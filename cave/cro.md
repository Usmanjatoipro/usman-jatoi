# CRO — Conversion Rate Optimization

_Living document. Only CRO belongs here (offer, funnel, friction, experiments)._

## 1. Primary conversion goals

| # | Goal | Where it happens | Current state |
|---|---|---|---|
| 1 | Book a discovery call | `/contact-me` form + Cal.com embed on service pages | Live; form writes to `contact_submissions` |
| 2 | Newsletter signup | Blog post CTA blocks, footer (planned) | Not wired yet |
| 3 | Media-kit / press download | `/media-kit`, `/press-release` | Live, static assets |
| 4 | White-label partnership inquiry | `/white-label-partnership` → `/contact-me` | Live |

## 2. Funnel

```
Traffic source
   → Home (/) or Blog post (/blog/{slug}) or Service (/services/{slug})
       → In-page CTA (Book a call / Let's Talk pill / Contact form)
           → /contact-me   OR   Cal.com booking widget
               → Submission (contact_submissions) or booked call
```

## 3. Friction points (to fix / A-B test)

- [ ] Newsletter capture: no backend yet — add a `newsletter_subscribers` table and inline form.
- [ ] Blog posts don't currently show a sticky "Book a call" CTA on mobile.
- [ ] `/contact-me` form: no success animation / confirmation email yet.
- [ ] Home hero has "Let's Talk" pill but no secondary CTA to /services.
- [ ] Service pages have long scroll before booking — add sticky booking bar.

## 4. Experiments log

_None run yet. Format: date · hypothesis · variant · metric · result._

## 5. Offer positioning

- Primary offer: "Book a call to discuss your project." (free discovery)
- Secondary offer (planned): productized bulk-publishing package.
- Tertiary (future): courses + shop.

## 6. Change log

- 2026-07-18 – File created.
