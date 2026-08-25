import React, { useState } from "react";
import { Link } from "@tanstack/react-router";
import {
  ChevronRight,
  ChevronDown,
  Check,
  Play,
  Award,
  Globe,
  Users,
  Briefcase,
  ExternalLink,
  Heart,
  Sparkles,
  Layers,
  Code,
  GraduationCap,
} from "lucide-react";
import PageHero from "@/components/PageHero";

const WEBSITES_GALLERY = [
  {
    title: "Top SEO Agency In London",
    img: "https://usmanjatoi.com/wp-content/uploads/2025/02/Top-SEO-Agency-In-London-Best-SEO-Services-London-02-07-2025_01_42_AM-e1738902410823.jpg",
  },
  {
    title: "Mortgage Broker London",
    img: "https://usmanjatoi.com/wp-content/uploads/2025/02/Mortgage-Broker-London-Professional-Advice-for-You-02-07-2025_01_07_AM-e1738902448915.jpg",
  },
  {
    title: "Pearl Lemon Commission Closers",
    img: "https://usmanjatoi.com/wp-content/uploads/2025/02/Pearl-Lemon-Commission-Closers-Expert-Sales-Closers-for-More-Deals-02-07-2025_01_08_AM-e1738902906252.jpg",
  },
  {
    title: "SEO Penalty Removal Services",
    img: "https://usmanjatoi.com/wp-content/uploads/2025/02/SEO-Penalty-Removal-Services-Recover-Search-Rankings-02-07-2025_01_09_AM-e1738902934678.jpg",
  },
  {
    title: "Web and App Developer",
    img: "https://usmanjatoi.com/wp-content/uploads/2025/02/Web-and-App-Developer-Professional-Digital-Solutions-02-07-2025_01_12_AM-e1738902959627.jpg",
  },
  {
    title: "Birmingham SEO Agency",
    img: "https://usmanjatoi.com/wp-content/uploads/2025/02/Birmingham-SEO-Agency-Top-Notch-SEO-Experts-02-07-2025_01_13_AM-e1738902991204.jpg",
  },
  {
    title: "Maximize Your Tax Returns",
    img: "https://usmanjatoi.com/wp-content/uploads/2025/02/Maximize-Your-Tax-Returns-with-Expert-Tax-Services-02-07-2025_01_14_AM-e1738902820115.jpg",
  },
  {
    title: "Top Facilities Management Services",
    img: "https://usmanjatoi.com/wp-content/uploads/2025/02/Top-Facilities-Management-Services-in-London-02-07-2025_01_15_AM-e1738903032559.jpg",
  },
  {
    title: "Expert Lead Generation Agency",
    img: "https://usmanjatoi.com/wp-content/uploads/2025/02/Expert-Lead-Generation-Agency-for-UK-Life-Insurance-Providers-02-07-2025_01_16_AM-e1738903058461.jpg",
  },
  {
    title: "Lifeline Surrogacy",
    img: "https://usmanjatoi.com/wp-content/uploads/2025/02/Top-Egg-Donation-and-Surrogacy-Agency-Lifeline-Surrogacy-02-07-2025_01_35_AM-e1738903096731.jpg",
  },
  {
    title: "Troncmaster Services UK",
    img: "https://usmanjatoi.com/wp-content/uploads/2025/02/Troncmaster-Services-in-UK-Expert-Payroll-Tax-Support-02-07-2025_01_18_AM-e1738903141251.jpg",
  },
  {
    title: "PL Repairs Ottawa Canada",
    img: "https://usmanjatoi.com/wp-content/uploads/2025/02/Trusted-Repair-Services-in-Canada-by-PL-Repairs-Ottawa-02-07-2025_01_18_AM-e1738903181330.jpg",
  },
  {
    title: "Pearl Lemon AI",
    img: "https://usmanjatoi.com/wp-content/uploads/2025/02/Pearl-Lemon-AI-Best-AI-solution-for-businesses-02-07-2025_01_19_AM-e1738903224928.jpg",
  },
  {
    title: "Expert Home Repairs UK",
    img: "https://usmanjatoi.com/wp-content/uploads/2025/02/Expert-Home-Repairs-in-the-UK-Fast-Reliable-Services-02-07-2025_01_20_AM-e1738903259169.jpg",
  },
  {
    title: "UK Commercial Cleaning Services",
    img: "https://usmanjatoi.com/wp-content/uploads/2025/02/UK-Commercial-Cleaning-Services-Office-Cleaning-Experts-02-07-2025_01_21_AM-e1738903317210.jpg",
  },
  {
    title: "Same Day Mobile Vet Services",
    img: "https://usmanjatoi.com/wp-content/uploads/2025/02/Same-Day-Mobile-Vet-Services-in-London-At-Home-Pet-Care-02-07-2025_01_23_AM-e1738903343604.jpg",
  },
  {
    title: "Bubble Tea Catering London",
    img: "https://usmanjatoi.com/wp-content/uploads/2025/02/Hire-Bubble-Tea-Catering-in-London-for-Events-Parties-02-07-2025_01_23_AM-e1738903374992.jpg",
  },
  {
    title: "Pet Transport Service UK",
    img: "https://usmanjatoi.com/wp-content/uploads/2025/02/Pet-Transport-Service-Reliable-Safe-Pet-Relocation-02-07-2025_01_24_AM-e1738903443700.jpg",
  },
  {
    title: "Professional Cold Email Marketing",
    img: "https://usmanjatoi.com/wp-content/uploads/2025/02/Professional-Cold-Email-Marketing-Agency-in-London-02-07-2025_01_25_AM-e1738903490651.jpg",
  },
  {
    title: "Top Wedding Planners in UK",
    img: "https://usmanjatoi.com/wp-content/uploads/2025/02/Top-Wedding-Planners-in-UK-Experienced-Wedding-Organizers-02-07-2025_01_29_AM-1-e1738903566413.jpg",
  },
  {
    title: "BREEAM Assessment Services",
    img: "https://usmanjatoi.com/wp-content/uploads/2025/02/BREEAM-Assessment-Services-Sustainable-Certification-UK-02-07-2025_01_39_AM-e1738903594517.jpg",
  },
  {
    title: "Pearl Lemon Properties",
    img: "https://usmanjatoi.com/wp-content/uploads/2025/02/Property-Sourcing-Company-in-the-UK-Pearl-Lemon-Properties-02-07-2025_01_37_AM-e1738903620489.jpg",
  },
  {
    title: "React Development Agency UK",
    img: "https://usmanjatoi.com/wp-content/uploads/2025/02/React-Development-Agency-UK-Top-Rated-Expert-Services-02-07-2025_01_37_AM-e1738903656624.jpg",
  },
  {
    title: "Corporate Catering London",
    img: "https://usmanjatoi.com/wp-content/uploads/2025/02/Corporate-Catering-London-Expert-Business-Catering-Services-02-07-2025_01_38_AM-e1738903681906.jpg",
  },
  {
    title: "Roblox Game Development",
    img: "https://usmanjatoi.com/wp-content/uploads/2025/02/Roblox-Game-Development-Services-Agency-Hire-a-Developer-02-07-2025_01_38_AM-e1738903728766.jpg",
  },
  {
    title: "Cold Calling Agency UK",
    img: "https://usmanjatoi.com/wp-content/uploads/2025/02/Boost-Sales-Now-with-UKs-Top-Cold-Calling-Agency-02-07-2025_01_38_AM-e1738903789300.jpg",
  },
  {
    title: "California Pool Builder",
    img: "https://usmanjatoi.com/wp-content/uploads/2025/02/Best-California-Pool-Builder-Custom-Pools-Landscaping-02-07-2025_01_38_AM-e1738903822890.jpg",
  },
  {
    title: "TV Dashboard Software",
    img: "https://usmanjatoi.com/wp-content/uploads/2025/02/TV-Dashboard-Software-Experts-02-07-2025_01_39_AM-e1738903855866.jpg",
  },
  {
    title: "The Best Lawyer In USA",
    img: "https://usmanjatoi.com/wp-content/uploads/2025/02/The-Best-Lawyer-In-USA-The-Best-Lawyer-In-Usa-02-07-2025_01_39_AM-e1738903886753.jpg",
  },
  {
    title: "Best Personal Injury Lawyers NYC",
    img: "https://usmanjatoi.com/wp-content/uploads/2025/02/Best-Personal-Injury-lawyers-NYC-Personal-Injury-Attorney-02-07-2025_01_39_AM-e1738903919390.jpg",
  },
  {
    title: "Expert Social Media Marketing",
    img: "https://usmanjatoi.com/wp-content/uploads/2025/02/Expert-Social-Media-Marketing-Worthing-Boost-Leads-Sales-02-07-2025_01_40_AM-e1738903957349.jpg",
  },
];

const FAQS_LIST = [
  {
    q: "Should any Head be working 4 hours?",
    a: "Nope. I worked 4 hours for the first two months, but I was actually putting in 8 to 12 hours most of the time. Later, I increased my hours from 6 after a few months, but I was still working around 8 hours.",
  },
  {
    q: "Is Pearl Lemon a bad company? 🤔",
    a: "No! If it was, I wouldn’t have referred 17+ people to work there.",
  },
  {
    q: "How did your journey at Pearl Lemon Group begin?",
    a: "It all started when my brother encouraged me by asking, 'You wanna do a company?' I agreed, and soon my video was shared with Deepak Shukla, the founder of Pearl Lemon Group. I joined a trial group alongside Kaushal (Head of Design) and Bianca from HR, who set the stage by introducing me to a test challenge. My first task was to redesign pearllemonweb.com—from creating a Photoshop mockup to implementing the design in WordPress using Elementor. Despite technical hurdles like cache issues, my extra effort (recording a detailed walkthrough video) impressed Deepak, and that’s when my real journey began.",
  },
  {
    q: "What was your first major project and how did you approach it?",
    a: "My first official project was designing WeddingChiefs.com. To tackle it, I had to quickly understand the niche, work closely with Joanne (the Head of Content who provided all the necessary materials and a Loom video), and work with WordPress credentials—all under a tight three-day deadline. I poured my energy into the task, and when I delivered the finished website, Deepak personally congratulated me, which was incredibly validating.",
  },
  {
    q: "How did the placement process and onboarding help you integrate into the team?",
    a: "After my trial ended, Bianca shared all the official placement details, including access to TrackAbi, a time-monitoring tool. I was then added to several company groups—such as the Internal Pearl Lemon Team for daily start and end-of-day updates, the Design & Dev Team for showcasing our work, and the PL Company Updates group where leadership shared news. This structured integration not only kept me informed but also made me feel like an integral part of the team from day one.",
  },
  {
    q: "In what ways did your role evolve during your first few months?",
    a: "In the early months (months 2–6), I was constantly challenged with new and larger projects—from redesigning multiple Pearl Lemon websites (like Pearl Lemon Cafe, Pearl Lemon Boba, and more) to building new ones from scratch. I learned to manage higher volumes of work without compromising on quality, honed my technical skills, and, importantly, learned the dynamics of working in a remote team. The mentorship from colleagues like Kaushal, Ali, and Daksh played a crucial role in my professional growth.",
  },
  {
    q: "Can you share an instance that highlights the supportive culture at Pearl Lemon?",
    a: "Absolutely. One memorable incident happened during Eid. I had three days off but returned to find myself bored and clicked on a website dashboard, only to see over 12 plugin updates pending. When I updated them, the website dropped, and I panicked—thinking it might be the main site. I immediately reached out to Ali Yasin, who was on leave for Eid. Despite the holiday, he responded, fixed the issue quickly, and reassured me. This episode perfectly illustrates the supportive and collaborative spirit within the team.",
  },
  {
    q: "Did you ever break trust with Pearl Lemon?",
    a: "No. I was never dishonest. Some misunderstandings happened, but I always stayed loyal.",
  },
  {
    q: "What were some great moments with the team?",
    a: "Birthday celebrations, fun chats in the Water Cooler group, and continuous support from Nida, Sakshi, Azan, Hussain, Themwani, Ion, and many more!",
  },
  {
    q: "What are you bad at? 😅",
    a: "Meetings – I rarely attended them on time. Sleeping on time – My work schedule was always intense and late into the night.",
  },
  {
    q: "What problem did you notice in the company? ⚠️",
    a: "Heavy workload affecting quality at times, lower salaries relative to output, and high-urgency tasks creating unnecessary pressure.",
  },
];

export default function PearlLemonExperience() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const toggleFaq = (idx: number) => {
    setOpenFaq(openFaq === idx ? null : idx);
  };

  return (
    <div className="min-h-screen bg-[#fafafa] text-neutral-900 selection:bg-orange-500 selection:text-white">
      {/* 1. Breadcrumbs */}
      <div className="bg-neutral-900 border-b border-neutral-800 text-white/80 py-3 px-4 sm:px-8 text-xs font-medium">
        <div className="max-w-6xl mx-auto flex items-center gap-2 flex-wrap">
          <Link to="/" className="hover:text-orange-400 flex items-center gap-1">
            <span className="text-emerald-400">✓</span> Home
          </Link>
          <ChevronRight className="h-3.5 w-3.5 text-neutral-500" />
          <Link to="/about-me" className="hover:text-orange-400">
            About Me
          </Link>
          <ChevronRight className="h-3.5 w-3.5 text-neutral-500" />
          <Link to="/about-me/my-journey/professional-experience" className="hover:text-orange-400">
            Professional Experience
          </Link>
          <ChevronRight className="h-3.5 w-3.5 text-neutral-500" />
          <span className="text-orange-400 font-semibold">Pearl Lemon</span>
        </div>
      </div>

      {/* 2. Hero Sky Header */}
      <header className="relative bg-gradient-to-b from-[#2ea3f2] via-[#56bbf5] to-[#e0f2fe] pt-12 pb-20 px-4 sm:px-8 overflow-hidden text-center text-white">
        <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:16px_16px]" />
        
        {/* Floating Clouds Background Elements */}
        <div className="max-w-5xl mx-auto relative z-10">
          <div className="inline-block px-4 py-1.5 rounded-full bg-white/20 backdrop-blur-md text-xs font-bold tracking-widest uppercase mb-4 shadow-sm">
            Professional Journey &amp; Growth
          </div>
          <h1 className="text-4xl sm:text-6xl md:text-7xl font-extrabold tracking-tight drop-shadow-md">
            PEARL LEMON
          </h1>
          <p className="mt-4 text-base sm:text-xl text-white/90 max-w-2xl mx-auto font-medium drop-shadow">
            How a 16-Year-Old Designer Transformed from an Intern into a Core Systems &amp; Web Architect at a Leading London Agency.
          </p>

          {/* Video / Appreciation Frame */}
          <div className="mt-10 max-w-3xl mx-auto rounded-3xl overflow-hidden shadow-2xl border-4 border-white/80 bg-neutral-950 aspect-video relative group">
            <video
              src="https://pearllemonplacements.com/wp-content/uploads/2024/03/Appriecation.mp4"
              controls
              poster="https://usmanjatoi.com/wp-content/uploads/2025/02/Book-a-call-1.png"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </header>

      {/* 3. The Beginning Narrative */}
      <main className="max-w-5xl mx-auto px-4 sm:px-8 py-16 space-y-20">
        <section className="bg-white rounded-3xl p-8 sm:p-12 border border-neutral-200 shadow-sm grid md:grid-cols-[1.4fr_1fr] gap-8 items-center">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-orange-500">
              The Journey Starts
            </span>
            <h2 className="text-3xl font-bold text-neutral-900 mt-2 mb-4">The Beginning</h2>
            <p className="text-neutral-700 leading-relaxed text-base">
              The day I joined Pearl Lemon Group was the start of an incredible journey. Looking back, I can’t believe how much I’ve grown.
              Bianca, the HR rep, added me to a trial group with Deepak Shukla (Founder) and Kaushal (Head of Design).
            </p>
            <blockquote className="my-4 p-4 rounded-xl bg-orange-50 border-l-4 border-orange-500 text-sm italic text-neutral-800">
              "Hi, guys! This is Usman—applying for the Web Designer role. Kaushal, can you give him some tasks?" — Bianca
            </blockquote>
            <p className="text-neutral-700 leading-relaxed text-sm">
              My first challenge was redesigning PearlLemonWeb.com. I designed the homepage in Photoshop, and Deepak asked me to build it in WordPress with Elementor. Despite cache issues, I recorded a video explaining everything. That extra effort sealed the deal:
              <strong className="block text-neutral-900 mt-2">"I’m happy with his work. Let’s bring him in." — Deepak Shukla</strong>
            </p>
          </div>
          <div className="flex flex-col items-center">
            <img
              src="https://usmanjatoi.com/wp-content/uploads/2025/05/undraw_building-a-website_1wrp.svg"
              alt="Website Design illustration"
              className="w-full max-w-xs object-contain"
            />
            <div className="mt-4 p-3 rounded-xl bg-neutral-50 border border-neutral-200 text-center w-full">
              <span className="text-xs font-bold text-neutral-900">First Milestone:</span>
              <p className="text-xs text-neutral-600">Passed trial &amp; assigned to Lead Web Projects</p>
            </div>
          </div>
        </section>

        {/* 4. Placement & Onboarding */}
        <section className="grid md:grid-cols-2 gap-8 items-center">
          <div className="order-2 md:order-1">
            <img
              src="https://usmanjatoi.com/wp-content/uploads/2025/05/undraw_organize-resume_ihw6.svg"
              alt="Placement Process illustration"
              className="w-full max-w-sm mx-auto"
            />
          </div>
          <div className="order-1 md:order-2 bg-white rounded-3xl p-8 sm:p-10 border border-neutral-200 shadow-sm">
            <span className="text-xs font-bold uppercase tracking-wider text-blue-600">
              Team Onboarding
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold text-neutral-900 mt-2 mb-4">
              The Placement Process
            </h2>
            <p className="text-neutral-700 leading-relaxed text-sm">
              Bianca sent me the official placement program details, including access to TrackAbi for time logging. I was added to the core communication channels:
            </p>
            <ul className="mt-4 space-y-2.5 text-sm text-neutral-800">
              <li className="flex items-start gap-2">
                <span className="text-emerald-500 font-bold">✓</span>
                <span><strong>Internal Team</strong> — SOD (Start of Day) &amp; EOD updates.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-emerald-500 font-bold">✓</span>
                <span><strong>Design &amp; Dev Team</strong> — Showcase live builds &amp; UI assets.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-emerald-500 font-bold">✓</span>
                <span><strong>Company Updates</strong> — Direct strategy &amp; vision sharing.</span>
              </li>
            </ul>
          </div>
        </section>

        {/* 5. Key Projects & 14+ Redesigns */}
        <section className="bg-white rounded-3xl p-8 sm:p-12 border border-neutral-200 shadow-sm">
          <div className="max-w-3xl mb-8">
            <span className="text-xs font-bold uppercase tracking-wider text-orange-500">
              High Impact Output
            </span>
            <h2 className="text-3xl font-bold text-neutral-900 mt-1">
              Months 2–6: Growing as a Lead Designer
            </h2>
            <p className="text-neutral-600 text-sm mt-2">
              Over 6 months, I redesigned and launched dozens of websites across the Pearl Lemon portfolio:
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 text-xs font-semibold text-neutral-800">
            {[
              "Pearl Lemon Cafe",
              "Pearl Lemon Boba",
              "Win on Upwork",
              "Pearl Lemon Catering",
              "Pearl Lemon Ventures",
              "Pearl Lemon Web",
              "Pearl Lemon Sales",
              "Corporate Removal Group",
              "Wedding Chiefs",
              "Wellness in Italy",
              "Dandee Consulting",
              "LemVids",
              "LemApp",
              "The DVC Resale",
            ].map((site) => (
              <div
                key={site}
                className="p-3.5 rounded-xl bg-neutral-50 border border-neutral-200 flex items-center gap-2 hover:border-orange-500 hover:bg-orange-50/40 transition"
              >
                <Globe className="h-4 w-4 text-orange-500 flex-none" />
                <span className="truncate">{site}</span>
              </div>
            ))}
          </div>

          <div className="mt-8 pt-6 border-t border-neutral-100 grid md:grid-cols-3 gap-4 text-xs text-neutral-700">
            <div className="p-4 rounded-xl bg-neutral-50 border border-neutral-200">
              <strong className="text-neutral-900 block mb-1">Kaushal (Head of Design):</strong>
              Guided me through complex design structures and Google Meet reviews.
            </div>
            <div className="p-4 rounded-xl bg-neutral-50 border border-neutral-200">
              <strong className="text-neutral-900 block mb-1">Ali Yasin (Lead Tech):</strong>
              Helped resolve critical server crashes and taught me WordPress stability.
            </div>
            <div className="p-4 rounded-xl bg-neutral-50 border border-neutral-200">
              <strong className="text-neutral-900 block mb-1">Daksh (Publishing Lead):</strong>
              Taught me bulk page publishing workflows and speed optimization.
            </div>
          </div>
        </section>

        {/* 6. Live Website Showcase Gallery */}
        <section>
          <div className="text-center max-w-2xl mx-auto mb-10">
            <span className="text-xs font-bold uppercase tracking-wider text-orange-500">
              Client &amp; Portfolio Showcase
            </span>
            <h2 className="text-3xl font-bold text-neutral-900 mt-1">
              Internal &amp; Client Websites Built at Pearl Lemon
            </h2>
            <p className="text-neutral-600 text-sm mt-2">
              A glimpse of 30+ production websites and landing pages built from scratch.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {WEBSITES_GALLERY.map((web, idx) => (
              <div
                key={idx}
                className="group rounded-2xl border border-neutral-200 bg-white overflow-hidden shadow-sm hover:shadow-xl hover:-translate-y-1 transition duration-300"
              >
                <div className="aspect-[16/10] overflow-hidden bg-neutral-100 relative">
                  <img
                    src={web.img}
                    alt={web.title}
                    loading="lazy"
                    className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                  />
                </div>
                <div className="p-4">
                  <h3 className="text-sm font-bold text-neutral-900 group-hover:text-orange-600 transition">
                    {web.title}
                  </h3>
                  <span className="text-[11px] text-neutral-500 block mt-1">
                    WordPress &bull; Elementor &bull; Full Responsive
                  </span>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* 7. Impact Numbers & Stats Bar */}
        <section className="rounded-3xl bg-neutral-950 text-white p-8 sm:p-12 shadow-xl">
          <div className="text-center mb-8">
            <span className="text-xs font-bold uppercase tracking-widest text-orange-400">
              Total Impact
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold mt-1">Numbers &amp; Scale Delivered</h2>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div className="p-6 rounded-2xl bg-white/5 border border-white/10">
              <div className="text-4xl sm:text-5xl font-extrabold text-orange-400">118</div>
              <div className="text-xs uppercase tracking-wider text-white/70 mt-2">
                Internal Websites
              </div>
            </div>
            <div className="p-6 rounded-2xl bg-white/5 border border-white/10">
              <div className="text-4xl sm:text-5xl font-extrabold text-blue-400">30+</div>
              <div className="text-xs uppercase tracking-wider text-white/70 mt-2">
                Client Websites
              </div>
            </div>
            <div className="p-6 rounded-2xl bg-white/5 border border-white/10">
              <div className="text-4xl sm:text-5xl font-extrabold text-emerald-400">14</div>
              <div className="text-xs uppercase tracking-wider text-white/70 mt-2">
                Team Members Led
              </div>
            </div>
            <div className="p-6 rounded-2xl bg-white/5 border border-white/10">
              <div className="text-4xl sm:text-5xl font-extrabold text-purple-400">110+</div>
              <div className="text-xs uppercase tracking-wider text-white/70 mt-2">
                Total Employees
              </div>
            </div>
          </div>
        </section>

        {/* 8. Growth & Gratitude Hero Conclusion Banner */}
        <section
          className="relative rounded-3xl overflow-hidden p-8 sm:p-16 text-white text-center shadow-2xl"
          style={{
            backgroundImage: `linear-gradient(180deg, rgba(0,0,0,0.45) 0%, rgba(0,0,0,0.85) 100%), url(https://usmanjatoi.com/wp-content/uploads/2024/12/einklang-banner-bg.webp)`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
          <div className="max-w-2xl mx-auto relative z-10">
            <span className="text-xs font-bold uppercase tracking-widest text-orange-300">
              Growth &amp; Gratitude at Pearl Lemon
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold mt-2 mb-4">Conclusion</h2>
            <p className="text-white/90 leading-relaxed text-sm sm:text-base mb-8">
              My journey at Pearl Lemon Group has been a rewarding experience. I started with challenges and quickly grew as a designer and professional, thanks to a supportive team. I learned valuable skills, managed projects, and built strong relationships. I'm grateful for the opportunities and flexible work environment that helped me succeed. Pearl Lemon has truly shaped my career, and I'll always cherish my time here.
            </p>
            <Link
              to="/about-me"
              className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full bg-white/20 hover:bg-white text-white hover:text-neutral-950 font-bold text-sm tracking-wider uppercase backdrop-blur-md transition shadow-lg"
            >
              Click Here
            </Link>
          </div>
        </section>

        {/* 9. Frequently Asked Questions Accordion */}
        <section className="bg-white rounded-3xl p-8 sm:p-12 border border-neutral-200 shadow-sm">
          <div className="text-center max-w-xl mx-auto mb-10">
            <span className="text-xs font-bold uppercase tracking-wider text-orange-500">
              Transparent Insights
            </span>
            <h2 className="text-3xl font-bold text-neutral-900 mt-1">
              Frequently Asked Questions
            </h2>
          </div>

          <div className="divide-y divide-neutral-200">
            {FAQS_LIST.map((faq, idx) => {
              const isOpen = openFaq === idx;
              return (
                <div key={idx} className="py-4">
                  <button
                    type="button"
                    onClick={() => toggleFaq(idx)}
                    className="w-full flex items-center justify-between text-left gap-4 py-2 text-sm sm:text-base font-semibold text-neutral-900 hover:text-orange-600 transition"
                  >
                    <span>{faq.q}</span>
                    <ChevronDown
                      className={`h-5 w-5 flex-none text-neutral-400 transition-transform duration-200 ${
                        isOpen ? "rotate-180 text-orange-500" : ""
                      }`}
                    />
                  </button>
                  {isOpen && (
                    <div className="mt-3 text-sm text-neutral-600 leading-relaxed pl-1 pr-4 animate-in fade-in slide-in-from-top-1">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </section>

        {/* 10. Things I Have Learned Are: Pills */}
        <section className="text-center pt-4">
          <h2 className="text-2xl sm:text-3xl font-bold text-neutral-900 mb-6">
            Things I Have Learned Are:
          </h2>
          <div className="flex flex-wrap justify-center gap-3">
            {[
              "TEAM MANAGEMENT",
              "SOCIAL MEDIA MANAGEMENT",
              "WEBSITE DESIGNS",
              "TEACHING",
              "OFFICE OPERATIONS",
            ].map((skill) => (
              <span
                key={skill}
                className="px-6 py-2.5 rounded-full bg-neutral-200/80 hover:bg-neutral-900 hover:text-white text-neutral-800 text-xs font-bold tracking-wider uppercase transition shadow-sm"
              >
                {skill}
              </span>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
