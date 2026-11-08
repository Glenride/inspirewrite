<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Str;
use Inertia\Inertia;

class WorkosAuthController extends Controller
{
    /**
     * WorkOS sign-in for InspireWrite (live 2026-10-28, replacing the
     * Fortify email+password login). Unlike the owner-only sites, this is
     * a multi-user app: there is NO owner allowlist here. A WorkOS
     * identity is matched to the existing local account by email, so
     * writers and affiliates keep their accounts, affiliate codes, and
     * subscriptions. A first-time email creates a local account.
     * Fresh-login rule: prompt=login forces WorkOS to ask fresh every
     * time instead of carrying over a session from another site.
     * The header links are Inertia links, so Inertia requests answer
     * with Inertia::location (full visit to WorkOS); direct visits keep
     * the plain 302. Return type is the Symfony response, which covers
     * both the redirect and the Inertia location response.
     */
    public function login(Request $request): \Symfony\Component\HttpFoundation\Response
    {
        if (Auth::check()) {
            return redirect()->route('dashboard');
        }
        $config = config('services.workos');
        if (empty($config['client_id']) || empty($config['redirect_uri'])) {
            return redirect('/');
        }
        $nonce = (string) Str::uuid();
        $sig = hash_hmac('sha256', $nonce, config('app.key'));
        $state = $nonce.'.'.$sig;
        $request->session()->put('workos_state', $state);
        $authUrl = 'https://api.workos.com/user_management/authorize?'.http_build_query([
            'response_type' => 'code',
            'client_id' => $config['client_id'],
            'redirect_uri' => $config['redirect_uri'],
            'provider' => 'authkit',
            'prompt' => 'login',
            'state' => $state,
        ]);
        if ($request->header('X-Inertia')) {
            return Inertia::location($authUrl);
        }

        return redirect()->away($authUrl);
    }

    public function callback(Request $request): \Illuminate\Http\RedirectResponse
    {
        $fail = function (string $code) {
            Log::warning('WorkOS callback failed', ['code' => $code]);

            return redirect('/');
        };
        $config = config('services.workos');
        if (empty($config['client_id']) || empty($config['client_secret'])) {
            return $fail('not_configured');
        }
        if ($request->query('error')) {
            return $fail('workos_rejected');
        }
        $code = $request->query('code');
        $state = (string) $request->query('state', '');
        $sessionState = (string) $request->session()->pull('workos_state', '');
        $parts = explode('.', $state);
        $stateOk = $code && $sessionState === $state && count($parts) === 2
            && hash_equals(hash_hmac('sha256', $parts[0], config('app.key')), $parts[1]);
        if (! $stateOk) {
            return $fail('invalid_state');
        }
        try {
            $res = Http::asJson()->post('https://api.workos.com/user_management/authenticate', [
                'grant_type' => 'authorization_code',
                'code' => $code,
                'client_id' => $config['client_id'],
                'client_secret' => $config['client_secret'],
            ]);
        } catch (\Throwable $e) {
            return $fail('workos_unreachable');
        }
        if (! $res->ok()) {
            return $fail('workos_rejected');
        }
        $email = strtolower((string) data_get($res->json(), 'user.email', ''));
        if (! $email) {
            return $fail('workos_rejected');
        }
        $first = trim((string) data_get($res->json(), 'user.first_name', ''));
        $last = trim((string) data_get($res->json(), 'user.last_name', ''));
        $name = trim($first.' '.$last) ?: $email;
        // Existing accounts are found by email and left untouched
        // (affiliate codes, subscriptions, and flags all survive).
        $user = User::firstOrCreate(
            ['email' => $email],
            [
                'name' => $name,
                'password' => bcrypt(Str::random(40)),
                'email_verified_at' => now(),
            ]
        );
        // WorkOS AuthKit has just proved ownership of this email, so a
        // returning account that was never email-verified is verified now.
        // Without this, the verified gate on checkout/dashboard locks
        // every pre-WorkOS customer out of paying.
        if (! $user->email_verified_at) {
            $user->email_verified_at = now();
            $user->save();
        }
        Auth::login($user);
        $request->session()->regenerate();

        return redirect()->intended(route('dashboard'));
    }

    public function logout(Request $request): \Illuminate\Http\RedirectResponse
    {
        Auth::logout();
        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return redirect('/');
    }
}
