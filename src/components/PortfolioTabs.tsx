import { useState } from "react";

type Slide = { src: string; alt: string; title: string; description: string };
type Tab = { key: string; label: string; blurb: string; slides: Slide[] };

const TABS: Tab[] = [
  {
    key: "creative",
    label: "Creative Work",
    blurb: "Branding, product mockups, packaging & visual identity systems.",
    slides: [
      { src: "/site-assets/Can1.png", alt: "Beverage can 3D packaging mockup", title: "Beverage Can Mockup", description: "Photoreal can rendering for a drink brand launch." },
      { src: "/site-assets/RabbitFlare-Logo.png", alt: "RabbitFlare brand logo", title: "RabbitFlare Logo", description: "Playful mark for a lifestyle micro-brand." },
      { src: "/site-assets/Shirt-Design.png", alt: "Apparel shirt graphic design", title: "Apparel Graphic", description: "Streetwear-inspired shirt print." },
      { src: "/site-assets/Card-Design.png", alt: "Business card design layout", title: "Business Card System", description: "Minimal, tactile identity cards." },
      { src: "/site-assets/Can_Usama-2.0.png", alt: "Usama 2.0 branded can design", title: "Usama 2.0 Can", description: "Bold packaging concept for a personal brand." },
      { src: "/site-assets/Usama-2.0-Logo.png", alt: "Usama 2.0 logo lockup", title: "Usama 2.0 Logo", description: "Signature wordmark and monogram." },
      { src: "/site-assets/Can_UJonline.png", alt: "UJonline energy can render", title: "UJonline Can", description: "Studio-lit can visual for a digital brand." },
      { src: "/site-assets/UJonline-Minimal-Logo.png", alt: "UJonline minimal logo", title: "UJonline Minimal", description: "Cleaner alt logo variation." },
      { src: "/site-assets/NotePads-and-Shirts.jpg", alt: "Notepad and shirt merch mockup", title: "Merch Collection", description: "Full-kit merch mockup for a launch." },
      { src: "/site-assets/NotePad.jpg", alt: "Branded notepad mockup", title: "Notepad Mockup", description: "Print collateral for onboarding kits." },
      { src: "/site-assets/Bottles-1.jpg", alt: "Branded bottle product shot", title: "Bottle Line", description: "Product packaging exploration." },
      { src: "/site-assets/Phone-Mockup-1.jpg", alt: "Mobile app screen mockup on phone", title: "App Mockup", description: "In-context mobile UI presentation." },
    ],
  },
  {
    key: "websites",
    label: "Website Designs",
    blurb: "High-converting, editorial web experiences built to rank and ship.",
    slides: [
      { src: "/site-assets/WeAdviceHosting.jpg", alt: "WeAdviceHosting website homepage design", title: "WeAdviceHosting", description: "Hosting affiliate site with review architecture." },
      { src: "/site-assets/Redsglow.jpg", alt: "Redsglow agency website design", title: "Redsglow Agency", description: "Full editorial site for a creative studio." },
      { src: "/site-assets/Tools-Redsglow.jpg", alt: "Redsglow tools directory web design", title: "Redsglow Tools", description: "Interactive tools directory experience." },
    ],
  },
  {
    key: "3d",
    label: "3D Models",
    blurb: "Photoreal product renders, packaging and cinematic visuals.",
    slides: [
      { src: "/site-assets/234782326_973961726734908_2610751845869625444_n.jpg", alt: "3D beverage product render", title: "Beverage Render #1", description: "Studio-lit hero visual." },
      { src: "/site-assets/234459209_973961563401591_7815631448312859521_n.jpg", alt: "3D bottle product render", title: "Bottle Render", description: "Frosted glass with dramatic lighting." },
      { src: "/site-assets/240666271_984628759001538_367505115436906883_n.jpg", alt: "3D packaging still life", title: "Packaging Still Life", description: "Editorial packaging composition." },
      { src: "/site-assets/193452573_930892167708531_2959523856236651778_n.jpg", alt: "3D product hero shot", title: "Product Hero", description: "Ad-ready product visual." },
      { src: "/site-assets/Verves1100001.jpg", alt: "Verves 3D creative render", title: "Verves #1", description: "Concept series render." },
      { src: "/site-assets/Verves1100006.jpg", alt: "Verves 3D creative render #6", title: "Verves #6", description: "Alternate composition from the same series." },
    ],
  },
  {
    key: "extensions",
    label: "Chrome Extensions",
    blurb: "Utility Chrome extensions shipped to real users on the Web Store.",
    slides: [
      { src: "/site-assets/unnamed.png", alt: "Chrome extension screenshot", title: "Productivity Booster", description: "One-click workflow helper." },
      { src: "/site-assets/unnamed-1.png", alt: "Chrome extension utility screenshot", title: "Quick Tools", description: "Handy on-page utilities." },
      { src: "/site-assets/unnamed-2.png", alt: "Chrome extension dashboard screenshot", title: "Tab Manager", description: "Organize and restore tabs fast." },
      { src: "/site-assets/unnamed-3.png", alt: "Chrome extension features screenshot", title: "Checkout Extension", description: "Streamlined ecommerce checkout helper." },
      { src: "/site-assets/unnamed-4.png", alt: "Chrome extension settings screenshot", title: "Settings Panel", description: "Clean settings surface for the extension." },
    ],
  },
  {
    key: "social",
    label: "My Social Media",
    blurb: "A slice of my personal content across platforms.",
    slides: [
      { src: "/site-assets/2024-07-23-145529-desktop-1-4-e1738381991119.png", alt: "Social media post 4", title: "Flexing My Pictures", description: "Personal editorial post." },
      { src: "/site-assets/2024-07-23-145529-desktop-1-10.png", alt: "Social media post 10", title: "Story Highlight", description: "Highlight cover art." },
      { src: "/site-assets/2024-07-23-145529-desktop-1-9.png", alt: "Social media post 9", title: "Reel Cover", description: "Reel thumbnail composition." },
      { src: "/site-assets/2024-07-23-145529-desktop-1-11.png", alt: "Social media post 11", title: "Grid Post", description: "Feed grid entry." },
      { src: "/site-assets/2024-07-23-145529-desktop-1-12.png", alt: "Social media post 12", title: "Announcement", description: "Product / life update post." },
      { src: "/site-assets/2024-07-23-145529-desktop-1-15.png", alt: "Social media post 15", title: "Behind The Scenes", description: "BTS shot from a shoot." },
      { src: "/site-assets/2024-07-23-145529-desktop-1-17.png", alt: "Social media post 17", title: "Quote Card", description: "Typographic quote share." },
      { src: "/site-assets/2024-07-23-145529-desktop-1-20.png", alt: "Social media post 20", title: "Portrait", description: "Editorial portrait post." },
      { src: "/site-assets/2024-07-23-145529-desktop-1-7.png", alt: "Social media post 7", title: "Travel", description: "Travel diary snap." },
      { src: "/site-assets/2024-07-23-145529-desktop-1-14.png", alt: "Social media post 14", title: "Studio", description: "Studio setup shot." },
      { src: "/site-assets/2024-07-23-145529-desktop-1-13.png", alt: "Social media post 13", title: "Product Tease", description: "Teaser for a launch." },
      { src: "/site-assets/2024-07-23-145529-desktop-1-6.png", alt: "Social media post 6", title: "Community", description: "Community shoutout." },
    ],
  },
  {
    key: "digital",
    label: "Digital Assets",
    blurb: "SaaS-flavored products and tools I've designed and shipped.",
    slides: [
      { src: "/site-assets/My-Tasko.png", alt: "My Tasko task manager product", title: "My Tasko", description: "Focused task manager UI." },
      { src: "/site-assets/ImgConvertly-1.png", alt: "ImgConvertly image converter tool", title: "ImgConvertly", description: "Batch image converter tool." },
      { src: "/site-assets/WeAdviceHosting.png", alt: "WeAdviceHosting brand asset", title: "WeAdviceHosting", description: "Brand asset for the hosting site." },
      { src: "/site-assets/WpBulkPublisher.png", alt: "WP Bulk Publisher tool", title: "WP Bulk Publisher", description: "Publish WordPress posts in bulk." },
      { src: "/site-assets/Fix-My-Speaker-1.png", alt: "Fix My Speaker web tool", title: "Fix My Speaker", description: "Utility to eject water from device speakers." },
      { src: "/site-assets/Redsglow-Logo.png", alt: "Redsglow logo brand asset", title: "Redsglow Logo", description: "Primary agency logo." },
      { src: "/site-assets/Tools-Redsglow.png", alt: "Redsglow tools brand asset", title: "Redsglow Tools", description: "Sub-brand asset for the tools hub." },
    ],
  },
];

export default function PortfolioTabs() {
  const [activeIdx, setActiveIdx] = useState(0);
  const active = TABS[activeIdx];

  return (
    <section className="pf-tabs" aria-label="Portfolio tabs">
      <div className="pf-tabs__nav" role="tablist" aria-label="Portfolio categories">
        {TABS.map((t, i) => (
          <button
            key={t.key}
            role="tab"
            aria-selected={i === activeIdx}
            tabIndex={i === activeIdx ? 0 : -1}
            className={`pf-tabs__tab${i === activeIdx ? " is-active" : ""}`}
            onClick={() => setActiveIdx(i)}
          >
            {t.label}
          </button>
        ))}
      </div>

      <p className="pf-tabs__blurb" key={active.key}>{active.blurb}</p>

      <div className="pf-grid" key={active.key + "-grid"}>
        {active.slides.map((s) => (
          <figure key={s.src} className="pf-card">
            <div className="pf-card__media">
              <img src={s.src} alt={s.alt} loading="lazy" decoding="async" />
            </div>
            <figcaption className="pf-card__body">
              <strong>{s.title}</strong>
              <span>{s.description}</span>
            </figcaption>
          </figure>
        ))}
      </div>
    </section>
  );
}
