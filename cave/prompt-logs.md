# Prompt log

_Every user prompt in this project, in order. Paraphrased for compactness._

## 2026-07-18

1. "Usman Jatoi" — introduction.
2. Requested help importing a ~500 MB WordPress export ZIP too big for GitHub / Lovable upload.
3. Asked to check if `usmanjatoi-site-export.zip` exists anywhere in the repo.
4. Shared file details + live site URL; asked for a ditto recreation with all media re-hosted.
5. Asked how to get the full ZIP into Lovable.
6. Shared Google Drive link → 487 MB ZIP downloaded and recovered.
7. "Use this data as well."
8. Chose: import everything (16,919 posts + 21,798 pages + 609 media), re-host media in Cloud Storage.
9. Frustrated ping to "just proceed and get everything done" — sign-in blocking.
10. Requested a pixel-accurate homepage mirror + integrate Chatway + VideoAsk chatbots.
11. "Proceed and get everything done."
12. "Import media properly, with proper sync — no errors."
13. Add scroll-driven dark→white theme transition.
14. Import all categories with parent/child structure + auto SEO archive pages.
15. Add rainbow gradient scroll progress bar; header transitions on scroll.
16. Fix missing icons across the site.
17. Create `/media-kit`.
18. Create `/careers`.
19. Create `/log` (changelog) with first entry — domain purchase.
20. Create `/businesses`.
21. Create `/blog` list page.
22. Create `/contact-me` (+ redirects from /contact, /contact-us).
23. Create `/press-release`.
24. Create `/white-label-partnership`.
25. Create `/testimonials` (+ redirect from /my-testimonials).
26. Create `/awards` (+ redirect from /my-awards).
27. Create `/certifications` (+ redirect from /my-certifications).
28. Create `/my-lifestyle/hobbies`.
29. Create `/trust`.
30. Create `/my-lifestyle/fitness-health`.
31. Create `/my-lifestyle/gaming-life`.
32. Create `/my-lifestyle`.
33. Create `/skills-expertise/seo-marketing`.
34. Create `/skills-expertise/technical-skills`.
35. Create `/skills-expertise/creative-skills`.
36. Create `/skills-expertise/ai-research-and-innovation`.
37. Create `/skills-expertise` index.
38. Create `/services` index.
39. Create `/services/web`.
40. Create `/about-me/social-media`.
41. Import all service child pages + build unified service template (27 imported).
42. Import all posts with full 70/30 template matching the reference screenshot.
43. Fix header/footer linking + trailing slashes; add missing routes.
44. Create cave/ architecture docs (this system) and keep them updated.
45. Import all pages + posts + media via WXR XML (Drive-hosted) to avoid connector credit spend: parsed `pages.xml` (21,614 pages) and `media.zip` (609 attachments) with lxml iterparse, bulk-loaded via `psql \copy` into `wp_posts` + `wp_media`, rehosted all 609 media into `wp-media` Supabase storage bucket via service-role Storage API + PostgREST PATCH (100% success). Added `src/routes/$.tsx` splat page template that resolves any unmatched path against `wp_posts.path`, renders hero + featured image + WordPress HTML content + related grid, with per-page SEO (seo_title/seo_description → meta + og + canonical).
