import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { playSelectSound, playClickSound } from "./utils/audio.js";

const PROJECTS = [
  {
    id: "afrocarib",
    badge: "I",
    title: "LESPAGESAFROCARIB",
    subtitle: "Next.js / Node.js",
    status: "LIVE",
    year: "2025",
    tech: ["Next.js", "Node.js", "REST API"],
    desc: [
      "- Directory for Afro-descendant businesses & freelancers.",
      "- Full-stack web app with custom backend.",
      "- Search, listings & profile management.",
    ],
    link: "https://lespagesafrocarib.com",
    linkLabel: "lespagesafrocarib.com",
  },
  {
    id: "haiken",
    badge: "II",
    title: "HAIKEN",
    subtitle: "React Native / Symfony",
    status: "LIVE",
    year: "2026",
    tech: ["React Native", "Symfony", "REST API"],
    desc: [
      "- Mobile app for managing spontaneous job applications.",
      "- Full application lifecycle tracking.",
      "- Symfony backend with React Native frontend.",
    ],
    link: null,
    linkLabel: null,
    noLinkMsg: "— Coming soon to stores —",
  },
  {
    id: "david",
    badge: "III",
    title: "DAVID ABITBOL",
    subtitle: "Web & Mobile",
    status: "LIVE",
    year: "2026",
    tech: ["React", "React Native", "Node.js"],
    desc: [
      "- Showcase website & mobile app for a tea salon.",
      "- Click & collect, reservation system.",
      "- Real-time crowd management feature.",
    ],
    link: "https://davidabitbol.vercel.app",
    linkLabel: "davidabitbol.vercel.app",
  },
  {
    id: "blackbeauty",
    badge: "IV",
    title: "BLACK BEAUTY",
    subtitle: "Vite / GSAP",
    status: "LIVE",
    year: "2026",
    tech: ["Vite", "GSAP", "ScrollTrigger"],
    desc: [
      "- E-commerce for a clothing brand.",
      "- Immersive scroll animations with GSAP ScrollTrigger.",
      "- High-performance storefront built with Vite.",
    ],
    link: "https://blackbeauty.vercel.app",
    linkLabel: "blackbeauty.vercel.app",
  },
];

export default function SideProjects() {
  const navigate = useNavigate();
  const [active, setActive] = useState(0);
  const [mounted, setMounted] = useState(false);
  const isFirstRenderAudio = useRef(true);
  const isClickRef = useRef(false);

  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 80);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    if (isFirstRenderAudio.current) {
      isFirstRenderAudio.current = false;
      return;
    }
    if (isClickRef.current) {
      isClickRef.current = false;
      return;
    }
    playSelectSound();
  }, [active]);

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "ArrowUp") setActive((i) => Math.max(0, i - 1));
      if (e.key === "ArrowDown") setActive((i) => Math.min(PROJECTS.length - 1, i + 1));
      if (e.key === "ArrowLeft" || e.key === "Escape" || e.key === "Backspace") navigate(-1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [navigate]);

  const proj = PROJECTS[active];

  return (
    <div className="sp-screen">
      <div style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.55)" }} />

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Anton&family=Bebas+Neue&display=swap');

        .sp-screen {
          position: relative;
          width: 100vw;
          height: 100vh;
          overflow: hidden;
        }

        .sp-overlay {
          position: absolute;
          inset: 0;
          z-index: 10;
          pointer-events: none;
        }

        /* ── Left stack ── */
        .sp-stack {
          position: absolute;
          top: 9vh;
          left: 2.8vw;
          width: min(47vw, 720px);
          display: flex;
          flex-direction: column;
          gap: 10px;
          pointer-events: none;
          transform: scale(0.9);
          transform-origin: top left;
        }

        .sp-list-tag {
          font-family: 'Anton', sans-serif;
          font-size: 92px;
          line-height: 0.9;
          color: #f6fbff;
          letter-spacing: 2px;
          margin: 0 0 6px 12px;
          text-shadow: 0 2px 0 rgba(0,0,0,0.18);
          opacity: 0;
          transform: translateX(-24px);
          transition: opacity 0.35s ease, transform 0.35s ease;
        }
        .sp-list-tag.mounted {
          opacity: 1;
          transform: translateX(0);
        }

        .sp-card-wrap {
          position: relative;
          opacity: 0;
          transform: translateX(-48px);
          transition: opacity 0.4s ease, transform 0.4s cubic-bezier(0.22, 1, 0.36, 1);
          pointer-events: all;
          cursor: pointer;
        }
        .sp-card-wrap.mounted {
          opacity: 1;
          transform: translateX(0);
        }

        .sp-card {
          position: relative;
          height: 112px;
          background: #3d1200;
          clip-path: polygon(0 0, 97% 0, 100% 100%, 3% 100%);
          box-shadow: 0 8px 0 rgba(5, 13, 59, 0.85);
          transition: transform 0.22s ease, background 0.22s ease, box-shadow 0.22s ease;
          overflow: visible;
        }
        .sp-card-wrap.active .sp-card {
          background: #ffffff;
          box-shadow: 10px 8px 0 #db3400;
          transform: translateX(6px);
        }

        .sp-card-inner {
          position: absolute;
          inset: 0;
          padding: 14px 22px 14px 62px;
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
        }

        .sp-badge {
          position: absolute;
          top: 10px;
          left: -10px;
          width: 56px;
          height: 70px;
          background: #1a0800;
          border: 3px solid #efb85d;
          clip-path: polygon(14% 0, 100% 0, 84% 100%, 0 100%);
          display: flex;
          align-items: center;
          justify-content: center;
          transform: rotate(-8deg);
          box-shadow: 0 4px 0 rgba(0,0,0,0.28);
          transition: background 0.22s ease, border-color 0.22s ease;
        }
        .sp-badge-text {
          font-family: 'Bebas Neue', sans-serif;
          font-size: 36px;
          color: #fee19b;
          letter-spacing: 1px;
          transform: rotate(8deg);
        }
        .sp-card-wrap.active .sp-badge {
          background: #000;
          border-color: #000;
        }
        .sp-card-wrap.active .sp-badge-text {
          color: #fff;
        }

        .sp-title {
          font-family: 'Anton', sans-serif;
          font-size: 52px;
          line-height: 0.9;
          letter-spacing: 1px;
          color: #efb85d;
          transition: color 0.22s ease;
        }
        .sp-card-wrap.active .sp-title {
          color: #000;
        }

        .sp-year {
          display: flex;
          align-items: center;
          gap: 10px;
          margin-top: 2px;
          flex-shrink: 0;
        }
        .sp-year-label {
          font-family: 'Bebas Neue', sans-serif;
          font-size: 16px;
          letter-spacing: 2px;
          color: #f27638;
          transition: color 0.22s ease;
        }
        .sp-year-number {
          font-family: 'Anton', sans-serif;
          font-size: 38px;
          line-height: 0.9;
          color: #f27638;
          transition: color 0.22s ease;
        }
        .sp-card-wrap.active .sp-year-label,
        .sp-card-wrap.active .sp-year-number {
          color: #000;
        }

        .sp-subtitle-bar {
          position: absolute;
          left: 64px;
          right: 14px;
          bottom: 12px;
          height: 34px;
          background: #f27638;
          clip-path: polygon(0 0, 100% 0, calc(100% - 10px) 100%, 0 100%);
          display: flex;
          align-items: center;
          padding: 0 18px;
          transition: background 0.22s ease;
        }
        .sp-card-wrap.active .sp-subtitle-bar {
          background: #000;
        }

        .sp-subtitle {
          font-family: 'Bebas Neue', sans-serif;
          font-size: 28px;
          line-height: 1;
          letter-spacing: 1px;
          color: #2a0d00;
          transition: color 0.22s ease;
        }
        .sp-card-wrap.active .sp-subtitle {
          color: #fff;
        }

        /* ── Right detail panel ── */
        .sp-detail-panel {
          position: absolute;
          top: 9.5vh;
          right: 4.5vw;
          width: min(39vw, 620px);
          min-height: 74vh;
          z-index: 12;
          padding: 0 0 24px 0;
          background: linear-gradient(180deg, rgba(61, 18, 0, 0.96) 0%, rgba(26, 8, 0, 0.97) 100%);
          clip-path: polygon(0 0, 100% 0, calc(100% - 18px) 100%, 0 100%);
          box-shadow:
            inset 0 0 0 1px rgba(242, 118, 56, 0.18),
            16px 16px 0 rgba(10, 0, 0, 0.55);
          overflow: hidden;
        }
        .sp-detail-panel::before {
          content: "";
          position: absolute;
          inset: 0;
          background:
            linear-gradient(135deg, rgba(242, 118, 56, 0.08) 0 15%, transparent 15% 100%),
            linear-gradient(180deg, rgba(255,255,255,0.04), transparent 24%);
          pointer-events: none;
        }

        /* header bar */
        .sp-detail-top {
          position: relative;
          display: grid;
          grid-template-columns: 70px 1fr auto;
          align-items: center;
          gap: 14px;
          min-height: 92px;
          padding: 0 18px;
          background: linear-gradient(90deg, #f27638 0%, #fee19b 100%);
          clip-path: polygon(0 0, 100% 0, calc(100% - 16px) 100%, 0 100%);
          color: #1a0800;
          box-shadow: 10px 0 0 rgba(255, 94, 136, 0.88);
        }
        .sp-detail-top-index {
          font-family: 'Anton', sans-serif;
          font-size: 46px;
          line-height: 1;
        }
        .sp-detail-top-title {
          font-family: 'Anton', sans-serif;
          font-size: 42px;
          line-height: 0.92;
          letter-spacing: 1px;
        }
        .sp-detail-top-status {
          font-family: 'Bebas Neue', sans-serif;
          font-size: 32px;
          letter-spacing: 2px;
          line-height: 1;
        }

        /* tech tags row */
        .sp-tech-row {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
          margin: 16px 24px 0 24px;
        }
        .sp-tech-tag {
          font-family: 'Bebas Neue', sans-serif;
          font-size: 18px;
          letter-spacing: 1.5px;
          color: #1a0800;
          background: #efb85d;
          padding: 5px 12px;
          clip-path: polygon(0 0, 100% 0, calc(100% - 8px) 100%, 0 100%);
          line-height: 1;
        }

        /* description */
        .sp-detail-desc {
          position: relative;
          margin: 16px 24px 0 24px;
          padding: 18px;
          background: rgba(40, 12, 0, 0.96);
          clip-path: polygon(0 0, 100% 0, calc(100% - 14px) 100%, 0 100%);
          box-shadow: inset 0 0 0 1px rgba(239, 184, 93, 0.12);
        }
        .sp-detail-desc-title {
          font-family: 'Bebas Neue', sans-serif;
          font-size: 26px;
          letter-spacing: 2px;
          color: #efb85d;
          margin-bottom: 12px;
        }
        .sp-detail-desc-line {
          font-family: 'Anton', sans-serif;
          font-size: 20px;
          line-height: 1.3;
          color: #fee19b;
          margin-bottom: 4px;
        }

        /* link button */
        .sp-detail-link-wrap {
          margin: 14px 24px 0 24px;
        }
        .sp-detail-link {
          display: inline-flex;
          align-items: center;
          gap: 10px;
          font-family: 'Bebas Neue', sans-serif;
          font-size: 24px;
          letter-spacing: 2px;
          color: #1a0800;
          background: #db3400;
          padding: 10px 20px;
          clip-path: polygon(0 0, 100% 0, calc(100% - 12px) 100%, 0 100%);
          text-decoration: none;
          transition: background 0.18s ease, color 0.18s ease;
          pointer-events: all;
          cursor: pointer;
        }
        .sp-detail-link:hover {
          background: #f27638;
          color: #000;
        }
        .sp-detail-no-link {
          font-family: 'Bebas Neue', sans-serif;
          font-size: 22px;
          letter-spacing: 2px;
          color: rgba(239, 184, 93, 0.35);
          padding: 10px 0;
        }

        /* footer hints */
        .sp-footer {
          position: fixed;
          bottom: 20px;
          right: 28px;
          display: flex;
          flex-direction: column;
          align-items: flex-end;
          gap: 5px;
          font-family: 'Bebas Neue', sans-serif;
          z-index: 14;
          opacity: 0;
          transition: opacity 0.4s ease 0.6s;
          pointer-events: none;
        }
        .sp-footer.mounted { opacity: 1; }
        .sp-footer-row {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 13px;
          letter-spacing: 2px;
          color: rgba(255,255,255,0.22);
        }
        .sp-footer-key {
          border: 1px solid rgba(255,255,255,0.15);
          border-radius: 3px;
          padding: 1px 6px;
          font-size: 11px;
        }

        /* right stripe accent */
        .sp-stripe  { position: absolute; right: 0; top: 0; bottom: 0; width: 5px; background: #db3400; z-index: 15; pointer-events: none; }
        .sp-stripe2 { position: absolute; right: 9px; top: 0; bottom: 0; width: 2px; background: rgba(242,118,56,0.22); z-index: 15; pointer-events: none; }

        @media (max-width: 1280px) {
          .sp-detail-panel {
            max-height: calc(100vh - 9.5vh - 2vh);
            overflow-y: auto;
          }
        }

        @media (max-width: 900px) {
          .sp-screen { height: auto !important; min-height: 100vh; overflow-y: auto !important; }
          .sideproj-bg-video { position: fixed !important; height: 100vh !important; }
          .sp-overlay {
            position: relative !important;
            inset: auto !important;
            display: flex !important;
            flex-direction: column;
            gap: 20px;
            padding: 16px 12px 48px;
          }
          .sp-stack {
            position: relative !important;
            top: auto !important; left: auto !important;
            width: 100% !important;
            transform: none !important;
          }
          .sp-list-tag { font-size: 64px; margin-left: 6px; }
          .sp-card { height: 90px; }
          .sp-card-wrap.active .sp-card { transform: translateX(4px); }
          .sp-title { font-size: 34px; }
          .sp-badge { width: 44px; height: 56px; left: -8px; }
          .sp-badge-text { font-size: 26px; }
          .sp-subtitle { font-size: 22px; }
          .sp-year-number { font-size: 30px; }
          .sp-year-label { font-size: 13px; }
          .sp-detail-panel {
            position: relative !important;
            top: auto !important; right: auto !important;
            width: 100% !important;
            min-height: auto !important;
          }
          .sp-detail-top { min-height: 72px; }
          .sp-detail-top-title { font-size: 30px; }
          .sp-detail-top-index { font-size: 36px; }
          .sp-detail-top-status { font-size: 26px; }
          .sp-detail-desc-line { font-size: 17px; }
          .sp-stripe, .sp-stripe2 { display: none; }
          .sp-footer { bottom: 10px; right: 12px; }
        }
        @media (max-width: 480px) {
          .sp-list-tag { font-size: 48px; }
          .sp-title { font-size: 26px; }
          .sp-card { height: 78px; }
          .sp-detail-top-title { font-size: 22px; }
          .sp-detail-desc-line { font-size: 15px; }
          .sp-tech-tag { font-size: 14px; }
        }
      `}</style>

      <div className="sp-overlay">
        <div className="sp-stripe" />
        <div className="sp-stripe2" />

        {/* Left stack */}
        <div className="sp-stack">
          <div className={`sp-list-tag${mounted ? " mounted" : ""}`}>WORKS</div>
          {PROJECTS.map((item, index) => (
            <div
              key={item.id}
              className={`sp-card-wrap${active === index ? " active" : ""}${mounted ? " mounted" : ""}`}
              style={{ transitionDelay: `${index * 55}ms` }}
              onMouseEnter={() => setActive(index)}
              onClick={() => {
                isClickRef.current = true;
                setActive(index);
                playClickSound();
              }}
            >
              <div className="sp-card">
                <div className="sp-badge">
                  <div className="sp-badge-text">{item.badge}</div>
                </div>
                <div className="sp-card-inner">
                  <div className="sp-title">{item.title}</div>
                  <div className="sp-year">
                    <div className="sp-year-label">YR</div>
                    <div className="sp-year-number">{item.year}</div>
                  </div>
                </div>
                <div className="sp-subtitle-bar">
                  <div className="sp-subtitle">{item.subtitle}</div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Right detail panel */}
        <div className="sp-detail-panel">
          <div className="sp-detail-top">
            <div className="sp-detail-top-index">0{active + 1}</div>
            <div className="sp-detail-top-title">{proj.title}</div>
            <div className="sp-detail-top-status">{proj.status}</div>
          </div>

          <div className="sp-tech-row">
            {proj.tech.map((t) => (
              <span className="sp-tech-tag" key={t}>{t}</span>
            ))}
          </div>

          <div className="sp-detail-desc">
            <div className="sp-detail-desc-title">OVERVIEW</div>
            {proj.desc.map((line, i) => (
              <div className="sp-detail-desc-line" key={i}>{line}</div>
            ))}
          </div>

          <div className="sp-detail-link-wrap">
            {proj.link ? (
              <a className="sp-detail-link" href={proj.link} target="_blank" rel="noreferrer">
                {proj.linkLabel} ›
              </a>
            ) : (
              <div className="sp-detail-no-link">{proj.noLinkMsg ?? "— NOT YET RELEASED —"}</div>
            )}
          </div>
        </div>

        {/* Footer hints */}
        <div className={`sp-footer${mounted ? " mounted" : ""}`}>
          <div className="sp-footer-row"><span className="sp-footer-key">↑↓</span><span>SELECT</span></div>
          <div className="sp-footer-row"><span className="sp-footer-key">ESC</span><span>BACK</span></div>
        </div>
      </div>
    </div>
  );
}
