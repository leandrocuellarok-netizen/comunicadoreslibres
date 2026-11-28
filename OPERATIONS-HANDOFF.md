# Comunicadores Libres — operational handoff

Updated: 2026-11-28 02:29 ART

## Repository and deployment
- Current `main` head: `3bef261ffa060b7c4a92eb3b89f8a868fd99d338`.
- Latest completed GitHub Pages run: [46107801576](https://github.com/leandrocuellarok-netizen/comunicadoreslibres/actions/runs/46107801576), push event, success, deploying the current `main` head. Artifact: `github-pages-46107801576-1`, 4,762,322 bytes.
- The deployed build includes the application changes from `0c094e82556bb032c45d64f6c59ce05d1d36c1a2` and its parent `e5753cbf8b5ac6d5a90abd87ca4f6dce5f7ecffe`: prerendered article pages now include explicit `twitter:title`, `twitter:description`, `twitter:image`, `article:published_time`, and `article:section`. Smoke tests require Twitter/X title, description, and image to match Open Graph, and require publication time and section metadata.
- Latest build logs confirm Typecheck, Vite build, 43 prerendered published article pages, sitemap generation, smoke tests for homepage, three required category routes, 43 article URLs, sitemap canonicals and JSON-LD, artifact upload, and deployment all succeeded.
- Three rapid push runs for the metadata change were cancelled by `concurrency.cancel-in-progress: true`; the subsequent final run for the new main head completed successfully. Avoid rapid sequential commits; verify the last run before reporting deployment.
- Workflow still uses unique artifact names `github-pages-${{ github.run_id }}-${{ github.run_attempt }}`, deploys the matching artifact after the build job, and has one hourly schedule. `CNAME` contains `libres.sbs`; `public/robots.txt` points to `https://libres.sbs/sitemap.xml`.
- GitHub Actions logs warn that several action versions target Node.js 20, which GitHub is forcing onto Node.js 24. This is a maintenance warning, not a failed job; review action upgrades separately.

## Public verification limits
- A fresh web search returned the homepage result for `site:libres.sbs` and reported it crawled today. Opening it exposed only the title and an iframe link; it did not expose the page body. An exact search for the critical Giordano article returned no results. Neither result establishes comprehensive indexing.
- Direct web opens of `https://libres.sbs/`, the Giordano article URL, and `https://libres.sbs/sitemap.xml` failed. The execution environment also failed DNS resolution for `libres.sbs`, `github.com`, and `google.com`; do not infer a domain-specific outage.
- HTTP status, redirect chain, TLS/certificate, browser-rendered content, mobile/desktop layout, and whether the custom domain serves the deployed artifact remain unverified. A successful GitHub Pages action is not proof of public reachability.

## Supabase content inventory — read-only
- `public.articles`: 43 records, all published, zero drafts.
- All published records have title, author, date, slug, and SEO description. No duplicate category/slug pairs, unknown categories, empty excerpts, or noncanonical slug characters were found.
- Five published articles have no image. All 38 records with images have non-empty alt text. Forty-two records lack a custom `og_image`; prerendering uses the article image or publication logo fallback.
- No production editorial data was changed.

## Security and operational risks — production unchanged
- Confirmed from live `pg_policies`: article INSERT, UPDATE, and DELETE allow any `authenticated` user; SELECT allows anonymous/authenticated users to read published articles and any authenticated user to read unpublished articles.
- Storage INSERT, UPDATE, and DELETE policies for `cl-article-images` allow any authenticated user. Public SELECT is enabled for the bucket.
- Bucket `cl-article-images` is public, with `file_size_limit = null` and `allowed_mime_types = null`.
- `public.rls_auto_enable()` is SECURITY DEFINER and EXECUTE is granted to `anon` and `authenticated`; it is attached to the enabled `ensure_rls` DDL event trigger.
- Previous Auth aggregate inspection found one user and zero users with `app_metadata.role=editor` or `admin`. Do not apply role-gated policies until the intended account is assigned an admin-controlled role and the owner explicitly authorizes the migration.
- Leaked-password protection remains disabled. Security Advisor previously flagged four RLS initialization-plan warnings. No RLS, Auth, Storage, secret, or production-record changes have been made.
- 73 unique local-only published records remain absent from Supabase; ID collisions `e1` and `e2` remain unresolved. Do not migrate or publish them without approval.
- CI dependency installation still reports vulnerabilities and recommends reviewing `npm audit`; prior count was 26 (2 low, 12 moderate, 12 high). Full advisory details have not been captured; no dependency upgrades have been applied.

## Next actions
1. Independently verify public HTTP/TLS and critical routes from a working external network; request Search Console access for `libres.sbs` if indexing diagnostics are required.
2. Prepare editor-only RLS and Storage hardening only after explicit owner approval and assignment of the intended editor/admin role. Preserve the current policy definitions for rollback.
3. Collect the full dependency audit report before changing packages; separately review GitHub Actions Node.js 20 deprecation warnings.
4. Reconcile the 73 local-only records and two ID collisions only after explicit owner approval.
