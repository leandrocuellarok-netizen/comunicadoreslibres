# Comunicadores Libres — operational handoff

Updated: 2026-11-28 00:34 ART  
Main: `86c6e29e17106e28237e8a8b04b77e5afcbedda1`  
Latest verified build/deploy: [run 46103357171](https://github.com/leandrocuellarok-netizen/comunicadoreslibres/actions/runs/46103357171), success. Artifact: `github-pages-46103357171-1`.

## Confirmed implementation
- Static article pages now include the site header, links to all six sections, and a category breadcrumb. Smoke tests check these links across all 43 published article pages.
- The homepage now receives build-time static fallback content: publication intro, section navigation, up to four featured and four latest article cards. React replaces the fallback when startup succeeds; if the app import fails, the fallback remains readable.
- Latest Typecheck, Vite build, prerender and smoke tests passed. The build generated 43 article pages and updated `sitemap.xml`.
- Deploy action reported success for commit `86c6e29e17106e28237e8a8b04b77e5afcbedda1` and returned `https://libres.sbs/` as the Pages environment URL.
- Artifact names remain unique per run and attempt. `CNAME` contains `libres.sbs`; `robots.txt` points to the sitemap.

## Verification limits
- Public HTTP, TLS, redirects and rendered browser behavior are still unverified. The web inspection tool could not open `libres.sbs`; the execution container also failed DNS resolution for `libres.sbs` and unrelated hosts including `github.com`. Do not infer a domain-specific outage from this.
- GitHub Pages' deployment result is not proof that the custom domain is reachable from readers' networks.

## Supabase and editorial risks — no production changes made
- `public.articles`: 43 published records, zero drafts. Five published articles have no image; all 38 records with images have non-empty alt text. Forty-two records have no custom `og_image`; the prerenderer uses the article image or publication logo fallback.
- Article INSERT/UPDATE/DELETE policies currently grant access to any authenticated role. The SELECT policy also exposes unpublished records to any authenticated role. Storage write/update/delete policies likewise accept any authenticated user.
- Image bucket `cl-article-images` is public-read and has no configured file-size or MIME allowlist.
- Auth aggregate: one user; no `app_metadata.role=editor` or `admin` is currently set. Do not switch policies to an editor-role check until the intended account is assigned an admin-controlled role, or the owner may lose CMS access.
- Supabase Security Advisor warns about `public.rls_auto_enable()` being SECURITY DEFINER and executable by anon/authenticated. It is attached to the `ensure_rls` DDL event trigger. Review and revoke unnecessary EXECUTE grants only with owner approval.
- Leaked-password protection is disabled. No RLS, Auth, Storage, secret or production-record changes have been made.
- 73 local-only published records remain absent from Supabase; ID collisions `e1` and `e2` remain unresolved. Do not migrate or publish them without approval.

## Maintenance
- `npm ci` reports 26 vulnerabilities (2 low, 12 moderate, 12 high). Detailed `npm audit` findings have not yet been collected; no dependency upgrades have been applied.
- GitHub Actions emits Node.js 20 deprecation warnings for current action versions. Builds still pass; review action upgrades separately.
- Next priorities: (1) obtain owner approval and assign the intended editor role before preparing/applying a reversible RLS and Storage hardening migration; (2) collect detailed dependency audit output; (3) independently verify public HTTP/TLS and critical routes from a working external network; (4) add images only when authorized source material and usage rights are available.
