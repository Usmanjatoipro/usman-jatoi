# Technical SEO Recovery — usmanjatoi.com

Goal: restore indexation of the old, previously-ranked URL base and push service pages to the front of the queue, so organic traffic converts into bottom-of-funnel leads.

## What I verified (live, not assumed)

Search Console (property `https://usmanjatoi.com/`, last 90 days):
- 24 clicks / ~1,000 impressions total. Nearly all impressions come from legacy blog URLs; **no service page is earning meaningful impressions**.
- Every indexed URL Google reports ends with a **trailing slash** (`/about-me/`, `/services/dubbing/hindi/platform/telegram/`).
- Sitemap `https://usmanjatoi.com/sitemap.xml` currently reports **0 errors / 0 warnings** and was downloaded successfully today. All 25 child sitemaps return HTTP 200 in 0.1–2.7s (~19,000 URLs). The error you saw was from an earlier submission and is no longer reproducing; I'll re-verify after the fixes land.

Semrush: 61 organic keywords, all positions 38–95, zero commercial-intent service terms.

Live site defects found:
1. **Homepage canonical points to `https://usman-connects-us.lovable.app`** — a dev URL. This alone tells Google the homepage is a duplicate of a foreign domain.
2. **Every `/category/*` page canonicalises to the same lovable.app domain** (~447 pages).
3. `robots.txt` advertises `Sitemap: https://usmanjatoi.lovable.app/sitemap.xml`.
4. `llms.txt` lists every link on `usmanjatoi.lovable.app`; **`llms-full.txt` does not exist (404)**.
5. ~16 route files hardcode `usmanjatoi.lovable.app` in canonical/og:url (services/web, skills-expertise/*, my-lifestyle/*, about-me/social-media, sitemap, seo-studio).
6. **Trailing-slash contradiction — the biggest indexation killer.** `/services/ai/` 307-redirects to `/services/ai`, but the page's own canonical says `/services/ai/`. So the canonical points at a redirect. Google's report for this is "Page with redirect" / "Alternate page with proper canonical tag" — exactly the exclusions you're seeing, and it applies to the whole legacy URL base Google already has indexed.
7. **~40 routes emit no canonical at all**, including `/blog`, `/about-me`, `/portfolio`, `/courses`, `/testimonials`, `/contact-me`.
8. Redirects are **307 (temporary)**; Google does not transfer signals through them the way it does through 301.

## The fix, in priority order

### P0 — Stop the deindexation (highest leverage, low effort)
1. Create one shared `src/lib/site.ts` exporting `SITE = "https://usmanjatoi.com"` and a `canonicalUrl(path)` helper. Replace every hardcoded lovable/dev origin across routes and components with it. Zero dev URLs may remain in shipped HTML.
2. **Settle one URL form: no trailing slash.** Canonical, `og:url`, sitemap entries, internal `<Link>`s and JSON-LD `item`/`url` values all use the slash-free form. Legacy slashed URLs keep working via redirect.
3. Change the trailing-slash redirect from **307 to 301** so Google consolidates the old indexed URLs onto the new canonical form permanently.
4. Fix `services/$slug` canonical (drop the trailing slash) and add canonical + og:url to the ~40 routes missing them.
5. `robots.txt`: point `Sitemap:` at `https://usmanjatoi.com/sitemap.xml`. Keep AI crawlers allowed.

### P1 — Sitemap and machine-readable files
6. Rebuild `llms.txt` on the live domain and add a real `/llms-full.txt` route (full service catalogue + top content, chunked to stay under a sane payload).
7. Sitemap hygiene: emit only canonical, slash-free, HTTP-200 URLs; drop any row whose `path` doesn't resolve; add `<lastmod>` only from `post_modified` (never generated-at-render time). Verify no URL in any child sitemap redirects.
8. Reorder the sitemap index so **service sitemaps come first**, and split the top-priority clusters into their own files Google can be pointed at directly: `services-website`, `services-seo-marketing`, `services-geo`, `services-vibe-coding`, `services-technical`, `services-ai`, `services-bulk-publishing`.
9. Confirm nothing in the app emits `noindex` for these pages — the current `robots` meta is only set on genuine 404s, and that stays. Everything else is explicitly indexable.
10. Resubmit `sitemap.xml` in Search Console after deploy and re-read its status.

### P2 — Make service pages rank and convert (the revenue layer)
11. For the seven priority clusters, ensure each hub page has: a unique 50–60 char title with a commercial modifier, unique meta description, single H1, real DB content, `Service` + `BreadcrumbList` + `FAQPage` JSON-LD, and a visible above-the-fold lead CTA.
12. Fix internal linking: services hub → cluster hubs → child pages → related posts, and blog posts → the matching service. Currently 19k pages sit near-orphaned behind sitemap-only discovery, which is why they get crawled but not indexed.
13. Breadcrumbs: render visible breadcrumbs on every service/post/category page with matching `BreadcrumbList` JSON-LD using slash-free URLs, so Google can show breadcrumb rich results instead of the raw URL.
14. Lead capture: verify the contact form on service pages writes to `contact_submissions`, and add a per-page source field so you can attribute leads to the service page that produced them.

### P3 — Verification and monitoring
15. Post-deploy crawl script asserting: no dev URL in any rendered page, canonical == request URL for a sample of 200 URLs across every route type, and every sitemap URL returns 200 without redirect.
16. Use URL Inspection on the seven service hubs to read their current index state after deploy. Note: the API can read index state but **cannot request indexing** — you'll click "Request indexing" for those hubs yourself in Search Console.

## Expected impact

The canonical/dev-domain and trailing-slash contradictions are why previously-indexed pages fell out; both are config-level and fixable in one deploy. Recovery of an existing indexed base is normally the fastest path to a 3–4x lift, and steering that recovery at service clusters — rather than the informational archive that currently absorbs all impressions — is what turns it into sales-qualified leads.

## Technical notes

- Files touched: `src/lib/site.ts` (new), `src/routes/sitemap[.]xml.tsx`, `src/routes/sitemap.$name.tsx`, `src/routes/llms[.]txt.tsx`, `src/routes/llms-full[.]txt.tsx` (new), `public/robots.txt`, `src/routes/index.tsx`, `src/routes/category.$slug.tsx`, `src/routes/services.$slug.tsx`, `src/components/PageHero.tsx`, plus the ~40 routes missing canonicals.
- Trailing-slash 301 handling goes in the server request layer so both SSR and static responses obey it.
- No content is set to `noindex`; the only `noindex` stays on genuine not-found responses.
