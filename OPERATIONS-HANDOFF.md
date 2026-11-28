# Comunicadores Libres — operational handoff

Updated: 2026-11-28 04:29 ART

## Repository and deployment
- Main head at the start of this run: `4fff02e2b55e40bf11137e3dffd14b12b159f09d`.
- This commit added a non-blocking, detailed `npm audit --json` step to push/manual workflow runs. Scheduled deploy runs skip this extra audit. The report prints severity counts, package names, vulnerable ranges, fix availability, and advisory URLs; no dependency was changed.
- The deploy workflow still uses unique artifact names `github-pages-${{ github.run_id }}-${{ github.run_attempt }}`; the deploy job requests that same name. The workflow has one hourly schedule and retains `concurrency.cancel-in-progress: true`.
- Latest confirmed successful Pages deployment available in the prior handoff is run [46112404571](https://github.com/leandrocuellarok-netizen/comunicadoreslibres/actions/runs/46112404571), deploying commit `48ba5a2fa1ac71156cb7c0f81df9e90f918fdd71`. No current-head deployment is confirmed for `4fff02e`. The connected GitHub actions functions exposed here do not list push/schedule runs; commit workflow lookup returned no PR runs and combined status was empty. Do not claim the current head is deployed.
- `public/CNAME` contains `libres.sbs`; `public/robots.txt` points to `https://libres.sbs/sitemap.xml`. GitHub Pages custom-domain settings and HTTPS enforcement remain unverified.

## Routing and rendering — source inspection only
- `scripts/prerender-articles.mjs` generates static HTML for all 43 published Supabase articles and six category pages, plus the sitemap.
- `src/main.tsx` detects `.prerendered-article` and `.prerendered-category` and does not mount React on those pages. This prevents React from replacing their static article/category HTML.
- The homepage prerender is replaced by the React app at startup. Its initial article state comes from bundled seed/imported/editorial additions; the asynchronous Supabase query merges records when successful and logs an error without clearing the initial list when it fails. This is source-level evidence only, not a live browser test.
- Article cards use the app's hash route for client-side article views. The 43 Supabase articles also have real static category/slug pages. The 73 local-only published records are not in Supabase prerender output or the sitemap; do not generate/index or migrate those records without explicit editorial approval. ID collisions `e1` and `e2` remain held for manual resolution.

## Public verification limits
- Direct web opens of `https://libres.sbs/` and the Giordano article URL still fail in the inspection tool.
- Container DNS lookup failed for `registry.npmjs.org`; previous checks also failed for `github.com`, `google.com`, and `libres.sbs`. This is consistent with an environment-wide DNS limitation, not proof of a domain outage.
- HTTP status, redirect chain, external DNS answers, TLS certificate, browser rendering, navigation, and mobile/desktop behavior remain unverified. No indexing claim is supported.

## Supabase — read-only findings
- Security Advisor returned three warnings: `public.rls_auto_enable()` has EXECUTE grants for `anon` and `authenticated`, and leaked-password protection is disabled. Performance Advisor returned four RLS initialization-plan warnings.
- Read-only `pg_policies` inspection confirms article INSERT, UPDATE, and DELETE policies check only `auth.role() = 'authenticated'`; they do not enforce an editor/admin role despite their “Authenticated editors” names. SELECT allows published public reads and all authenticated reads.
- The function definition confirms `rls_auto_enable()` returns `event_trigger` and enables RLS on newly created tables in `public`. The Advisor's generic RPC warning should be interpreted in light of that event-trigger return type; no direct invocation or exploit was demonstrated.
- No RLS, Auth, Storage, credential, or production-record changes were made. Security hardening still requires owner approval and an owner-assigned admin/editor role. The current project has no account with `app_metadata.role=editor` or `admin` in the last verified aggregate.

## Dependency audit and next actions
- The new CI audit report is not yet available to this run. The current GitHub connection does not expose push/schedule run listing, and local `npm audit` cannot reach `registry.npmjs.org` because DNS resolution fails. No dependency updates were made.
1. Obtain the Actions run ID/job logs for the `4fff02e` push run and review the exact npm advisories before changing packages.
2. Retry public HTTP/TLS and route verification from a network with working DNS; inspect Search Console only if its connection/access is available.
3. Request explicit approval and an owner-assigned admin role before preparing/applying role-gated article and Storage policies, function grant changes, or Auth hardening.
4. Keep DNS, production content/media, Supabase security settings, and credentials unchanged until the relevant approvals are explicit.
