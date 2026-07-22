import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/my-lifestyle/hobbies")({
  head: () => ({
    meta: [
      { title: "Hobbies — My Lifestyle | Usman Jatoi" },
      {
        name: "description",
        content:
          "The hobbies that shape Usman Jatoi — art, 3D, photography, filmmaking, lifelong learning, and adventures beyond the screen.",
      },
      { property: "og:title", content: "Hobbies — My Lifestyle | Usman Jatoi" },
      {
        property: "og:description",
        content:
          "The creative and personal pursuits that fuel Usman Jatoi's work and life.",
      },
      { property: "og:type", content: "article" },
      {
        property: "og:url",
        content: "https://usmanjatoi.lovable.app/my-lifestyle/hobbies",
      },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [
      {
        rel: "canonical",
        href: "https://usmanjatoi.lovable.app/my-lifestyle/hobbies",
      },
    ],
  }),
  component: HobbiesPage,
});

type Section = {
  tag: string;
  title: string;
  icon: string;
  paragraphs: string[];
};

const sections: Section[] = [
  {
    tag: "Creativity",
    icon: "",
    title: "The Heart of Creativity: Art in Many Forms",
    paragraphs: [
      "From a very young age, creating art has been a core part of who I am. Even as a child, when I was only seven years old, my interest in making things in the digital world began. This love for art started with simple ways of putting my thoughts onto paper, then quickly moved into the digital space.",
      "I remember spending countless hours in late 2019, diving deep into graphic design. This wasn't just a casual interest; I spent day and night improving my work, not thinking about the time. It was a true passion. To get some early experience, I started making shirt designs for the website theWareHouse.pk, creating over 30 unique designs that were even promoted through their ads. This was a fun way to see my creative work out there, even before I was getting paid much for it.",
      "Then, in 2020, I explored 3D modeling. I gave my whole year to learning 3D artwork, and I became good at it, adding another dimension to my creative skills. Whether it's designing visuals that connect, making logos, social media posts, or ad creatives, or even putting together print designs like brochures and flyers, my creative skills are a big part of my hobbies and personal enjoyment. This consistent effort in art and design has taught me discipline and the joy of seeing an idea come to life.",
    ],
  },
  {
    tag: "Storytelling",
    icon: "",
    title: "The Lens and the Story: From Photography to Filmmaking",
    paragraphs: [
      "My interest in visuals also led me to photography. I enjoy taking pictures and capturing moments, which is a quiet way to see the world around me. This naturally flowed into a deep hobby of video creation and filmmaking. My YouTube channel, \"Usman Jatoi\" (originally \"UJTutorial,\" later \"Usman Art\"), became a place for this.",
      "A notable project in this area was the \"Khanpur Katora Documentary.\" This film was a big personal project, taking over 1.5 months to script, record, and edit with my brother. It was a huge effort, involving telling a story from where I come from. We then went on to make two more videos. These experiences taught me about storytelling, the technical details of video editing, and the patience needed to bring a long-form idea to completion.",
      "This was all driven by personal interest and a desire to tell stories, even before it became something I was recognized for professionally in my city in 2022. The ability to turn art and designs into motion through video editing became a central part of my creative hobbies.",
    ],
  },
  {
    tag: "Curiosity",
    icon: "",
    title: "The Quest for Knowledge: Learning as a Lifestyle",
    paragraphs: [
      "For me, learning new skills is not just a job requirement; it's a core hobby and a way of life. I have always been driven by curiosity. As a kid, I tried learning everything: coding, game building, and app creation. But after a few months, I realized I didn't want to choose pure coding for my entire career. I then tried front-end website development, which includes design but also uses coding. Again, I decided to move on from just coding for my whole life.",
      "This was a valuable lesson: it's okay to try something and then decide it's not the right fit. It taught me about self-awareness and the importance of finding what truly excites me.",
      "I keep trying new skills without fear of changing direction. This consistent push to learn new things is a hobby in itself. It means I am always keeping up-to-date with different digital skills, whether it's understanding new platforms or exploring new ways of doing things. This constant learning feeds my mind and keeps me ready for any new challenge, personally or professionally.",
    ],
  },
  {
    tag: "Adventure",
    icon: "",
    title: "Adventures and Explorations: Beyond the Screen",
    paragraphs: [
      "While much of my life involves screens, I also find joy in exploring the real world. My personal experiences, like a trip to Bhawalpur, show my interest in traveling and seeing new places. These experiences, though not directly tied to digital tools, help broaden my perspective and offer fresh ideas.",
      "It's about taking time away from the computer to experience different environments and cultures. Such explorations help clear my mind and give me new ways to think about creative and problem-solving tasks when I return to my digital work.",
    ],
  },
  {
    tag: "Reflection",
    icon: "",
    title: "The Game That Taught a Lesson: What Stays and What Goes",
    paragraphs: [
      "Like many young people, I explored gaming as a hobby. I even started a second YouTube channel, \"UJGamer418,\" because my friends encouraged me to play with them and upload gaming videos. At first, it was fun, and my friends praised my content.",
      "But, as often happens, gaming too much can become boring. I realized that it wasn't holding my long-term interest in the way my other creative pursuits did. So, I decided to move on from the gaming channel.",
      "This experience was a good lesson in personal discernment: knowing when a hobby is serving its purpose for fun and when it's time to shift focus to things that truly feed your deeper passions and goals. It shows a practical approach to my own time and energy.",
    ],
  },
  {
    tag: "Impact",
    icon: "",
    title: "How Hobbies Shape My Professional Self",
    paragraphs: [
      "All these hobbies, from deep creative work to trying and leaving different paths, play a big role in my professional life. The discipline I learned from daily graphic design and 3D modeling directly helps my work ethic. The storytelling and detailed planning from filmmaking carry over into how I approach professional projects.",
      "The willingness to try new skills, even if I decide they aren't for me, means I am not afraid to experiment or adapt to new technologies in my professional work.",
      "These hobbies are not just distractions; they are the fuel for my professional growth, keeping my mind open, my skills sharp, and my approach to problem-solving fresh and practical. They are where I practice perseverance and critical thinking — skills that are essential in any digital field.",
    ],
  },
];

const faqs: { q: string; a: string }[] = [
  {
    q: "What are your main hobbies?",
    a: "My main hobbies include creating digital art and graphic design, 3D modeling, video editing and filmmaking, and constantly learning new skills. I also enjoy photography and exploring new places when I can.",
  },
  {
    q: "How do your hobbies relate to your professional work?",
    a: "Every hobby feeds a professional muscle — design taught me discipline, filmmaking taught me storytelling, constant learning taught me adaptability. My professional work is essentially my hobbies practiced under deadlines.",
  },
  {
    q: "Did you always know what your main hobby would be?",
    a: "No. I tried coding, game building, app creation, and gaming before settling on design, 3D, and filmmaking. Each try taught me what fits and what doesn't, and that clarity is a hobby-lesson in itself.",
  },
  {
    q: "Do you have any hobbies that didn't stick?",
    a: "Yes — pure coding as a career path, my gaming YouTube channel \"UJGamer418,\" and a few short-lived experiments. Leaving them was as valuable as the ones I kept.",
  },
  {
    q: "What have your creative hobbies taught you?",
    a: "Patience, discipline, and the joy of turning an idea into something real. Also — that consistency beats talent almost every time.",
  },
  {
    q: "How do you keep learning new skills as a hobby?",
    a: "I follow curiosity without fear of changing direction. If a topic excites me, I go deep for weeks. If it stops serving me, I move on without guilt.",
  },
  {
    q: "Do you have any non-digital hobbies?",
    a: "Yes — traveling, photography in the real world, and simply exploring new cities and cultures. They reset my brain and feed my digital work with new perspectives.",
  },
];

function HobbiesPage() {
  return (
    <div className="min-h-screen bg-white text-neutral-900">
      <style
        dangerouslySetInnerHTML={{
          __html: `
        @keyframes hGradient {
          0%,100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
        .h-gradient-text {
          background: linear-gradient(90deg,#ff5f6d,#ffc371,#47e0a0,#4facfe,#a06cff,#ff5f6d);
          background-size: 300% 300%;
          -webkit-background-clip: text;
          background-clip: text;
          color: transparent;
          animation: hGradient 8s ease infinite;
        }
        .h-pill {
          position: relative;
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 12px 24px;
          border-radius: 999px;
          background: #fff;
          color: #111;
          font-weight: 600;
          font-size: 14px;
          text-decoration: none;
        }
        .h-pill.dark { background:#111; color:#fff; }
        .h-pill.dark::before { display:none; }
        .h-pill::before {
          content:"";
          position:absolute; inset:0;
          padding:2px; border-radius:999px;
          background: linear-gradient(90deg,#ff5f6d,#ffc371,#47e0a0,#4facfe,#a06cff,#ff5f6d);
          background-size:300% 300%;
          -webkit-mask: linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0);
          mask: linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0);
          -webkit-mask-composite: xor; mask-composite: exclude;
          animation: hGradient 8s ease infinite;
          pointer-events:none;
        }
        .h-card {
          position:relative;
          border-radius: 24px;
          background:#fff;
          padding: 32px;
        }
        .h-card::before {
          content:"";
          position:absolute; inset:0;
          padding:1.5px; border-radius:24px;
          background: linear-gradient(120deg,#ff5f6d,#ffc371,#47e0a0,#4facfe,#a06cff);
          background-size:300% 300%;
          -webkit-mask: linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0);
          mask: linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0);
          -webkit-mask-composite: xor; mask-composite: exclude;
          animation: hGradient 10s ease infinite;
          pointer-events:none;
        }
        .h-tag {
          display:inline-block;
          font-size: 11px;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          padding: 4px 10px;
          border-radius: 999px;
          background: #111;
          color: #fff;
          font-weight: 600;
        }
        .h-icon {
          width:64px; height:64px;
          border-radius:20px;
          display:inline-flex;
          align-items:center;
          justify-content:center;
          font-size:32px;
          background: linear-gradient(135deg,#fff6f8,#eef4ff);
          box-shadow: 0 8px 24px -12px rgba(160,108,255,.35);
          flex-shrink:0;
        }
        .h-crumb a { color:#666; }
        .h-crumb a:hover { color:#111; }
        details.h-faq { border-radius: 20px; background:#fff; position:relative; }
        details.h-faq::before {
          content:"";
          position:absolute; inset:0;
          padding:1.5px; border-radius:20px;
          background: linear-gradient(120deg,#ff5f6d,#ffc371,#47e0a0,#4facfe,#a06cff);
          background-size:300% 300%;
          -webkit-mask: linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0);
          mask: linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0);
          -webkit-mask-composite: xor; mask-composite: exclude;
          animation: hGradient 10s ease infinite;
          pointer-events:none;
        }
        details.h-faq summary {
          list-style:none;
          cursor:pointer;
          padding: 20px 24px;
          font-weight: 700;
          display:flex;
          justify-content:space-between;
          align-items:center;
          gap: 12px;
        }
        details.h-faq summary::-webkit-details-marker { display:none; }
        details.h-faq[open] summary { padding-bottom: 8px; }
        details.h-faq .h-faq-icon {
          transition: transform .25s ease;
          font-weight: 900;
          color:#a06cff;
          font-size: 20px;
        }
        details.h-faq[open] .h-faq-icon { transform: rotate(45deg); }
      `,
        }}
      />

      {/* Hero */}
      <section className="pt-32 pb-14 px-6 md:px-10 max-w-6xl mx-auto">
        <nav className="h-crumb text-sm mb-6" aria-label="Breadcrumb">
          <a href="/">Home</a>
          <span className="mx-2 text-neutral-400">›</span>
          <a href="/my-lifestyle">My Lifestyle</a>
          <span className="mx-2 text-neutral-400">›</span>
          <span className="text-neutral-900 font-semibold">Hobbies</span>
        </nav>

        <div className="text-center">
          <span className="h-tag mb-6">Hobbies</span>
          <h1 className="mt-6 text-5xl md:text-7xl font-black tracking-tight leading-[1.05]">
            What I do when
            <br />
            I'm <span className="h-gradient-text">not working</span>.
          </h1>
          <p className="mt-6 text-lg md:text-xl text-neutral-600 max-w-3xl mx-auto">
            Hobbies are more than ways to pass the time — they're big parts
            of who I am, how I see the world, and how I stay fresh and
            ready for anything.
          </p>
        </div>
      </section>

      {/* Intro */}
      <section className="px-6 md:px-10 max-w-4xl mx-auto pb-16">
        <div className="h-card">
          <span className="h-tag mb-4">Why hobbies matter</span>
          <h2 className="mt-4 text-3xl md:text-4xl font-bold tracking-tight">
            My hobbies: <span className="h-gradient-text">what I do when I'm not working</span>
          </h2>
          <div className="mt-6 space-y-4 text-neutral-700 leading-relaxed">
            <p>
              Many people have hobbies, but for me, they are deeply tied to
              how I learn and grow. They are where I try new things without
              the pressure of work deadlines, where I can make mistakes and
              learn from them without worry. This page shares what I enjoy
              doing, the lessons these activities teach me, and how they
              help me be a better person and a better professional.
            </p>
            <p>
              I am <strong>Usman Jatoi</strong>, and my hobbies are a big
              part of my story. They show my love for building, creating,
              and always trying something new. My aim is to show you how
              these personal interests help me bring a full and practical
              approach to all my work.
            </p>
          </div>
        </div>
      </section>

      {/* Sections */}
      <section className="px-6 md:px-10 max-w-5xl mx-auto pb-20 space-y-8">
        {sections.map((s, i) => (
          <article key={i} className="h-card">
            <div className="flex items-start gap-5">
              <span className="h-icon">{s.icon}</span>
              <div className="flex-1 min-w-0">
                <span className="h-tag">{s.tag}</span>
                <h2 className="mt-3 text-2xl md:text-3xl font-bold tracking-tight leading-snug">
                  {s.title}
                </h2>
                <div className="mt-4 space-y-4 text-neutral-700 leading-relaxed">
                  {s.paragraphs.map((p, j) => (
                    <p key={j}>{p}</p>
                  ))}
                </div>
              </div>
            </div>
          </article>
        ))}
      </section>

      {/* FAQ */}
      <section className="px-6 md:px-10 max-w-4xl mx-auto pb-24">
        <div className="text-center mb-10">
          <span className="h-tag mb-4">FAQ</span>
          <h2 className="mt-4 text-4xl md:text-5xl font-black tracking-tight">
            Frequently asked <span className="h-gradient-text">questions</span>
          </h2>
        </div>
        <div className="space-y-4">
          {faqs.map((f, i) => (
            <details key={i} className="h-faq">
              <summary>
                <span>{f.q}</span>
                <span className="h-faq-icon">+</span>
              </summary>
              <div className="px-6 pb-6 text-neutral-700 leading-relaxed">
                {f.a}
              </div>
            </details>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="px-6 md:px-10 max-w-4xl mx-auto pb-32">
        <div className="h-card text-center">
          <span className="h-tag mb-4">Let's talk</span>
          <h3 className="mt-4 text-3xl md:text-4xl font-bold tracking-tight">
            Ready to talk about <span className="h-gradient-text">digital creation</span>?
          </h3>
          <p className="mt-4 text-neutral-600 max-w-xl mx-auto">
            My hobbies are a big part of the practical experience I bring
            to any task. If you're looking for someone who understands
            creativity, learning, and disciplined effort, let's connect.
          </p>
          <div className="mt-8 flex flex-wrap gap-3 justify-center">
            <a href="/contact-me" className="h-pill dark">
              Contact me →
            </a>
            <a href="/my-lifestyle" className="h-pill">
              Back to lifestyle
            </a>
          </div>
        </div>

        <div className="mt-12 text-center">
          <a href="/" className="text-neutral-600 hover:text-neutral-900 font-medium">
            ← Back to home
          </a>
        </div>
      </section>
    </div>
  );
}
