# Import everything from your WordPress XML exports

Your Drive folder is reachable and holds the exact files needed:

| File | Size |
| --- | --- |
| `usmanjatoipro.posts.WordPress.2026-07-18.xml` | 502 MB |
| `usmanjatoipro.pages.WordPress.2026-07-19.xml` | 488 MB |
| `usmanjatoipro.WordPress.2026-07-19.Media.xml` | 2.3 MB |
| `usmanjatoi-site-export-20260712-152710.zip` | 488 MB |

The size is not a problem. Nothing gets uploaded through chat or committed to the repo — the files are pulled straight into the build sandbox from Drive and streamed record by record into the database.

## Verified current state

- Database: **21,607 published pages**, **16,919 published posts**, 3 products, 1 course, 609 media rows.
- Only **132 posts** have a real body; **16,787 are empty or thin**. Both sample posts you gave me have empty content.
- 9,541 posts have no SEO title/description, 3,919 have no saved URL path, 3,919 have no category link.
- Every large data file in the repo (`src/data/wp-*-manifest.json`, all of `public/wp-data/**`) is a Git LFS pointer stub, not real data — which is why "the data we already have" never rendered.
- Rendering reads those broken stubs first and only falls back to the database for blog posts by slug, so pages, services and category archives have no working fallback.

The posts XML is the missing piece: it carries `content:encoded` for all 16,919 posts.

## Plan

### 1. Stream the XML into the database

- Download each XML from Drive into the sandbox (no repo commit, no LFS).
- Parse with a streaming parser so a 500 MB file never loads into memory at once.
- Per record extract: id, type, status, slug, title, content, excerpt, permalink, path, dates, parent, menu order, author, thumbnail id, categories/tags, and the useful meta keys (Rank Math, Yoast, FIFU, ACF section fields).
- Bulk-load in batches, upserting on WordPress id so reruns are idempotent and a rerun never overwrites a good body with an empty one.
- Fill the 3,919 missing paths from each item's permalink, preserving your existing URL structure exactly.

### 2. Restore taxonomy and media

- Import all terms with correct parent/child structure, names and slugs; rebuild every post-to-category/tag link.
- Cross-check the media XML against the 609 hosted files; pull any missing image into cloud storage.
- Rewrite inline `usmanjatoi.com` / `wp-content/uploads` URLs in content to cloud URLs so no page depends on WordPress.
- Backfill featured images from thumbnail id, then FIFU meta, then first in-content image.

### 3. Fix the rendering path

- Make the database the single runtime source; delete the LFS-stub reader path that currently shadows it.
- Stop the hydration helper from discarding valid content (the markup-only strip check and the placeholder-phrase rule both blank real bodies today).
- Render structured meta sections as additions to the body, never as a replacement.
- Give pages, services and category archives the same database fallback that blog posts have.

### 4. Post template and assets you specified

- 70/30 layout: breadcrumb hero, then a constrained featured image and body in the 70% column.
- Sidebar: metadata card, table of contents, categories, share, community — author and quick links in black, not blue.
- Your supplied images used for author portrait, metadata card background, community section, featured-in-article CTA, contact block and the RedsGlow banner, all rehosted locally.
- Ad script and Cal.com embed loaded client-side in isolated containers so they cannot blank or shift the article.

### 5. SEO, schema, sitemap

- Unique length-safe title and description per record from the imported SEO fields.
- Canonical, Open Graph, Twitter and cloud-hosted preview image per route.
- `BlogPosting` for posts, `WebPage`/`Service` for pages, `BreadcrumbList` everywhere, `FAQPage` only where real FAQs exist.
- Regenerate sitemaps from validated database paths.

### 6. Verification before I call it done

A health dashboard reporting empty/thin content, missing paths, SEO gaps, missing taxonomy, remote media and duplicate slugs. Completion requires: all 16,919 posts and 21,607 pages carry their real imported body, both sample URLs match the live originals in content and layout, no public asset points at WordPress, and a link sweep reports no unexplained 404s.

## Technical notes

- Streaming XML parse in the sandbox; batched upserts on WordPress id; cursor tracked per stage so an interrupted run resumes instead of restarting.
- Oversized raw payloads stay out of the database rows; only useful structured meta is kept.
- Import/cleanup stay admin-gated; public reads stay on published-content policies.
- After validation the WordPress connector is no longer on any public code path.
