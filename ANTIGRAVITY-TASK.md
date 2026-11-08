# Antigravity work order — InspireWrite: fix the frontend build, finish the logo deploy, prove payments readiness (2026-10-29)

Paste this into Antigravity on the iMac. Antigravity has no headless interface, so this file is staged in the tree for you to paste.

## Workdir and branch — do not change these

- Workdir: `~/projects/glenrideReligions2/bible` (Docker project `bible`, container `bible-app`, serves https://inspirewrite.online)
- Branch: `feature/inspirewrite-payments` — stay on it. Do NOT switch branches, do NOT merge to main, do NOT touch `feature/affiliate-system`, do NOT touch D'Quizz, Mission Control, or the `pt_nvi` translation history.
- App: Laravel + Inertia/React, repo `deevee3/bibleApp`.

## State already on this tree (verified 2026-10-29 — do not undo any of it)

- WorkOS sign-in is live and replaces Fortify login: `login` → WorkOS authorize, `register` → redirect to `login`, `auth/callback`, `logout` via `app/Http/Controllers/WorkosAuthController.php` (untracked). `FortifyServiceProvider::register()` calls `Fortify::ignoreRoutes()`. `config/services.php` adds a `workos` block. Backup files `*.bak-20261028-workos-flip` and the untracked `docker-compose.yml` stay where they are — do not delete them.
- Payments path (server-side, already working in code): Laravel Cashier, `CheckoutController`, `GET /checkout/{study,pro}` and `/billing-portal` behind `auth` + `verified` middleware, `POST /stripe/webhook` (`cashier.webhook`). Stripe prices on the `dvaughnhousegateway` account: $7/mo and $27/mo, live mode. The Stripe webhook endpoint for `https://inspirewrite.online/stripe/webhook` is ENABLED (it was disabled from its creation on 2026-10-22 until 2026-10-29).
- Verified-gate fix (2026-10-29, in `WorkosAuthController::callback`, just before `Auth::login`): a WorkOS sign-in now marks the account verified if it was not already, because WorkOS AuthKit has proved ownership of that email. Do NOT remove this. Before it, all 10 existing users were unverified and checkout (behind `verified`) was locked for every one of them.
- Logo files already on this tree (do not redesign, do not recolour): `public/images/inspirewrite-icon.svg`, `inspirewrite-icon-dark.svg`, `inspirewrite-monogram-seal.svg`, `inspirewrite-monogram-seal-dark.svg`, `inspirewrite-lockup-light.svg`, `inspirewrite-lockup-dark.svg`, and `public/favicon.svg` (nib + gold spark micro-mark). `resources/views/app.blade.php` already points the SVG favicon at `/favicon.svg`. Logo colours: ink `#18181B`, parchment `#FAF8F5`, gold `#C59B27` (spark + terminal period only), ivory `#F4F1EA`, obsidian `#0F1115`.
- Logo code changes already on this tree (uncommitted, waiting on Task 1): `resources/js/components/app-logo.tsx` + `app-logo-icon.tsx` (Illuminated Spine: gold spark, nib `I`, `W` open-scripture base, strokes via `currentColor`), `resources/js/components/site-footer.tsx` (dark icon + wordmark), `resources/js/pages/Welcome.tsx` (nav icon + wordmark; monogram seal above the Psalm 119:105 quote, giant decorative `IW` removed).

## Task 1 — Fix the frontend build (this blocks the logo, not payments)

Reproduce first:

```
npm run build
```

Expected failure (verbatim, 2026-10-29):

```
[vite:load-fallback] Could not load /resources/js/routes/password/confirm (imported by resources/js/pages/auth/confirm-password.tsx): ENOENT: no such file or directory
```

Verify the mechanism before choosing a fix. The working hypothesis is that `Fortify::ignoreRoutes()` stops Fortify from registering its password-confirm route, so the Wayfinder plugin never generates `resources/js/routes/password/confirm`, while `confirm-password.tsx` still imports it. Prove or disprove that from the code and the route list (`php artisan route:list`) — do not just assume it.

Fix, smallest change that preserves WorkOS sign-in, in this order of preference:

1. If the confirm-password page is dead after the WorkOS flip (no route or link reaches it), remove the page and every import/reference to it.
2. If it is still reachable or needed, restore a password-confirm route explicitly without restoring Fortify login, register, or reset routes.
3. Do NOT restore Fortify login/register/reset routes. Do NOT break WorkOS login, callback, or logout. Do NOT add a generated-route stub unless you prove it survives a clean `npm run build` (Wayfinder regenerates that directory).

Verification for Task 1: `npm run build` completes clean with no new errors, `php -l` passes on every PHP file touched, and WorkOS login still redirects to WorkOS authorize (check `curl -I https://inspirewrite.online/login` → 302 to `api.workos.com`).

## Task 2 — Finish the logo deploy after the build succeeds

Restart `bible-app` if needed for the new build output, then verify live at https://inspirewrite.online, by eye and by status code:

- Landing nav: Illuminated Spine icon + `INSPIREWRITE.` with a gold terminal period.
- Footer: dark icon + `INSPIREWRITE.` with a gold terminal period.
- Landing quote card: monogram seal (sanctuary arch) above the Psalm 119:105 quote — no giant plain-text `IW` decoration.
- Logged-in header and sidebar: spine icon + `INSPIREWRITE.`
- Browser tab favicon: nib + gold spark (`/favicon.svg`).
- `public/images/inspirewrite-*.svg` all serve 200.

Report any logo element that does not appear, with its URL and what you saw instead. Do not redesign the mark to work around a build or caching problem — report it.

## Task 3 — Payments readiness check (NO real charge)

Do NOT charge a real card, do NOT use a real customer's card, and do NOT run a live $7 checkout. Test cards do not work on these live-mode prices, so a full end-to-end payment proof is a separate, human-approved step and is explicitly out of scope here.

Verify by inspection and by unauthenticated checks only:

- `https://inspirewrite.online/pricing` → 200, with Subscribe links to `/checkout/study` and `/checkout/pro`.
- Unauthenticated `/checkout/study` → redirect to `/login` (expected: checkout requires auth).
- `php artisan route:list` shows `checkout`, `billing-portal`, and `cashier.webhook` (`POST stripe/webhook`).
- The verified-gate fix from the state section above is still in place in `WorkosAuthController`.
- If you can check Stripe-side state without printing any secret: confirm the `inspirewrite.online/stripe/webhook` endpoint is enabled. If you cannot check it, say so plainly — do not guess.

If a webhook signature failure appears in the app logs, stop and report it verbatim. Do NOT disable the webhook, do NOT rotate or change `STRIPE_WEBHOOK_SECRET`, and do NOT change the $7/$27 pricing copy or price IDs.

## Guardrails (hard)

- NEVER print, paste, or write into any file, log, or report: any Stripe key/secret, webhook secret, WorkOS client secret/API key, app key, password, or `.env` value. Report only whether a value is present and whether a check passed or failed.
- NEVER commit or modify `.env`. NEVER commit the WorkOS files (`WorkosAuthController.php`, `FortifyServiceProvider.php`, `services.php`, `web.php` changes from the WorkOS flip) as part of this work — they are intentionally uncommitted and belong to a separate review.
- Leave ALL of your changes uncommitted in the working tree when you finish, and report the diff stat. Janine reviews and commits. Do NOT push.
- If any step contradicts this order, or a fix would require touching secrets, pricing, or auth beyond what is written above, stop that step and report exactly what is blocked and what decision it needs.

## Report back (required)

1. Build: final `npm run build` result (clean, or the verbatim error if still failing).
2. Files changed, one line each, with the root cause for the build fix.
3. Live logo checklist from Task 2: pass/fail per element, with URLs.
4. Payments readiness from Task 3: pass/fail per check, plus the one sentence that remains unproven: a real live checkout + webhook activation has not been run, and needs a human-approved $7 charge.
5. Anything you deliberately did NOT do, and why.
