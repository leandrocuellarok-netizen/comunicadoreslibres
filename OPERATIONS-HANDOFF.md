# Comunicadores Libres — operational handoff

Updated: 2026-11-28 07:31 ART

## Current main and deployment
- Main before this handoff refresh: `d7aec2e4da3d4cc7fefbd1884f2381d7faa4c35e`.
- Latest deployment run [46131572555](https://github.com/leandrocuellarok-netizen/comunicadoreslibres/actions/runs/46131572555) completed successfully for that exact SHA. Build and deploy jobs passed. Artifact `github-pages-46131572555-1` (4,761,100 bytes) was uploaded and the deploy job consumed that exact artifact, created a Pages deployment for the same SHA, reported success, and returned environment URL `https://libres.sbs/`.
- Build logs confirm `npm ci`, `npm audit`, TypeScript typecheck, Vite build, prerender of 43 published article pages, and smoke tests for homepage, 3 required category routes, 43 article URLs, sitemap canonicals, and JSON-LD all passed.
- Dependency remediation is complete in commit `5cfe781e5832afa12ba7014fdc2a6ee1f5643321` (merged PR #2): lockfile-only dependency refresh plus one unused catch-binding lint correction; no package.json ranges, major versions, or production records changed. The previous 26 npm advisories are superseded: post-fix `npm ci` and explicit `npm audit` both report 0 vulnerabilities (0 critical/high/moderate/low).
- The earlier maintenance attempt [46130961195](https://github.com/leandrocuellarok-netizen/comunicadoreslibres/actions/runs/46130961195) failed only at ESLint for an unused catch binding; fixed in the subsequent commit. Main deployments [46131405305](https://github.com/leandrocuellarok-netizen/comunicadoreslibres/actions/runs/46131405305) and [46131572555](https://github.com/leandrocuellarok-netizen/comunicadoreslibres/actions/runs/46131572555) passed.
- Artifact naming remains unique per run attempt: `github-pages-${{ github.run_id }}-${{ github.run_attempt }}`; deploy consumes the matching name. Workflow concurrency still uses `cancel-in-progress: true`.
- The latest schedule-triggered run returned by GitHub is [46099391136](https://github.com/leandrocuellarok-netizen/comunicadoreslibres/actions/runs/46099391136), created 2026-11-28T02:42:31Z. No later schedule events were returned; cron remains `17 * * * *`. Treat schedule delivery as best-effort.
- GitHub reports `main` unprotected. No branch-protection or workflow permissions were changed.

## Routing and public verification
- Static article and category routes are preserved: `src/main.tsx` detects prerendered markup and does not mount React over it. The homepage mounts React while retaining its static fallback on import failure. Build smoke tests validate the Giordano title/body before JavaScript and validate sitemap canonicals and JSON-LD.
- Fresh web opens of `https://libres.sbs/` and `https://libres.sbs/agenda/contacto-prensa-juan-carlos-giordano/` remain inaccessible to the inspection service. Container `curl` also cannot resolve `libres.sbs`, `github.com`, or `google.com`; this is a general DNS/network limitation in the inspection environment, not evidence of a domain-specific outage. HTTP status, redirect chain, TLS, rendered pixels, navigation, and mobile/desktop behavior remain unverified.
- Root `CNAME` contains `libres.sbs`; the prior audit also confirmed `public/CNAME` matches. Deployment logs returning `https://libres.sbs/` are not independent live verification. The current GitHub connection cannot read repository Pages settings or HTTPS enforcement. A repository administrator must verify Settings → Pages has custom domain `libres.sbs` and Enforce HTTPS enabled. Do not change DNS without authoritative records and approval.
- Search Console is connected only to `https://www.syscom.sbs/`; no site-specific indexing or performance data for Comunicadores Libres is available.

## Editorial data and media
- Read-only Supabase query confirms 43 articles total: 43 published, 0 drafts.
- Critical Giordano article remains published and featured in category `Agenda política`; its `image`, `og_image`, and `imageAlt` are null. The prerendered article therefore has no custom in-article image; social metadata uses the publication fallback. Do not invent or source a replacement without rights/owner authorization.
- 73 unique local-only published records remain absent from Supabase prerender output and sitemap. ID collisions `e1` and `e2` remain held for manual resolution. Do not migrate, publish, or reconcile them without explicit editorial approval.

## Supabase security and performance — unchanged, approval required
- Security Advisor still flags `public.rls_auto_enable()` as SECURITY DEFINER and executable by both `anon` and `authenticated`; leaked-password protection is disabled.
- Performance Advisor reports four RLS initialization-plan warnings on `public.articles`.
- Existing article and storage write policies still allow any authenticated user rather than an owner-assigned editor/admin role; the public image bucket has no server-side MIME or size allowlist. No RLS, Auth, Storage, credential, DNS, or production-record changes were made. Obtain explicit approval before hardening these settings.

## Next actions
1. Obtain independent HTTP/TLS and real-browser checks for root, category pages, the Giordano direct URL/refresh, navigation, and mobile/desktop from a network with working DNS.
2. Have a repository administrator verify Settings → Pages custom domain and Enforce HTTPS; keep DNS unchanged until authoritative records are verified.
3. Obtain a rights-cleared image or owner approval for the featured Giordano article; verify public retrieval and social preview dimensions before claiming media completeness.
4. Obtain explicit approval before RLS/Auth/Storage hardening or editorial reconciliation of the 73 local-only records and two ID collisions.
5. Authorize the correct Search Console property before site-specific indexing/performance analysis.
