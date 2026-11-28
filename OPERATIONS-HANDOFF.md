# Comunicadores Libres — operational handoff

Updated: 2026-11-28 01:25 ART

## Repository and deployment
- Main application code previously deployed: `86c6e29e17106e28237e8a8b04b77e5afcbedda1`; GitHub Pages run [46103357171](https://github.com/leandrocuellarok-netizen/comunicadoreslibres/actions/runs/46103357171) succeeded; artifact `github-pages-46103357171-1` (4,760,727 bytes).
- Latest source commits: `ee39e6e4bb8c2019ae011851ed8902d4103f81da` (initial X metadata insertion), `e5753cbf8b5ac6d5a90abd87ca4f6dce5f7ecffe` (corrected insertion), `0c094e82556bb032c45d64f6c59ce05d1d36c1a2` (added smoke assertions). Treat the latter as the intended source state; a transient malformed intermediate commit was corrected immediately.
- Current source change adds `twitter:title`, `twitter:description`, `twitter:image`, `article:published_time`, and `article:section` to every prerendered article. Build smoke tests now require the X/Twitter values to match Open Graph values and check publication time and section.
- A Node fixture test for the metadata insertion and assertions passed. Full repository build/CI for the new commits has not yet been independently confirmed. The available GitHub workflow-run connector does not return push-triggered runs; combined commit statuses returned no status contexts. Verify the latest run before treating the metadata change as deployed.
- Workflow still uses unique artifact names `github-pages-${{ github.run_id }}-${{ github.run_attempt }}`, deploys the same artifact after the build job, and has `concurrency.cancel-in-progress: true`. Avoid rapid sequential commits because older runs may be cancelled.
- `CNAME` contains `libres.sbs`; `public/robots.txt` points to `https://libres.sbs/sitemap.xml`.

## Public verification limits
- Attempts to open the home, Agenda, Giordano article, Ciencia e IA, Empresas y Negocios, and sitemap via web inspection failed.
- Container DNS resolution failed for `libres.sbs`, `github.com`, and `google.com`. This is an environment-wide lookup failure; do not infer a domain-specific outage.
- HTTP status, redirect chain, TLS/certificate, visual rendering, mobile/desktop layout, and public deployment content remain unverified. Latest independently confirmed deployment remains the 86c6e29 run above.

## Supabase content inventory — read-only checks at 01:26 ART
- `public.articles`: 43 records, all published, zero drafts.
- All published records have title, author, date, slug, and SEO description. No duplicate category/slug pairs, unknown categories, empty excerpts, or noncanonical slug characters were found.
- Five published articles have no image. All 38 records with images have non-empty alt text. Forty-two records lack a custom `og_image`; the prerenderer falls back to the article image or publication logo.
- No production editorial data was changed.

## Security and operational risks — no production changes
- Article INSERT/UPDATE/DELETE policies allow any authenticated user. The SELECT policy allows any authenticated user to read unpublished records.
- Storage write/update/delete policies allow any authenticated user in `cl-article-images`; the bucket is public-read and has no size or MIME restrictions configured.
- Auth aggregate: one user; zero users currently have `app_metadata.role=editor` or `admin`. Do not apply role-gated policies until the intended account is assigned an admin-controlled role and the owner authorizes the migration.
- Security Advisor continues to flag `public.rls_auto_enable()` as SECURITY DEFINER and executable by anon/authenticated, and leaked-password protection as disabled. Performance Advisor reports four RLS initialization-plan warnings on article policies.
- 73 unique local-only published records remain absent from Supabase; ID collisions `e1` and `e2` remain unresolved. Do not migrate or publish them without approval.
- `npm ci` previously reported 26 vulnerabilities (2 low, 12 moderate, 12 high). Detailed audit findings remain uncollected; no dependency upgrades have been applied.

## Next actions
1. Confirm the latest push-triggered build, smoke tests, artifact, and deployment for the current main head; do not equate a green workflow with public-domain verification.
2. Retry public HTTP/TLS checks from an external network with working DNS.
3. Obtain explicit owner approval and assign the intended editorial role before changing RLS, Auth, or Storage policies.
4. Collect detailed dependency audit findings before changing packages.
5. Reconcile the 73 local-only records and two ID collisions only after owner approval.
