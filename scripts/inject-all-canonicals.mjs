import fs from "fs";
import path from "path";

const SITE = "https://usmanjatoi.com";

// Map of route file to path and meta
const ROUTE_CONFIGS = [
  { file: "about-me.tsx", path: "/about-me", title: "About Me — Usman Jatoi", desc: "Get to know Usman Jatoi — journey, personal life, vision, values and social presence." },
  { file: "about-me.my-journey.tsx", path: "/about-me/my-journey", title: "My Journey — Usman Jatoi", desc: "Career milestones, professional growth, and turning points in Usman Jatoi's journey." },
  { file: "about-me.personal-life.tsx", path: "/about-me/personal-life", title: "Personal Life — Usman Jatoi", desc: "Life outside of the screen: fitness, mindset, disciplines, and passions." },
  { file: "about-me.vision-values.tsx", path: "/about-me/vision-values", title: "Vision & Values — Usman Jatoi", desc: "The core principles, work ethic, and long-term vision guiding Usman Jatoi." },
  { file: "blog.tsx", path: "/blog", title: "Blog & Knowledge Hub — Usman Jatoi", desc: "In-depth articles, tutorials, and frameworks on web development, SEO, and AI systems." },
  { file: "blog.index.tsx", path: "/blog", title: "Blog & Knowledge Hub — Usman Jatoi", desc: "In-depth articles, tutorials, and frameworks on web development, SEO, and AI systems." },
  { file: "portfolio.tsx", path: "/portfolio", title: "Portfolio & Case Studies — Usman Jatoi", desc: "Explore websites, creative projects, digital brands, and high-scale systems built by Usman Jatoi." },
  { file: "portfolio.websites.tsx", path: "/portfolio/websites", title: "Websites Portfolio — Usman Jatoi", desc: "High-performance WordPress, React, and custom web applications delivered for clients worldwide." },
  { file: "portfolio.brands-businesses.tsx", path: "/portfolio/brands-businesses", title: "Brands & Businesses — Usman Jatoi", desc: "Ventures, digital products, and brand identities developed and scaled." },
  { file: "portfolio.creative-projects.tsx", path: "/portfolio/creative-projects", title: "Creative Projects — Usman Jatoi", desc: "Design systems, motion graphics, video assets, and creative campaigns." },
  { file: "portfolio.gaming-life.tsx", path: "/portfolio/gaming-life", title: "Gaming Life — Usman Jatoi", desc: "Gaming setups, strategic plays, and high-focus recreation." },
  { file: "courses.tsx", path: "/courses", title: "Courses & Training — Usman Jatoi", desc: "Masterclasses on full-stack development, programmatic SEO, and modern web architectures." },
  { file: "testimonials.tsx", path: "/testimonials", title: "Testimonials & Reviews — Usman Jatoi", desc: "What clients, founders, and partners say about working with Usman Jatoi." },
  { file: "contact-me.tsx", path: "/contact-me", title: "Contact Me — Usman Jatoi", desc: "Get in touch for custom web development, SEO consultations, and AI engineering projects." },
  { file: "careers.tsx", path: "/careers", title: "Careers & Opportunities — Usman Jatoi", desc: "Join the team, collaborate on digital systems, and scale modern web initiatives." },
  { file: "businesses.tsx", path: "/businesses", title: "Businesses & Ventures — Usman Jatoi", desc: "Portfolio of commercial operations, digital platforms, and ventures." },
  { file: "awards.tsx", path: "/awards", title: "Awards & Honors — Usman Jatoi", desc: "Industry recognition, digital awards, and milestones achieved." },
  { file: "certifications.tsx", path: "/certifications", title: "Certifications & Credentials — Usman Jatoi", desc: "Professional certifications across development, cloud platforms, and digital marketing." },
  { file: "press-release.tsx", path: "/press-release", title: "Press Releases & Media — Usman Jatoi", desc: "Official press announcements, company news, and public updates." },
  { file: "media-kit.tsx", path: "/media-kit", title: "Media Kit & Brand Assets — Usman Jatoi", desc: "Official bios, headshots, brand logos, and press resources for Usman Jatoi." },
  { file: "trust.tsx", path: "/trust", title: "Trust & Transparency — Usman Jatoi", desc: "Security standards, client confidentiality, and operational integrity." },
  { file: "case-studies.tsx", path: "/case-studies", title: "Case Studies & Results — Usman Jatoi", desc: "Measurable impact, traffic growth, and ROI delivered for enterprise clients." },
  { file: "white-label-partnership.tsx", path: "/white-label-partnership", title: "White-Label Agency Partnerships — Usman Jatoi", desc: "Scalable white-label development and SEO execution for agencies worldwide." },
  { file: "shop.tsx", path: "/shop", title: "Shop & Digital Products — Usman Jatoi", desc: "Themes, boilerplates, automation templates, and development resources." },
  { file: "skills-expertise.index.tsx", path: "/skills-expertise", title: "Skills & Expertise — Usman Jatoi", desc: "Core technical capabilities: web architecture, SEO algorithms, AI tooling, and design systems." },
  { file: "my-lifestyle.index.tsx", path: "/my-lifestyle", title: "My Lifestyle — Usman Jatoi", desc: "Mindset, wellness routines, hobbies, and personal philosophy." },
  { file: "legal.tsx", path: "/legal", title: "Legal Information — Usman Jatoi", desc: "Legal disclosures, operational terms, and policies." },
  { file: "legal.our-terms.tsx", path: "/legal/our-terms", title: "Terms of Service — Usman Jatoi", desc: "Terms and conditions governing services and digital assets on UsmanJatoi.com." },
  { file: "legal.privacy-policy.tsx", path: "/legal/privacy-policy", title: "Privacy Policy — Usman Jatoi", desc: "Privacy policy and data protection commitments for UsmanJatoi.com." },
];

let modifiedCount = 0;

ROUTE_CONFIGS.forEach((cfg) => {
  const filePath = path.join("./src/routes", cfg.file);
  if (!fs.existsSync(filePath)) return;

  let content = fs.readFileSync(filePath, "utf8");
  const canonicalUrl = `${SITE}${cfg.path}`;

  const headBlock = `  head: () => ({\n    meta: [\n      { title: "${cfg.title}" },\n      { name: "description", content: "${cfg.desc}" },\n      { property: "og:title", content: "${cfg.title}" },\n      { property: "og:description", content: "${cfg.desc}" },\n      { property: "og:type", content: "website" },\n      { property: "og:url", content: "${canonicalUrl}" },\n      { name: "twitter:card", content: "summary_large_image" },\n    ],\n    links: [{ rel: "canonical", href: "${canonicalUrl}" }],\n  }),`;

  if (content.includes("head: () => ({")) {
    // Replace existing head
    content = content.replace(/head:\s*\(\)\s*=>\s*\(\{[\s\S]*?\}\),/m, headBlock);
  } else if (content.includes("createFileRoute(")) {
    // Insert head into route config
    content = content.replace(/(export const Route = createFileRoute\([^)]+\)\(\{)/, `$1\n${headBlock}`);
  }

  fs.writeFileSync(filePath, content, "utf8");
  console.log(`✓ Injected Canonical & Head into: ${cfg.file} -> ${canonicalUrl}`);
  modifiedCount++;
});

console.log(`\n🎉 Successfully injected canonical tags into all ${modifiedCount} static routes!`);
