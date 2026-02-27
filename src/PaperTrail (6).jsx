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

const STATE_PATHS = {
  TX: {
    subject: "abram", label: "Texas", lx: 169.6, ly: 202.0,
    d: "M 106.5,22.4 L 104.5,28.2 L 103.8,34.0 L 102.5,39.8 L 101.9,45.6 L 101.2,51.4 L 100.6,57.2 L 99.2,63.0 L 98.6,68.8 L 97.9,74.6 L 97.3,80.4 L 96.6,86.2 L 95.3,92.0 L 94.6,97.8 L 94.0,103.6 L 92.7,109.3 L 92.0,115.1 L 91.4,120.9 L 90.7,126.7 L 89.4,132.5 L 88.7,138.3 L 88.1,144.1 L 87.4,149.9 L 0.7,155.7 L 2.0,161.5 L 7.2,167.3 L 11.2,173.1 L 15.1,178.9 L 19.1,184.7 L 23.0,190.4 L 27.6,196.2 L 31.5,202.0 L 32.2,207.8 L 33.5,213.6 L 34.2,219.4 L 35.5,225.2 L 36.2,231.0 L 39.4,236.8 L 44.7,242.6 L 51.3,248.4 L 59.2,254.2 L 130.1,260.0 L 133.4,265.8 L 136.1,271.6 L 138.0,277.3 L 140.0,283.1 L 142.6,288.9 L 145.3,294.7 L 146.6,300.5 L 149.2,306.3 L 151.8,312.1 L 158.4,317.9 L 159.7,323.7 L 159.7,329.5 L 161.0,335.3 L 161.0,341.1 L 163.7,346.9 L 168.9,352.7 L 170.2,358.4 L 175.5,364.2 L 182.7,370.0 L 204.4,375.8 L 211.0,375.8 L 210.3,370.0 L 207.7,364.2 L 207.7,358.4 L 206.4,352.7 L 205.1,346.9 L 203.1,341.1 L 200.5,335.3 L 207.0,329.5 L 212.3,323.7 L 205.1,317.9 L 222.2,312.1 L 223.5,306.3 L 230.0,300.5 L 234.0,294.7 L 268.2,288.9 L 279.3,283.1 L 279.3,277.3 L 278.7,271.6 L 308.9,265.8 L 310.9,260.0 L 313.5,254.2 L 314.8,248.4 L 314.2,242.6 L 314.2,236.8 L 316.2,231.0 L 316.2,225.2 L 312.9,219.4 L 312.9,213.6 L 312.9,207.8 L 310.9,202.0 L 308.9,196.2 L 306.3,190.4 L 305.0,184.7 L 305.0,178.9 L 305.6,173.1 L 306.9,167.3 L 307.6,161.5 L 307.6,155.7 L 308.3,149.9 L 305.0,144.1 L 293.1,138.3 L 284.6,132.5 L 217.6,126.7 L 214.3,120.9 L 196.5,115.1 L 188.0,109.3 L 182.7,103.6 L 168.9,97.8 L 165.0,92.0 L 165.0,86.2 L 166.3,80.4 L 166.9,74.6 L 167.6,68.8 L 167.6,63.0 L 168.3,57.2 L 168.9,51.4 L 169.6,45.6 L 170.2,39.8 L 169.6,34.0 L 140.7,28.2 L 107.8,22.4 Z",
  },
  MS: {
    subject: "thompson", label: "Mississippi", lx: 350, ly: 222,
    d: "M 313.5,162.2 L 312.9,163.7 L 312.2,165.1 L 312.2,166.6 L 311.5,168.0 L 312.2,169.4 L 311.5,170.9 L 311.5,172.3 L 311.5,173.8 L 311.5,175.2 L 310.9,176.7 L 310.9,178.1 L 310.2,179.6 L 310.2,181.0 L 310.2,182.5 L 310.2,183.9 L 310.9,185.4 L 310.2,186.8 L 310.9,188.3 L 312.2,189.7 L 312.2,191.2 L 312.9,192.6 L 313.5,194.1 L 314.2,195.5 L 314.2,197.0 L 314.2,198.4 L 316.2,199.9 L 316.2,201.3 L 317.5,202.8 L 318.1,204.2 L 318.1,205.7 L 318.1,207.1 L 318.8,208.6 L 318.8,210.0 L 318.1,211.4 L 318.1,212.9 L 318.1,214.3 L 318.1,215.8 L 318.8,217.2 L 319.4,218.7 L 320.1,220.1 L 320.8,221.6 L 321.4,223.0 L 322.1,224.5 L 322.1,225.9 L 322.1,227.4 L 321.4,228.8 L 321.4,230.3 L 320.8,231.7 L 320.1,233.2 L 320.1,234.6 L 320.8,236.1 L 319.4,237.5 L 319.4,239.0 L 318.8,240.4 L 319.4,241.9 L 319.4,243.3 L 319.4,244.8 L 319.4,246.2 L 319.4,247.7 L 319.4,249.1 L 319.4,250.6 L 318.8,252.0 L 318.8,253.4 L 318.8,254.9 L 318.1,256.3 L 318.1,257.8 L 318.1,259.2 L 316.8,260.7 L 316.2,262.1 L 314.8,263.6 L 315.5,265.0 L 333.9,266.5 L 336.5,267.9 L 337.2,269.4 L 346.4,270.8 L 350.3,272.3 L 379.9,273.7 L 380.6,278.1 L 386.5,283.9 L 390.4,289.7 L 394.4,288.2 L 402.9,283.9 L 409.5,269.4 L 412.1,270.8 L 416.1,273.7 L 416.1,272.3 L 416.7,275.2 L 416.1,278.1 L 416.7,279.5 L 415.4,250.6 L 412.8,244.8 L 412.1,241.9 L 412.8,237.5 L 410.1,234.6 L 376.0,233.2 L 367.4,228.8 L 368.7,224.5 L 373.3,214.3 L 377.3,207.1 L 379.9,201.3 L 381.2,197.0 L 383.8,189.7 L 385.8,185.4 L 383.2,178.1 L 383.2,172.3 L 383.8,168.0 L 381.2,166.6 L 367.4,165.1 L 341.1,163.7 L 315.5,162.2 Z",
  },
  AL: {
    subject: "willis", label: "Alabama", lx: 422, ly: 177,
    d: "M 413.4,99.9 L 412.1,102.1 L 409.5,104.3 L 408.2,106.4 L 407.5,108.6 L 406.9,110.8 L 404.9,113.0 L 404.2,115.1 L 402.9,117.3 L 400.9,119.5 L 399.6,121.7 L 398.3,123.8 L 396.3,126.0 L 395.0,128.2 L 393.7,130.3 L 392.4,132.5 L 391.1,134.7 L 390.4,136.9 L 389.8,139.0 L 389.8,141.2 L 391.1,143.4 L 391.1,145.6 L 391.7,147.7 L 391.7,149.9 L 391.7,152.1 L 391.7,154.2 L 391.1,156.4 L 390.4,158.6 L 389.8,160.8 L 389.1,162.9 L 389.1,165.1 L 389.1,167.3 L 388.5,169.4 L 388.5,171.6 L 388.5,173.8 L 388.5,176.0 L 389.1,178.1 L 389.8,180.3 L 390.4,182.5 L 391.1,184.7 L 391.1,186.8 L 390.4,189.0 L 389.8,191.2 L 387.8,193.3 L 387.1,195.5 L 385.8,197.7 L 385.2,199.9 L 385.2,202.0 L 383.8,204.2 L 382.5,206.4 L 381.2,208.6 L 380.6,210.7 L 379.2,212.9 L 378.6,215.1 L 376.6,217.2 L 376.0,219.4 L 374.6,221.6 L 374.0,223.8 L 374.0,225.9 L 376.0,228.1 L 416.1,230.3 L 418.0,234.6 L 418.0,236.8 L 417.4,239.0 L 417.4,243.3 L 418.7,247.7 L 423.3,254.2 L 430.5,252.0 L 446.9,249.8 L 446.9,245.5 L 446.9,241.1 L 446.9,236.8 L 446.9,232.4 L 446.9,228.1 L 446.9,223.8 L 446.9,219.4 L 447.6,215.1 L 447.6,210.7 L 447.6,206.4 L 447.6,202.0 L 447.6,197.7 L 448.3,193.3 L 448.9,189.0 L 449.6,184.7 L 449.6,180.3 L 450.2,176.0 L 450.9,169.4 L 451.5,162.9 L 452.2,154.2 L 452.9,147.7 L 453.5,141.2 L 453.5,136.9 L 454.2,132.5 L 454.8,126.0 L 455.5,119.5 L 456.2,113.0 L 456.2,108.6 L 455.5,104.3 L 439.7,102.1 L 419.3,99.9 Z",
  },
  GA: {
    subject: "henry", label: "Georgia", lx: 494, ly: 178,
    d: "M 519.9,104.3 L 460.8,106.4 L 460.8,110.8 L 460.8,115.1 L 460.1,121.7 L 459.4,128.2 L 458.8,134.5 L 458.1,141.2 L 457.5,147.7 L 457.5,152.1 L 456.8,156.4 L 456.2,162.9 L 455.5,169.4 L 455.5,174.4 L 454.8,180.3 L 454.2,186.8 L 453.5,193.3 L 452.9,200.0 L 452.9,206.4 L 452.9,212.9 L 452.2,219.4 L 452.2,225.9 L 452.2,232.4 L 452.2,239.0 L 452.2,245.5 L 452.2,249.8 L 453.5,252.0 L 470.0,249.8 L 471.3,245.5 L 470.6,239.0 L 470.6,232.4 L 533.7,230.3 L 533.1,223.8 L 531.7,215.1 L 531.1,208.6 L 531.1,202.0 L 533.1,197.7 L 536.3,189.0 L 535.7,184.7 L 533.7,178.1 L 531.1,171.6 L 529.1,165.1 L 527.8,158.6 L 527.1,152.1 L 525.8,145.6 L 524.5,136.9 L 524.5,130.3 L 523.2,123.8 L 522.5,115.1 L 521.2,108.6 L 519.9,104.3 Z",
  },
  FL: {
    subject: "willis", label: "Florida", lx: 570, ly: 335,
    d: "M 478.5,235.3 L 476.5,238.2 L 475.2,241.1 L 475.9,244.0 L 478.5,246.9 L 508.1,249.8 L 512.0,252.7 L 525.8,255.6 L 527.8,258.5 L 529.1,261.4 L 527.8,264.3 L 528.5,267.2 L 529.8,270.1 L 581.0,273.0 L 582.3,278.8 L 588.9,284.6 L 597.5,290.4 L 598.1,296.2 L 601.4,304.9 L 600.8,313.6 L 597.5,322.2 L 602.1,325.1 L 608.6,330.9 L 609.3,336.7 L 608.6,342.5 L 605.4,348.3 L 602.7,354.1 L 609.3,359.9 L 619.8,365.7 L 619.2,371.5 L 627.0,377.3 L 627.0,383.1 L 628.4,388.9 L 635.6,394.7 L 644.8,397.6 L 646.1,403.3 L 651.4,412.0 L 655.3,414.9 L 659.2,412.0 L 657.3,406.2 L 659.2,397.6 L 662.5,391.8 L 665.8,386.0 L 664.5,383.1 L 663.8,374.4 L 663.2,368.6 L 660.6,362.8 L 659.9,354.1 L 657.3,345.4 L 658.6,339.6 L 652.0,333.8 L 651.4,328.0 L 649.4,325.1 L 644.1,313.6 L 641.5,307.8 L 640.8,304.9 L 642.2,299.1 L 638.9,296.2 L 634.9,287.5 L 633.6,275.9 L 631.0,270.1 L 629.0,264.3 L 627.7,258.5 L 626.4,249.8 L 619.2,241.1 L 535.7,238.2 L 507.4,235.3 Z",
  },
};

const MAP_ROUTES = [
  {
    key: "willis",
    // Lowndes Co, AL center → Marion Co, FL (south of Tallahassee area)
    d: "M 418,185 C 420,210 430,230 450,250 C 465,265 490,268 510,270",
    fromX: 418, fromY: 183, fromLabel: "Lowndes Co., AL",
    toX: 510, toY: 272, toLabel: "Marion Co., FL",
  },
  {
    key: "abram",
    // East Texas — internal movement north to south
    d: "M 155,130 C 160,165 168,200 175,235 C 178,255 174,275 168,295",
    fromX: 155, fromY: 128, fromLabel: "East Texas",
    toX: 168, toY: 295, toLabel: "",
  },
  {
    key: "thompson",
    // Amite County MS — southwest MS
    d: "M 323,185 C 325,210 328,230 330,252 C 332,268 332,278 330,287",
    fromX: 323, fromY: 183, fromLabel: "Amite Co., MS",
    toX: 330, toY: 285, toLabel: "",
  },
  {
    key: "henry",
    // Wilkes County GA — northeast GA
    d: "M 510,120 C 508,148 506,172 504,198 C 502,218 498,232 495,248",
    fromX: 510, fromY: 118, fromLabel: "Wilkes Co., GA",
    toX: 495, toY: 248, toLabel: "",
  },
];

function SouthernMap({ subjects }) {
  const [hovered, setHovered] = React.useState(null);

  return (
    <div style={{ width: "100%", maxWidth: "820px", margin: "0 auto" }}>
      <div style={{
        background: "radial-gradient(ellipse at 38% 32%, #d8ca9c 0%, #c9b882 45%, #b8a06a 100%)",
        border: "1px solid rgba(90,60,20,0.35)", borderRadius: "3px",
        padding: "22px 18px 18px",
        boxShadow: "inset 0 0 80px rgba(90,60,20,0.12), 0 12px 50px rgba(0,0,0,0.65)",
        position: "relative", overflow: "hidden",
      }}>
        {/* Paper lines */}
        <div style={{ position: "absolute", inset: 0, backgroundImage: "repeating-linear-gradient(0deg, transparent, transparent 27px, rgba(90,60,20,0.04) 28px)", pointerEvents: "none", zIndex: 0 }} />
        <div style={{ position: "relative", zIndex: 1 }}>
          {/* Header */}
          <div style={{ textAlign: "center", marginBottom: "12px" }}>
            <p style={{ fontFamily: "'IM Fell English', serif", color: "#5c3a1a", fontSize: "0.58rem", letterSpacing: "0.42em", fontStyle: "italic" }}>CARTOGRAPHY OF THE INVESTIGATION</p>
            <div style={{ height: "1px", background: "linear-gradient(to right, transparent, rgba(90,60,20,0.35), transparent)", marginTop: "5px" }} />
          </div>

          <svg viewBox="0 0 700 430" style={{ width: "100%", height: "auto", display: "block" }}>
            <defs>
              <filter id="roughen2">
                <feTurbulence type="turbulence" baseFrequency="0.02" numOctaves="2" seed="12" result="noise" />
                <feDisplacementMap in="SourceGraphic" in2="noise" scale="1.5" xChannelSelector="R" yChannelSelector="G" />
              </filter>
              {MAP_ROUTES.map(r => (
                <marker key={r.key} id={`arrowhead-${r.key}`} markerWidth="5" markerHeight="5" refX="2.5" refY="2.5" orient="auto">
                  <circle cx="2.5" cy="2.5" r="2.2" fill={subjects[r.key]?.color} opacity="0.9" />
                </marker>
              ))}
            </defs>

            {/* Water label */}
            <text x="200" y="415" fontFamily="'IM Fell English', serif" fontSize="9.5" fill="rgba(92,58,26,0.35)" fontStyle="italic" textAnchor="middle">Gulf of Mexico</text>
            <text x="590" y="410" fontFamily="'IM Fell English', serif" fontSize="8" fill="rgba(92,58,26,0.3)" fontStyle="italic" textAnchor="middle">Atlantic</text>

            {/* States */}
            {Object.entries(STATE_PATHS).map(([id, s]) => {
              const subj = subjects[s.subject];
              if (!subj) return null;
              const isH = hovered === s.subject;
              const dimmed = hovered && hovered !== s.subject;
              return (
                <g key={id}
                  onMouseEnter={() => setHovered(s.subject)}
                  onMouseLeave={() => setHovered(null)}
                  style={{ cursor: "pointer" }}>
                  <path d={s.d} fill={subj.color}
                    fillOpacity={isH ? 0.58 : dimmed ? 0.13 : 0.30}
                    stroke={subj.color}
                    strokeWidth={isH ? 2.2 : 1.3}
                    strokeOpacity={isH ? 1 : dimmed ? 0.28 : 0.65}
                    filter="url(#roughen2)"
                    style={{ transition: "all 0.22s ease" }} />
                  <text x={s.lx} y={s.ly}
                    fontFamily="'IM Fell English', serif" fontSize={isH ? 12 : 10}
                    fontStyle="italic" fill={subj.color}
                    fillOpacity={dimmed ? 0.28 : 0.9}
                    textAnchor="middle"
                    style={{ transition: "all 0.22s", pointerEvents: "none", userSelect: "none" }}>
                    {s.label}
                  </text>
                </g>
              );
            })}

            {/* Routes */}
            {MAP_ROUTES.map(r => {
              const subj = subjects[r.key];
              if (!subj) return null;
              const isH = hovered === r.key;
              const dimmed = hovered && hovered !== r.key;
              return (
                <g key={r.key}>
                  <path d={r.d} fill="none" stroke={subj.color} strokeWidth="7" strokeOpacity="0.07" strokeLinecap="round" />
                  <path d={r.d} fill="none" stroke={subj.color}
                    strokeWidth={isH ? 3 : 2}
                    strokeOpacity={dimmed ? 0.12 : isH ? 1 : 0.75}
                    strokeLinecap="round"
                    strokeDasharray={r.key === "willis" ? "8,5" : "3,4"}
                    markerEnd={`url(#arrowhead-${r.key})`}
                    style={{ transition: "all 0.22s ease" }} />
                </g>
              );
            })}

            {/* Markers */}
            {MAP_ROUTES.map(r => {
              const subj = subjects[r.key];
              if (!subj) return null;
              const isH = hovered === r.key;
              const dimmed = hovered && hovered !== r.key;
              return (
                <g key={r.key} opacity={dimmed ? 0.2 : 1} style={{ transition: "opacity 0.22s" }}>
                  <circle cx={r.fromX} cy={r.fromY} r={isH ? 7 : 5}
                    fill="none" stroke={subj.color} strokeWidth="1.2" strokeOpacity="0.65"
                    style={{ transition: "all 0.22s" }} />
                  <circle cx={r.fromX} cy={r.fromY} r={isH ? 3.5 : 2.5}
                    fill={subj.color} fillOpacity="0.95"
                    style={{ transition: "all 0.22s" }} />
                  {isH && r.fromLabel && (() => {
                    const w = r.fromLabel.length * 6 + 14;
                    const flip = r.fromX > 400;
                    return (
                      <g>
                        <rect x={flip ? r.fromX - w - 6 : r.fromX + 9} y={r.fromY - 18} width={w} height={21}
                          rx="2" fill="rgba(15,8,2,0.93)" stroke={subj.color} strokeWidth="0.6" strokeOpacity="0.7" />
                        <text x={flip ? r.fromX - w + 1 : r.fromX + 14} y={r.fromY - 3}
                          fontFamily="'Crimson Pro', serif" fontSize="9.5" fontWeight="600" fill={subj.color}>
                          {r.fromLabel}
                        </text>
                      </g>
                    );
                  })()}
                  {isH && r.toLabel && (() => {
                    const w = r.toLabel.length * 6 + 14;
                    const flip = r.toX > 400;
                    return (
                      <g>
                        <rect x={flip ? r.toX - w - 6 : r.toX + 9} y={r.toY - 18} width={w} height={21}
                          rx="2" fill="rgba(15,8,2,0.93)" stroke={subj.color} strokeWidth="0.6" strokeOpacity="0.7" />
                        <text x={flip ? r.toX - w + 1 : r.toX + 14} y={r.toY - 3}
                          fontFamily="'Crimson Pro', serif" fontSize="9.5" fontWeight="600" fill={subj.color}>
                          {r.toLabel}
                        </text>
                      </g>
                    );
                  })()}
                </g>
              );
            })}

            {/* Compass */}
            <g transform="translate(666, 78)">
              <circle cx="0" cy="0" r="20" fill="rgba(184,160,106,0.12)" stroke="rgba(92,58,26,0.22)" strokeWidth="0.8" />
              {[["N",0,-14],["S",0,18],["E",17,4],["W",-17,4]].map(([l,dx,dy]) => (
                <text key={l} x={dx} y={dy} fontFamily="'IM Fell English', serif" fontSize="8.5" fill="rgba(92,58,26,0.62)" textAnchor="middle" fontStyle="italic">{l}</text>
              ))}
              <line x1="0" y1="-10" x2="0" y2="10" stroke="rgba(92,58,26,0.3)" strokeWidth="0.7" />
              <line x1="-10" y1="0" x2="10" y2="0" stroke="rgba(92,58,26,0.3)" strokeWidth="0.7" />
              <circle cx="0" cy="0" r="1.5" fill="rgba(92,58,26,0.5)" />
            </g>
          </svg>

          {/* Legend */}
          <div style={{ borderTop: "1px solid rgba(90,60,20,0.2)", paddingTop: "12px", marginTop: "2px", display: "flex", flexWrap: "wrap", gap: "8px 22px", justifyContent: "center" }}>
            {Object.entries(subjects).map(([key, s]) => (
              <div key={key}
                onMouseEnter={() => setHovered(key)}
                onMouseLeave={() => setHovered(null)}
                style={{ display: "flex", alignItems: "center", gap: "7px", cursor: "pointer",
                  opacity: hovered && hovered !== key ? 0.3 : 1, transition: "opacity 0.22s" }}>
                <svg width="28" height="10" style={{ flexShrink: 0 }}>
                  <line x1="2" y1="5" x2="26" y2="5" stroke={s.color} strokeWidth="2"
                    strokeDasharray={key === "willis" ? "6,3" : "3,3"} strokeOpacity="0.9" />
                  <circle cx="4" cy="5" r="3" fill={s.color} />
                </svg>
                <span style={{ fontFamily: "'Crimson Pro', serif", color: s.color, fontSize: "0.73rem", letterSpacing: "0.04em", whiteSpace: "nowrap" }}>
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
