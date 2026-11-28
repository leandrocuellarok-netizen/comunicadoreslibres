# Comunicadores Libres — operational handoff

Updated: 2026-11-28 05:30 ART

## Repository and deployment
- Main head at the start of this run: `8627003fe1228f124a0434a23e8cfae24926bb15`.
- GitHub Actions run [46121965101](https://github.com/leandrocuellarok-netizen/comunicadoreslibres/actions/runs/46121965101) built and deployed that exact commit successfully. Build and Deploy jobs both passed. Artifact: `github-pages-46121965101-1`, 4,762,314 bytes. This proves the Pages deployment action completed, not that the custom domain serves it.
- The same run executed the detailed dependency audit successfully. Audit findings are recorded below.
- Artifact naming remains unique per run attempt: `github-pages-${{ github.run_id }}-${{ github.run_attempt }}`; the deploy job consumes that exact name. One hourly schedule remains. `concurrency.cancel-in-progress: true` is enabled; three rapid push runs were cancelled around 04:28Z, followed by successful final runs. No change to concurrency was made.
- Both root `CNAME` and `public/CNAME` contain `libres.sbs`. `public/robots.txt` allows crawling and points to `https://libres.sbs/sitemap.xml`. GitHub Pages settings and HTTPS enforcement could not be read through the current GitHub connection.
- Workflow uses Node 22, `npm ci`, typecheck, Vite build/prerender/smoke tests, uniquely named artifact upload, and a separate deploy job. The workflow's audit step is non-blocking and skipped for scheduled runs.

## Routing and rendering — source inspection only
- `scripts/prerender-articles.mjs` generates static HTML for the current 43 published Supabase articles and six category pages, plus sitemap output.
- `src/main.tsx` detects `.prerendered-article` and `.prerendered-category` and does not mount React on those pages. The homepage's static fallback is replaced by React after startup; if startup fails, a readable fallback and alert are retained.
- Source inspection indicates the homepage starts with bundled article data and merges Supabase results; a failed query is logged without clearing the initial list. This is not a live browser test.
- The code search returned no references to `react-router-dom`; the dependency appears unused, but removal still requires a lockfile update and CI regression tests.
- The 73 local-only published records remain absent from Supabase prerender output and sitemap; do not generate/index or migrate them without explicit editorial approval. ID collisions `e1` and `e2` remain held for manual resolution.

## Public verification limits
- Fresh direct web opens failed for `https://libres.sbs/`, `/agenda/`, the Giordano article, `/ciencia-ia/`, and `/empresas-negocios/`. The default `github.io` URL also failed in the inspection tool.
- No HTTP status, redirect chain, DNS answer, TLS certificate, browser rendering, navigation, or mobile/desktop behavior could be observed. Previous container DNS checks failed for unrelated domains as well; do not infer that libres.sbs is down from this environment limitation.
- No indexing claim is supported. A working external network and browser/HTTP probe are still required.

## Dependency audit — confirmed from GitHub Actions logs
- Runs [46117175882](https://github.com/leandrocuellarok-netizen/comunicadoreslibres/actions/runs/46117175882) and [46121965101](https://github.com/leandrocuellarok-netizen/comunicadoreslibres/actions/runs/46121965101) both reported: 0 critical, 12 high, 12 moderate, 2 low; 26 total. Every listed vulnerability had `fixAvailable=true` in the audit report.
- Direct flagged dependencies: `react-router-dom@7.13.1` (high, runtime dependency, no source-code references found); `vite@7.3.1` (high, dev dependency); `postcss@8.5.8` (high, dev dependency); `typescript-eslint@8.8.1` (moderate, dev dependency).
- A high-severity transitive runtime dependency is `ws@8.18.3`, pulled through `@supabase/realtime-js`. Other flagged packages are primarily build/lint tooling: brace-expansion, browserslist, flatted, glob, js-yaml, minimatch, nanoid, picomatch, postcss-selector-parser, source-map-js, sucrase, yaml, and related ESLint/Babel packages.
- The direct `react-router-dom` dependency is not referenced in repository code search, but it has not been removed. No package or lockfile changes were made. The container cannot resolve `registry.npmjs.org`; the connected CI runner can run the audit, but no workflow-dispatch capability is available here to execute a dependency-fix job. Do not use `npm audit fix --force`.
- Next safe dependency action: create a separate, reviewable PR that applies semver-compatible audit fixes, then run `npm ci`, typecheck, lint, build, smoke tests, and a second audit. Remove unused `react-router-dom` only as part of that tested lockfile change.

## Supabase — read-only findings
- Project status is `ACTIVE_HEALTHY`.
- Security Advisor currently reports three warnings: `public.rls_auto_enable()` EXECUTE grants for `anon` and `authenticated`, plus leaked-password protection disabled. Performance Advisor reports four RLS initialization-plan warnings.
- Read-only policy inspection confirms article INSERT, UPDATE, and DELETE policies check only `auth.role() = 'authenticated'`; they do not enforce an editor/admin role despite their names. SELECT allows public reads of published articles and authenticated reads of unpublished articles.
- `rls_auto_enable()` returns `event_trigger` and enables RLS on newly created tables in `public`. The Advisor's generic RPC warning must be interpreted in light of that return type; no exploit has been demonstrated.
- No RLS, Auth, Storage, credential, or production-record changes were made. Hardening requires explicit owner approval and an owner-assigned admin/editor role. Keep production security settings unchanged until then.

## Next actions
1. Run a tested dependency-update PR using CI network access; prioritize direct high-severity build dependencies and the `ws` transitive runtime dependency.
2. Retry public HTTP/TLS and browser route verification from a network with working DNS; inspect Search Console only if connected and authorized.
3. Obtain explicit approval and an owner-assigned admin role before preparing/applying role-gated article and Storage policies, function grant changes, or Auth hardening.
4. Keep DNS, production content/media, Supabase security settings, and credentials unchanged until the relevant approvals are explicit.
