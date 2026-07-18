# Design system & UX

_Living document. Visual language, components, responsiveness, motion._

## 1. Palette

- Base bg: `#0a0a0e` (near-black) with scroll-driven transition to `#ffffff`.
- Accent gradient (brand): `#ff6ec4 → #7873f5 → #1fd1f9 → #ff6ec4` (animated 6s linear).
- Text on dark: `#ffffff`, muted `rgba(255,255,255,0.6-0.7)`.
- Border on dark: `rgba(255,255,255,0.1-0.3)`.

## 2. Typography

- Display / hero: inherited from Elementor mirror (usmanjatoi Elementor kit fonts).
- Native routes: Tailwind default stack, headings bold + gradient text on H1s.
- Never use serif unless a specific editorial page requests it.

## 3. Motion

- Home hero: scroll-driven dark → light theme via `--scroll-theme` CSS var + `color-mix(oklab)`.
- Header: transparent → white-glass on scroll.
- Progress bar: 4px animated rainbow gradient stroke at very top, black bg.
- Say / Hello scroll animation with image fade+scale.
- Rainbow border on primary CTA buttons (border-animated 6s linear infinite).

## 4. Components

- `src/components/PageShell.tsx` — dark hero page shell + breadcrumb + gradient H1 for native content routes.
- `src/components/PageShell.tsx` `<LinkGrid />` — 2-col link cards for silo index pages.
- Blog post template: 70/30 layout with sticky sidebar (meta, quote, ad slot, TOC, share).
- Service template: hero + zigzag intro + trusted marquee + accordion about + expertise trio + 3D-tilt cards + tools + process + video + portfolio tabs + transparency + Cal.com + awards + global flags + FAQ + contact.

## 5. Responsiveness

- Homepage mirror: preserves original Elementor breakpoints (desktop / tablet / mobile).
- Native routes: Tailwind `md:` breakpoint at 768px for grids and hero sizing.
- Header progress bar: always full-width, `position: fixed`.
- All CTAs full-width on mobile, inline on desktop.

## 6. Icon & font assets

- Icon fonts hosted locally in `public/fonts/` (Elementor icons + fontawesome).
- Media re-hosted in `public/site-assets/` and `wp-media` storage bucket.

## 7. Change log

- 2026-07-18 – File created.
- 2026-07-18 – Added `PageShell` component for silo stub pages.
