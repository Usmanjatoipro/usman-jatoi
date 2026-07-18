import { useEffect, useRef, useState } from "react";
import meAsset from "@/assets/me-playing.webp.asset.json";

export default function SayHello() {
  const ref = useRef<HTMLElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setVisible(true);
          io.disconnect();
        }
      },
      { threshold: 0.25 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <section
      ref={ref}
      aria-label="Say hello"
      data-visible={visible}
      className="sh-section"
    >
      <div className="sh-inner">
        <p className="sh-eyebrow">
          <span className="sh-eyebrow__dot" aria-hidden="true" />
          Nice to meet you
        </p>

        <div className="sh-row">
          <span className="sh-word sh-word--say">Say</span>

          <div className="sh-media" aria-hidden="true">
            <div className="sh-media__ring" />
            <div className="sh-media__reveal">
              <img
                src={meAsset.url}
                alt=""
                width={540}
                height={540}
                loading="lazy"
                decoding="async"
              />
            </div>
          </div>

          <span className="sh-word sh-word--hello">Hello</span>
        </div>

        <p className="sh-tagline">
          Let&rsquo;s create something that fits &mdash; and scales.
        </p>
      </div>

      <style>{`
        .sh-section {
          position: relative;
          isolation: isolate;
          contain: layout paint;
          width: 100%;
          padding: clamp(64px, 10vw, 140px) clamp(20px, 5vw, 60px);
          background: #ffffff;
          color: #0a0a0a;
          overflow: hidden;
        }
        .sh-inner {
          max-width: 1200px;
          margin: 0 auto;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: clamp(28px, 4vw, 48px);
          text-align: center;
        }
        .sh-eyebrow {
          display: inline-flex;
          align-items: center;
          gap: 10px;
          margin: 0;
          font-size: 13px;
          font-weight: 600;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          color: #6b6b6b;
          opacity: 0;
          transform: translateY(12px);
          transition: opacity .7s ease, transform .7s ease;
        }
        .sh-eyebrow__dot {
          width: 8px; height: 8px; border-radius: 999px;
          background: linear-gradient(135deg, #ff5f6d, #7a5cff);
        }
        [data-visible="true"] .sh-eyebrow {
          opacity: 1; transform: translateY(0);
        }
        .sh-row {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: clamp(16px, 3vw, 40px);
          flex-wrap: nowrap;
          width: 100%;
        }
        .sh-word {
          font-family: inherit;
          font-weight: 800;
          font-size: clamp(56px, 12vw, 180px);
          line-height: 0.9;
          letter-spacing: -0.04em;
          white-space: nowrap;
          opacity: 0;
          transition: opacity .9s ease, transform .9s cubic-bezier(.2,.7,.2,1);
          will-change: opacity, transform;
        }
        .sh-word--say {
          color: #0a0a0a;
          transform: translateX(-32px);
        }
        .sh-word--hello {
          background: linear-gradient(135deg, #ff5f6d 0%, #ffc371 35%, #47d4ff 70%, #7a5cff 100%);
          -webkit-background-clip: text;
          background-clip: text;
          color: transparent;
          transform: translateX(32px);
          transition-delay: .12s;
        }
        [data-visible="true"] .sh-word {
          opacity: 1;
          transform: translateX(0);
        }
        .sh-media {
          position: relative;
          flex: 0 0 auto;
          width: clamp(120px, 18vw, 240px);
          aspect-ratio: 1 / 1;
          border-radius: 999px;
          overflow: hidden;
          box-shadow: 0 24px 60px -28px rgba(10,10,10,.35);
        }
        .sh-media__ring {
          position: absolute; inset: -2px;
          border-radius: inherit;
          padding: 2px;
          background: conic-gradient(from 0deg, #ff5f6d, #ffc371, #47d4ff, #7a5cff, #ff5f6d);
          -webkit-mask: linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0);
          -webkit-mask-composite: xor;
                  mask-composite: exclude;
          animation: sh-spin 10s linear infinite;
          pointer-events: none;
          z-index: 2;
        }
        @keyframes sh-spin { to { transform: rotate(360deg); } }
        .sh-media__reveal {
          position: absolute; inset: 0;
          overflow: hidden;
          border-radius: inherit;
        }
        .sh-media__reveal::after {
          content: "";
          position: absolute; inset: 0;
          background: #0a0a0a;
          transform: translateY(0);
          transition: transform 1.1s cubic-bezier(.77,0,.18,1) .2s;
          z-index: 1;
        }
        [data-visible="true"] .sh-media__reveal::after {
          transform: translateY(-101%);
        }
        .sh-media__reveal img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transform: scale(1.12);
          transition: transform 1.6s cubic-bezier(.2,.7,.2,1) .35s;
          display: block;
        }
        [data-visible="true"] .sh-media__reveal img {
          transform: scale(1);
        }
        .sh-tagline {
          font-size: clamp(15px, 1.4vw, 20px);
          line-height: 1.5;
          color: #555;
          max-width: 560px;
          margin: 0;
          opacity: 0;
          transform: translateY(16px);
          transition: opacity .8s ease .4s, transform .8s ease .4s;
        }
        [data-visible="true"] .sh-tagline {
          opacity: 1; transform: translateY(0);
        }
        @media (max-width: 640px) {
          .sh-row { gap: 10px; }
          .sh-media { width: 22vw; min-width: 96px; }
        }
        @media (prefers-reduced-motion: reduce) {
          .sh-word, .sh-tagline, .sh-eyebrow, .sh-media__reveal img {
            transition: none;
            opacity: 1;
            transform: none;
          }
          .sh-media__reveal::after { display: none; }
          .sh-media__ring { animation: none; }
        }
      `}</style>
    </section>
  );
}
