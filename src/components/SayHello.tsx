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
      className="say-hello"
    >
      <div className="say-hello__inner">
        <div className="say-hello__row">
          <span className="say-hello__word say-hello__word--say">SAY</span>
          <div className="say-hello__media">
            <div className="say-hello__reveal">
              <img
                src={meAsset.url}
                alt="Usman Jatoi waving hello"
                width={540}
                height={540}
                loading="lazy"
                decoding="async"
              />
            </div>
          </div>
          <span className="say-hello__word say-hello__word--hello">Hello</span>
        </div>
        <p className="say-hello__tagline">
          Let&rsquo;s create something that fits &mdash; and scales.
        </p>
      </div>

      <style>{`
        .say-hello {
          position: relative;
          width: 100%;
          padding: clamp(48px, 9vw, 140px) clamp(20px, 5vw, 80px);
          background: #fff;
          color: #0a0a0a;
          overflow: hidden;
        }
        .say-hello__inner {
          max-width: 1400px;
          margin: 0 auto;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: clamp(24px, 4vw, 48px);
        }
        .say-hello__row {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: clamp(12px, 3vw, 40px);
          flex-wrap: wrap;
          width: 100%;
        }
        .say-hello__word {
          font-family: inherit;
          font-weight: 800;
          font-size: clamp(64px, 14vw, 220px);
          line-height: 0.9;
          letter-spacing: -0.04em;
          background: linear-gradient(135deg, #0a0a0a 0%, #444 100%);
          -webkit-background-clip: text;
          background-clip: text;
          color: transparent;
          opacity: 0;
          transform: translateX(-40px);
          transition: opacity .9s ease, transform .9s cubic-bezier(.2,.7,.2,1);
        }
        .say-hello__word--hello {
          transform: translateX(40px);
          background: linear-gradient(135deg, #ff5f6d, #ffc371, #47d4ff, #7a5cff);
          -webkit-background-clip: text;
          background-clip: text;
          color: transparent;
          transition-delay: .15s;
        }
        [data-visible="true"] .say-hello__word {
          opacity: 1;
          transform: translateX(0);
        }
        .say-hello__media {
          position: relative;
          width: clamp(140px, 22vw, 320px);
          aspect-ratio: 1 / 1;
          border-radius: 999px;
          overflow: hidden;
          box-shadow: 0 30px 80px -30px rgba(0,0,0,.35);
        }
        .say-hello__media::before {
          content: "";
          position: absolute; inset: -3px;
          border-radius: inherit;
          padding: 3px;
          background: conic-gradient(from 0deg, #ff5f6d, #ffc371, #47d4ff, #7a5cff, #ff5f6d);
          -webkit-mask: linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0);
          -webkit-mask-composite: xor;
                  mask-composite: exclude;
          animation: sh-spin 8s linear infinite;
          z-index: 2;
          pointer-events: none;
        }
        @keyframes sh-spin { to { transform: rotate(360deg); } }
        .say-hello__reveal {
          position: absolute; inset: 0;
          overflow: hidden;
          border-radius: inherit;
        }
        .say-hello__reveal::after {
          content: "";
          position: absolute; inset: 0;
          background: #0a0a0a;
          transform: translateY(0);
          transition: transform 1.1s cubic-bezier(.77,0,.18,1) .2s;
          z-index: 1;
        }
        [data-visible="true"] .say-hello__reveal::after {
          transform: translateY(-101%);
        }
        .say-hello__reveal img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transform: scale(1.15);
          transition: transform 1.6s cubic-bezier(.2,.7,.2,1) .4s;
          display: block;
        }
        [data-visible="true"] .say-hello__reveal img {
          transform: scale(1);
        }
        .say-hello__tagline {
          font-size: clamp(16px, 1.6vw, 22px);
          color: #444;
          text-align: center;
          max-width: 640px;
          margin: 0;
          opacity: 0;
          transform: translateY(20px);
          transition: opacity .8s ease .5s, transform .8s ease .5s;
        }
        [data-visible="true"] .say-hello__tagline {
          opacity: 1; transform: translateY(0);
        }
        @media (max-width: 640px) {
          .say-hello__row { gap: 8px; }
          .say-hello__media { width: 44vw; }
        }
        @media (prefers-reduced-motion: reduce) {
          .say-hello__word, .say-hello__tagline, .say-hello__reveal img { transition: none; }
          .say-hello__reveal::after { display: none; }
          .say-hello__media::before { animation: none; }
        }
      `}</style>
    </section>
  );
}
