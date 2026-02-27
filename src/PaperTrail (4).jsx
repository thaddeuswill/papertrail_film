import React, { useState, useEffect, useRef } from "react";
import { SUBJECTS, EPISODES, RESEARCH, FUNDERS, CAMPAIGN, FORMSPREE, STRIPE_URL } from "./config";

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;0,900;1,400;1,700&family=IM+Fell+English:ital@0;1&family=Crimson+Pro:ital,wght@0,300;0,400;0,600;1,300;1,400&display=swap');

  * { box-sizing: border-box; margin: 0; padding: 0; -webkit-tap-highlight-color: transparent; }
  :root {
    --ink: #1a1208; --parchment: #e8d9b5; --aged: #c9a96e;
    --sepia-dark: #2c1a08; --sepia-mid: #5c3a1a; --sepia-light: #8b5e3c;
    --cream: #f2e8d0; --rust: #8b2500; --gold: #c49a38; --muted: #a08060; --void: #080401;
  }
  html { scroll-behavior: smooth; }
  body { background: var(--void); overflow-x: hidden; }
  .font-display { font-family: 'Playfair Display', serif; }
  .font-body    { font-family: 'Crimson Pro', serif; }
  .font-fell    { font-family: 'IM Fell English', serif; }

  .paper-texture {
    background-color: var(--parchment);
    background-image:
      repeating-linear-gradient(0deg, transparent, transparent 27px, rgba(90,60,20,0.055) 28px),
      radial-gradient(ellipse at 20% 80%, rgba(180,120,40,0.1) 0%, transparent 60%),
      radial-gradient(ellipse at 80% 20%, rgba(120,80,20,0.07) 0%, transparent 50%);
  }

  .nav-fixed {
    position: fixed; top: 0; left: 0; right: 0; z-index: 100;
    backdrop-filter: blur(14px); -webkit-backdrop-filter: blur(14px);
    background: rgba(8,4,1,0.92); border-bottom: 1px solid rgba(196,154,56,0.1);
  }
  .nav-desktop { display: none; }
  @media (min-width: 900px) {
    .nav-desktop { display: flex; align-items: center; gap: 28px; }
    .nav-desktop-link { background: none; border: none; cursor: pointer; font-family: 'Crimson Pro', serif; font-size: 0.9rem; letter-spacing: 0.08em; color: var(--muted); transition: color 0.2s; padding: 0; }
    .nav-desktop-link:hover { color: var(--parchment); }
    .nav-hamburger { display: none !important; }
  }

  .drawer {
    position: fixed; top: 0; right: 0; bottom: 0; width: min(80vw, 300px);
    background: #110800; border-left: 1px solid rgba(196,154,56,0.15);
    z-index: 200; transform: translateX(100%);
    transition: transform 0.35s cubic-bezier(0.25,0.46,0.45,0.94);
    padding: 80px 32px 40px; display: flex; flex-direction: column; gap: 8px;
  }
  .drawer.open { transform: translateX(0); }
  .drawer-overlay {
    position: fixed; inset: 0; background: rgba(0,0,0,0.7);
    z-index: 150; opacity: 0; pointer-events: none; transition: opacity 0.3s;
  }
  .drawer-overlay.open { opacity: 1; pointer-events: all; }

  .support-btn {
    background: linear-gradient(135deg, #7a1f00 0%, #4a1000 100%);
    border: 1px solid rgba(196,154,56,0.35); letter-spacing: 0.14em;
    text-transform: uppercase; cursor: pointer;
    font-family: 'Playfair Display', serif; transition: all 0.2s;
    -webkit-appearance: none; position: relative; overflow: hidden;
  }
  .support-btn:hover { background: linear-gradient(135deg, #8b2500 0%, #5c1800 100%); }
  .support-btn:active { opacity: 0.85; transform: scale(0.98); }
  .support-btn:disabled { opacity: 0.5; cursor: wait; }

  .ghost-btn {
    background: transparent; border: 1px solid rgba(196,154,56,0.2);
    color: var(--aged); cursor: pointer; letter-spacing: 0.1em;
    font-family: 'Crimson Pro', serif; transition: all 0.2s; -webkit-appearance: none;
  }
  .ghost-btn:hover { border-color: rgba(196,154,56,0.45); color: var(--parchment); }
  .ghost-btn:active { background: rgba(196,154,56,0.07); }

  .progress-fill {
    background: linear-gradient(90deg, #8b2500, #c49a38, #8b5e3c);
    background-size: 200% 100%; animation: shimmer 3s ease-in-out infinite;
  }
  @keyframes shimmer { 0% { background-position: -200% 0; } 100% { background-position: 200% 0; } }

  .section-rule { border: none; height: 1px; background: linear-gradient(to right, transparent, var(--aged), var(--gold), var(--aged), transparent); }
  .masthead-rule { border: none; height: 2px; background: var(--gold); opacity: 0.4; }
  .masthead-rule-thin { border: none; height: 1px; background: var(--gold); opacity: 0.2; margin: 3px 0; }

  .subject-pill { display: inline-block; font-family: 'Crimson Pro', serif; font-size: 0.65rem; letter-spacing: 0.15em; text-transform: uppercase; padding: 2px 7px; border-radius: 2px; white-space: nowrap; }

  .tab-row { display: flex; overflow-x: auto; -webkit-overflow-scrolling: touch; scrollbar-width: none; border-bottom: 1px solid rgba(196,154,56,0.12); margin-bottom: 28px; gap: 0; }
  .tab-row::-webkit-scrollbar { display: none; }
  .tab-btn { flex-shrink: 0; background: transparent; border: none; border-bottom: 2px solid transparent; padding: 12px 20px; cursor: pointer; font-family: 'Playfair Display', serif; font-size: 0.82rem; letter-spacing: 0.04em; color: var(--muted); white-space: nowrap; transition: color 0.2s; }
  .tab-btn.active { border-bottom-color: var(--gold); color: var(--parchment); }

  .filter-row { display: flex; overflow-x: auto; -webkit-overflow-scrolling: touch; scrollbar-width: none; gap: 8px; padding-bottom: 4px; margin-bottom: 20px; }
  .filter-row::-webkit-scrollbar { display: none; }
  .filter-chip { flex-shrink: 0; font-family: 'Crimson Pro', serif; font-size: 0.72rem; letter-spacing: 0.12em; text-transform: uppercase; padding: 5px 12px; border-radius: 20px; cursor: pointer; border: 1px solid rgba(90,60,20,0.3); background: transparent; color: var(--muted); transition: all 0.2s; -webkit-appearance: none; }

  .loi-input { background: rgba(90,60,20,0.08); border: 1px solid rgba(90,60,20,0.3); color: var(--sepia-dark); font-family: 'Crimson Pro', serif; font-size: 1rem; padding: 12px 14px; border-radius: 2px; outline: none; width: 100%; -webkit-appearance: none; transition: border-color 0.2s; }
  .loi-input:focus { border-color: rgba(196,154,56,0.5); }
  .loi-input::placeholder { color: var(--sepia-light); opacity: 0.6; }

  .card-tap { transition: transform 0.2s, box-shadow 0.2s; cursor: pointer; }
  .card-tap:active { transform: scale(0.99); }
  .watch-badge { animation: pulse-gold 2s ease-in-out infinite; }
  @keyframes pulse-gold { 0%, 100% { box-shadow: 0 0 0 0 rgba(196,154,56,0.4); } 50% { box-shadow: 0 0 0 5px rgba(196,154,56,0); } }
  .stamp { border: 3px double var(--rust); transform: rotate(-3deg); opacity: 0.85; }
  .funder-card { background: rgba(44,26,8,0.5); border: 1px solid rgba(196,154,56,0.1); transition: border-color 0.2s; }

  .grid-funders { display: grid; grid-template-columns: 1fr; gap: 10px; }
  @media (min-width: 700px) { .grid-funders { grid-template-columns: 1fr 1fr; } }

  .ep-card { display: flex; flex-direction: column; }
  .ep-thumb { min-height: 90px; width: 100%; background: rgba(13,6,2,0.7); border-bottom: 1px solid rgba(196,154,56,0.08); display: flex; align-items: center; justify-content: center; overflow: hidden; }
  @media (min-width: 900px) {
    .ep-card { flex-direction: row; }
    .ep-thumb { width: 240px; min-width: 240px; min-height: unset; border-bottom: none; border-right: 1px solid rgba(196,154,56,0.08); }
  }

  .pledge-row { display: flex; flex-direction: column; gap: 10px; }
  @media (min-width: 480px) { .pledge-row { flex-direction: row; align-items: center; } }

  .video-wrapper { position: relative; width: 100%; padding-top: 56.25%; background: #000; }
  .video-wrapper iframe { position: absolute; inset: 0; width: 100%; height: 100%; border: none; }

  /* HERO */
  .hero-section { min-height: 100svh; background: var(--void); display: flex; flex-direction: column; position: relative; overflow: hidden; padding-top: 60px; }
  .hero-masthead { padding: 28px clamp(20px, 4vw, 60px) 0; max-width: 1100px; width: 100%; margin: 0 auto; flex-shrink: 0; }
  .hero-kicker { font-family: 'Crimson Pro', serif; font-size: 0.65rem; letter-spacing: 0.45em; text-transform: uppercase; color: var(--rust); display: flex; align-items: center; gap: 12px; margin-bottom: 10px; }
  .hero-kicker::before, .hero-kicker::after { content: ''; flex: 1; height: 1px; background: rgba(139,37,0,0.4); }
  .hero-title-block { text-align: center; padding: 12px 0 16px; border-top: 3px solid rgba(196,154,56,0.5); border-bottom: 1px solid rgba(196,154,56,0.25); margin-bottom: 3px; }
  .hero-title { font-family: 'Playfair Display', serif; font-size: clamp(2rem, 5vw, 4.5rem); font-weight: 900; line-height: 1.05; color: var(--cream); letter-spacing: -0.01em; text-shadow: 0 4px 40px rgba(139,37,0,0.25); }
  .hero-subtitle-bar { display: flex; align-items: center; justify-content: space-between; padding: 6px 0; border-bottom: 2px solid rgba(196,154,56,0.3); margin-bottom: 20px; gap: 8px; flex-wrap: wrap; }
  .hero-body { display: grid; grid-template-columns: 1fr; gap: 0; max-width: 1100px; width: 100%; margin: 0 auto; padding: 0 clamp(20px, 4vw, 60px); flex: 1; }
  @media (min-width: 700px) { .hero-body { grid-template-columns: 1fr 1fr; } }
  .hero-col { padding: 16px 0; }
  @media (min-width: 700px) { .hero-col { padding: 20px 24px; } .hero-col:first-child { padding-left: 0; } .hero-col:last-child { padding-right: 0; } }
  .hero-lede { font-family: 'Crimson Pro', serif; font-size: clamp(1rem, 2vw, 1.15rem); line-height: 1.7; color: var(--parchment); font-weight: 300; margin-bottom: 16px; }
  .hero-lede em { font-style: italic; color: var(--aged); }
  .hero-dateline { font-family: 'Crimson Pro', serif; font-size: 0.72rem; letter-spacing: 0.15em; color: var(--muted); text-transform: uppercase; margin-bottom: 12px; }
  .hero-pullquote { border-left: 3px solid var(--rust); padding: 10px 14px; margin: 16px 0; background: rgba(139,37,0,0.06); }
  .hero-pullquote p { font-family: 'IM Fell English', serif; font-size: 1.05rem; line-height: 1.5; color: var(--parchment); font-style: italic; }

  /* SUBJECTS DOSSIER */
  .subject-dossier { display: grid; grid-template-columns: 1fr 1fr; border: 1px solid rgba(196,154,56,0.12); overflow: hidden; border-radius: 2px; }
  @media (min-width: 600px) { .subject-dossier { grid-template-columns: repeat(4, 1fr); } }
  .dossier-cell { padding: 20px 16px; border-right: 1px solid rgba(196,154,56,0.1); border-bottom: 1px solid rgba(196,154,56,0.1); background: rgba(26,13,4,0.6); cursor: pointer; transition: background 0.2s; position: relative; overflow: hidden; }
  .dossier-cell::before { content: attr(data-num); position: absolute; bottom: -8px; right: 6px; font-family: 'Playfair Display', serif; font-size: 5rem; font-weight: 900; opacity: 0.04; color: #fff; line-height: 1; pointer-events: none; }
  .dossier-cell:nth-child(2n) { border-right: none; }
  @media (min-width: 600px) { .dossier-cell:nth-child(2n) { border-right: 1px solid rgba(196,154,56,0.1); } .dossier-cell:nth-child(4n) { border-right: none; } .dossier-cell:nth-last-child(-n+4) { border-bottom: none; } }
  .dossier-cell:nth-last-child(-n+2) { border-bottom: none; }
  .dossier-cell:hover { background: rgba(44,26,8,0.85); }
  .dossier-tag { font-family: 'Crimson Pro', serif; font-size: 0.6rem; letter-spacing: 0.18em; text-transform: uppercase; padding: 2px 6px; border-radius: 1px; display: inline-block; margin-bottom: 10px; }

  .geo-divider { display: flex; align-items: center; height: 48px; border-top: 1px solid rgba(196,154,56,0.08); border-bottom: 1px solid rgba(196,154,56,0.08); }
  .geo-segment { flex: 1; height: 100%; display: flex; align-items: center; justify-content: center; font-family: 'Crimson Pro', serif; font-size: 0.58rem; letter-spacing: 0.18em; text-transform: uppercase; }

  .reveal { opacity: 0; transform: translateY(18px); transition: opacity 0.7s ease, transform 0.7s ease; }
  .reveal.visible { opacity: 1; transform: translateY(0); }

  .archive-card { background-color: var(--parchment); background-image: repeating-linear-gradient(0deg, transparent, transparent 27px, rgba(90,60,20,0.055) 28px), radial-gradient(ellipse at 20% 80%, rgba(180,120,40,0.1) 0%, transparent 60%); border-radius: 2px; overflow: hidden; box-shadow: 0 4px 24px rgba(0,0,0,0.5); }

  .section-inner { max-width: 1100px; margin: 0 auto; padding: 0 clamp(20px, 4vw, 60px); }
  .section-eyebrow { font-family: 'IM Fell English', serif; color: var(--rust); font-size: 0.7rem; letter-spacing: 0.38em; font-style: italic; margin-bottom: 8px; display: block; }
  .section-title { font-family: 'Playfair Display', serif; color: var(--parchment); font-size: clamp(1.8rem, 3vw, 3rem); font-weight: 900; line-height: 1.05; }
  .footer-masthead { border-top: 3px solid rgba(196,154,56,0.2); padding-top: 24px; }

  /* NOTIFY MODAL */
  .modal-overlay {
    position: fixed; inset: 0; background: rgba(0,0,0,0.75);
    z-index: 300; display: flex; align-items: center; justify-content: center;
    padding: 20px; opacity: 0; pointer-events: none; transition: opacity 0.25s ease;
  }
  .modal-overlay.open { opacity: 1; pointer-events: all; }
  .modal-box {
    background: #1a0d04; border: 1px solid rgba(196,154,56,0.25);
    border-top: 3px solid var(--gold); border-radius: 2px; padding: 32px 28px;
    width: 100%; max-width: 440px; box-shadow: 0 24px 80px rgba(0,0,0,0.8);
    transform: translateY(12px); transition: transform 0.25s ease; position: relative;
  }
  .modal-overlay.open .modal-box { transform: translateY(0); }
  .modal-close { position: absolute; top: 14px; right: 16px; background: none; border: none; cursor: pointer; color: var(--muted); font-size: 1.3rem; line-height: 1; transition: color 0.2s; }
  .modal-close:hover { color: var(--parchment); }


  /* MAP */
  .map-container { position: relative; width: 100%; max-width: 860px; margin: 0 auto; }
  .map-svg { width: 100%; height: auto; display: block; }
  .map-state { transition: opacity 0.3s; }
  .map-state:hover { opacity: 0.85; }
  .map-legend { display: flex; flex-wrap: wrap; gap: 16px 28px; margin-top: 24px; justify-content: center; }
  .map-legend-item { display: flex; align-items: center; gap: 8px; }

  .error-msg { color: #c0392b; font-family: 'Crimson Pro', serif; font-size: 0.82rem; margin-top: 6px; }
`;

async function submitToFormspree(formId, data) {
  if (!formId || formId.startsWith("YOUR_")) {
    await new Promise(r => setTimeout(r, 600));
    return { ok: true };
  }
  const res = await fetch(`https://formspree.io/f/${formId}`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Accept: "application/json" },
    body: JSON.stringify(data),
  });
  return res;
}

function Reveal({ children, delay = 0, style = {} }) {
  const ref = useRef(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) { el.classList.add("visible"); obs.disconnect(); }
    }, { threshold: 0.08 });
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  return <div ref={ref} className="reveal" style={{ transitionDelay: `${delay}ms`, ...style }}>{children}</div>;
}

function VideoPlayer({ videoUrl, subjectColor, episodeNumber }) {
  if (videoUrl) {
    return (
      <div className="video-wrapper">
        <iframe src={videoUrl} allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen title={`Episode ${episodeNumber}`} />
      </div>
    );
  }
  return (
    <div className="ep-thumb">
      <div style={{ textAlign: "center" }}>
        <div className="font-display" style={{ color: subjectColor, fontSize: "2.8rem", fontWeight: 900, opacity: 0.18 }}>{String(episodeNumber).padStart(2, "0")}</div>
        <div className="font-body" style={{ color: "var(--muted)", fontSize: "0.6rem", letterSpacing: "0.2em", opacity: 0.5 }}>PENDING</div>
      </div>
    </div>
  );
}


// ── SOUTHERN MAP ─────────────────────────────────────────────────────────────
// Simplified SVG outlines of AL, MS, GA, TX, FL — hand-drafted aesthetic
// Viewbox: roughly 0 0 700 480, coordinates approximate real geography

function SouthernMap({ subjects }) {
  const [hoveredKey, setHoveredKey] = React.useState(null);

  // Simplified state path data (hand-approximated for aesthetic, not precise GIS)
  const states = [
    {
      id: "tx",
      label: "Texas",
      // Simplified Texas outline
      path: "M 30,80 L 38,78 L 50,72 L 68,70 L 85,68 L 105,62 L 118,55 L 128,48 L 132,42 L 138,38 L 148,36 L 158,35 L 165,38 L 168,44 L 170,52 L 168,60 L 165,70 L 162,82 L 160,95 L 158,115 L 156,135 L 154,158 L 152,178 L 150,198 L 148,215 L 148,228 L 152,236 L 158,242 L 165,248 L 172,252 L 178,258 L 180,265 L 175,272 L 168,278 L 160,280 L 148,282 L 135,282 L 120,282 L 105,282 L 90,282 L 75,282 L 62,280 L 52,276 L 45,268 L 40,258 L 38,245 L 36,232 L 34,215 L 32,195 L 30,175 L 28,155 L 28,135 L 28,115 L 28,95 Z",
      subject: "abram",
      labelX: 95, labelY: 200,
    },
    {
      id: "ms",
      label: "Mississippi",
      path: "M 310,110 L 318,108 L 328,107 L 336,108 L 342,112 L 346,118 L 348,126 L 348,136 L 346,148 L 344,162 L 342,176 L 340,190 L 338,204 L 336,218 L 334,230 L 334,240 L 336,248 L 340,255 L 346,260 L 350,265 L 352,272 L 348,278 L 342,282 L 334,284 L 325,284 L 316,280 L 308,274 L 302,266 L 298,255 L 296,242 L 296,228 L 296,214 L 297,200 L 298,186 L 298,172 L 298,158 L 298,144 L 298,132 L 300,120 L 304,114 Z",
      subject: "thompson",
      labelX: 323, labelY: 200,
    },
    {
      id: "al",
      label: "Alabama",
      path: "M 348,108 L 360,106 L 372,105 L 384,106 L 393,108 L 400,113 L 404,120 L 406,130 L 406,142 L 406,156 L 406,170 L 405,184 L 404,198 L 403,212 L 402,226 L 402,238 L 403,248 L 405,258 L 408,266 L 412,272 L 416,278 L 418,284 L 416,290 L 412,294 L 406,296 L 398,296 L 388,294 L 378,290 L 368,285 L 358,280 L 350,274 L 346,268 L 344,260 L 342,250 L 340,238 L 338,224 L 337,210 L 336,196 L 336,182 L 337,168 L 338,154 L 340,140 L 342,127 L 344,118 Z",
      subject: "willis",
      labelX: 375, labelY: 210,
    },
    {
      id: "ga",
      label: "Georgia",
      path: "M 406,106 L 418,104 L 432,103 L 446,103 L 460,104 L 472,106 L 482,110 L 490,116 L 496,124 L 500,134 L 502,146 L 502,160 L 500,175 L 498,190 L 496,205 L 494,218 L 492,230 L 490,240 L 488,250 L 486,258 L 484,264 L 480,268 L 474,270 L 466,270 L 456,268 L 445,264 L 434,258 L 424,252 L 416,245 L 410,237 L 406,228 L 405,218 L 404,206 L 403,192 L 402,178 L 402,164 L 403,150 L 404,136 L 405,122 Z",
      subject: "henry",
      labelX: 450, labelY: 195,
    },
    {
      id: "fl",
      label: "Florida",
      path: "M 348,296 L 360,295 L 372,294 L 384,294 L 394,295 L 404,296 L 414,297 L 424,298 L 434,299 L 444,300 L 452,302 L 458,306 L 462,312 L 464,320 L 463,330 L 460,340 L 456,350 L 450,360 L 442,370 L 432,380 L 420,390 L 408,400 L 396,408 L 384,414 L 372,418 L 362,420 L 354,418 L 348,412 L 344,404 L 342,394 L 342,382 L 343,368 L 345,354 L 347,340 L 348,326 L 348,312 Z",
      subject: "willis",
      labelX: 400, labelY: 370,
    },
  ];

  // Routes: simplified paths connecting key locations
  const routes = [
    {
      // Willis: Lowndes Co AL → Marion Co FL (south-southwest)
      key: "willis",
      d: "M 368,220 Q 370,260 365,295 Q 360,320 370,355",
      color: subjects.willis.color,
      label: "Willis: AL → FL",
      fromX: 368, fromY: 220, toX: 370, toY: 355,
    },
    {
      // Abram: East Texas (internal movement)
      key: "abram",
      d: "M 80,160 Q 100,180 110,210 Q 118,235 105,260",
      color: subjects.abram.color,
      label: "Abram: East Texas",
      fromX: 80, fromY: 160, toX: 105, toY: 260,
    },
    {
      // Thompson: Amite County MS (local)
      key: "thompson",
      d: "M 318,160 Q 322,195 320,230 Q 318,255 325,270",
      color: subjects.thompson.color,
      label: "Thompson: Amite Co.",
      fromX: 318, fromY: 160, toX: 325, toY: 270,
    },
    {
      // Henry: Wilkes County GA (local)
      key: "henry",
      d: "M 460,145 Q 465,175 462,210 Q 458,240 455,260",
      color: subjects.henry.color,
      label: "Henry: Wilkes Co.",
      fromX: 460, fromY: 145, toX: 455, toY: 260,
    },
  ];

  // Location markers
  const markers = [
    { key: "willis", x: 368, y: 218, label: "Lowndes Co.", sub: "Born here, 1848" },
    { key: "willis", x: 370, y: 356, label: "Marion Co., FL", sub: "Land & church" },
    { key: "abram", x: 80, y: 158, label: "East Texas", sub: "Freedmen's Bureau" },
    { key: "thompson", x: 318, y: 158, label: "Amite Co.", sub: "Church rolls" },
    { key: "henry", x: 460, y: 143, label: "Wilkes Co.", sub: "The deed, 1870s" },
  ];

  return (
    <div className="map-container">
      {/* Parchment backing */}
      <div style={{
        background: "radial-gradient(ellipse at 40% 35%, #d4c49a 0%, #c8b888 40%, #b8a070 100%)",
        borderRadius: "4px",
        padding: "32px 24px 28px",
        border: "1px solid rgba(90,60,20,0.3)",
        boxShadow: "inset 0 0 60px rgba(90,60,20,0.15), 0 8px 40px rgba(0,0,0,0.6)",
        position: "relative",
        overflow: "hidden",
      }}>
        {/* Aged paper texture overlay */}
        <div style={{ position: "absolute", inset: 0, backgroundImage: "repeating-linear-gradient(0deg, transparent, transparent 27px, rgba(90,60,20,0.04) 28px), repeating-linear-gradient(90deg, transparent, transparent 40px, rgba(90,60,20,0.02) 41px)", pointerEvents: "none" }} />

        {/* Map title */}
        <div style={{ textAlign: "center", marginBottom: "16px", position: "relative" }}>
          <p style={{ fontFamily: "'IM Fell English', serif", color: "#5c3a1a", fontSize: "0.62rem", letterSpacing: "0.4em", fontStyle: "italic", marginBottom: "4px" }}>CARTOGRAPHY OF THE INVESTIGATION</p>
          <div style={{ height: "1px", background: "linear-gradient(to right, transparent, rgba(90,60,20,0.4), transparent)" }} />
        </div>

        <svg viewBox="0 0 700 480" className="map-svg" style={{ filter: "drop-shadow(0 2px 4px rgba(44,26,8,0.3))" }}>
          <defs>
            {/* Paper grain filter */}
            <filter id="grain">
              <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="4" stitchTiles="stitch" result="noise" />
              <feColorMatrix type="saturate" values="0" in="noise" result="grayNoise" />
              <feBlend in="SourceGraphic" in2="grayNoise" mode="multiply" result="blended" />
              <feComposite in="blended" in2="SourceGraphic" operator="in" />
            </filter>
            {/* Sketch/rough edge filter */}
            <filter id="sketch" x="-2%" y="-2%" width="104%" height="104%">
              <feTurbulence type="turbulence" baseFrequency="0.04" numOctaves="3" seed="8" result="noise" />
              <feDisplacementMap in="SourceGraphic" in2="noise" scale="2.5" xChannelSelector="R" yChannelSelector="G" />
            </filter>
            {/* Arrow marker */}
            {routes.map(r => (
              <marker key={r.key} id={`arrow-${r.key}`} markerWidth="6" markerHeight="6" refX="3" refY="3" orient="auto">
                <circle cx="3" cy="3" r="2" fill={r.color} opacity="0.9" />
              </marker>
            ))}
          </defs>

          {/* Gulf of Mexico label area */}
          <text x="220" y="440" fontFamily="'IM Fell English', serif" fontSize="11" fill="rgba(92,58,26,0.4)" fontStyle="italic" textAnchor="middle">Gulf of Mexico</text>
          <text x="560" y="430" fontFamily="'IM Fell English', serif" fontSize="9" fill="rgba(92,58,26,0.35)" fontStyle="italic" textAnchor="middle">Atlantic Ocean</text>

          {/* State fills */}
          {states.map(s => {
            const subj = subjects[s.subject];
            const isHovered = hoveredKey === s.subject;
            const isOtherHovered = hoveredKey && hoveredKey !== s.subject;
            return (
              <g key={s.id} className="map-state"
                onMouseEnter={() => setHoveredKey(s.subject)}
                onMouseLeave={() => setHoveredKey(null)}
                style={{ cursor: "pointer" }}>
                <path
                  d={s.path}
                  fill={subj.color}
                  fillOpacity={isHovered ? 0.55 : isOtherHovered ? 0.18 : 0.32}
                  stroke={subj.color}
                  strokeWidth={isHovered ? 2 : 1.2}
                  strokeOpacity={isHovered ? 0.9 : 0.55}
                  filter="url(#sketch)"
                  style={{ transition: "all 0.3s ease" }}
                />
                {/* Crosshatch texture lines for depth */}
                <path
                  d={s.path}
                  fill="none"
                  stroke={subj.color}
                  strokeWidth="0.4"
                  strokeOpacity="0.15"
                  strokeDasharray="3,4"
                />
                {/* State label */}
                <text
                  x={s.labelX} y={s.labelY}
                  fontFamily="'IM Fell English', serif"
                  fontSize={isHovered ? "13" : "11"}
                  fill={subj.color}
                  fillOpacity={isOtherHovered ? 0.35 : 0.85}
                  textAnchor="middle"
                  fontStyle="italic"
                  style={{ transition: "all 0.3s", pointerEvents: "none", userSelect: "none" }}>
                  {s.label}
                </text>
              </g>
            );
          })}

          {/* Route lines */}
          {routes.map(r => {
            const isHovered = hoveredKey === r.key;
            const isOtherHovered = hoveredKey && hoveredKey !== r.key;
            return (
              <g key={r.key}>
                {/* Shadow/glow */}
                <path d={r.d} fill="none" stroke={r.color} strokeWidth="5" strokeOpacity="0.08" strokeLinecap="round" />
                {/* Main dashed route */}
                <path
                  d={r.d}
                  fill="none"
                  stroke={r.color}
                  strokeWidth={isHovered ? 2.5 : 1.8}
                  strokeOpacity={isOtherHovered ? 0.2 : isHovered ? 1 : 0.7}
                  strokeLinecap="round"
                  strokeDasharray={r.key === "abram" || r.key === "thompson" || r.key === "henry" ? "3,4" : "6,4"}
                  markerEnd={`url(#arrow-${r.key})`}
                  style={{ transition: "all 0.3s ease" }}
                />
              </g>
            );
          })}

          {/* Location markers */}
          {markers.map((m, i) => {
            const subj = subjects[m.key];
            const isHovered = hoveredKey === m.key;
            const isOtherHovered = hoveredKey && hoveredKey !== m.key;
            return (
              <g key={i} opacity={isOtherHovered ? 0.3 : 1} style={{ transition: "opacity 0.3s" }}>
                {/* Outer ring */}
                <circle cx={m.x} cy={m.y} r={isHovered ? 9 : 7} fill="none" stroke={subj.color} strokeWidth="1" strokeOpacity="0.5" style={{ transition: "all 0.3s" }} />
                {/* Inner dot */}
                <circle cx={m.x} cy={m.y} r={isHovered ? 4 : 3} fill={subj.color} fillOpacity="0.9" style={{ transition: "all 0.3s" }} />
                {/* Label */}
                {isHovered && (
                  <g>
                    <rect x={m.x + 12} y={m.y - 18} width="90" height="32" rx="2" fill="rgba(26,13,4,0.9)" stroke={subj.color} strokeWidth="0.5" strokeOpacity="0.5" />
                    <text x={m.x + 16} y={m.y - 5} fontFamily="'Playfair Display', serif" fontSize="9" fontWeight="700" fill={subj.color}>{m.label}</text>
                    <text x={m.x + 16} y={m.y + 7} fontFamily="'Crimson Pro', serif" fontSize="8" fill="rgba(232,217,181,0.7)">{m.sub}</text>
                  </g>
                )}
              </g>
            );
          })}

          {/* Compass rose (top right) */}
          <g transform="translate(640, 60)">
            <circle cx="0" cy="0" r="22" fill="rgba(232,217,181,0.08)" stroke="rgba(92,58,26,0.25)" strokeWidth="0.8" />
            <circle cx="0" cy="0" r="2" fill="rgba(92,58,26,0.5)" />
            {[["N", 0,-18], ["S", 0,22], ["E", 20,5], ["W", -20,5]].map(([lbl, dx, dy]) => (
              <text key={lbl} x={dx} y={dy} fontFamily="'IM Fell English', serif" fontSize="9" fill="rgba(92,58,26,0.65)" textAnchor="middle" fontStyle="italic">{lbl}</text>
            ))}
            <line x1="0" y1="-14" x2="0" y2="14" stroke="rgba(92,58,26,0.35)" strokeWidth="0.8" />
            <line x1="-14" y1="0" x2="14" y2="0" stroke="rgba(92,58,26,0.35)" strokeWidth="0.8" />
          </g>

          {/* Scale bar */}
          <g transform="translate(30, 455)">
            <line x1="0" y1="0" x2="60" y2="0" stroke="rgba(92,58,26,0.4)" strokeWidth="1" />
            <line x1="0" y1="-4" x2="0" y2="4" stroke="rgba(92,58,26,0.4)" strokeWidth="1" />
            <line x1="60" y1="-4" x2="60" y2="4" stroke="rgba(92,58,26,0.4)" strokeWidth="1" />
            <text x="30" y="-7" fontFamily="'Crimson Pro', serif" fontSize="8" fill="rgba(92,58,26,0.55)" textAnchor="middle">~300 mi</text>
          </g>
        </svg>

        {/* Legend */}
        <div className="map-legend">
          {Object.entries(subjects).map(([key, s]) => (
            <div key={key} className="map-legend-item"
              onMouseEnter={() => setHoveredKey(key)}
              onMouseLeave={() => setHoveredKey(null)}
              style={{ cursor: "pointer", opacity: hoveredKey && hoveredKey !== key ? 0.4 : 1, transition: "opacity 0.3s" }}>
              <svg width="28" height="12">
                <line x1="0" y1="6" x2="28" y2="6" stroke={s.color} strokeWidth="2" strokeDasharray={key === "willis" ? "6,3" : "3,3"} strokeOpacity="0.9" />
                <circle cx="5" cy="6" r="3" fill={s.color} fillOpacity="0.9" />
              </svg>
              <span style={{ fontFamily: "'Crimson Pro', serif", color: s.color, fontSize: "0.78rem", letterSpacing: "0.05em" }}>{s.name}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function PaperTrail() {
  const [drawerOpen, setDrawerOpen]       = useState(false);
  const [fundTab, setFundTab]             = useState("public");
  const [raised]                          = useState(CAMPAIGN.raised);
  const [backers]                         = useState(CAMPAIGN.backers);
  const [expanded, setExpanded]           = useState(null);
  const [epStates]                        = useState(EPISODES.reduce((a, e) => ({ ...a, [e.id]: e.status }), {}));
  const [subFilter, setSubFilter]         = useState("all");

  const [loiForm, setLoiForm]             = useState({ name: "", org: "", type: "", email: "", message: "" });
  const [loiSent, setLoiSent]             = useState(false);
  const [loiLoading, setLoiLoading]       = useState(false);
  const [loiError, setLoiError]           = useState("");

  const [streamForm, setStreamForm]       = useState({ name: "", platform: "", email: "", interest: "" });
  const [streamSent, setStreamSent]       = useState(false);
  const [streamLoading, setStreamLoading] = useState(false);
  const [streamError, setStreamError]     = useState("");

  const [notifyOpen, setNotifyOpen]       = useState(false);
  const [notifyEp, setNotifyEp]           = useState(null);
  const [notifyForm, setNotifyForm]       = useState({ name: "", email: "" });
  const [notifySent, setNotifySent]       = useState(false);
  const [notifyLoading, setNotifyLoading] = useState(false);
  const [notifyError, setNotifyError]     = useState("");

  const progress = Math.min((raised / CAMPAIGN.goal) * 100, 100);
  const scrollTo = (id) => { setDrawerOpen(false); setTimeout(() => document.getElementById(id)?.scrollIntoView({ behavior: "smooth" }), 50); };
  const filteredEps      = subFilter === "all" ? EPISODES : EPISODES.filter(e => e.subject === subFilter);
  const filteredResearch = subFilter === "all" ? RESEARCH : RESEARCH.filter(r => r.subject === subFilter);

  async function handleLoi() {
    if (!loiForm.name || !loiForm.email) { setLoiError("Name and email are required."); return; }
    setLoiLoading(true); setLoiError("");
    const res = await submitToFormspree(FORMSPREE.loi, { ...loiForm, _subject: `LOI from ${loiForm.org || loiForm.name}` });
    setLoiLoading(false);
    if (res.ok) setLoiSent(true); else setLoiError("Something went wrong. Please try again.");
  }

  async function handleStream() {
    if (!streamForm.name || !streamForm.email) { setStreamError("Name and email are required."); return; }
    setStreamLoading(true); setStreamError("");
    const res = await submitToFormspree(FORMSPREE.streaming, { ...streamForm, _subject: `Streaming interest: ${streamForm.platform || streamForm.name}` });
    setStreamLoading(false);
    if (res.ok) setStreamSent(true); else setStreamError("Something went wrong. Please try again.");
  }

  async function handleNotify() {
    if (!notifyForm.name || !notifyForm.email) { setNotifyError("Name and email are required."); return; }
    setNotifyLoading(true); setNotifyError("");
    const res = await submitToFormspree(FORMSPREE.notify, {
      name: notifyForm.name, email: notifyForm.email,
      episode: notifyEp ? `${notifyEp.number}: ${notifyEp.title}` : "All episodes",
      _subject: `Notify me: ${notifyEp ? notifyEp.title : "All episodes"} — ${notifyForm.name}`,
    });
    setNotifyLoading(false);
    if (res.ok) setNotifySent(true); else setNotifyError("Something went wrong. Please try again.");
  }

  function openNotify(ep) {
    setNotifyEp(ep); setNotifyForm({ name: "", email: "" });
    setNotifySent(false); setNotifyError(""); setNotifyOpen(true);
  }

  const FilterChips = () => (
    <div className="filter-row">
      {[["all", "All"], ...Object.entries(SUBJECTS).map(([k, s]) => [k, s.short])].map(([key, label]) => {
        const active = subFilter === key;
        const col = key === "all" ? "var(--gold)" : SUBJECTS[key]?.color;
        return (
          <button key={key} className="filter-chip" onClick={() => setSubFilter(key)}
            style={{ background: active ? `${col}20` : "transparent", borderColor: active ? col : "rgba(90,60,20,0.3)", color: active ? col : "var(--muted)" }}>
            {label}
          </button>
        );
      })}
    </div>
  );

  const SectionHeader = ({ eyebrow, title, sub }) => (
    <div style={{ marginBottom: "32px" }}>
      <div style={{ display: "flex", alignItems: "center", gap: "14px", marginBottom: "10px" }}>
        <hr style={{ flex: 1, border: "none", borderTop: "1px solid rgba(196,154,56,0.15)" }} />
        <span className="section-eyebrow" style={{ margin: 0 }}>{eyebrow}</span>
        <hr style={{ flex: 1, border: "none", borderTop: "1px solid rgba(196,154,56,0.15)" }} />
      </div>
      <h2 className="section-title">{title}</h2>
      {sub && <p className="font-body" style={{ color: "var(--muted)", fontSize: "1rem", marginTop: "10px", lineHeight: 1.65, maxWidth: "560px" }}>{sub}</p>}
      <div style={{ width: "48px", height: "2px", background: "var(--rust)", marginTop: "14px", opacity: 0.6 }} />
    </div>
  );

  const SuccessMsg = ({ text }) => (
    <div style={{ display: "inline-flex", alignItems: "center", gap: "10px", padding: "14px 18px", background: "rgba(139,37,0,0.08)", border: "1px solid rgba(139,37,0,0.3)", borderRadius: "2px" }}>
      <span className="font-display" style={{ color: "var(--rust)" }}>✦</span>
      <span className="font-body" style={{ color: "var(--sepia-dark)", fontSize: "1.05rem" }}>{text}</span>
    </div>
  );

  return (
    <>
      <style>{styles}</style>

      {/* NAV */}
      <nav className="nav-fixed">
        <div style={{ maxWidth: "1100px", margin: "0 auto", padding: "0 clamp(20px, 4vw, 60px)", height: "60px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <button onClick={() => scrollTo("home")} style={{ background: "none", border: "none", cursor: "pointer", padding: 0 }}>
            <span className="font-display" style={{ color: "var(--gold)", letterSpacing: "0.24em", fontSize: "0.8rem", fontWeight: 700 }}>THE PAPER TRAIL</span>
          </button>
          <div className="nav-desktop">
            {[["Subjects", "subjects"], ["Episodes", "episodes"], ["Archive", "archive"]].map(([label, id]) => (
              <button key={id} className="nav-desktop-link" onClick={() => scrollTo(id)}>{label}</button>
            ))}
            <button className="support-btn" style={{ color: "var(--cream)", padding: "8px 18px", borderRadius: "2px", fontSize: "0.65rem" }} onClick={() => scrollTo("fund")}>Support the Film</button>
          </div>
          <button className="nav-hamburger" onClick={() => setDrawerOpen(true)} style={{ background: "none", border: "none", cursor: "pointer", padding: "8px", display: "flex", flexDirection: "column", gap: "5px" }}>
            {[0,1,2].map(i => <span key={i} style={{ display: "block", width: "22px", height: "1.5px", background: "var(--aged)" }} />)}
          </button>
        </div>
      </nav>

      {/* DRAWER */}
      <div className={`drawer-overlay ${drawerOpen ? "open" : ""}`} onClick={() => setDrawerOpen(false)} />
      <div className={`drawer ${drawerOpen ? "open" : ""}`}>
        <button onClick={() => setDrawerOpen(false)} style={{ position: "absolute", top: "18px", right: "18px", background: "none", border: "none", cursor: "pointer", color: "var(--muted)", fontSize: "1.4rem" }}>✕</button>
        <p className="font-fell" style={{ color: "var(--rust)", fontSize: "0.62rem", letterSpacing: "0.35em", marginBottom: "20px" }}>NAVIGATE</p>
        {[["Subjects", "subjects"], ["Episodes", "episodes"], ["Archive", "archive"], ["Fund the Film", "fund"]].map(([label, id]) => (
          <button key={id} onClick={() => scrollTo(id)} className="font-display"
            style={{ background: "none", border: "none", borderBottom: "1px solid rgba(196,154,56,0.08)", padding: "14px 0", color: "var(--parchment)", fontSize: "1.1rem", cursor: "pointer", textAlign: "left", letterSpacing: "0.05em" }}>
            {label}
          </button>
        ))}
        <button className="support-btn" style={{ marginTop: "24px", color: "var(--cream)", padding: "12px 0", borderRadius: "2px", fontSize: "0.78rem", width: "100%" }} onClick={() => scrollTo("fund")}>
          Support the Film
        </button>
      </div>

      {/* HERO */}
      <section id="home" className="hero-section">
        <div className="hero-masthead" style={{ position: "relative", zIndex: 1 }}>
          <div className="hero-kicker">A Documentary Series in Four Parts</div>
          <hr className="masthead-rule" />
          <hr className="masthead-rule-thin" />
          <div className="hero-title-block">
            <h1 className="hero-title">The Paper Trail</h1>
          </div>
          <hr className="masthead-rule-thin" />
          <hr className="masthead-rule" style={{ marginBottom: "10px" }} />
          <div className="hero-subtitle-bar">
            <span className="font-body" style={{ color: "var(--muted)", fontSize: "0.72rem", letterSpacing: "0.08em" }}>Four Families. Four States. One Century of Erasure.</span>
            <span className="font-body" style={{ color: "var(--muted)", fontSize: "0.72rem", letterSpacing: "0.08em" }}>Pre-Production · 2025</span>
          </div>
        </div>

        <div className="hero-body" style={{ position: "relative", zIndex: 1 }}>
          <div className="hero-col">
            <p className="hero-dateline">The Deep South, 1865–1910</p>
            <p className="hero-lede">
              They survived a record system designed to erase them. <em>The Paper Trail</em> is a four-episode investigative documentary series that traces four formerly enslaved families — through courthouse ledgers, census margins, church rolls, and land deeds — across Alabama, Texas, Mississippi, and Georgia.
            </p>
            <div className="hero-pullquote"><p>"The record is the resistance."</p></div>
            <p className="font-body" style={{ color: "var(--muted)", fontSize: "0.95rem", lineHeight: 1.65, marginBottom: "20px" }}>
              This is not heritage filmmaking. It is investigative documentary work — made with the rigor of a cold case and the intimacy of a family portrait.
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: "10px", marginBottom: "24px" }}>
              <button className="support-btn" style={{ color: "var(--cream)", padding: "13px 0", borderRadius: "2px", fontSize: "0.78rem", width: "100%" }} onClick={() => scrollTo("fund")}>Support the Film</button>
              <button className="ghost-btn" style={{ padding: "12px 0", borderRadius: "2px", fontSize: "0.9rem", width: "100%" }} onClick={() => scrollTo("episodes")}>View Episodes</button>
            </div>
          </div>

          <div className="hero-col" style={{ borderLeft: "1px solid rgba(196,154,56,0.1)", paddingLeft: "24px" }}>
            <p className="font-fell" style={{ color: "var(--rust)", fontSize: "0.62rem", letterSpacing: "0.3em", fontStyle: "italic", marginBottom: "10px" }}>THE FOUR SUBJECTS</p>
            <div style={{ display: "flex", flexDirection: "column" }}>
              {Object.entries(SUBJECTS).map(([key, s], i) => (
                <div key={key} onClick={() => { setSubFilter(key); scrollTo("episodes"); }}
                  style={{ padding: "12px 0", borderBottom: "1px solid rgba(196,154,56,0.1)", cursor: "pointer", display: "flex", gap: "12px", alignItems: "flex-start" }}>
                  <span className="font-display" style={{ color: s.color, fontSize: "1.4rem", fontWeight: 900, lineHeight: 1, flexShrink: 0, width: "28px" }}>{(i+1).toString().padStart(2,"0")}</span>
                  <div>
                    <div className="font-display" style={{ color: "var(--parchment)", fontSize: "0.9rem", fontWeight: 700, marginBottom: "2px" }}>{s.name}</div>
                    <div className="font-fell" style={{ color: "var(--muted)", fontSize: "0.78rem", fontStyle: "italic" }}>{s.region}</div>
                    <div style={{ display: "flex", gap: "8px", marginTop: "5px", alignItems: "center" }}>
                      <span style={{ display: "block", width: "20px", height: "2px", background: s.color }} />
                      <span className="font-body" style={{ color: s.color, fontSize: "0.6rem", letterSpacing: "0.12em" }}>{s.ep} · {s.epTitle}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div style={{ display: "flex", gap: "24px", marginTop: "18px" }}>
              {[["4", "Subjects"], ["4 States", "Coverage"], [EPISODES.length + " Eps", "In Production"]].map(([val, label]) => (
                <div key={val}>
                  <div className="font-display" style={{ color: "var(--gold)", fontSize: "1.3rem", fontWeight: 700 }}>{val}</div>
                  <div className="font-body" style={{ color: "var(--muted)", fontSize: "0.62rem", letterSpacing: "0.12em" }}>{label.toUpperCase()}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="geo-divider" style={{ position: "relative", zIndex: 1 }}>
          {Object.entries(SUBJECTS).map(([key, s]) => (
            <div key={key} className="geo-segment" style={{ color: s.color, borderRight: "1px solid rgba(196,154,56,0.08)", background: `${s.color}08` }}>
              {s.region.split("→")[0].trim()}
            </div>
          ))}
        </div>
      </section>

      {/* SUBJECTS */}
      <section id="subjects" style={{ background: "#0c0600", padding: "clamp(60px, 8vw, 100px) 0" }}>
        <div className="section-inner">
          <Reveal><SectionHeader eyebrow="THE FOUR LINES" title="Subjects" sub="Each subject represents a distinct family line, geography, and archival challenge." /></Reveal>
          <Reveal delay={100}>
            <div className="subject-dossier">
              {Object.entries(SUBJECTS).map(([key, s], i) => (
                <div key={key} className="dossier-cell card-tap" data-num={i+1}
                  onClick={() => { setSubFilter(key); scrollTo("episodes"); }}
                  style={{ borderTopColor: s.color, borderTopWidth: "3px", borderTopStyle: "solid" }}>
                  <span className="dossier-tag" style={{ background: `${s.color}18`, border: `1px solid ${s.color}40`, color: s.color }}>
                    {key === "thompson" ? "Family" : "Individual"}
                  </span>
                  <h3 className="font-display" style={{ color: "var(--parchment)", fontSize: "0.95rem", fontWeight: 700, lineHeight: 1.25, marginBottom: "6px" }}>{s.name}</h3>
                  <div className="font-fell" style={{ color: "var(--aged)", fontSize: "0.78rem", fontStyle: "italic", marginBottom: "3px" }}>{s.period}</div>
                  <div className="font-body" style={{ color: "var(--muted)", fontSize: "0.72rem", lineHeight: 1.4 }}>{s.region}</div>
                  <div style={{ marginTop: "14px", display: "flex", alignItems: "center", gap: "6px" }}>
                    <span style={{ display: "block", width: "16px", height: "1.5px", background: s.color }} />
                    <span className="font-body" style={{ color: s.color, fontSize: "0.6rem", letterSpacing: "0.14em" }}>{s.ep} · {s.epTitle}</span>
                  </div>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </section>


      {/* MAP */}
      <section id="map" style={{ background: "linear-gradient(180deg, #0c0600 0%, #0a0400 100%)", padding: "clamp(60px, 8vw, 100px) 0" }}>
        <div className="section-inner">
          <Reveal>
            <SectionHeader eyebrow="THE GEOGRAPHY" title="The Territory" sub="Five states. Four families. The routes they walked, fled, and built upon." />
          </Reveal>
          <Reveal delay={120}>
            <SouthernMap subjects={SUBJECTS} />
          </Reveal>
        </div>
      </section>

      {/* EPISODES */}
      <section id="episodes" style={{ background: "radial-gradient(ellipse at bottom right, #1a0d04, #0c0600)", padding: "clamp(60px, 8vw, 100px) 0" }}>
        <div className="section-inner">
          <Reveal><SectionHeader eyebrow="THE SERIES" title="Episodes" /></Reveal>
          <Reveal delay={80}><FilterChips /></Reveal>
          <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
            {filteredEps.map((ep, idx) => {
              const sub = SUBJECTS[ep.subject];
              const state = epStates[ep.id];
              return (
                <Reveal key={ep.id} delay={idx * 80}>
                  <div className="ep-card" style={{ borderRadius: "2px", overflow: "hidden", background: "rgba(22,11,3,0.8)", border: "1px solid rgba(196,154,56,0.1)", boxShadow: "0 4px 20px rgba(0,0,0,0.6)" }}>
                    <div style={{ borderLeft: `4px solid ${sub.color}`, display: "flex", flexDirection: "inherit", flex: 1 }}>
                      <VideoPlayer videoUrl={ep.videoUrl} subjectColor={sub.color} episodeNumber={ep.id} />
                      <div style={{ padding: "18px", flex: 1 }}>
                        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "8px", gap: "8px" }}>
                          <div style={{ display: "flex", alignItems: "center", gap: "8px", flexWrap: "wrap" }}>
                            <span className="font-body" style={{ color: "var(--muted)", fontSize: "0.68rem", letterSpacing: "0.15em" }}>{ep.number}</span>
                            <span className="subject-pill" style={{ background: `${sub.color}18`, border: `1px solid ${sub.color}44`, color: sub.color }}>{sub.short}</span>
                          </div>
                          <span className={`subject-pill ${state === "watch_now" ? "watch-badge" : ""}`}
                            style={{ background: state === "watch_now" ? "rgba(196,154,56,0.15)" : "rgba(90,60,20,0.25)", border: `1px solid ${state === "watch_now" ? "rgba(196,154,56,0.5)" : "rgba(90,60,20,0.25)"}`, color: state === "watch_now" ? "var(--gold)" : "var(--muted)" }}>
                            {state === "watch_now" ? "WATCH NOW" : "COMING SOON"}
                          </span>
                        </div>
                        <h3 className="font-display" style={{ color: "var(--parchment)", fontSize: "1.15rem", fontWeight: 700, marginBottom: "6px" }}>{ep.title}</h3>
                        <p className="font-body" style={{ color: "var(--muted)", fontSize: "0.92rem", lineHeight: 1.65 }}>{ep.description}</p>
                        <div style={{ display: "flex", gap: "10px", marginTop: "14px" }}>
                          {state === "watch_now"
                            ? <button className="support-btn" style={{ color: "var(--cream)", padding: "9px 20px", borderRadius: "2px", fontSize: "0.75rem" }}>▶ Watch Now</button>
                            : <button className="ghost-btn" style={{ padding: "8px 18px", borderRadius: "2px", fontSize: "0.82rem" }} onClick={() => openNotify(ep)}>Notify Me</button>
                          }
                        </div>
                      </div>
                    </div>
                  </div>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>

      {/* ARCHIVE */}
      <section id="archive" style={{ background: "#090502", padding: "clamp(60px, 8vw, 100px) 0" }}>
        <div className="section-inner">
          <Reveal><SectionHeader eyebrow="THE EVIDENCE" title="Research Archive" sub="Primary sources, archival findings, and investigative notes from production." /></Reveal>
          <Reveal delay={80}><FilterChips /></Reveal>
          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            {filteredResearch.map((entry, idx) => {
              const sub = SUBJECTS[entry.subject];
              const isOpen = expanded === entry.id;
              return (
                <Reveal key={entry.id} delay={idx * 70}>
                  <div className="archive-card card-tap" onClick={() => setExpanded(isOpen ? null : entry.id)} style={{ borderLeft: `4px solid ${sub.color}` }}>
                    <div style={{ padding: "18px" }}>
                      <div style={{ display: "flex", gap: "6px", marginBottom: "10px", flexWrap: "wrap" }}>
                        <span className="subject-pill" style={{ background: `${sub.color}18`, border: `1px solid ${sub.color}44`, color: sub.color }}>{sub.short}</span>
                        <span className="subject-pill" style={{ background: "rgba(139,37,0,0.1)", border: "1px solid rgba(139,37,0,0.3)", color: "var(--rust)" }}>{entry.tag}</span>
                      </div>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "12px" }}>
                        <h3 className="font-display" style={{ color: "var(--sepia-dark)", fontSize: "1rem", fontWeight: 700, lineHeight: 1.3, flex: 1 }}>{entry.title}</h3>
                        <div style={{ textAlign: "right", flexShrink: 0 }}>
                          <div className="font-fell" style={{ color: "var(--sepia-light)", fontSize: "0.78rem", fontStyle: "italic" }}>{entry.date}</div>
                          <div className="font-body" style={{ color: "var(--muted)", fontSize: "0.68rem", marginTop: "2px" }}>{entry.location}</div>
                        </div>
                      </div>
                      <hr style={{ border: "none", borderTop: "1px solid rgba(90,60,20,0.18)", margin: "10px 0" }} />
                      <p className="font-body" style={{ color: "var(--sepia-mid)", fontSize: "0.95rem", lineHeight: 1.7, maxHeight: isOpen ? "none" : "3.2rem", overflow: "hidden" }}>{entry.summary}</p>
                      <button className="font-body" style={{ color: "var(--rust)", fontSize: "0.68rem", letterSpacing: "0.12em", background: "none", border: "none", cursor: "pointer", marginTop: "8px", padding: 0 }}>
                        {isOpen ? "▲ COLLAPSE" : "▼ READ MORE"}
                      </button>
                    </div>
                  </div>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>

      {/* FUNDING */}
      <section id="fund" style={{ background: "radial-gradient(ellipse at top, #201005, #0c0600)", padding: "clamp(60px, 8vw, 100px) 0" }}>
        <div className="section-inner">
          <Reveal><SectionHeader eyebrow="FUND THE INVESTIGATION" title="Support the Film" sub="Public crowdfunding, foundation grants, and streaming partnerships." /></Reveal>
          <Reveal delay={80}>
            <div className="tab-row">
              {[["public", "Public Campaign"], ["foundations", "Foundations"], ["streaming", "Streaming"]].map(([id, label]) => (
                <button key={id} className={`tab-btn ${fundTab === id ? "active" : ""}`} onClick={() => setFundTab(id)}>{label}</button>
              ))}
            </div>
          </Reveal>

          {fundTab === "public" && (
            <Reveal>
              <div className="paper-texture" style={{ borderRadius: "2px", padding: "28px 24px", border: "1px solid rgba(196,154,56,0.2)", position: "relative", boxShadow: "0 8px 40px rgba(0,0,0,0.5)" }}>
                <div className="stamp" style={{ position: "absolute", top: "16px", right: "16px", padding: "4px 10px", textAlign: "center" }}>
                  <div className="font-display" style={{ color: "var(--rust)", fontSize: "0.58rem", letterSpacing: "0.2em" }}>CAMPAIGN</div>
                  <div className="font-display" style={{ color: "var(--rust)", fontSize: "1rem", fontWeight: 700 }}>ACTIVE</div>
                </div>
                <p className="font-body" style={{ color: "var(--sepia-dark)", fontSize: "1.05rem", lineHeight: 1.75, marginBottom: "14px", maxWidth: "480px" }}>
                  Willis in Alabama. Abram in Texas. The Thompsons in Mississippi. Henry in Georgia. Four families who survived in the margins of a record system that wasn't designed to remember them.
                </p>
                <p className="font-body" style={{ color: "var(--sepia-mid)", fontSize: "0.95rem", lineHeight: 1.7, marginBottom: "22px" }}>
                  Your support funds courthouse travel, archival licensing, and production across all four episodes.
                </p>

                {/* PROGRESS */}
                <div style={{ marginBottom: "28px" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "10px" }}>
                    <span className="font-display" style={{ color: "var(--sepia-dark)", fontSize: "1.7rem", fontWeight: 700 }}>${raised.toLocaleString()}</span>
                    <span className="font-body" style={{ color: "var(--sepia-light)", fontSize: "0.9rem", alignSelf: "flex-end" }}>of ${CAMPAIGN.goal.toLocaleString()}</span>
                  </div>
                  <div style={{ height: "6px", background: "rgba(90,60,20,0.18)", borderRadius: "2px", overflow: "hidden", border: "1px solid rgba(90,60,20,0.12)" }}>
                    <div className="progress-fill" style={{ height: "100%", width: `${progress.toFixed(1)}%`, transition: "width 0.8s ease" }} />
                  </div>
                  <div style={{ display: "flex", gap: "24px", marginTop: "12px" }}>
                    <div><div className="font-display" style={{ color: "var(--sepia-dark)", fontWeight: 700, fontSize: "1.1rem" }}>{backers}</div><div className="font-body" style={{ color: "var(--sepia-light)", fontSize: "0.66rem", letterSpacing: "0.1em" }}>BACKERS</div></div>
                    <div><div className="font-display" style={{ color: "var(--sepia-dark)", fontWeight: 700, fontSize: "1.1rem" }}>{progress.toFixed(1)}%</div><div className="font-body" style={{ color: "var(--sepia-light)", fontSize: "0.66rem", letterSpacing: "0.1em" }}>FUNDED</div></div>
                  </div>
                </div>

                {/* STRIPE */}
                <p className="font-body" style={{ color: "var(--sepia-mid)", fontSize: "0.75rem", letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: "12px" }}>Choose an amount</p>
                <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", marginBottom: "16px" }}>
                  {[10, 25, 50, 100, 250].map(a => (
                    <a key={a} href={STRIPE_URL || "#"} target="_blank" rel="noopener noreferrer" className="font-body"
                      style={{ background: "rgba(90,60,20,0.08)", border: "1px solid rgba(90,60,20,0.22)", color: "var(--sepia-mid)", borderRadius: "2px", cursor: "pointer", padding: "10px 18px", fontSize: "0.95rem", textDecoration: "none", display: "inline-block" }}>
                      ${a}
                    </a>
                  ))}
                </div>
                <a href={STRIPE_URL || "#"} target="_blank" rel="noopener noreferrer"
                  style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "8px", padding: "14px 0", borderRadius: "2px", fontSize: "0.78rem", width: "100%", textDecoration: "none", background: "linear-gradient(135deg, #1a4a1a 0%, #0d2e0d 100%)", border: "1px solid rgba(100,200,100,0.3)", color: "#a8e6a8", fontFamily: "'Playfair Display', serif", letterSpacing: "0.14em", textTransform: "uppercase" }}>
                  <span>🔒</span><span>Donate Securely via Stripe</span>
                </a>
                <p className="font-body" style={{ color: "var(--sepia-light)", fontSize: "0.72rem", marginTop: "8px", textAlign: "center" }}>
                  Secure payment by Stripe. You'll be redirected to a hosted checkout page.
                </p>
              </div>
            </Reveal>
          )}

          {fundTab === "foundations" && (
            <Reveal>
              <div>
                <div className="paper-texture" style={{ borderRadius: "2px", padding: "22px 20px", border: "1px solid rgba(196,154,56,0.2)", marginBottom: "16px" }}>
                  <h3 className="font-display" style={{ color: "var(--sepia-dark)", fontSize: "1.25rem", fontWeight: 700, marginBottom: "12px" }}>Case Statement</h3>
                  <hr style={{ border: "none", borderTop: "1px solid rgba(90,60,20,0.18)", marginBottom: "14px" }} />
                  <div className="font-body" style={{ color: "var(--sepia-mid)", fontSize: "1rem", lineHeight: 1.8 }}>
                    <p style={{ marginBottom: "12px" }}><em>The Paper Trail</em> is a four-episode documentary series using genealogical research, archival investigation, and original filmmaking to recover the stories of four families who were enslaved across the Deep South.</p>
                    <p style={{ marginBottom: "12px" }}>This is not heritage filmmaking. It is investigative documentary work, made with the rigor of a cold case and the intimacy of a family portrait.</p>
                    <p style={{ marginBottom: "12px" }}><strong style={{ color: "var(--sepia-dark)" }}>Subjects:</strong> Willis Henry Willoughby (AL→FL), Abram Ellis (TX), the Thompson Family (MS), Henry Reed (GA).</p>
                    <p><strong style={{ color: "var(--sepia-dark)" }}>Budget:</strong> $125,000 across four episodes — archival licensing, travel to five state archives, original music, and post-production.</p>
                  </div>
                </div>
                <h3 className="font-display" style={{ color: "var(--parchment)", fontSize: "1rem", fontWeight: 700, marginBottom: "12px" }}>Target Funders</h3>
                <div className="grid-funders" style={{ marginBottom: "20px" }}>
                  {FUNDERS.map((f, i) => (
                    <div key={i} className="funder-card" style={{ borderRadius: "2px", padding: "12px 14px" }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "8px" }}>
                        <div>
                          <div className="font-display" style={{ color: "var(--parchment)", fontSize: "0.88rem", fontWeight: 700 }}>{f.name}</div>
                          <div className="font-body" style={{ color: "var(--muted)", fontSize: "0.78rem", marginTop: "3px" }}>{f.focus}</div>
                        </div>
                        <span className="subject-pill" style={{ background: "rgba(196,154,56,0.08)", border: "1px solid rgba(196,154,56,0.22)", color: "var(--aged)", flexShrink: 0 }}>{f.type}</span>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="paper-texture" style={{ borderRadius: "2px", padding: "22px 20px", border: "1px solid rgba(196,154,56,0.2)" }}>
                  <h3 className="font-display" style={{ color: "var(--sepia-dark)", fontSize: "1.1rem", fontWeight: 700, marginBottom: "6px" }}>Letter of Inquiry</h3>
                  <p className="font-body" style={{ color: "var(--sepia-light)", fontSize: "0.9rem", marginBottom: "16px" }}>Foundation officers — reach the production team directly.</p>
                  {!loiSent ? (
                    <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                      <input className="loi-input" placeholder="Your name" value={loiForm.name} onChange={e => setLoiForm(p=>({...p,name:e.target.value}))} />
                      <input className="loi-input" placeholder="Organization" value={loiForm.org} onChange={e => setLoiForm(p=>({...p,org:e.target.value}))} />
                      <input className="loi-input" placeholder="Funder type" value={loiForm.type} onChange={e => setLoiForm(p=>({...p,type:e.target.value}))} />
                      <input className="loi-input" placeholder="Email address" value={loiForm.email} onChange={e => setLoiForm(p=>({...p,email:e.target.value}))} />
                      <textarea className="loi-input" placeholder="Brief note (optional)" rows={3} value={loiForm.message} onChange={e => setLoiForm(p=>({...p,message:e.target.value}))} style={{ resize: "vertical" }} />
                      {loiError && <p className="error-msg">{loiError}</p>}
                      <button className="support-btn" style={{ color: "var(--cream)", padding: "13px 0", borderRadius: "2px", fontSize: "0.78rem", width: "100%" }} onClick={handleLoi} disabled={loiLoading}>
                        {loiLoading ? "Sending…" : "Send Letter of Inquiry"}
                      </button>
                    </div>
                  ) : <SuccessMsg text="Received. The team will follow up within 5 business days." />}
                </div>
              </div>
            </Reveal>
          )}

          {fundTab === "streaming" && (
            <Reveal>
              <div>
                <div className="paper-texture" style={{ borderRadius: "2px", padding: "22px 20px", border: "1px solid rgba(196,154,56,0.2)", marginBottom: "16px" }}>
                  <h3 className="font-display" style={{ color: "var(--sepia-dark)", fontSize: "1.25rem", fontWeight: 700, marginBottom: "12px" }}>Distribution Pitch</h3>
                  <hr style={{ border: "none", borderTop: "1px solid rgba(90,60,20,0.18)", marginBottom: "14px" }} />
                  <div className="font-body" style={{ color: "var(--sepia-mid)", fontSize: "1rem", lineHeight: 1.8 }}>
                    <p style={{ marginBottom: "12px" }}><em>The Paper Trail</em> is a four-episode limited docuseries. Each episode runs 45–55 minutes: one family, one geography, one archive.</p>
                    <p style={{ marginBottom: "12px" }}>The series sits at the intersection of three audiences that over-perform on streaming: Black history documentary, genealogical investigation, and Deep South storytelling.</p>
                    <p><strong style={{ color: "var(--sepia-dark)" }}>Format:</strong> 4 × ~50 min &nbsp;·&nbsp; <strong style={{ color: "var(--sepia-dark)" }}>Stage:</strong> Pre-production &nbsp;·&nbsp; <strong style={{ color: "var(--sepia-dark)" }}>Seeking:</strong> Presale, co-production, or acquisition.</p>
                  </div>
                </div>
                <div className="paper-texture" style={{ borderRadius: "2px", padding: "22px 20px", border: "1px solid rgba(196,154,56,0.2)" }}>
                  <h3 className="font-display" style={{ color: "var(--sepia-dark)", fontSize: "1.1rem", fontWeight: 700, marginBottom: "6px" }}>Express Streaming Interest</h3>
                  <p className="font-body" style={{ color: "var(--sepia-light)", fontSize: "0.9rem", marginBottom: "16px" }}>Development execs and acquisitions teams — contact the production team.</p>
                  {!streamSent ? (
                    <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                      <input className="loi-input" placeholder="Your name" value={streamForm.name} onChange={e => setStreamForm(p=>({...p,name:e.target.value}))} />
                      <input className="loi-input" placeholder="Platform / Network" value={streamForm.platform} onChange={e => setStreamForm(p=>({...p,platform:e.target.value}))} />
                      <input className="loi-input" placeholder="Email address" value={streamForm.email} onChange={e => setStreamForm(p=>({...p,email:e.target.value}))} />
                      <div>
                        <p className="font-body" style={{ color: "var(--sepia-light)", fontSize: "0.7rem", letterSpacing: "0.12em", marginBottom: "8px" }}>INTEREST TYPE</p>
                        <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                          {["Acquisition","Co-production","Pre-sale","Development","Festival only"].map(opt => (
                            <button key={opt} onClick={() => setStreamForm(p=>({...p,interest:opt}))} className="font-body"
                              style={{ borderRadius: "20px", cursor: "pointer", padding: "6px 14px", fontSize: "0.82rem", background: streamForm.interest===opt?"rgba(196,154,56,0.15)":"rgba(90,60,20,0.08)", border:`1px solid ${streamForm.interest===opt?"rgba(196,154,56,0.5)":"rgba(90,60,20,0.25)"}`, color:streamForm.interest===opt?"var(--gold)":"var(--sepia-mid)", transition:"all 0.2s" }}>
                              {opt}
                            </button>
                          ))}
                        </div>
                      </div>
                      {streamError && <p className="error-msg">{streamError}</p>}
                      <button className="support-btn" style={{ color: "var(--cream)", padding: "13px 0", borderRadius: "2px", fontSize: "0.78rem", width: "100%", marginTop: "4px" }} onClick={handleStream} disabled={streamLoading}>
                        {streamLoading ? "Submitting…" : "Submit Interest"}
                      </button>
                    </div>
                  ) : <SuccessMsg text="Interest logged. Expect a full pitch package within the week." />}
                </div>
              </div>
            </Reveal>
          )}
        </div>
      </section>

      {/* FOOTER */}
      <footer style={{ background: "var(--void)", borderTop: "1px solid rgba(196,154,56,0.08)", padding: "48px 20px", textAlign: "center" }}>
        <div className="footer-masthead" style={{ maxWidth: "400px", margin: "0 auto" }}>
          <p className="font-display" style={{ color: "var(--gold)", letterSpacing: "0.3em", fontSize: "0.88rem", fontWeight: 700, marginBottom: "6px" }}>THE PAPER TRAIL</p>
          <hr className="masthead-rule-thin" style={{ margin: "0 auto 6px" }} />
          <hr className="masthead-rule-thin" style={{ margin: "0 auto 16px" }} />
          <p className="font-fell" style={{ color: "var(--muted)", fontSize: "0.9rem", fontStyle: "italic", marginBottom: "20px" }}>"The record is the resistance."</p>
          <div style={{ display: "flex", justifyContent: "center", gap: "16px", flexWrap: "wrap", marginBottom: "20px" }}>
            {Object.values(SUBJECTS).map(s => (
              <span key={s.name} className="font-body" style={{ color: s.color, fontSize: "0.7rem" }}>{s.short}</span>
            ))}
          </div>
          <hr className="section-rule" style={{ maxWidth: "160px", margin: "0 auto 16px" }} />
          <p className="font-body" style={{ color: "var(--sepia-light)", fontSize: "0.7rem", letterSpacing: "0.1em" }}>© 2025 The Paper Trail Documentary Series</p>
        </div>
      </footer>

      {/* NOTIFY MODAL */}
      <div className={`modal-overlay ${notifyOpen ? "open" : ""}`} onClick={e => { if (e.target.classList.contains("modal-overlay")) setNotifyOpen(false); }}>
        <div className="modal-box">
          <button className="modal-close" onClick={() => setNotifyOpen(false)}>✕</button>
          <p className="font-fell" style={{ color: "var(--rust)", fontSize: "0.65rem", letterSpacing: "0.35em", marginBottom: "10px" }}>STAY INFORMED</p>
          <h3 className="font-display" style={{ color: "var(--parchment)", fontSize: "1.4rem", fontWeight: 700, marginBottom: "6px", lineHeight: 1.2 }}>
            {notifyEp ? notifyEp.title : "The Paper Trail"}
          </h3>
          <p className="font-body" style={{ color: "var(--muted)", fontSize: "0.92rem", lineHeight: 1.6, marginBottom: "20px" }}>
            {notifyEp
              ? `Be the first to know when ${notifyEp.number} drops. We'll reach out when it's ready.`
              : "Be the first to know when new episodes drop."}
          </p>
          <hr style={{ border: "none", borderTop: "1px solid rgba(196,154,56,0.12)", marginBottom: "20px" }} />
          {!notifySent ? (
            <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
              <input className="loi-input" placeholder="Your name" value={notifyForm.name}
                onChange={e => { setNotifyForm(p => ({ ...p, name: e.target.value })); setNotifyError(""); }}
                style={{ background: "rgba(90,60,20,0.12)", color: "var(--parchment)", borderColor: "rgba(196,154,56,0.2)" }} />
              <input className="loi-input" placeholder="Email address" value={notifyForm.email}
                onChange={e => { setNotifyForm(p => ({ ...p, email: e.target.value })); setNotifyError(""); }}
                style={{ background: "rgba(90,60,20,0.12)", color: "var(--parchment)", borderColor: "rgba(196,154,56,0.2)" }} />
              {notifyError && <p className="error-msg">{notifyError}</p>}
              <button className="support-btn" style={{ color: "var(--cream)", padding: "13px 0", borderRadius: "2px", fontSize: "0.78rem", width: "100%", marginTop: "4px" }}
                onClick={handleNotify} disabled={notifyLoading}>
                {notifyLoading ? "Submitting…" : "Notify Me"}
              </button>
            </div>
          ) : (
            <div style={{ display: "flex", alignItems: "center", gap: "10px", padding: "16px", background: "rgba(139,37,0,0.08)", border: "1px solid rgba(139,37,0,0.3)", borderRadius: "2px" }}>
              <span className="font-display" style={{ color: "var(--rust)" }}>✦</span>
              <span className="font-body" style={{ color: "var(--parchment)", fontSize: "1rem" }}>You're on the list. We'll be in touch.</span>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
