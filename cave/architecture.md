# Architecture — usmanjatoi.com (Lovable mirror)

_Living document. Updated after every prompt. Owner: Lovable agent + Usman._

---

## 1. Brand positioning

- **Persona:** Usman Jatoi — "Top 0.1% Full-Stack Digital Expert & Entrepreneur."
- **Voice:** Confident, transparent, story-driven, faith + family grounded.
- **Promise:** End-to-end digital execution (strategy → build → publish → grow) plus honest storytelling of the journey behind it.
- **Differentiators:**
  1. Full-stack range (AI automation, bulk publishing, SEO, creative, web dev).
  2. Public journal / log / lifestyle content that humanizes the operator.
  3. Owned network of side businesses (Redsglow, UJ Online, RabbitFlare, Usama 2.0).
- **Primary audiences:**
  1. Clients hiring for AI + bulk-publishing + web work.
  2. Recruiters / partners vetting the operator.
  3. Aspiring creators reading the log / lifestyle content.

## 2. Site architecture (silos)

```
/
├── Home (/) ................................ brand hub, hero, teasers
│
├── SILO: About & Trust ..................... EEAT + persona authority
│   ├── /about-me
│   │   ├── /about-me/my-journey
│   │   ├── /about-me/personal-life
│   │   ├── /about-me/vision-values
│   │   └── /about-me/social-media
│   ├── /trust
│   ├── /awards      (redirect: /my-awards)
│   ├── /certifications (redirect: /my-certifications)
│   ├── /testimonials  (redirect: /my-testimonials)
│   └── /media-kit
│
├── SILO: Services (commercial) ............. money pages
│   ├── /services (index)
│   ├── /services/ai
│   ├── /services/bulk-publishing
│   ├── /services/creative
│   ├── /services/marketing
│   ├── /services/web
│   └── /services/{slug}    (27 imported children, template-driven)
│
├── SILO: Skills & Expertise ................ topical authority
│   ├── /skills-expertise
│   ├── /skills-expertise/ai-research-and-innovation
│   ├── /skills-expertise/creative-skills
│   ├── /skills-expertise/seo-marketing
│   └── /skills-expertise/technical-skills
│
├── SILO: Content (SEO engine) .............. 7,350 imported posts
│   ├── /blog (index, paginated)
│   ├── /blog/{slug}                    (post detail, 70/30 template)
│   └── /category/{slug}                (447 imported categories)
│
├── SILO: Lifestyle (human moat) ............ story + trust content
│   ├── /my-lifestyle
│   ├── /my-lifestyle/fitness-health
│   ├── /my-lifestyle/gaming-life
│   ├── /my-lifestyle/hobbies
│   └── /log                            (changelog)
│
├── SILO: Business & Portfolio .............. proof
│   ├── /businesses
│   ├── /portfolio (+ brands-businesses, websites, creative-projects, gaming-life)
│   ├── /case-studies
│   └── /press-release
│
├── SILO: Commerce / Recruit ................ conversion + team
│   ├── /shop
│   ├── /courses
│   ├── /careers
│   └── /white-label-partnership
│
├── SILO: Contact & Legal ................... capture + compliance
│   ├── /contact-me            (canonical)
│   ├── /contact, /contact-us  (redirect)
│   ├── /legal, /legal/our-terms, /legal/privacy-policy
│
└── /_authenticated/*  ..................... admin (import, dashboards)
```

## 3. Internal-linking / authority strategy

- **Home = hub.** Links out to top of every silo (services, blog, about, portfolio, log).
- **Silo index → children.** Every silo index page links down to every child (already done for services, skills-expertise, about-me, portfolio, legal, my-lifestyle).
- **Children → siblings + parent breadcrumb.** Enforced via breadcrumb component (`PageShell`) and sibling blocks on the post template.
- **Blog posts → related category + related posts.** Handled by `/blog/{slug}` sidebar and bento.
- **Money pages (services) receive links from:** home hero CTA, footer, skills-expertise, blog CTAs, contact page.
- **Trust pages (awards / testimonials / certifications) linked from:** every service page, media-kit, home hero.

## 4. Content inventory & priorities

| Priority | Silo | Volume | Status | Intent |
|---|---|---|---|---|
| P0 | Services (money) | 27 pages | Imported + template built | Convert traffic → calls |
| P0 | Blog (SEO engine) | 7,350 posts + 447 cats | Imported, rendering | Capture long-tail search |
| P1 | About / Trust | ~10 pages | Native routes | EEAT + close deals |
| P1 | Skills-expertise | 5 pages | Native routes | Topical authority + hire-me |
| P2 | Lifestyle + Log | 5 pages | Native routes | Brand moat / retention |
| P2 | Portfolio + Businesses | 6 pages | Stub + real | Proof for deals |
| P3 | Legal / Careers / Shop / Courses | 6 pages | Stub | Compliance + future revenue |

## 5. Interconnection map (why each silo exists)

- **Content silo** feeds **Services silo** (in-post CTAs → book a call).
- **Skills-expertise silo** validates **Services silo** (topical E-E-A-T).
- **About & Trust silo** validates the person selling on **Services silo**.
- **Lifestyle silo** creates parasocial trust that improves conversion on **Services silo**.
- **Portfolio & Business silo** is the receipts layer for **Services silo**.
- **Commerce silo** (courses/shop) is the future scale layer once traffic + trust exist.

## 6. Tech / rendering architecture

- Framework: TanStack Start v1 on Cloudflare Workers, Vite 7.
- Styling: Tailwind v4 tokens in `src/styles.css`.
- Backend: Lovable Cloud (Supabase). Tables: `wp_posts` (7,350), `wp_terms` (447), `wp_media` (609), `wp_post_terms`, `contact_submissions`, `user_roles`.
- Storage: `wp-media` bucket for imported media.
- Home page: WordPress HTML mirrored into `src/data/homeBody.html` + `homeStyles.css`, rendered via `dangerouslySetInnerHTML` on `/`.
- All other pages: native TanStack routes under `src/routes/`.
- Third-party: Chatway (`L0xfLqShglJm`), VideoAsk (`fbxgry0wo`), Cal.com booking.

## 7. Change log

- 2026-07-18 – Initial cave scaffold (architecture, cro, design, prompt-logs, security-seo).
- 2026-07-18 – Added trailing-slash normalization, SPA link interceptor, and 15 stub routes to make every footer link resolve (about-me, portfolio, legal, courses, case-studies, shop + subs).
