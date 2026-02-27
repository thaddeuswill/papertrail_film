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

const STATE_DATA = [
  {
    id: "tx", label: "Texas", subject: "abram", lx: 100, ly: 195,
    path: "M 30,155 L 38,120 L 50,90 L 75,70 L 105,58 L 130,45 L 150,38 L 170,35 L 178,48 L 175,65 L 168,85 L 162,108 L 158,135 L 155,165 L 152,195 L 150,222 L 152,238 L 162,252 L 175,262 L 182,272 L 178,282 L 165,288 L 148,290 L 120,290 L 90,290 L 62,288 L 45,278 L 36,262 L 32,242 L 30,215 L 28,185 L 28,155 Z",
  },
  {
    id: "ms", label: "Mississippi", subject: "thompson", lx: 323, ly: 205,
    path: "M 308,112 L 322,108 L 338,108 L 348,112 L 352,122 L 352,138 L 350,155 L 348,172 L 346,190 L 344,208 L 342,224 L 340,238 L 338,250 L 340,260 L 346,268 L 350,276 L 348,284 L 338,288 L 325,288 L 312,284 L 302,276 L 296,262 L 294,246 L 294,230 L 295,214 L 296,198 L 297,182 L 298,166 L 300,150 L 302,135 L 304,122 L 308,112 Z",
  },
  {
    id: "al", label: "Alabama", subject: "willis", lx: 378, ly: 210,
    path: "M 350,110 L 365,107 L 380,106 L 394,108 L 404,114 L 408,125 L 408,140 L 408,156 L 407,172 L 406,188 L 405,204 L 404,220 L 403,234 L 403,246 L 405,256 L 408,266 L 412,274 L 416,282 L 418,290 L 414,296 L 406,300 L 395,300 L 382,296 L 370,290 L 358,283 L 350,276 L 346,268 L 342,256 L 340,242 L 340,228 L 341,196 L 342,180 L 344,164 L 346,148 L 347,132 L 348,118 L 350,110 Z",
  },
  {
    id: "ga", label: "Georgia", subject: "henry", lx: 452, ly: 195,
    path: "M 408,108 L 422,106 L 438,105 L 454,105 L 468,107 L 480,112 L 490,120 L 496,132 L 498,146 L 498,162 L 496,178 L 494,194 L 492,210 L 490,224 L 488,236 L 486,248 L 482,258 L 476,265 L 468,268 L 458,268 L 446,264 L 434,258 L 422,250 L 413,242 L 407,232 L 405,220 L 404,206 L 404,178 L 405,164 L 405,150 L 406,136 L 407,122 L 408,108 Z",
  },
  {
    id: "fl", label: "Florida", subject: "willis", lx: 408, ly: 370,
    path: "M 350,300 L 365,298 L 382,297 L 398,297 L 412,298 L 424,300 L 436,302 L 448,306 L 458,312 L 464,322 L 464,335 L 460,348 L 455,360 L 448,372 L 438,384 L 426,395 L 412,404 L 398,412 L 384,418 L 370,422 L 358,420 L 348,414 L 342,404 L 340,392 L 340,378 L 342,364 L 344,350 L 346,336 L 348,322 L 350,308 L 350,300 Z",
  },
];

const ROUTES = [
  {
    key: "willis",
    // Lowndes Co AL (center-west AL) down to Marion Co FL (north-central FL)
    d: "M 374,195 C 372,230 368,260 366,290 C 364,310 368,330 375,355",
    fromLabel: "Lowndes Co., AL", toLabel: "Marion Co., FL",
    fromX: 374, fromY: 192, toX: 375, toY: 358,
  },
  {
    key: "abram",
    // East Texas internal movement
    d: "M 90,155 C 100,175 112,200 118,228 C 122,248 115,268 108,280",
    fromLabel: "East Texas", toLabel: "",
    fromX: 90, fromY: 152, toX: 108, toY: 280,
  },
  {
    key: "thompson",
    // Amite County MS — southwestern MS
    d: "M 310,195 C 312,218 315,238 318,258 C 320,272 322,280 320,285",
    fromLabel: "Amite Co., MS", toLabel: "",
    fromX: 310, fromY: 192, toX: 320, toY: 284,
  },
  {
    key: "henry",
    // Wilkes County GA — northeast GA
    d: "M 470,148 C 468,172 465,198 462,222 C 460,240 458,255 456,264",
    fromLabel: "Wilkes Co., GA", toLabel: "",
    fromX: 470, fromY: 145, toX: 456, toY: 264,
  },
];

function SouthernMap({ subjects }) {
  const [hovered, setHovered] = React.useState(null);

  return (
    <div style={{ width: "100%", maxWidth: "820px", margin: "0 auto" }}>
      {/* Parchment card */}
      <div style={{
        background: "radial-gradient(ellipse at 38% 32%, #d8ca9c 0%, #c9b882 45%, #b8a06a 100%)",
        border: "1px solid rgba(90,60,20,0.35)",
        borderRadius: "3px",
        padding: "24px 20px 20px",
        boxShadow: "inset 0 0 80px rgba(90,60,20,0.12), 0 12px 50px rgba(0,0,0,0.65)",
        position: "relative",
        overflow: "hidden",
      }}>
        {/* Paper lines */}
        <div style={{ position: "absolute", inset: 0, backgroundImage: "repeating-linear-gradient(0deg, transparent, transparent 27px, rgba(90,60,20,0.045) 28px)", pointerEvents: "none", zIndex: 0 }} />

        <div style={{ position: "relative", zIndex: 1 }}>
          {/* Header */}
          <div style={{ textAlign: "center", marginBottom: "14px" }}>
            <p style={{ fontFamily: "'IM Fell English', serif", color: "#5c3a1a", fontSize: "0.6rem", letterSpacing: "0.42em", fontStyle: "italic" }}>CARTOGRAPHY OF THE INVESTIGATION</p>
            <div style={{ height: "1px", background: "linear-gradient(to right, transparent, rgba(90,60,20,0.35), transparent)", marginTop: "6px" }} />
          </div>

          {/* SVG Map */}
          <svg viewBox="0 50 700 400" style={{ width: "100%", height: "auto", display: "block", overflow: "visible" }}>
            <defs>
              <filter id="roughen" x="-1%" y="-1%" width="102%" height="102%">
                <feTurbulence type="turbulence" baseFrequency="0.025" numOctaves="2" seed="5" result="noise" />
                <feDisplacementMap in="SourceGraphic" in2="noise" scale="1.8" xChannelSelector="R" yChannelSelector="G" />
              </filter>
              {ROUTES.map(r => (
                <marker key={r.key} id={`dot-${r.key}`} markerWidth="5" markerHeight="5" refX="2.5" refY="2.5">
                  <circle cx="2.5" cy="2.5" r="2.5" fill={subjects[r.key].color} opacity="0.85" />
                </marker>
              ))}
            </defs>

            {/* State fills */}
            {STATE_DATA.map(s => {
              const subj = subjects[s.subject];
              const isH = hovered === s.subject;
              const dimmed = hovered && hovered !== s.subject;
              return (
                <g key={s.id}
                  onMouseEnter={() => setHovered(s.subject)}
                  onMouseLeave={() => setHovered(null)}
                  style={{ cursor: "pointer" }}>
                  {/* Fill */}
                  <path
                    d={s.path}
                    fill={subj.color}
                    fillOpacity={isH ? 0.52 : dimmed ? 0.14 : 0.28}
                    stroke={subj.color}
                    strokeWidth={isH ? 2.2 : 1.4}
                    strokeOpacity={isH ? 0.95 : dimmed ? 0.3 : 0.6}
                    filter="url(#roughen)"
                    style={{ transition: "fill-opacity 0.25s, stroke-opacity 0.25s, stroke-width 0.25s" }}
                  />
                  {/* State label */}
                  <text
                    x={s.lx} y={s.ly}
                    fontFamily="'IM Fell English', serif"
                    fontSize={isH ? 12.5 : 10.5}
                    fontStyle="italic"
                    fill={subj.color}
                    fillOpacity={dimmed ? 0.3 : 0.88}
                    textAnchor="middle"
                    style={{ transition: "all 0.25s", pointerEvents: "none", userSelect: "none" }}>
                    {s.label}
                  </text>
                </g>
              );
            })}

            {/* Route lines */}
            {ROUTES.map(r => {
              const subj = subjects[r.key];
              const isH = hovered === r.key;
              const dimmed = hovered && hovered !== r.key;
              return (
                <g key={r.key}>
                  {/* Glow */}
                  <path d={r.d} fill="none" stroke={subj.color} strokeWidth="6" strokeOpacity="0.07" strokeLinecap="round" />
                  {/* Dashed line */}
                  <path
                    d={r.d}
                    fill="none"
                    stroke={subj.color}
                    strokeWidth={isH ? 2.8 : 1.8}
                    strokeOpacity={dimmed ? 0.15 : isH ? 1 : 0.72}
                    strokeLinecap="round"
                    strokeDasharray={r.key === "willis" ? "7,4" : "3,4"}
                    markerEnd={`url(#dot-${r.key})`}
                    style={{ transition: "all 0.25s" }}
                  />
                </g>
              );
            })}

            {/* Origin markers */}
            {ROUTES.map(r => {
              const subj = subjects[r.key];
              const isH = hovered === r.key;
              const dimmed = hovered && hovered !== r.key;
              return (
                <g key={r.key} style={{ transition: "opacity 0.25s" }} opacity={dimmed ? 0.25 : 1}>
                  <circle cx={r.fromX} cy={r.fromY} r={isH ? 7 : 5.5} fill="none" stroke={subj.color} strokeWidth="1.2" strokeOpacity="0.6" style={{ transition: "all 0.25s" }} />
                  <circle cx={r.fromX} cy={r.fromY} r={isH ? 3.5 : 2.5} fill={subj.color} fillOpacity="0.9" style={{ transition: "all 0.25s" }} />
                  {/* Hover tooltip */}
                  {isH && r.fromLabel && (
                    <g>
                      <rect x={r.fromX + 10} y={r.fromY - 16} width={r.fromLabel.length * 6.2 + 10} height="20" rx="2"
                        fill="rgba(20,10,2,0.92)" stroke={subj.color} strokeWidth="0.6" strokeOpacity="0.7" />
                      <text x={r.fromX + 15} y={r.fromY - 2}
                        fontFamily="'Crimson Pro', serif" fontSize="9.5" fill={subj.color} fontWeight="600">{r.fromLabel}</text>
                    </g>
                  )}
                  {/* Destination label for Willis */}
                  {isH && r.toLabel && (
                    <g>
                      <rect x={r.toX + 10} y={r.toY - 16} width={r.toLabel.length * 6.2 + 10} height="20" rx="2"
                        fill="rgba(20,10,2,0.92)" stroke={subj.color} strokeWidth="0.6" strokeOpacity="0.7" />
                      <text x={r.toX + 15} y={r.toY - 2}
                        fontFamily="'Crimson Pro', serif" fontSize="9.5" fill={subj.color} fontWeight="600">{r.toLabel}</text>
                    </g>
                  )}
                </g>
              );
            })}

            {/* Gulf of Mexico */}
            <text x="175" y="410" fontFamily="'IM Fell English', serif" fontSize="10" fill="rgba(92,58,26,0.38)" fontStyle="italic" textAnchor="middle">Gulf of Mexico</text>
            <text x="560" y="400" fontFamily="'IM Fell English', serif" fontSize="8.5" fill="rgba(92,58,26,0.32)" fontStyle="italic" textAnchor="middle">Atlantic</text>

            {/* Compass */}
            <g transform="translate(645,95)">
              <circle cx="0" cy="0" r="20" fill="rgba(184,160,106,0.15)" stroke="rgba(92,58,26,0.22)" strokeWidth="0.8" />
              {[["N",0,-14],["S",0,17],["E",16,4],["W",-16,4]].map(([l,dx,dy]) => (
                <text key={l} x={dx} y={dy} fontFamily="'IM Fell English', serif" fontSize="8.5" fill="rgba(92,58,26,0.6)" textAnchor="middle" fontStyle="italic">{l}</text>
              ))}
              <line x1="0" y1="-10" x2="0" y2="10" stroke="rgba(92,58,26,0.3)" strokeWidth="0.7" />
              <line x1="-10" y1="0" x2="10" y2="0" stroke="rgba(92,58,26,0.3)" strokeWidth="0.7" />
              <circle cx="0" cy="0" r="1.5" fill="rgba(92,58,26,0.5)" />
            </g>
          </svg>

          {/* Legend */}
          <div style={{ borderTop: "1px solid rgba(90,60,20,0.2)", paddingTop: "14px", marginTop: "4px", display: "flex", flexWrap: "wrap", gap: "10px 24px", justifyContent: "center" }}>
            {Object.entries(subjects).map(([key, s]) => (
              <div key={key}
                onMouseEnter={() => setHovered(key)}
                onMouseLeave={() => setHovered(null)}
                style={{ display: "flex", alignItems: "center", gap: "8px", cursor: "pointer", opacity: hovered && hovered !== key ? 0.35 : 1, transition: "opacity 0.25s" }}>
                <svg width="30" height="10" style={{ flexShrink: 0 }}>
                  <line x1="2" y1="5" x2="28" y2="5" stroke={s.color} strokeWidth="2" strokeDasharray={key === "willis" ? "6,3" : "3,3"} strokeOpacity="0.9" />
                  <circle cx="4" cy="5" r="3" fill={s.color} />
                </svg>
                <span style={{ fontFamily: "'Crimson Pro', serif", color: s.color, fontSize: "0.76rem", letterSpacing: "0.04em", whiteSpace: "nowrap" }}>
                  {s.short} · {s.region.split("→")[0].trim()}
                </span>
              </div>
            ))}
          </div>
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
