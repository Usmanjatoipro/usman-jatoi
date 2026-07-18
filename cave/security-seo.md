# Security & SEO

_Living document. Impact and status of every security/SEO decision._

## 1. Security posture

| Area | Status | Notes |
|---|---|---|
| Auth | Supabase email + Google OAuth planned | Email confirmation disabled on request |
| RLS | Enabled on every public table | `wp_posts`, `wp_terms`, `wp_media`, `wp_post_terms`, `contact_submissions`, `user_roles` |
| Roles | Separate `user_roles` table + `has_role()` SECURITY DEFINER | Admin role pre-granted to Usman's email |
| Grants | Explicit GRANTs in every migration | `authenticated` + `service_role`; `anon` only for public read tables |
| Storage | `wp-media` bucket + policies | Public read, admin write |
| Secrets | Chatway/VideoAsk IDs public; no server-side secrets exposed | |
| Import protection | Server files under `.server.ts` never imported client-side | |

Open items:
- [ ] Add reCAPTCHA / rate-limit on `/contact-me` submissions.
- [ ] Newsletter table + RLS when the feature ships.
- [ ] Rotate Chatway / VideoAsk IDs if repo goes public.

## 2. SEO status

### Head metadata coverage
- `__root.tsx`: title + description + og + twitter defaults.
- Every native route defines its own `head()` with unique title + description + og:title + og:description.
- og:image: not yet set at leaf routes (TODO — attach hero for /services/*, /blog/{slug}).

### Structured data
- Home: JSON-LD `Person` schema (name, url, jobTitle, sameAs).
- Blog posts: TODO — add `Article` JSON-LD from post data.
- Services: TODO — add `Service` JSON-LD.

### Sitemap & robots
- `public/robots.txt`: allows all.
- `public/sitemap.xml`: placeholder — needs generation from `wp_posts` + `wp_terms` + static routes.

### Internal linking
- Silo index pages link down to all children.
- Blog post sidebar links to sibling category posts + parent category.
- Category archive links to all posts in category.
- Footer links every silo top-level (fixed 2026-07-18).

### Content depth
- 7,350 blog posts imported → massive long-tail coverage.
- 447 categories → topical clusters.
- 27 services → commercial keyword coverage.
- 5 skills-expertise pillars → E-E-A-T.

## 3. Impact priorities

| Priority | Action | Expected impact |
|---|---|---|
| P0 | Generate real `sitemap.xml` from DB | Full 7,350-post indexation |
| P0 | Add `Article` JSON-LD to `/blog/{slug}` | Rich results, CTR lift |
| P1 | og:image per route (hero-derived) | Social CTR |
| P1 | Add breadcrumb JSON-LD | SERP breadcrumbs |
| P2 | Add `Service` + `Organization` + `FAQPage` JSON-LD | Rich results on services |
| P2 | Canonical URLs everywhere (currently home only) | Duplicate-content safety |

## 4. Change log

- 2026-07-18 – File created; audit of current state captured above.
