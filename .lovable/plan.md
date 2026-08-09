# Indexation & Coverage Automation for usmanjatoi.com

## What Search Console actually says right now

Live reads from your verified property `https://usmanjatoi.com/`:

- `sitemap_index.xml` submits **38,417 web URLs + 3,463 image URLs**. Google last downloaded it 2026-07-31. It carries 6 warnings; `page-sitemap16.xml` reports 1 error and several others report warnings. Search Console gives counts only, not causes — the exact cause is unknown until each file is fetched and validated.
- The two pages I inspected (`/services/ai/` and a deep blog page) both come back **"Submitted and indexed", robots ALLOWED, canonical self-referencing, fetch SUCCESSFUL**. So there is no site-wide crawl/canonical block — indexation is patchy, not broken.
- Performance, last 90 days: the whole site earns roughly **26 clicks** across its top pages. Only two URLs get meaningful impressions (`inshot-free-video-templates-download`, the homepage). Dozens of pages sit at position 30-98 with 1-6 impressions — classic "indexed but not competitive" long tail.
- The deep blog page **fails rich results**: Product snippet markup ("Key Features", "Pricing", "User Rating") is emitted without `offers`/`review`/`aggregateRating`. Breadcrumbs pass.

So the real problem is not "Google can't reach us." It is: no measurement of which of 38k URLs are indexed, invalid structured data on the blog template, sitemap files Google flags, and a huge tail of thin pages with nothing to rank on.

## The system to build

### 1. Coverage Intelligence (the core piece)
A stored, self-refreshing index-status table for every URL, using the URL Inspection API (quota: 2,000 URLs/day, 600/min per property).

- New table `gsc_url_status`: url, verdict, coverage_state, google_canonical, user_canonical, last_crawl_time, robots_state, fetch_state, rich_result_verdict, checked_at.
- A cron-driven public route walks the URL list oldest-checked-first, ~2,000/day, and upserts results. At that rate the full 38k set is profiled in ~19 days and then continuously re-profiled.
- Dashboard section at `/seo` → "Coverage": counts by coverage_state (Submitted and indexed / Crawled - currently not indexed / Discovered - not indexed / Duplicate, Google chose different canonical / Excluded by noindex), filterable by URL pattern so services vs blog can be compared, plus one-click drilldown to the offending URLs.

This turns "are my pages indexed?" from a guess into a number, and every fix below gets measured against it.

### 2. Sitemap hygiene + resubmission
- Validate each generated sitemap chunk: no non-200 URLs, no redirects, no noindex URLs, no >50k/50MB overflow, correct `lastmod` sourced from `post_modified` only (never build time).
- Drop from sitemaps any URL that Coverage Intelligence marks as noindex, duplicate-canonical, or 404 — Google's trust in a sitemap drops when it's full of URLs it rejects.
- Automated resubmission of the sitemap index via `PUT /webmasters/v3/sites/{site}/sitemaps/{sitemap}` after each regeneration, plus a job that reads sitemap status back and surfaces error/warning counts in the dashboard.
- Split by intent: `services-*.xml` and priority-post sitemaps separate from the long tail, so their crawl signals aren't diluted.

### 3. Fix the structured-data failure
- Remove or complete the Product snippet markup on blog posts. Comparison-style posts should emit `Review`/`ItemList` (with `itemReviewed` + `aggregateRating` where a genuine rating exists), never a bare `Product`.
- Add `Service` + `Offer` JSON-LD to the 27 service pages, `FAQPage` where real Q&A exists, `BreadcrumbList` everywhere (already passing — keep).
- A validator server function re-inspects a sample of each template weekly via URL Inspection and flags regressions.

### 4. Priority crawl paths for services
Services are the revenue pages, so they get the strongest internal signal:
- A hub-and-spoke pass: every service page links to its 5-10 most topically related blog posts, and those posts link back to the service. Related posts chosen by shared category/tag + title similarity.
- "Recently updated" and "Latest posts" feeds on the homepage and every category archive so new/changed URLs are one hop from the root.
- An `/updates` feed page + RSS at `/feed.xml` — cheap, reliable discovery surface.

### 5. Thin-content triage before more submission
Pushing 38k thin URLs at Google makes coverage worse, not better. So:
- Score every post: word count, unique-title check, unique-meta check, presence of outline/FAQ/citation data from `wp_post_outlines`.
- Anything below threshold and with zero impressions in 12 months goes into one of three buckets: **enrich** (you.com engine fills it out), **merge** (canonical into a stronger sibling), **retire** (410 + removed from sitemap).
- The enrichment queue prioritises by GSC impressions — pages already getting impressions at position 10-30 move first, because those convert into clicks fastest.

### 6. Ping-and-refresh loop
- IndexNow submission (Bing/Yandex, free, no quota drama) on every publish/update — genuinely automatic.
- For Google, no public "index this" API exists for regular pages (the Indexing API is job-posting/livestream only). What works instead is what's above: clean sitemaps with honest `lastmod`, fast server responses, and internal links. The plan does not pretend otherwise.

## Quick wins, in order

1. Fix the Product-snippet schema error on the blog template (currently an outright ERROR verdict).
2. Rebuild + resubmit sitemaps with real `lastmod` and no junk URLs; clear the `page-sitemap16.xml` error.
3. Stand up `gsc_url_status` + the daily 2,000-URL inspection crawler so coverage becomes measurable.
4. Wire the services hub-and-spoke internal links.
5. Point the you.com enrichment engine at the impression-bearing, position 10-30 pages first.

## Technical notes

- All Search Console calls go through the connector gateway from server code (`src/routes/api/public/*` for the cron endpoint, secured with a shared secret), never from the browser.
- URL Inspection quota is 2,000/day per property; the crawler must persist a cursor and back off on 429.
- The daily job runs on a schedule via pg_cron hitting the stable `project--{id}.lovable.app/api/public/...` URL.
- Enrichment continues to run against you.com directly with your own key, not Lovable AI credits.
- Everything reads/writes existing tables (`wp_posts`, `wp_terms`, `wp_post_outlines`, `seo_audit_findings`) plus the one new `gsc_url_status` table, with RLS + explicit grants.

## One caveat

Your Search Console property is the live WordPress site `usmanjatoi.com`. This Lovable project isn't published yet, so any code change here only affects Google once this build replaces the live site at that domain. Fixes shipped here are staged until then — worth deciding whether we cut over before or after the coverage crawler has a baseline.
