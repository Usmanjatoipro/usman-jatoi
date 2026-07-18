import { createFileRoute, Link } from "@tanstack/react-router";

export const Route = createFileRoute("/about-me/social-media")({
  head: () => ({
    meta: [
      { title: "Social Media — About Me | Usman Jatoi" },
      {
        name: "description",
        content:
          "Connect with Usman Jatoi across 60+ authoritative digital hubs — LinkedIn, Instagram, YouTube, X, TikTok, Crunchbase, IMDb, and more.",
      },
      { property: "og:title", content: "Social Media — Usman Jatoi" },
      {
        property: "og:description",
        content:
          "The global digital footprint — every profile, in one place.",
      },
      { property: "og:type", content: "profile" },
      {
        property: "og:url",
        content: "https://usmanjatoi.lovable.app/about-me/social-media",
      },
    ],
    links: [
      {
        rel: "canonical",
        href: "https://usmanjatoi.lovable.app/about-me/social-media",
      },
    ],
  }),
  component: SocialMediaPage,
});

const featured = [
  {
    icon: "in",
    name: "LinkedIn",
    handle: "Connect with me professionally",
    href: "https://www.linkedin.com/in/usmanjatoipro/",
    body:
      "I'm Usman Jatoi Pro — Entrepreneur, Creative Artist, and Founder of Redsglow, the parent company behind Tools Redsglow, DreamJobChaser, and HirePakistani. I've worked with top international agencies like Pearl Lemon UK as Head of Website Design and Social Media, leading a team of 13 at a young age.",
  },
  {
    icon: "IG",
    name: "Instagram",
    handle: "@usmanjatoipro",
    href: "https://www.instagram.com/usmanjatoipro/",
    body:
      "Behind-the-scenes of my journey as an entrepreneur, designer, and founder. Insights on design, marketing, startups, and the creative world — plus tips to grow online.",
  },
  {
    icon: "AM",
    name: "About.me",
    handle: "about.me/usmanjatoipro",
    href: "https://about.me/usmanjatoipro/",
    body:
      "One-stop place to learn about my work, startups, and digital ventures — from Redsglow to Pearl Lemon UK and AlhajarAlfidhi.",
  },
  {
    icon: "M",
    name: "Mssg.me",
    handle: "Direct link hub",
    href: "https://mssg.me/usmanjatoi",
    body:
      "All my links, services, and projects in one place — connect with me directly through my official Mssg.me profile.",
  },
  {
    icon: "EW",
    name: "Everybody Wiki",
    handle: "Journey wiki",
    href: "https://en.everybodywiki.com/Usman_Jatoi",
    body:
      "A snapshot of the journey — from curious teen to full-fledged digital entrepreneur. Milestones, tools, businesses, and the vision behind Redsglow, AI Universe, and beyond.",
  },
];

type Profile = { name: string; href: string; group: string };

const profiles: Profile[] = [
  { name: "Google Knowledge Panel", href: "https://www.google.com/search?q=Usman+Jatoi+Pro", group: "Authority" },
  { name: "Facebook", href: "https://www.facebook.com/UsmanJatoiofficial/", group: "Social" },
  { name: "YouTube", href: "https://www.youtube.com/@UsmanJatoiofficial/videos", group: "Social" },
  { name: "Instagram", href: "https://www.instagram.com/usmanjatoipro/", group: "Social" },
  { name: "X (Twitter)", href: "https://x.com/UsmanJatoiPro", group: "Social" },
  { name: "TikTok", href: "https://www.tiktok.com/@usmanjatoipro", group: "Social" },
  { name: "Pinterest", href: "https://www.pinterest.com/usmanjatoipro/", group: "Social" },

  { name: "Crunchbase", href: "https://www.crunchbase.com/person/usman-jatoi-pro", group: "Professional" },
  { name: "The Org", href: "https://theorg.com/org/pearl-lemon-group/org-chart/usman-jatoi", group: "Professional" },
  { name: "IMDb", href: "https://www.imdb.com/name/nm17435623/", group: "Professional" },
  { name: "UK Company Filing", href: "https://find-and-update.company-information.service.gov.uk/officers/KYgG6lW61QwQNGgS1BHbaXQafks/appointments", group: "Professional" },
  { name: "ProvenExpert", href: "https://provenexpert.com/en-us/usman-jatoi/", group: "Professional" },
  { name: "Owler", href: "https://owler.com/company/usmanjatoi", group: "Professional" },

  { name: "500px", href: "https://500px.com/p/usmanjatoipro", group: "Creative" },
  { name: "Sketchfab", href: "https://sketchfab.com/usman_jatoi", group: "Creative" },
  { name: "Unsplash", href: "https://unsplash.com/@usmanjatoipro/likes", group: "Creative" },
  { name: "Giphy", href: "https://giphy.com/channel/usmanjatoipro", group: "Creative" },
  { name: "Pexels", href: "https://www.pexels.com/@usman-jatoi-2154501844/", group: "Creative" },
  { name: "SketchUp 3D", href: "https://3dwarehouse.sketchup.com/by/usmanjatoi", group: "Creative" },
  { name: "Vimeo", href: "https://vimeo.com/usmanjatoipro", group: "Creative" },
  { name: "Twitch", href: "https://www.twitch.tv/usmanjatoipro/about", group: "Creative" },
  { name: "Coub", href: "https://coub.com/usmanjatoi", group: "Creative" },
  { name: "DivePhotoGuide", href: "https://www.divephotoguide.com/user/usmanjatoi125", group: "Creative" },
  { name: "Awwwards", href: "https://www.awwwards.com/usmanjatoi/", group: "Creative" },

  { name: "About.me", href: "https://about.me/usmanjatoipro/", group: "Hub" },
  { name: "Brandfetch", href: "https://brandfetch.com/usmanjatoi.com", group: "Hub" },
  { name: "Linktree", href: "https://linktr.ee/usmanjatoipro", group: "Hub" },
  { name: "Solo.to", href: "https://solo.to/usmanjatoi125", group: "Hub" },
  { name: "HeyLink.me", href: "https://heylink.me/usmanjatoi/", group: "Hub" },
  { name: "Lnk.Bio", href: "https://lnk.bio/usmanjatoi", group: "Hub" },
  { name: "Start.me", href: "https://start.me/w/L9YJyM", group: "Hub" },
  { name: "Gravatar", href: "https://gravatar.com/usmanjatoiprosocial", group: "Hub" },

  { name: "Medium", href: "https://medium.com/@usmanjatoipro", group: "Writing" },
  { name: "Substack", href: "https://substack.com/@usmanjatoiproexpert", group: "Writing" },
  { name: "Tumblr", href: "https://www.tumblr.com/usmanjatoipro/795299302166708224?source=share", group: "Writing" },
  { name: "HubPages", href: "https://hubpages.com/@usmanjatoi", group: "Writing" },
  { name: "LiveJournal", href: "https://usman-jatoi.livejournal.com/profile/", group: "Writing" },
  { name: "Bloglovin", href: "https://www.bloglovin.com/@usmanjatoi", group: "Writing" },
  { name: "Blurb", href: "https://www.blurb.com/user/usman_jatoi", group: "Writing" },
  { name: "Hatena", href: "https://profile.hatena.ne.jp/Usman_Jatoi/profile", group: "Writing" },
  { name: "Flipboard", href: "https://flipboard.com/@usmanjatoipro/usman-jatoi-7lvl3671z", group: "Writing" },
  { name: "Scoop.it", href: "https://sco.lt/6SZAfI", group: "Writing" },
  { name: "Pearltrees", href: "https://www.pearltrees.com/usmanjatoiofficial", group: "Writing" },

  { name: "Reddit", href: "https://www.reddit.com/user/usmanjatoipro/", group: "Community" },
  { name: "Quora", href: "https://www.quora.com/profile/Usman-Jatoi-Pro", group: "Community" },
  { name: "Disqus", href: "https://disqus.com/by/usmanjatoi/about/", group: "Community" },
  { name: "IntenseDebate", href: "https://www.intensedebate.com/people/Usman_Jatoi", group: "Community" },
  { name: "The Dots", href: "https://the-dots.com/users/usman-jatoi-1976350", group: "Community" },
  { name: "EmpowHer", href: "https://www.empowher.com/users/usmanjatoi", group: "Community" },
  { name: "SB Nation", href: "https://www.sbnation.com/users/Usman%20Jatoi", group: "Community" },
  { name: "Snipesocial", href: "https://www.snipesocial.co.uk/usmanjatoi125", group: "Community" },

  { name: "Product Hunt", href: "https://www.producthunt.com/@usmanjatoi125", group: "Startup" },
  { name: "Kickstarter", href: "https://www.kickstarter.com/profile/84463933/about", group: "Startup" },
  { name: "StartupXplore", href: "https://startupxplore.com/en/person/usman-jatoi", group: "Startup" },
  { name: "RemoteHub", href: "https://www.remotehub.com/usmanjatoi.pro", group: "Startup" },
  { name: "StockTwits", href: "https://stocktwits.com/usmanjatoi", group: "Startup" },

  { name: "Speaker Deck", href: "https://speakerdeck.com/usman_jatoi", group: "Docs" },
  { name: "Slides.com", href: "https://slides.com/usmanjatoi", group: "Docs" },
  { name: "SlideShare", href: "https://www.slideshare.net/usmanjatoiprosocial?tab=about", group: "Docs" },
  { name: "Issuu", href: "https://issuu.com/usmanjatoi125", group: "Docs" },
  { name: "FlipHTML5", href: "https://fliphtml5.com/homepage/Usman_Jatoi/usman-jatoi/", group: "Docs" },
  { name: "MagCloud", href: "https://www.magcloud.com/user/usmanjatoi125", group: "Docs" },
  { name: "Edocr", href: "https://www.edocr.com/user/usmanjatoi", group: "Docs" },
  { name: "Padlet", href: "https://padlet.com/usmanjatoipro/usman-jatoi-jrve1vrwra7s4s73", group: "Docs" },
  { name: "Pastebin", href: "https://pastebin.com/u/usmanjatoi125", group: "Docs" },
  { name: "JustPaste.it", href: "https://justpaste.it/u/Usman_Jatoi_Pro", group: "Docs" },
  { name: "JustPaste.me", href: "https://justpaste.me/hPg73", group: "Docs" },
  { name: "Open Library", href: "https://openlibrary.org/people/usman_jatoi", group: "Docs" },
  { name: "Data.world", href: "https://data.world/usmanjatoi", group: "Docs" },
  { name: "Gifyu", href: "https://gifyu.com/usman_jatoi", group: "Docs" },

  { name: "Replit", href: "https://replit.com/@usmanjatoiproso", group: "Dev" },
  { name: "RapidAPI", href: "https://rapidapi.com/user/usmanjatoi125", group: "Dev" },
  { name: "DZone", href: "https://dzone.com/users/5378044/usmanjatoi125.html", group: "Dev" },
  { name: "Conifer", href: "https://conifer.rhizome.org/Usman_Jatoi", group: "Dev" },

  { name: "Audiomack", href: "https://audiomack.com/usman-jatoi", group: "Media" },
  { name: "Letterboxd", href: "https://letterboxd.com/usman_jatoi/", group: "Media" },
  { name: "Goodreads", href: "https://www.goodreads.com/user/show/192557144-usman-jatoi", group: "Media" },
  { name: "TED", href: "https://www.ted.com/profiles/49885248", group: "Media" },
  { name: "TripAdvisor", href: "https://www.tripadvisor.com/Profile/usmanjatoi", group: "Media" },
  { name: "OpenStreetMap", href: "https://www.openstreetmap.org/user/Usman%20Jatoi", group: "Media" },
  { name: "Fuelly", href: "https://www.fuelly.com/driver/usmanjatoi125", group: "Media" },
  { name: "Peatix", href: "https://peatix.com/user/27442813/view", group: "Media" },
  { name: "Coursera", href: "https://www.coursera.org/learner/usmanjatoi", group: "Media" },
];

const groups = Array.from(new Set(profiles.map((p) => p.group)));

function SocialMediaPage() {
  return (
    <main className="min-h-screen bg-white text-neutral-900">
      <section className="mx-auto max-w-5xl px-6 pb-20 pt-28 sm:pt-32">
        <nav className="mb-8 text-sm text-neutral-500">
          <Link to="/" className="hover:text-neutral-900">Home</Link>
          <span className="mx-2">/</span>
          <span>About Me</span>
          <span className="mx-2">/</span>
          <span className="text-neutral-900">Social Media</span>
        </nav>

        <header className="mb-14">
          <span className="inline-block rounded-full border border-neutral-200 bg-neutral-50 px-3 py-1 text-xs font-medium uppercase tracking-widest text-neutral-600">
            About · Social Media
          </span>
          <h1 className="mt-4 text-4xl font-semibold leading-tight sm:text-5xl">
            <span className="bg-[linear-gradient(90deg,#ff2d55,#ff9500,#ffcc00,#34c759,#5ac8fa,#af52de,#ff2d55)] bg-[length:300%_100%] bg-clip-text text-transparent animate-[gradient_8s_linear_infinite]">
              The global digital footprint.
            </span>
          </h1>
          <p className="mt-5 max-w-2xl text-lg text-neutral-600">
            Connect with Usman Jatoi across {profiles.length}+ authoritative
            digital hubs — social, professional, creative, and everywhere in
            between.
          </p>
        </header>

        <section className="mb-14 grid gap-5 sm:grid-cols-2">
          {featured.map((f) => (
            <a
              key={f.name}
              href={f.href}
              target="_blank"
              rel="noopener noreferrer"
              className="group rounded-2xl border border-neutral-200 bg-white p-6 transition hover:-translate-y-0.5 hover:shadow-lg"
            >
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[linear-gradient(135deg,#ff2d55,#af52de)] text-sm font-bold text-white">
                  {f.icon}
                </div>
                <div>
                  <div className="text-lg font-semibold">{f.name}</div>
                  <div className="text-xs text-neutral-500">{f.handle}</div>
                </div>
              </div>
              <p className="mt-4 text-sm leading-relaxed text-neutral-700">{f.body}</p>
              <span className="mt-4 inline-block text-sm font-medium text-neutral-900 group-hover:underline">
                Visit now →
              </span>
            </a>
          ))}
        </section>

        <section>
          <div className="flex flex-wrap items-end justify-between gap-3">
            <h2 className="text-2xl font-semibold sm:text-3xl">All profiles</h2>
            <span className="text-sm text-neutral-500">{profiles.length} total</span>
          </div>

          {groups.map((g) => {
            const list = profiles.filter((p) => p.group === g);
            return (
              <div key={g} className="mt-8">
                <div className="mb-3 flex items-center gap-3">
                  <span className="text-xs font-medium uppercase tracking-widest text-neutral-500">
                    {g}
                  </span>
                  <span className="h-px flex-1 bg-neutral-200" />
                  <span className="text-xs text-neutral-400">{list.length}</span>
                </div>
                <ul className="flex flex-wrap gap-2">
                  {list.map((p) => (
                    <li key={p.href}>
                      <a
                        href={p.href}
                        target="_blank"
                        rel="nofollow noopener noreferrer"
                        className="inline-flex items-center gap-2 rounded-full border border-neutral-200 bg-white px-3 py-1.5 text-sm text-neutral-800 transition hover:border-neutral-400 hover:bg-neutral-50"
                      >
                        <span className="h-1.5 w-1.5 rounded-full bg-[linear-gradient(90deg,#ff2d55,#af52de)]" />
                        {p.name}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </section>

        <section className="mt-16 rounded-2xl border border-neutral-200 bg-neutral-50 p-6 sm:p-8">
          <h2 className="text-xl font-semibold sm:text-2xl">Want to collaborate?</h2>
          <p className="mt-2 text-neutral-700">
            The fastest way to reach me is the contact page — pick the channel
            you prefer above, or drop a message directly.
          </p>
          <div className="mt-5 flex flex-wrap gap-3">
            <Link
              to="/contact-me"
              className="rounded-full bg-neutral-900 px-5 py-2.5 text-sm font-medium text-white hover:bg-neutral-800"
            >
              Contact me
            </Link>
            <Link
              to="/media-kit"
              className="rounded-full border border-neutral-300 bg-white px-5 py-2.5 text-sm font-medium text-neutral-900 hover:bg-neutral-100"
            >
              Media kit
            </Link>
          </div>
        </section>
      </section>

      <style>{`
        @keyframes gradient {
          0% { background-position: 0% 50%; }
          100% { background-position: 300% 50%; }
        }
      `}</style>
    </main>
  );
}
