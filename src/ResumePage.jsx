import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { playSelectSound, playClickSound } from "./utils/audio.js";

const ITEMS = [
  { id: "i", badge: "I", title: "EDUCATION", subtitle: "University / Coursework", rank: 3 },
  { id: "ii", badge: "II", title: "SKILLS", subtitle: "Frontend / Design / UI", rank: 4 },
  { id: "iii", badge: "III", title: "PROJECTS", subtitle: "Featured Work", rank: 5 },
  { id: "iv", badge: "IV", title: "EXPERIENCE", subtitle: "Internships / Roles", rank: 2 },
];

const EDUCATION_ROWS = [
  { index: "01", title: "High School — CS & Biology", status: "Complete" },
  { index: "02", title: "Cybersecurity & CS Prep", status: "Complete" },
  { index: "03", title: "App Developer — Bac+3", status: "In Progress" },
  { index: "04", title: "Master Project Mgmt — Bac+5", status: "Queued" },
];

const SKILLS_ROWS = [
  { index: "01", title: "React / Vite", status: "Proficient" },
  { index: "02", title: "JavaScript / TypeScript", status: "Proficient" },
  { index: "03", title: "CSS / Animation", status: "Proficient" },
  { index: "04", title: "Python", status: "Familiar" },
  { index: "05", title: "UI / UX Design", status: "Familiar" },
];

const PROJECTS_ROWS = [
  { index: "01", title: "LESPAGESAFROCARIB", status: "Live" },
  { index: "02", title: "HAIKEN", status: "Live" },
  { index: "03", title: "David Abitbol", status: "Live" },
  { index: "04", title: "Black Beauty", status: "Live" },
];

const EXPERIENCE_ROWS = [
  { index: "01", title: "Axone Conseils — Internship", status: "Active" },
  { index: "02", title: "Ambriel — Freelance", status: "Active" },
  { index: "03", title: "LespagesAfroCarib — Internship", status: "Complete" },
];

export default function ResumePage({ src }) {
  const navigate = useNavigate();
  const [active, setActive] = useState(1);
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
      if (e.key === "ArrowDown") setActive((i) => Math.min(ITEMS.length - 1, i + 1));
      if (e.key === "ArrowLeft") navigate(-1);
      if (e.key === "Escape" || e.key === "Backspace") navigate(-1);
    };

    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [navigate]);

  return (
    <div id="menu-screen" className="resume-screen">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Anton&family=Bebas+Neue&display=swap');

        .resume-overlay {
          position: absolute;
          inset: 0;
          z-index: 10;
          pointer-events: none;
        }

        .resume-stack {
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

        .resume-list-tag {
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
        .resume-list-tag.mounted {
          opacity: 1;
          transform: translateX(0);
        }

        .resume-card-wrap {
          position: relative;
          opacity: 0;
          transform: translateX(-48px);
          transition: opacity 0.4s ease, transform 0.4s cubic-bezier(0.22, 1, 0.36, 1);
          pointer-events: all;
          cursor: pointer;
        }
        .resume-card-wrap.mounted {
          opacity: 1;
          transform: translateX(0);
        }

        .resume-card {
          position: relative;
          height: 112px;
          background: #3d1200;
          clip-path: polygon(0 0, 97% 0, 100% 100%, 3% 100%);
          box-shadow: 0 8px 0 rgba(5, 13, 59, 0.85);
          transition: transform 0.22s ease, background 0.22s ease, box-shadow 0.22s ease;
          overflow: visible;
        }
        .resume-card-wrap.active .resume-card {
          background: #ffffff;
          box-shadow: 10px 8px 0 #db3400;
          transform: translateX(6px);
        }

        .resume-card-inner {
          position: absolute;
          inset: 0;
          padding: 14px 22px 14px 62px;
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
        }

        .resume-badge {
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
        .resume-badge-text {
          font-family: 'Bebas Neue', sans-serif;
          font-size: 36px;
          color: #fee19b;
          letter-spacing: 1px;
          transform: rotate(8deg);
        }
        .resume-card-wrap.active .resume-badge {
          background: #000;
          border-color: #000;
        }
        .resume-card-wrap.active .resume-badge-text {
          color: #fff;
        }

        .resume-title {
          font-family: 'Anton', sans-serif;
          font-size: 56px;
          line-height: 0.9;
          letter-spacing: 1px;
          color: #efb85d;
          transition: color 0.22s ease;
        }
        .resume-card-wrap.active .resume-title {
          color: #000;
        }

        .resume-rank {
          display: flex;
          align-items: center;
          gap: 10px;
          margin-top: 2px;
          flex-shrink: 0;
        }
        .resume-rank-label {
          font-family: 'Bebas Neue', sans-serif;
          font-size: 28px;
          letter-spacing: 2px;
          color: #f27638;
          transition: color 0.22s ease;
        }
        .resume-rank-number {
          font-family: 'Anton', sans-serif;
          font-size: 70px;
          line-height: 0.82;
          color: #f27638;
          transition: color 0.22s ease;
        }
        .resume-card-wrap.active .resume-rank-label,
        .resume-card-wrap.active .resume-rank-number {
          color: #000;
        }

        .resume-subtitle-bar {
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
        .resume-card-wrap.active .resume-subtitle-bar {
          background: #000;
        }

        .resume-subtitle {
          font-family: 'Bebas Neue', sans-serif;
          font-size: 28px;
          line-height: 1;
          letter-spacing: 1px;
          color: #2a0d00;
          transition: color 0.22s ease;
        }
        .resume-card-wrap.active .resume-subtitle {
          color: #fff;
        }

        .resume-detail-panel {
          position: absolute;
          top: 9.5vh;
          right: 4.5vw;
          width: min(39vw, 620px);
          min-height: 74vh;
          z-index: 12;
          padding: 22px 24px 24px 24px;
          background: linear-gradient(180deg, rgba(61, 18, 0, 0.96) 0%, rgba(26, 8, 0, 0.97) 100%);
          clip-path: polygon(0 0, 100% 0, calc(100% - 18px) 100%, 0 100%);
          box-shadow:
            inset 0 0 0 1px rgba(242, 118, 56, 0.18),
            16px 16px 0 rgba(10, 0, 0, 0.55);
          overflow: hidden;
        }
        .resume-detail-panel::before {
          content: "";
          position: absolute;
          inset: 0;
          background:
            linear-gradient(135deg, rgba(242, 118, 56, 0.08) 0 15%, transparent 15% 100%),
            linear-gradient(180deg, rgba(255,255,255,0.04), transparent 24%);
          pointer-events: none;
        }
        .resume-detail-top {
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
        .resume-detail-top-index {
          font-family: 'Anton', sans-serif;
          font-size: 46px;
          line-height: 1;
        }
        .resume-detail-top-title {
          font-family: 'Anton', sans-serif;
          font-size: 42px;
          line-height: 0.92;
          letter-spacing: 1px;
        }
        .resume-detail-top-progress {
          font-family: 'Bebas Neue', sans-serif;
          font-size: 42px;
          letter-spacing: 2px;
          line-height: 1;
        }
        .resume-detail-list {
          position: relative;
          display: flex;
          flex-direction: column;
          gap: 10px;
          margin-top: 18px;
        }
        .resume-detail-row {
          display: grid;
          grid-template-columns: 50px 1fr auto;
          align-items: center;
          gap: 14px;
          min-height: 56px;
          padding: 0 14px;
          background: rgba(40, 12, 0, 0.96);
          clip-path: polygon(0 0, 100% 0, calc(100% - 14px) 100%, 0 100%);
          box-shadow: inset 0 0 0 1px rgba(239, 184, 93, 0.12);
          transition: transform 0.16s ease, background 0.16s ease;
        }
        .resume-detail-row:hover {
          transform: translateX(4px);
          background: rgba(55, 17, 0, 1);
        }
        .resume-detail-row-index {
          font-family: 'Bebas Neue', sans-serif;
          font-size: 26px;
          letter-spacing: 1px;
          color: #efb85d;
        }
        .resume-detail-row-title {
          font-family: 'Anton', sans-serif;
          font-size: 28px;
          line-height: 1;
          color: #fee19b;
        }
        .resume-detail-status {
          font-family: 'Bebas Neue', sans-serif;
          font-size: 22px;
          line-height: 1;
          letter-spacing: 1.1px;
          color: #1a0800;
          background: #fee19b;
          padding: 7px 12px;
          clip-path: polygon(0 0, 100% 0, calc(100% - 8px) 100%, 0 100%);
        }
        .resume-detail-bottom {
          position: relative;
          margin-top: 22px;
          padding: 18px;
          background: rgba(26, 8, 0, 0.97);
          clip-path: polygon(0 0, 100% 0, calc(100% - 16px) 100%, 0 100%);
          box-shadow: inset 0 0 0 1px rgba(239, 184, 93, 0.12);
        }
        .resume-detail-bottom-title {
          font-family: 'Bebas Neue', sans-serif;
          font-size: 30px;
          letter-spacing: 2px;
          color: #efb85d;
          margin-bottom: 14px;
        }
        .resume-detail-bullets {
          display: flex;
          flex-direction: column;
          gap: 10px;
        }
        .resume-detail-bullet {
          font-family: 'Anton', sans-serif;
          font-size: 21px;
          line-height: 1.15;
          color: #fee19b;
        }

        @media (max-width: 1280px) {
          .resume-detail-panel {
            max-height: calc(100vh - 9.5vh - 2vh);
            overflow-y: auto;
          }
        }

        @media (max-width: 900px) {
          .resume-screen { overflow-y: auto; height: auto; min-height: 100vh; }
          .resume-entry-mask { position: fixed !important; }
          .resume-entry-video { position: fixed !important; }
          .resume-overlay {
            position: relative !important;
            inset: auto !important;
            display: flex !important;
            flex-direction: column;
            gap: 20px;
            padding: 16px 12px 48px;
          }
          .resume-stack {
            position: relative !important;
            top: auto !important; left: auto !important;
            width: 100% !important;
            transform: none !important;
          }
          .resume-list-tag { font-size: 64px; margin-left: 6px; }
          .resume-card { height: 90px; }
          .resume-card-wrap.active .resume-card { transform: translateX(4px); }
          .resume-title { font-size: 36px; }
          .resume-badge { width: 44px; height: 56px; left: -8px; }
          .resume-badge-text { font-size: 26px; }
          .resume-subtitle { font-size: 22px; }
          .resume-rank-number { font-size: 54px; }
          .resume-detail-panel {
            position: relative !important;
            top: auto !important; right: auto !important;
            width: 100% !important;
            min-height: auto !important;
          }
          .resume-detail-top { min-height: 72px; }
          .resume-detail-top-title { font-size: 32px; }
          .resume-detail-top-index { font-size: 36px; }
          .resume-detail-top-progress { font-size: 34px; }
          .resume-detail-row-title { font-size: 22px; }
          .resume-detail-bullet { font-size: 17px; }
        }
        @media (max-width: 480px) {
          .resume-list-tag { font-size: 48px; }
          .resume-title { font-size: 28px; }
          .resume-card { height: 78px; }
          .resume-detail-top-title { font-size: 24px; }
          .resume-detail-row-title { font-size: 18px; }
          .resume-detail-bullet { font-size: 15px; }
        }
      `}</style>

      <div className="resume-overlay">
        <div className="resume-stack">
          <div className={`resume-list-tag${mounted ? " mounted" : ""}`}>LIST</div>
          {ITEMS.map((item, index) => (
            <div
              key={item.id}
              className={`resume-card-wrap${active === index ? " active" : ""}${mounted ? " mounted" : ""}`}
              style={{ transitionDelay: `${index * 55}ms` }}
              onMouseEnter={() => {
                setActive(index);
              }}
              onClick={() => {
                isClickRef.current = true;
                setActive(index);
                playClickSound();
              }}
            >
              <div className="resume-card">
                <div className="resume-badge">
                  <div className="resume-badge-text">{item.badge}</div>
                </div>
                <div className="resume-card-inner">
                  <div className="resume-title">{item.title}</div>
                  <div className="resume-rank">
                    <div className="resume-rank-label">RANK</div>
                    <div className="resume-rank-number">{item.rank}</div>
                  </div>
                </div>
                <div className="resume-subtitle-bar">
                  <div className="resume-subtitle">{item.subtitle}</div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {active === 0 && (
          <div className="resume-detail-panel">
            <div className="resume-detail-top">
              <div className="resume-detail-top-index">01</div>
              <div className="resume-detail-top-title">EDUCATION LOG</div>
              <div className="resume-detail-top-progress">7/5</div>
            </div>
            <div className="resume-detail-list">
              {EDUCATION_ROWS.map((row) => (
                <div className="resume-detail-row" key={row.index}>
                  <div className="resume-detail-row-index">{row.index}</div>
                  <div className="resume-detail-row-title">{row.title}</div>
                  <div className="resume-detail-status">{row.status}</div>
                </div>
              ))}
            </div>
            <div className="resume-detail-bottom">
              <div className="resume-detail-bottom-title">DETAILS</div>
              <div className="resume-detail-bullets">
                <div className="resume-detail-bullet">- CS track from high school to master's level.</div>
                <div className="resume-detail-bullet">- Specializing in app development & project management.</div>
                <div className="resume-detail-bullet">- Targeting entrepreneurship alongside technical skills.</div>
              </div>
            </div>
          </div>
        )}

        {active === 1 && (
          <div className="resume-detail-panel">
            <div className="resume-detail-top">
              <div className="resume-detail-top-index">02</div>
              <div className="resume-detail-top-title">SKILLS LOG</div>
              <div className="resume-detail-top-progress">5/5</div>
            </div>
            <div className="resume-detail-list">
              {SKILLS_ROWS.map((row) => (
                <div className="resume-detail-row" key={row.index}>
                  <div className="resume-detail-row-index">{row.index}</div>
                  <div className="resume-detail-row-title">{row.title}</div>
                  <div className="resume-detail-status">{row.status}</div>
                </div>
              ))}
            </div>
            <div className="resume-detail-bottom">
              <div className="resume-detail-bottom-title">DETAILS</div>
              <div className="resume-detail-bullets">
                <div className="resume-detail-bullet">- Focused on frontend development and interactive UI.</div>
                <div className="resume-detail-bullet">- Strong emphasis on motion design and visual polish.</div>
                <div className="resume-detail-bullet">- Continuously expanding stack with new tools and frameworks.</div>
              </div>
            </div>
          </div>
        )}

        {active === 2 && (
          <div className="resume-detail-panel">
            <div className="resume-detail-top">
              <div className="resume-detail-top-index">03</div>
              <div className="resume-detail-top-title">PROJECTS LOG</div>
              <div className="resume-detail-top-progress">2/4</div>
            </div>
            <div className="resume-detail-list">
              {PROJECTS_ROWS.map((row) => (
                <div className="resume-detail-row" key={row.index}>
                  <div className="resume-detail-row-index">{row.index}</div>
                  <div className="resume-detail-row-title">{row.title}</div>
                  <div className="resume-detail-status">{row.status}</div>
                </div>
              ))}
            </div>
            <div className="resume-detail-bottom">
              <div className="resume-detail-bottom-title">DETAILS</div>
              <div className="resume-detail-bullets">
                <div className="resume-detail-bullet">- Build projects that merge technical skill with design intent.</div>
                <div className="resume-detail-bullet">- Each project targets a real use-case or portfolio milestone.</div>
                <div className="resume-detail-bullet">- Source available on GitHub for review and collaboration.</div>
              </div>
            </div>
          </div>
        )}

        {active === 3 && (
          <div className="resume-detail-panel">
            <div className="resume-detail-top">
              <div className="resume-detail-top-index">04</div>
              <div className="resume-detail-top-title">EXPERIENCE LOG</div>
              <div className="resume-detail-top-progress">1/3</div>
            </div>
            <div className="resume-detail-list">
              {EXPERIENCE_ROWS.map((row) => (
                <div className="resume-detail-row" key={row.index}>
                  <div className="resume-detail-row-index">{row.index}</div>
                  <div className="resume-detail-row-title">{row.title}</div>
                  <div className="resume-detail-status">{row.status}</div>
                </div>
              ))}
            </div>
            <div className="resume-detail-bottom">
              <div className="resume-detail-bottom-title">DETAILS</div>
              <div className="resume-detail-bullets">
                <div className="resume-detail-bullet">- Actively seeking internships and entry-level opportunities.</div>
                <div className="resume-detail-bullet">- Available for freelance and collaborative projects.</div>
                <div className="resume-detail-bullet">- Open to remote and hybrid roles in frontend / UI engineering.</div>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
