# Comunicadores Libres — operational handoff

Updated: 2026-11-28 06:40 ART

## Current main and deployment
- Main head: `5cfe781e5832afa12ba7014fdc2a6ee1f5643321`.
- Dependency remediation PR [#2](https://github.com/leandrocuellarok-netizen/comunicadoreslibres/pull/2) was merged by squash as that commit. The production change is limited to `package-lock.json` plus a one-line `src/App.tsx` lint correction (remove an unused catch binding).
- GitHub Actions run [46131405305](https://github.com/leandrocuellarok-netizen/comunicadoreslibres/actions/runs/46131405305) completed Build and Deploy successfully for the exact main commit. Artifact: `github-pages-46131405305-1`, 4,761,152 bytes. Deploy logs confirm the deploy job consumed that exact artifact, created a deployment for the same SHA, reported success, and evaluated the environment URL as `https://libres.sbs/`. This is deployment evidence, not independent public HTTP/browser verification.
- Maintenance branch CI run [46131181574](https://github.com/leandrocuellarok-netizen/comunicadoreslibres/actions/runs/46131181574) passed after the lint correction: `npm ci`, non-forced `npm audit fix`, second `npm ci`, audit, typecheck, lint, build, prerender, and smoke tests.
- Post-fix npm audit: 0 critical, 0 high, 0 moderate, 0 low (0 total), down from 26 (12 high, 12 moderate, 2 low). No `--force`, major-version override, package.json dependency-range change, or production data change was used. Lockfile now resolves Vite 7.3.8, PostCSS 8.5.34, typescript-eslint 8.74.0, react-router-dom 7.18.7, ws 8.23.1, js-yaml 4.3.2, and brace-expansion 1.1.22.
- The successful main build generated 43 published article pages and sitemap.xml. Smoke tests passed for homepage, 3 required category routes, 43 article URLs, sitemap canonicals, and JSON-LD.
- Artifact naming remains unique per attempt: `github-pages-${{ github.run_id }}-${{ github.run_attempt }}`; deploy consumes the matching name. Workflow still has `concurrency.cancel-in-progress: true`; rapid pushes can cancel earlier runs.
- One scheduled event was found at 2026-11-28T02:42:31Z (run 46099391136); no later scheduled events appeared in the latest 25-run history through 2026-11-28T09:39Z. Treat GitHub schedule delivery as best-effort.
- CI still emits non-blocking Node.js 20 action deprecation warnings and Node deprecation warnings for `punycode` and legacy `url.parse()`. No action-version changes were made.

## Routing and public verification
- `scripts/prerender-articles.mjs` generates static HTML for 43 published Supabase articles and six category pages. `src/main.tsx` preserves static article/category HTML by not mounting React on those routes; homepage React startup retains a readable static fallback on import failure.
- Fresh direct web opens for `https://libres.sbs/`, `/agenda/`, the Giordano article, `/ciencia-ia/`, `/empresas-negocios/`, and `/sitemap.xml` remain inaccessible to the web inspection service.
- Container `curl` also cannot resolve `libres.sbs`, `github.com`, or `google.com`; this environment has a general DNS/network limitation, not evidence of a domain-specific outage.
- Independent positive signal: Supabase edge logs over the recent 24-hour window show 188 GET and 76 OPTIONS requests to `/rest/v1/articles`, all HTTP 200. A separate filter found 230 requests to that endpoint with Referer `https://libres.sbs/`, all HTTP 200; 192 had mobile user-agent markers. This confirms some browsers reached the site sufficiently to request article data, but does not verify the critical static article route, rendered pixels, navigation, TLS, or that each request hit the just-deployed commit.
- Supabase edge logs show no non-2xx/3xx status for logged requests in the queried window; the PostgreSQL log query found no event messages containing ERROR. This is not a substitute for full browser monitoring.
- Both root `CNAME` and `public/CNAME` contain `libres.sbs`; `public/robots.txt` allows crawling and points to the sitemap. Because deployment uses a custom GitHub Actions workflow, GitHub documentation says CNAME files are ignored for domain configuration; the custom domain must be configured in repository Pages settings. The current GitHub connection cannot read Pages settings or HTTPS enforcement. Do not change DNS.
- Search Console connector is authorized only for `https://www.syscom.sbs/`, not Comunicadores Libres. No site-specific indexing/performance data is available; do not claim indexing.

## Editorial data and media
- Supabase contains 43 articles, all published, zero drafts. All 43 have a slug, SEO description, and author. Of articles with an image, none is missing imageAlt.
- Five published articles have no image; three are featured: `ludopatia-especialistas-consultas-entrevistas`, `contacto-prensa-juan-carlos-giordano`, and `tercera-via-argentina-talerico-merlo`. Two non-featured without images: `diego-salazar-problema-economia-argentina` and `cazvid-reclutamiento-en-video`. Do not invent or source replacement imagery without rights/owner authorization.
- Existing image field distribution: 37 external URLs (28 images.unsplash.com, 7 www.argentina.gob.ar, 1 www.bcra.gob.ar, 1 raw.githubusercontent.com), 1 data URI, 5 missing. No requests to the `cl-article-images` public storage path appeared in the queried logs; visible image rendering and external asset availability remain unverified.
- 73 unique local-only published records remain absent from Supabase prerender output and sitemap. ID collisions `e1` and `e2` remain held for manual resolution. Do not migrate, publish, or reconcile them without explicit editorial approval.

## Supabase security — unchanged, approval required
- Project status: ACTIVE_HEALTHY.
- Article INSERT/UPDATE/DELETE policies still authorize any authenticated user rather than an owner-assigned editor/admin role. Storage write/update/delete policies have the same broad authenticated check; bucket `cl-article-images` is public-read and has no server-side file-size or MIME allowlist.
- Security Advisor still flags EXECUTE grants for `public.rls_auto_enable()` to anon/authenticated and leaked-password protection disabled; the function returns event_trigger and no exploit has been demonstrated. Performance Advisor has four RLS initialization-plan warnings.
- No RLS, Auth, Storage, credential, DNS, or production-record changes were made. Obtain explicit owner approval and assign the editor/admin role before hardening these settings.

## Next actions
1. Obtain independent HTTP/TLS and real-browser checks for root, category pages, the Giordano direct URL/refresh, navigation, and mobile/desktop. The present inspection environment cannot perform those checks.
2. Have a repository administrator verify Settings → Pages custom domain `libres.sbs` and Enforce HTTPS, or provide the required GitHub Pages admin-level access. Keep DNS unchanged until authoritative records are verified.
3. Review rights and availability for the five missing article images; verify external image URLs and social preview dimensions before claiming media completeness.
4. Add/authorize the correct Search Console property before site-specific indexing and performance analysis.
5. Obtain explicit approval before RLS/Auth/Storage hardening or editorial reconciliation of the 73 local-only records and two ID collisions.
