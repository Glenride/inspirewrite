<?php

use App\Http\Controllers\Settings\PasswordController;
use App\Http\Controllers\Settings\ProfileController;
use App\Http\Controllers\Settings\TwoFactorAuthenticationController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::middleware(['auth', 'verified'])->group(function () {
    Route::redirect('settings', '/settings/profile');

    Route::get('settings/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('settings/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('settings/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');

    Route::get('settings/password', [PasswordController::class, 'edit'])->name('user-password.edit');

    Route::put('settings/password', [PasswordController::class, 'update'])
        ->middleware('throttle:6,1')
        ->name('user-password.update');

    Route::get('settings/appearance', function () {
        return Inertia::render('settings/appearance');
    })->name('appearance.edit');

    Route::get('settings/two-factor', [TwoFactorAuthenticationController::class, 'show'])
        ->name('two-factor.show');

    // Password Confirmation
    Route::get('/user/confirm-password', [\Laravel\Fortify\Http\Controllers\ConfirmablePasswordController::class, 'show'])
        ->name('password.confirm');
    Route::post('/user/confirm-password', [\Laravel\Fortify\Http\Controllers\ConfirmablePasswordController::class, 'store'])
        ->name('password.confirm.store');
    Route::get('/user/confirmed-password-status', [\Laravel\Fortify\Http\Controllers\ConfirmedPasswordStatusController::class, 'show'])
        ->name('password.confirmation');

    // Two-Factor Authentication
    Route::post('/user/two-factor-authentication', [\Laravel\Fortify\Http\Controllers\TwoFactorAuthenticationController::class, 'store'])
        ->name('two-factor.enable');
    Route::post('/user/confirmed-two-factor-authentication', [\Laravel\Fortify\Http\Controllers\ConfirmedTwoFactorAuthenticationController::class, 'store'])
        ->name('two-factor.confirm');
    Route::delete('/user/two-factor-authentication', [\Laravel\Fortify\Http\Controllers\TwoFactorAuthenticationController::class, 'destroy'])
        ->name('two-factor.disable');
    Route::get('/user/two-factor-qr-code', [\Laravel\Fortify\Http\Controllers\TwoFactorQrCodeController::class, 'show'])
        ->name('two-factor.qr-code');
    Route::get('/user/two-factor-secret-key', [\Laravel\Fortify\Http\Controllers\TwoFactorSecretKeyController::class, 'show'])
        ->name('two-factor.secret-key');
    Route::get('/user/two-factor-recovery-codes', [\Laravel\Fortify\Http\Controllers\RecoveryCodeController::class, 'index'])
        ->name('two-factor.recovery-codes');
    Route::post('/user/two-factor-recovery-codes', [\Laravel\Fortify\Http\Controllers\RecoveryCodeController::class, 'store'])
        ->name('two-factor.regenerate-recovery-codes');

    Route::get('settings/subscription', function () {
        $user = auth()->user();
        $currentPlan = $user->currentPlan();
        $subscriptionEndsAt = null;

        if ($user->subscribed('default')) {
            $subscription = $user->subscription('default');
            if ($subscription->ends_at) {
                $subscriptionEndsAt = $subscription->ends_at->format('M d, Y');
            } elseif ($subscription->asStripeSubscription()->current_period_end) {
                $subscriptionEndsAt = \Carbon\Carbon::createFromTimestamp(
                    $subscription->asStripeSubscription()->current_period_end
                )->format('M d, Y');
            }
        }

        return Inertia::render('settings/subscription', [
            'currentPlan' => $currentPlan,
            'subscriptionEndsAt' => $subscriptionEndsAt,
        ]);
    })->name('subscription.edit');
});
