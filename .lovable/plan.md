# Complete WordPress content recovery and rendering

## Verified current state

- The backend contains **21,607 published pages**, **16,919 published posts**, 3 products, 1 course, and 609 media records.
- Page bodies are mostly present: 20,413 published pages have at least 200 content characters; 1,194 are empty or thin.
- Post bodies are not complete: only 132 posts have at least 200 content characters; 16,787 are empty or thin. The two supplied sample posts currently have empty bodies.
- 9,541 posts are missing SEO titles/descriptions, 3,919 posts have no saved path/permalink, and only 13,000 posts currently have category relationships.
- The large post/page manifests and every `public/wp-data` shard in this checkout are **Git LFS pointer text**, not the actual JSON/gzip payload. The only usable local manifest is the 609-item media manifest.
- Rendering currently tries those unusable local shards before the database. Its hydration helper can also discard valid markup and ignores custom metadata outside a fixed whitelist.

## Recovery source order

Use one deterministic precedence for every field, without replacing good data with weaker data:

1. Full WordPress export payload, if the real LFS/Drive object can be recovered.
2. Existing complete database fields.
3. Rendered live page/post HTML scraped from the original canonical URL for fields still missing or demonstrably thin.
4. Safe generated fallbacks only for metadata such as an excerpt; never invent article body content.

The original compressed export will be archived in private cloud storage when available. Public rendering will not read the 500 MB export or repository shards at runtime.

## Implementation

### 1. Make the database the only runtime content source

- Replace the local-shard-first readers with database-backed fetchers for post slug, exact path, services, category archives, child pages, and related content.
- Keep server functions thin and move parsing/normalization helpers into server-only modules.
- Preserve the canonical `content` HTML exactly; remove logic that blanks markup-only content or drops bodies based on a placeholder phrase.
- Parse structured custom fields only as additive sections. Never replace a non-empty canonical body with generated HTML.
- Ensure the blog list, blog detail, splat page route, service templates, categories, sitemap, and CMS all use the same normalized records.

### 2. Build a resumable recovery pipeline

- Add import-job and per-record health state with stages for export ingestion, live recovery, metadata normalization, taxonomy linking, media migration, and validation.
- Process by stable `id` cursor rather than offset so interrupted jobs resume safely and reruns are idempotent.
- Parse the real export in a streaming fashion when it becomes available; do not load the full 500 MB archive into memory.
- For every page and post still incomplete, scrape its rendered canonical URL, isolate the real article/page body, sanitize scripts and unsafe markup, and save the recovered HTML.
- Discover missing canonical paths from exported links, existing permalinks, sitemaps, and live canonical tags. Preserve the current WordPress URL hierarchy.
- Record source, recovery time, content hash, status, and failure reason so failed URLs can be retried without reprocessing completed records.
- Run the recovery in controlled batches with retries/backoff and an admin progress view; execute the initial full recovery as part of this work rather than requiring manual per-page imports.

### 3. Preserve rich sections and metadata without bloat

- Retain the canonical article/page HTML once in `wp_posts.content`.
- Keep only useful structured fields in `meta` (FAQs, steps, checklists, comparisons, takeaways, glossary, ACF/Rank Math/Yoast values); archive oversized raw provider responses in compressed cloud storage instead of duplicating them in every database row.
- Normalize title, excerpt, SEO title, SEO description, canonical URL, robots directives, social image, dates, author, and schema source fields during ingestion.
- Deduplicate recovered content and media by hash and skip unchanged records on reruns.

### 4. Recover taxonomy, links, and media

- Restore every category/tag relation and parent-child taxonomy relationship from the export or live data.
- Backfill the 3,919 missing post paths and ensure every internal link resolves locally.
- Crawl saved content for internal links, normalize the original domain to local paths, and log unresolved URLs for redirects instead of silently breaking them.
- Import all featured and inline images into public cloud media storage, deduplicated by content hash; rewrite `src`, `srcset`, and relevant links to cloud URLs.
- Generate optimized WebP versions where appropriate, preserve meaningful existing alt text, and derive a conservative alt from the post/media title only when the source has none.
- Use the supplied author, community, feature CTA, contact, metadata-card, and RedsGlow images, rehosted locally rather than hotlinked.

### 5. Correct page and post rendering

- Render blog posts in the requested **70/30 layout**: title/breadcrumb hero, then a constrained featured image and article body in the 70% column, with the metadata card, ad, table of contents, category navigation, sharing, and community modules in the 30% sidebar.
- Use the supplied author portrait and backgrounds; make author and quick-link text black and restore the requested sidebar sections.
- Load the supplied ad and Cal.com embeds only on the client, with isolated containers and graceful failure states so they cannot blank or shift the article.
- Render recovered pages and services through their proper templates, including child-page/service listings and working breadcrumbs.
- Keep the global native header/footer on every public page and exclude only admin/auth pages.

### 6. SEO, schema, and AI/GEO readiness

- Generate a unique, length-safe title and description per record using saved SEO data first, then source title/excerpt/content fallback.
- Emit canonical, Open Graph, Twitter, article dates, author, and cloud-hosted preview image tags per route.
- Emit valid `BlogPosting` for posts, `WebPage`/`Service` for pages, `BreadcrumbList` for hierarchy, and `FAQPage` only when real FAQs exist.
- Build summaries, key takeaways, and table-of-contents data from recovered source content only; do not fabricate sections for thin records.
- Regenerate sitemap indexes from the validated database paths and keep crawler rules aligned with public routes.

### 7. Health dashboard and completion gates

- Add a content-health view/dashboard covering totals, empty/thin content, missing paths, SEO gaps, missing taxonomy, missing/remote media, duplicate slugs, orphan references, and scrape failures.
- Do not mark recovery complete until:
  - all expected published pages/posts have a local route and canonical path;
  - every recoverable item has substantive source content or a recorded source-level reason it does not;
  - no public body or featured image depends on WordPress;
  - the two supplied sample posts match their live source content and requested layout;
  - representative pages, posts, services, categories, pagination, schema, images, header, and footer pass desktop/mobile browser checks;
  - a URL sweep reports no unexplained internal 404s and the sitemap totals match the validated database inventory.

## Technical notes

- Schema changes will use a migration with grants and row-level security for job/health tables.
- Import and cleanup actions remain authenticated and admin-role checked; public content continues through narrow published-content read policies.
- Live scraping is a one-time recovery/fallback stage. Once validation is clean, public routes will have no WordPress or connector dependency.
- The broken LFS-pointer runtime path will be removed or explicitly rejected by integrity checks so it cannot silently override complete database rows again.