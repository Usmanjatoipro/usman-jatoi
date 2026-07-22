## Current state (verified in your Lovable Cloud DB)

- **Pages**: 21,607 published · **Posts**: 13,000 · **Products**: 3 · **Courses**: 1
- **Media**: 609/609 rehosted on Lovable Cloud storage (0 depend on WordPress)
- **Categories/tags**: 451 terms imported
- **URL paths**: 100% of published items have a `path` (WP-identical URLs preserved)
- **229 blog posts** have no featured image assigned
- **171 pages/posts** still contain inline `usmanjatoi.com` or `/wp-content/uploads/...` URLs baked into their HTML body — these load images from WordPress
- **No service taxonomy** exists — services are pages nested by URL (e.g. `/services/web/cms/wordpress/{child}/`), not by parent_id

## What I'll fix

### 1. Kill every remaining WordPress dependency in post/page HTML
One-time server function that scans all published `wp_posts.content`:
- Find every `https?://usmanjatoi.com/wp-content/uploads/...` and every relative `/wp-content/uploads/...`
- Download each missing asset into the `wp-media` bucket (dedupe by filename hash)
- Rewrite the HTML to the Cloud storage URL and `UPDATE wp_posts` in place
- Also strip absolute `https://usmanjatoi.com` prefixes from inline `<a href>` so internal links stay SPA-routed
- Progress UI on `/admin` so you can watch it finish

Result: 0 references to `usmanjatoi.com` or `wp-content/uploads` anywhere in the DB.

### 2. Backfill featured images for the 229 orphan posts
Extract the first `<img>` inside `content`, resolve it to a `wp_media` row (or import it), and set `featured_media_id`. Posts render with hero images everywhere.

### 3. Services hub — parent → children hierarchy from URL paths
Because services are pages nested by URL, I'll:
- Rebuild `/services` to list only top-level lines (`/services/web/`, `/services/seo/`, `/services/game/`, `/services/pr/`, `/services/lead-generaton/`, etc.) with the page's own hero image + excerpt
- On any `/services/{parent}/` page, auto-render a "Sub-services" grid listing all pages whose `path` starts with that prefix + one segment deeper
- Same recursion for `/services/web/cms/`, `/services/web/location/`, etc.
- Each node uses the WP page's real title, excerpt, featured image, and SEO fields

Result: browse from `/services` → any leaf without a dead end.

### 4. Structured data (schema.org JSON-LD)
Add per-route JSON-LD in `head()`:
- Posts → `Article` (headline, image, datePublished, author)
- Services / pages → `Service` or `WebPage` with breadcrumbs
- Homepage → `Person` (Usman Jatoi) + `WebSite` with SearchAction

### 5. Head/meta cleanup on every route
- Unique `title`, `description`, `og:title`, `og:description`, `og:image` (from featured media, absolute https URL), `twitter:card` per route
- Canonical URL set to the same path as WP had (no changes to URL structure)

### 6. Strip Elementor/WP CSS residue without touching visuals
`SiteChrome` already filters some junk stylesheets. I'll:
- Extend `HEAD_JUNK_PATTERNS` to drop every Elementor `frontend.min.css`, `widget-*.min.css`, `motion-fx`, `swiper`, `photoswipe`, `woocommerce*`, `tutor*` sheet that isn't actually used by native routes
- Keep only what's needed: fonts (inter, manrope, zeyada), the FontAwesome pack, and the tiny custom bits that drive the hero animations
- Rebuild home hero styles as scoped CSS so removing the Elementor sheets can't regress the look

### 7. Search visibility inside the Lovable preview chrome
The Lovable preview's page-search reads `<title>` and rendered text. Because 34K+ dynamic pages render through the `$.tsx` splat, they're all crawlable/searchable once the head metadata in step 5 lands.

### 8. 404 sweep
Automated crawl of every internal link found in `wp_posts.content` after step 1. Any URL that still 404s gets logged to a `broken_links` table with a suggested redirect (nearest matching slug). I'll ship a `redirects` table + splat fallback that consults it before returning 404.

## Technical section

- New server fns in `src/lib/wp-cleanup.functions.ts`: `rewriteInlineMedia`, `backfillFeaturedImages`, `crawlBrokenLinks` — all `.middleware([requireSupabaseAuth])` and admin-role gated
- Migration adds `redirects (from_path text pk, to_path text)` and `broken_links (path text pk, suggested text, checked_at timestamptz)` with RLS + GRANTs
- Update `src/routes/$.tsx`: on notFound, look up `redirects` and 301-navigate; also inject JSON-LD in `head()`
- Update `src/routes/services.index.tsx` + new `src/routes/services.$.tsx` splat to render the recursive services tree from `wp_posts` paths
- Update `src/routes/blog.$slug.tsx` and `$.tsx` to include Article/WebPage JSON-LD
- Extend `HEAD_JUNK_PATTERNS` in `src/components/SiteChrome.tsx`; move required hero CSS into `src/styles.css` (scoped) before removing sheets
- Admin dashboard at `/admin` gains three run buttons + live progress for the three cleanup jobs

No URL structure changes. No design regressions — every removal of Elementor CSS is paired with a scoped replacement first, verified visually before the sheet is dropped.

## Out of scope (say the word to add)
- Redirecting the `usmanjatoi.com` domain to this app (DNS is your side)
- Rewriting old WP HTML into native React components (heavy; keeping HTML preserves fidelity)
