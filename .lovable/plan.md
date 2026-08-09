# Content Intelligence + SEO Enrichment Program

A phased build. Each phase ships on its own so you see results early.

## What I verified first

- 16,977 rows in `Final_Posts_Doc_-_Blog_Posts_Data.csv` (`H1/Title`, `Live Url`, `Outline`), with 1,699 outline cells — the merged cells, each covering a block of posts, sectioned by `stats / quote / insight / example / risk / tools and resources / citations / AI`.
- Existing admin area: `/admin`, `/cms`, `/import`, `/seed` under `_authenticated`, plus a `/seo-studio` route and a single `sitemap.xml`.
- Six you.com keys already in cloud secrets (`you_job_usmanjatoi`, `you_contact_usmanjatoi`, `you_social_usmanjatoi`, `you_me_usmanjatoi`, `you_info_usmanjatoi`, `you_info_wpbulkpublishing`).

---

## Phase 1 — Content Intelligence dashboard

New admin page `/admin/intel`:

- **Inventory cards**: total pages, posts, services, categories, tags, media, indexable vs noindex, posts with/without featured image, with/without meta description, thin content (<300 words).
- **Hierarchy tree**: pillar → category → subcategory → post counts, expandable, showing depth and orphan pages (no internal inbound links).
- **Topical authority view**: clusters by category with coverage score (posts, avg word count, internal links in/out, schema present, outline enrichment present) and a "gaps" list — clusters where you have volume but no pillar page, or a pillar with too few supporting posts.
- **AI chat over your corpus**: ask "how many AI posts do I have?", "what's missing in the SEO cluster?", "which services have no supporting blog posts?". Answers are grounded in live database aggregates, not guesses.

## Phase 2 — Ingest the outline CSV

- New table `wp_post_outlines` (post match by Live Url/slug, plus parsed sections: intro, key concepts, main points, examples, best practices, stats, quotes, insights, risks, tools, citations, AI notes).
- Parser splits the merged cells into per-post blocks by heading, matches each to a post by URL, and reports unmatched rows so nothing is silently lost.
- Idempotent: re-running updates rather than duplicating.

## Phase 3 — Richer blog posts

For every post that has outline data, render (in the existing 70/30 template, same Helvetica/black-white-orange system):

- Key stats strip, pull quotes, "insights" callouts, risks, tools & resources, and a citations list with outbound links.
- FAQs (collapsed, black chevron) and a takeaways box.
- Schema upgrade per post: `BlogPosting` + `FAQPage` + `HowTo` where applicable + `ItemList` for stats + `Person` E-E-A-T author block with credentials, plus `speakable` and `citation` fields.

## Phase 4 — you.com enrichment engine

- Server-side you.com client with automatic rotation across the six keys and quota tracking, so a single key running out doesn't stop the run.
- Batch jobs, driven from the admin UI with live progress:
  - **Services**: per-service keyword + SERP research → unique intro, differentiators, pricing framing, objection-handling FAQs, related-industry and location sections. Kills the "programmatically generated" sameness.
  - **Posts**: fill missing meta title/description, add fresh stats and citations, and generate the per-post unique section from your clustered question list.
- Everything is written to the database as reviewable drafts; you approve (bulk or individually) before it goes live.

## Phase 5 — Indexation repair

- Audit every route + database row for `noindex`, thin content, duplicate titles/descriptions, canonical mismatches, and broken internal links; results surfaced as a fixable list in the dashboard.
- **Sitemaps**: sitemap index + chunked child sitemaps (1,000 URLs each) split by type (posts, pages, services, categories, media), auto-regenerating as content changes, with correct `lastmod` from real post modification dates only.
- **HTML sitemap** page (Rank Math style) for crawl paths and users.
- **llms.txt + llms-full.txt** auto-generated from live content counts and the URL index.
- Internal linking automation: silo rules (post → category → pillar service) with a contextual related-links block, so orphan pages disappear.

## Phase 6 — E-E-A-T signals

- Author entity pages with `Person` + `sameAs` across your profiles, credentials, awards.
- Review/rating schema where you have real testimonials only (no invented ratings).
- Per-post "reviewed by / last updated" line backed by real timestamps.
- Organization + WebSite + Breadcrumb graph wired sitewide.

---

## Technical notes

- New tables: `wp_post_outlines`, `content_enrichment` (drafts + approval state), `seo_audit_findings`, `you_api_usage`. Each gets GRANTs + RLS (admin-write, public-read where needed).
- All you.com and AI calls run in `createServerFn` handlers; keys are read inside handlers, never exposed to the browser.
- Long enrichment runs are chunked and resumable (state row per job) rather than one long request.
- No new Edge Functions; TanStack server functions and `/api/public/*` routes only.

## Suggested order

Phase 1 + 2 first (visibility and data), then 5 (indexation is your bleeding wound), then 3, 4, 6.

Tell me if you want that order changed, or if you want me to start with the indexation repair instead.
