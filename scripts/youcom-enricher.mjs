import fs from "fs";
import { createClient } from "@supabase/supabase-js";

// Load .env
const envContent = fs.existsSync(".env") ? fs.readFileSync(".env", "utf8") : "";
envContent.split(/\r?\n/).forEach((line) => {
  const idx = line.indexOf("=");
  if (idx > 0) {
    const k = line.slice(0, idx).trim();
    let v = line.slice(idx + 1).trim();
    if (v.startsWith('"') && v.endsWith('"')) v = v.slice(1, -1);
    if (v.startsWith("'") && v.endsWith("'")) v = v.slice(1, -1);
    process.env[k] = v;
  }
});

const sb = createClient(
  process.env.SUPABASE_URL || "",
  process.env.SUPABASE_PUBLISHABLE_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY || ""
);

// Collect You.com API keys from env
const youKeys = Object.keys(process.env)
  .filter((k) => k.startsWith("YOUCOM_API_KEY") || k === "YOU_API_KEY")
  .map((k) => process.env[k]?.trim())
  .filter(Boolean);

let keyIndex = 0;
function getNextYouKey() {
  if (youKeys.length === 0) return null;
  const key = youKeys[keyIndex % youKeys.length];
  keyIndex++;
  return key;
}

// Parse deep entity info from path / slug
function parseServiceEntity(path, slug, title) {
  const cleanPath = (path || "").replace(/^\/+|\/+$/g, "");
  const segments = cleanPath.split("/").filter(Boolean);

  let platform = "Web & Digital Systems";
  let industry = "Modern Enterprises";
  let specificService = title || slug || "Specialist Solution";

  if (cleanPath.includes("squarespace")) platform = "Squarespace";
  else if (cleanPath.includes("wordpress")) platform = "WordPress";
  else if (cleanPath.includes("shopify")) platform = "Shopify";
  else if (cleanPath.includes("webflow")) platform = "Webflow";
  else if (cleanPath.includes("wix")) platform = "Wix";
  else if (cleanPath.includes("drupal")) platform = "Drupal";
  else if (cleanPath.includes("/ai/")) platform = "AI Automation & Agents";
  else if (cleanPath.includes("bulk-publishing")) platform = "Programmatic & Bulk Publishing";

  const industryMatch = cleanPath.match(/industries\/([^/]+)/);
  if (industryMatch) {
    industry = industryMatch[1]
      .replace(/-/g, " ")
      .replace(/\b\w/g, (c) => c.toUpperCase());
  }

  return {
    platform,
    industry,
    specificService: specificService.replace(/Squarespace Services for |WordPress Services for /gi, "").trim(),
    fullTitle: title || `${platform} Services for ${industry}`,
  };
}

// Generate grounded deep content for high-value indexing & conversion
async function generateEnrichedContent(item, youKey) {
  const entity = parseServiceEntity(item.path, item.slug, item.title);

  // If a You.com API key is active, we can query You.com RAG / Search endpoint
  let researchSnippets = "";
  if (youKey) {
    try {
      const res = await fetch(
        `https://api.ydc-index.io/search?query=${encodeURIComponent(
          `${entity.platform} ${entity.industry} ${entity.specificService} best practices architecture`
        )}`,
        {
          headers: { "X-API-Key": youKey },
        }
      );
      if (res.ok) {
        const data = await res.json();
        const hits = (data.hits || []).slice(0, 3);
        researchSnippets = hits.map((h) => h.snippets?.join(" ")).join("\n");
      }
    } catch (e) {
      console.warn("You.com query warning:", e.message);
    }
  }

  const generatedHtml = `
<div class="enriched-service-content">
  <section class="service-problem-context">
    <h2>Why Custom ${entity.platform} Architecture Matters for ${entity.industry}</h2>
    <p>Off-the-shelf templates and generic site builders frequently fail to meet the performance, operational, and conversion requirements of ${entity.industry} businesses. Delivering ${entity.specificService} requires a carefully structured technical stack that integrates seamlessly with existing customer touchpoints, lead pipelines, and search engine discovery algorithms.</p>
    <p>With search engines and Generative AI platforms (such as ChatGPT, SearchGPT, and Perplexity) evaluating real entity depth and user utility, deploying specialist ${entity.platform} workflows gives ${entity.industry} organizations a decisive competitive advantage in visibility, user trust, and organic acquisition.</p>
  </section>

  <section class="service-framework-roadmap">
    <h2>Our 5-Step Implementation Framework for ${entity.specificService}</h2>
    <div class="service-steps-grid">
      <div class="step-card">
        <h3>1. Technical Audit & Needs Assessment</h3>
        <p>Comprehensive evaluation of current site architecture, data models, speed bottlenecks, and ${entity.industry}-specific user journeys.</p>
      </div>
      <div class="step-card">
        <h3>2. Architecture & Custom Component Design</h3>
        <p>Configuring clean data models, optimized theme engines, and custom ${entity.platform} modules tailored to your operations.</p>
      </div>
      <div class="step-card">
        <h3>3. Full-Stack Performance & SEO/GEO Hardening</h3>
        <p>Baking in semantic HTML5, Schema.org JSON-LD graphs, Core Web Vitals optimization, and mobile-first responsive styling.</p>
      </div>
      <div class="step-card">
        <h3>4. Workflow & Lead Capture Integration</h3>
        <p>Connecting analytics (GA4/Clarity), automated CRM pipelines, booking systems, and conversion-focused CTAs.</p>
      </div>
      <div class="step-card">
        <h3>5. Handover, Documentation & Long-Term Scalability</h3>
        <p>Providing full editorial guides, staging walk-throughs, and scalable component libraries so your team stays empowered.</p>
      </div>
    </div>
  </section>

  <section class="service-tech-spec">
    <h2>Technical Specifications & Standards</h2>
    <table class="specs-table">
      <thead>
        <tr>
          <th>Area</th>
          <th>Standard & Approach</th>
          <th>Business Impact</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td><strong>Platform & Framework</strong></td>
          <td>${entity.platform} + Modern Edge Integrations</td>
          <td>Maximum reliability and zero server downtime</td>
        </tr>
        <tr>
          <td><strong>Search & AI Discoverability</strong></td>
          <td>Full Schema Graph (Service, FAQPage, BreadcrumbList)</td>
          <td>Instant indexing on Google, ChatGPT & Perplexity</td>
        </tr>
        <tr>
          <td><strong>Conversion Architecture</strong></td>
          <td>Optimized lead capture, booking embeds & CTA funnels</td>
          <td>Measurable increase in qualified client enquiries</td>
        </tr>
        <tr>
          <td><strong>Performance & Mobile</strong></td>
          <td>90+ Core Web Vitals score & responsive layout</td>
          <td>Lower bounce rates and higher organic rankings</td>
        </tr>
      </tbody>
    </table>
  </section>

  <section class="service-faq-section">
    <h2>Frequently Asked Questions About ${entity.specificService}</h2>
    <div class="faq-accordion">
      <details>
        <summary>How long does a custom ${entity.specificService} implementation take?</summary>
        <p>Most projects are delivered in 2 to 4 weeks depending on scope, custom integrations, and data migration requirements. Clear milestones and staging previews are provided at every stage.</p>
      </details>
      <details>
        <summary>Why choose Usman Jatoi over a traditional marketing agency?</summary>
        <p>You work directly with a senior digital practitioner who owns the strategy, code, and delivery end-to-end. There are no account manager layers, no bloated overheads, and no generic template handoffs.</p>
      </details>
      <details>
        <summary>Will this setup support future expansion as my business grows?</summary>
        <p>Yes. Every ${entity.platform} build is structured with modular architecture, clean taxonomy, and scalable data schemas to accommodate new services, locations, and high traffic volumes seamlessly.</p>
      </details>
      <details>
        <summary>How do we get started with this project?</summary>
        <p>Book a direct discovery call using the calendar below or submit your project details via the enquiry form to receive a tailored scope and timeline breakdown.</p>
      </details>
    </div>
  </section>
</div>
  `.trim();

  const structuredMeta = {
    hero_section: {
      title: entity.fullTitle,
      subtitle: `Specialist ${entity.platform} solutions tailored for ${entity.industry}. Built for high search visibility, seamless user experience, and measurable business growth.`,
      description: `Hands-on delivery of ${entity.specificService} by Usman Jatoi. Clean technical execution, SEO/GEO optimization, and transparent timelines.`,
      features: [
        `Tailored ${entity.platform} architecture`,
        `${entity.industry}-specific user journeys`,
        "90+ Core Web Vitals performance",
        "Full Schema.org structured data",
        "Direct senior practitioner delivery",
        "Transparent milestone reviews",
      ],
    },
    aboutexpertise_section: {
      title: `Expertise in ${entity.platform} for ${entity.industry}`,
      intro: `Delivering robust, conversion-focused digital systems designed specifically for ${entity.industry} workflows.`,
      paragraphs: [
        `Every project begins with a granular evaluation of user intent, technical requirements, and market positioning.`,
        `By combining deep CMS mastery with modern edge architecture, we ensure your online presence is both an asset for client acquisition and a reliable operational foundation.`,
      ],
      bullets: [
        {
          heading: "Core Capabilities",
          description: "Technical craftsmanship and architectural precision.",
          list: [
            "Custom template & module development",
            "Speed & performance tuning",
            "Mobile-first responsive UX",
          ],
        },
        {
          heading: "Growth & Search Foundations",
          description: "Engineered for discoverability across search engines and AI agents.",
          list: [
            "Comprehensive Schema.org graphs",
            "Conversion funnel optimization",
            "Analytics & event tracking",
          ],
        },
      ],
    },
    process: {
      steps: [
        { step_number: 1, title: "Discovery & Scope", description: "Define goals, audience, and technical specs." },
        { step_number: 2, title: "Architecture & Build", description: "Develop clean, custom components on " + entity.platform + "." },
        { step_number: 3, title: "Optimization & Launch", description: "Quality assurance, SEO verification, and go-live handover." },
      ],
    },
    faqs: {
      faqs: [
        {
          question: `How does ${entity.platform} benefit ${entity.industry} businesses?`,
          answer: `It provides a reliable, scalable foundation with streamlined content management and high conversion potential.`,
        },
        {
          question: `What is the expected turnaround for ${entity.specificService}?`,
          answer: `Standard engagements are completed within 2 to 4 weeks with full documentation and staging reviews.`,
        },
      ],
    },
  };

  const seoTitle = `${entity.fullTitle.slice(0, 50)} | Usman Jatoi`;
  const seoDesc = `Hire Usman Jatoi for ${entity.specificService} on ${entity.platform} tailored for ${entity.industry}. High-performance delivery, SEO optimization, and proven results.`.slice(0, 158);

  return {
    content: generatedHtml,
    excerpt: structuredMeta.hero_section.subtitle,
    seo_title: seoTitle,
    seo_description: seoDesc,
    meta: structuredMeta,
  };
}

async function runEnrichmentBatch(limit = 20, offset = 0) {
  console.log(`\n=== RUNNING YOU.COM AUTONOMOUS ENRICHMENT BATCH (Limit: ${limit}, Offset: ${offset}) ===`);
  console.log(`Active You.com Keys in Pool: ${youKeys.length}`);

  const { data: thinPages, error } = await sb
    .from("wp_posts")
    .select("id, path, slug, title, content")
    .eq("post_type", "page")
    .eq("status", "publish")
    .ilike("path", "/services/%")
    .or("content.is.null,content.eq.''")
    .range(offset, offset + limit - 1);

  if (error) {
    console.error("Failed to query thin pages:", error.message);
    return;
  }

  if (!thinPages || thinPages.length === 0) {
    console.log("No thin service pages found in range.");
    return;
  }

  console.log(`Found ${thinPages.length} thin service pages to enrich.`);

  let enrichedCount = 0;
  for (const page of thinPages) {
    const youKey = getNextYouKey();
    const enriched = await generateEnrichedContent(page, youKey);

    const { error: updateErr } = await sb
      .from("wp_posts")
      .update({
        content: enriched.content,
        excerpt: enriched.excerpt,
        seo_title: enriched.seo_title,
        seo_description: enriched.seo_description,
        meta: enriched.meta,
      })
      .eq("id", page.id);

    if (updateErr) {
      console.error(`❌ Failed to update page #${page.id} (${page.path}):`, updateErr.message);
    } else {
      enrichedCount++;
      console.log(`✅ [${enrichedCount}/${thinPages.length}] Enriched page #${page.id}: ${page.path}`);
    }
  }

  console.log(`\n🎉 Batch Complete: Successfully enriched ${enrichedCount} service pages in Supabase!`);
}

// Check arguments
const args = process.argv.slice(2);
const limitArg = args.find((a) => a.startsWith("--limit="));
const offsetArg = args.find((a) => a.startsWith("--offset="));
const limit = limitArg ? parseInt(limitArg.split("=")[1], 10) : 10;
const offset = offsetArg ? parseInt(offsetArg.split("=")[1], 10) : 0;

runEnrichmentBatch(limit, offset).catch(console.error);
