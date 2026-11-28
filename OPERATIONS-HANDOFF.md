# Comunicadores Libres — operational handoff

Updated: 2026-11-28 03:29 ART

## Repository and deployment
- Main head at the start of this run: `48ba5a2fa1ac71156cb7c0f81df9e90f918fdd71`.
- Latest successful GitHub Pages run at the start of this run: [46112404571](https://github.com/leandrocuellarok-netizen/comunicadoreslibres/actions/runs/46112404571), deploying `48ba5a2fa1ac71156cb7c0f81df9e90f918fdd71`. Artifact: `github-pages-46112404571-1`, 4,762,318 bytes.
- Typecheck, Vite build, prerender of 43 published article pages, smoke tests, sitemap generation, artifact upload, and Pages deployment all passed in that run. Smoke tests covered the homepage, three required category routes, all 43 article URLs, sitemap canonicals, and JSON-LD.
- The deployed source includes the article metadata change from `0c094e82556bb032c45d64f6c59ce05d1d36c1a2`: Twitter/X title, description, image, publication time, and section are emitted and checked against Open Graph.
- Workflow artifact naming remains unique per attempt: `github-pages-${{ github.run_id }}-${{ github.run_attempt }}`. The deploy job consumes that exact name. Three rapid push runs were cancelled by `concurrency.cancel-in-progress: true`; the final run for the latest main head succeeded.
- `CNAME` contains `libres.sbs`; `public/robots.txt` points to `https://libres.sbs/sitemap.xml`. GitHub Pages custom-domain settings could not be independently read through the available connection.
- Workflow has one hourly schedule. GitHub Actions currently warns that several action versions target Node.js 20 and are being forced onto Node.js 24; this is a maintenance warning, not a failed deployment.
- Added a non-blocking detailed `npm audit --json` report to push/manual workflow runs only (not the hourly schedule). It prints package, severity, vulnerable range, available fix, and advisory URLs. The current commit's audit result is pending; no dependency was upgraded.

## Public verification limits
- Direct opens of `https://libres.sbs/`, `/agenda/`, the Giordano article, `/ciencia-ia/`, and `/empresas-negocios/` failed in the web inspection tool.
- Container DNS resolution also failed for `libres.sbs`, `github.com`, `google.com`, and `registry.npmjs.org`. This is an environment-wide resolution failure and does not prove that the publication's domain is down.
- HTTP status, redirect chain, DNS answers, TLS certificate, browser-rendered content, navigation, and mobile/desktop presentation remain unverified. Do not claim public availability or indexing based on a green workflow.
- Source inspection confirms that article/category prerendered pages are not remounted by React, preserving their static HTML. The homepage retains a static fallback while the interactive app starts. Live browser behavior is still unverified.

## Supabase content inventory — read-only
- `public.articles`: 43 published records, zero drafts.
- All 43 have a slug, SEO description, and author; no duplicate category/slug pairs; zero published images with empty alt text.
- Five published articles have no image. Forty-two records lack a custom `og_image`; prerendering uses the article image or publication-logo fallback.
- One embedded data-URI image is WebP and has alt text. No other data-URI image formats were found.
- No production editorial data or media was changed.

## Security and operational risks — production unchanged
- Auth aggregate: one user, zero users with `app_metadata.role` equal to `editor` or `admin`.
- `public.articles` INSERT, UPDATE, and DELETE policies permit any authenticated user. SELECT permits public reads of published articles and authenticated reads of unpublished articles.
- Storage INSERT, UPDATE, and DELETE policies permit any authenticated user to modify `cl-article-images`; public SELECT is enabled. Bucket size limit and allowed MIME types are unset.
- `public.rls_auto_enable()` is a `SECURITY DEFINER` event-trigger function. Its body enables RLS on newly created tables in `public`; Supabase Security Advisor warns that EXECUTE is granted to `anon` and `authenticated`. No exploit has been demonstrated.
- Current Supabase Security Advisor: three warnings (the two SECURITY DEFINER execution grants and leaked-password protection disabled). Performance Advisor: four RLS initialization-plan warnings.
- Hardening requires explicit owner approval: assign an admin-controlled editor/admin role to the intended account, then apply role-gated article and Storage policies, revoke public/authenticated EXECUTE on the event-trigger function, set bucket MIME/size restrictions, and decide whether to enable leaked-password protection. No such changes have been made.
- 73 unique local-only published records remain absent from Supabase; ID collisions `e1` and `e2` remain unresolved. Do not migrate or publish them without approval.

## Next actions
1. Inspect the detailed dependency-audit output from this commit; make only targeted, tested dependency changes.
2. Obtain explicit approval and an owner-assigned admin role before preparing/applying the reversible Supabase security migration.
3. Retry public HTTP/TLS and route verification from a network with working DNS; inspect Search Console only if its connection/access is available.
4. Keep production editorial data, DNS, Auth, RLS, Storage, and credentials unchanged until the required approvals are explicit.
