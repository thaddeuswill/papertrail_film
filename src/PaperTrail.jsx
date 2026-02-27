import { useState } from "react";

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;0,900;1,400;1,700&family=IM+Fell+English:ital@0;1&family=Crimson+Pro:ital,wght@0,300;0,400;0,600;1,300;1,400&display=swap');

  * { box-sizing: border-box; margin: 0; padding: 0; -webkit-tap-highlight-color: transparent; }

  :root {
    --ink: #1a1208;
    --parchment: #e8d9b5;
    --aged: #c9a96e;
    --sepia-dark: #2c1a08;
    --sepia-mid: #5c3a1a;
    --sepia-light: #8b5e3c;
    --cream: #f2e8d0;
    --rust: #8b2500;
    --gold: #c49a38;
    --muted: #a08060;
  }

  html { scroll-behavior: smooth; }
  body { background: #0d0602; overflow-x: hidden; }

  .paper-texture {
    background-color: var(--parchment);
    background-image:
      repeating-linear-gradient(0deg, transparent, transparent 27px, rgba(90,60,20,0.06) 28px),
      radial-gradient(ellipse at 20% 80%, rgba(180,120,40,0.12) 0%, transparent 60%),
      radial-gradient(ellipse at 80% 20%, rgba(120,80,20,0.08) 0%, transparent 50%);
  }

  .font-display { font-family: 'Playfair Display', serif; }
  .font-body    { font-family: 'Crimson Pro', serif; }
  .font-fell    { font-family: 'IM Fell English', serif; }

  /* NAV */
  .nav-fixed {
    position: fixed; top: 0; left: 0; right: 0; z-index: 100;
    backdrop-filter: blur(10px);
    background: rgba(13,6,2,0.95);
    border-bottom: 1px solid rgba(196,154,56,0.15);
  }

  /* Drawer */
  .drawer {
    position: fixed; top: 0; right: 0; bottom: 0;
    width: min(80vw, 300px);
    background: #1a0d04;
    border-left: 1px solid rgba(196,154,56,0.2);
    z-index: 200;
    transform: translateX(100%);
    transition: transform 0.3s ease;
    padding: 80px 32px 40px;
    display: flex; flex-direction: column; gap: 8px;
  }
  .drawer.open { transform: translateX(0); }
  .drawer-overlay {
    position: fixed; inset: 0; background: rgba(0,0,0,0.6);
    z-index: 150; opacity: 0; pointer-events: none; transition: opacity 0.3s;
  }
  .drawer-overlay.open { opacity: 1; pointer-events: all; }

  /* Buttons */
  .support-btn {
    background: linear-gradient(135deg, #8b2500 0%, #5c1800 100%);
    border: 1px solid rgba(196,154,56,0.4);
    letter-spacing: 0.12em;
    text-transform: uppercase;
    cursor: pointer;
    font-family: 'Playfair Display', serif;
    transition: all 0.25s;
    -webkit-appearance: none;
  }
  .support-btn:active { opacity: 0.85; transform: scale(0.98); }

  .ghost-btn {
    background: transparent;
    border: 1px solid rgba(196,154,56,0.25);
    color: var(--aged);
    cursor: pointer;
    letter-spacing: 0.08em;
    font-family: 'Crimson Pro', serif;
    transition: all 0.25s;
    -webkit-appearance: none;
  }
  .ghost-btn:active { background: rgba(196,154,56,0.07); }

  /* Progress */
  .progress-fill {
    background: linear-gradient(90deg, #8b2500, #c49a38, #8b5e3c);
    background-size: 200% 100%;
    animation: shimmer 3s ease-in-out infinite;
  }
  @keyframes shimmer {
    0%   { background-position: -200% 0; }
    100% { background-position:  200% 0; }
  }

  /* Misc */
  .section-rule {
    border: none; height: 1px;
    background: linear-gradient(to right, transparent, var(--aged), var(--gold), var(--aged), transparent);
  }

  .subject-pill {
    display: inline-block;
    font-family: 'Crimson Pro', serif;
    font-size: 0.65rem;
    letter-spacing: 0.15em;
    text-transform: uppercase;
    padding: 2px 7px;
    border-radius: 2px;
    white-space: nowrap;
  }

  /* Fund tabs — horizontally scrollable on mobile */
  .tab-row {
    display: flex;
    overflow-x: auto;
    -webkit-overflow-scrolling: touch;
    scrollbar-width: none;
    border-bottom: 1px solid rgba(196,154,56,0.15);
    margin-bottom: 28px;
    gap: 0;
  }
  .tab-row::-webkit-scrollbar { display: none; }
  .tab-btn {
    flex-shrink: 0;
    background: transparent;
    border: none;
    border-bottom: 2px solid transparent;
    padding: 12px 20px;
    cursor: pointer;
    font-family: 'Playfair Display', serif;
    font-size: 0.82rem;
    letter-spacing: 0.04em;
    color: var(--muted);
    white-space: nowrap;
    transition: color 0.2s;
  }
  .tab-btn.active {
    border-bottom-color: var(--gold);
    color: var(--parchment);
  }

  /* Filter chips — horizontally scrollable */
  .filter-row {
    display: flex;
    overflow-x: auto;
    -webkit-overflow-scrolling: touch;
    scrollbar-width: none;
    gap: 8px;
    padding-bottom: 4px;
    margin-bottom: 20px;
  }
  .filter-row::-webkit-scrollbar { display: none; }
  .filter-chip {
    flex-shrink: 0;
    font-family: 'Crimson Pro', serif;
    font-size: 0.72rem;
    letter-spacing: 0.12em;
    text-transform: uppercase;
    padding: 5px 12px;
    border-radius: 20px;
    cursor: pointer;
    border: 1px solid rgba(90,60,20,0.3);
    background: transparent;
    color: var(--muted);
    transition: all 0.2s;
    -webkit-appearance: none;
  }

  /* Inputs */
  .loi-input {
    background: rgba(90,60,20,0.08);
    border: 1px solid rgba(90,60,20,0.3);
    color: var(--sepia-dark);
    font-family: 'Crimson Pro', serif;
    font-size: 1rem;
    padding: 12px 14px;
    border-radius: 2px;
    outline: none;
    width: 100%;
    -webkit-appearance: none;
    transition: border-color 0.2s;
  }
  .loi-input:focus { border-color: rgba(196,154,56,0.5); }
  .loi-input::placeholder { color: var(--sepia-light); opacity: 0.6; }

  /* Cards */
  .card-tap {
    transition: transform 0.2s, box-shadow 0.2s;
    cursor: pointer;
  }
  .card-tap:active { transform: scale(0.99); }

  /* Watch badge */
  .watch-badge { animation: pulse-gold 2s ease-in-out infinite; }
  @keyframes pulse-gold {
    0%, 100% { box-shadow: 0 0 0 0 rgba(196,154,56,0.4); }
    50%       { box-shadow: 0 0 0 5px rgba(196,154,56,0); }
  }

  .stamp {
    border: 3px double var(--rust);
    transform: rotate(-3deg);
    opacity: 0.85;
  }

  .hero-bg {
    background:
      radial-gradient(ellipse at 30% 40%, rgba(139,37,0,0.14) 0%, transparent 60%),
      linear-gradient(180deg, #0d0602 0%, #1a0d04 50%, #2c1a08 100%);
  }

  .funder-card {
    background: rgba(44,26,8,0.5);
    border: 1px solid rgba(196,154,56,0.12);
    transition: border-color 0.2s;
  }
  .funder-card:active { border-color: rgba(196,154,56,0.35); }

  /* Mobile-first grid — 1 col default, 2 col on wider screens */
  .grid-subjects { display: grid; grid-template-columns: 1fr; gap: 14px; }
  .grid-funders  { display: grid; grid-template-columns: 1fr; gap: 10px; }
  @media (min-width: 600px) {
    .grid-subjects { grid-template-columns: 1fr 1fr; }
    .grid-funders  { grid-template-columns: 1fr 1fr; }
  }

  /* Episode card — stacked on mobile, row on wider */
  .ep-card { display: flex; flex-direction: column; }
  @media (min-width: 600px) { .ep-card { flex-direction: row; } }
  .ep-thumb {
    min-height: 90px; width: 100%;
    background: rgba(13,6,2,0.7);
    border-bottom: 1px solid rgba(196,154,56,0.08);
    display: flex; align-items: center; justify-content: center;
  }
  @media (min-width: 600px) {
    .ep-thumb {
      width: 160px; min-width: 160px; min-height: unset;
      border-bottom: none; border-right: 1px solid rgba(196,154,56,0.08);
    }
  }

  /* Hero stat row */
  .stat-row { display: flex; justify-content: center; gap: 28px; flex-wrap: wrap; }

  /* Pledge row — stacked on mobile */
  .pledge-row { display: flex; flex-direction: column; gap: 10px; }
  @media (min-width: 480px) { .pledge-row { flex-direction: row; align-items: center; } }
`;

const SUBJECTS = {
  willis:   { name: "Willis Henry Willoughby", short: "Willis",   color: "#c0392b", region: "Lowndes Co., AL → Marion Co., FL", period: "1848–1910s" },
  abram:    { name: "Abram Ellis",             short: "Abram",    color: "#7a9e3b", region: "East Texas",                        period: "c. 1850–1900s" },
  thompson: { name: "The Thompson Family",     short: "Thompson", color: "#3b7a9e", region: "Amite County, Mississippi",         period: "c. 1840s–1890s" },
  henry:    { name: "Henry Reed",              short: "Henry",    color: "#c49a38", region: "Wilkes County, Georgia",            period: "c. 1845–1900s" },
};

const EPISODES = [
  { id: 1, subject: "willis",   number: "Ep. 01", title: "From Lowndes",         status: "coming_soon", description: "Born enslaved in Alabama's Black Belt in 1848, Willis Henry Willoughby survived Reconstruction, migrated south, and built a life in Marion County, Florida — buying land and founding a church. The archive opens here." },
  { id: 2, subject: "abram",    number: "Ep. 02", title: "Deep East",             status: "coming_soon", description: "Abram Ellis emerges from the post-war chaos of East Texas, a region where emancipation arrived late and resistance ran deep. Land, family, and the long shadow of Juneteenth." },
  { id: 3, subject: "thompson", number: "Ep. 03", title: "The Amite Line",        status: "coming_soon", description: "The Thompson family of Amite County, Mississippi — traced through church rolls, estate inventories, and Freedmen's Bureau labor contracts across two adjoining plantations." },
  { id: 4, subject: "henry",    number: "Ep. 04", title: "The Wilkes County Deed",status: "coming_soon", description: "A single deed names Henry Reed as purchaser of a small parcel in the 1870s. One document. A whole life behind it. This episode reconstructs what that paper cost to earn." },
];

const RESEARCH = [
  { id: 1, subject: "willis",   title: "Willis Henry Willoughby — From Bondage to Landowner", date: "c. 1865–1882", location: "Lowndes Co., AL → Marion Co., FL", tag: "Primary Subject",       summary: "Born enslaved in Alabama, 1848. Post-emancipation records trace Willis through Reconstruction before his documented arrival in Marion County, Florida, where he acquired land, established a household, and became a founding member of a local church. County deed records and an 1880 Federal Census entry confirm his standing as a landowning head of household." },
  { id: 2, subject: "abram",    title: "Abram Ellis — Juneteenth Country",                      date: "c. 1865–1900", location: "East Texas",                        tag: "Active Investigation",  summary: "East Texas freedmen faced a distinct post-war landscape — Confederate holdouts, delayed emancipation, extreme land concentration. Abram Ellis appears in Reconstruction-era Freedmen's Bureau records and again in an 1880 census as head of household. The gap between those appearances is the central mystery." },
  { id: 3, subject: "thompson", title: "The Thompson Family — Amite County Church Records",     date: "1860s–1890s",  location: "Amite County, Mississippi",         tag: "Archival Investigation",summary: "Mississippi's Amite County presents one of the sparsest documentary records for formerly enslaved people in the region. The Thompson family is traced through church membership rolls, a single estate inventory from the 1850s, and two Freedmen's Bureau labor contracts." },
  { id: 4, subject: "henry",    title: "Henry Reed — The Wilkes County Deed",                   date: "c. 1870–1905", location: "Wilkes County, Georgia",            tag: "Primary Document",      summary: "A single deed in the Wilkes County land records names Henry Reed as the purchaser of a small parcel in the 1870s. For a formerly enslaved man in post-war Georgia, that transaction was an act of extraordinary persistence. This entry reconstructs the legal and economic landscape that made such a purchase nearly impossible." },
];

const FUNDERS = [
  { name: "Sundance Documentary Fund",   type: "Foundation",   focus: "Documentary features & series" },
  { name: "Ford Foundation / JustFilms", type: "Foundation",   focus: "Social justice documentary" },
  { name: "ITVS / Independent Lens",     type: "Public Media", focus: "PBS documentary series" },
  { name: "Firelight Media",             type: "Foundation",   focus: "Black documentary filmmakers" },
  { name: "Netflix Documentary Films",   type: "Streaming",    focus: "Feature documentary acquisition" },
  { name: "HBO Documentary Films",       type: "Streaming",    focus: "Prestige documentary series" },
  { name: "Hulu Originals",             type: "Streaming",    focus: "Docuseries development" },
  { name: "American Documentary | POV",  type: "Public Media", focus: "PBS documentary anthology" },
];

const GOAL = 25000;

export default function PaperTrail() {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [fundTab, setFundTab]       = useState("public");
  const [pledgeAmt, setPledgeAmt]   = useState("");
  const [pledged, setPledged]       = useState(false);
  const [raised, setRaised]         = useState(8740);
  const [expanded, setExpanded]     = useState(null);
  const [epStates, setEpStates]     = useState(EPISODES.reduce((a, e) => ({ ...a, [e.id]: e.status }), {}));
  const [subFilter, setSubFilter]   = useState("all");
  const [loiForm, setLoiForm]       = useState({ name: "", org: "", type: "", email: "", message: "" });
  const [loiSent, setLoiSent]       = useState(false);
  const [streamForm, setStreamForm] = useState({ name: "", platform: "", email: "", interest: "" });
  const [streamSent, setStreamSent] = useState(false);

  const progress = Math.min((raised / GOAL) * 100, 100);

  const scrollTo = (id) => {
    setDrawerOpen(false);
    setTimeout(() => document.getElementById(id)?.scrollIntoView({ behavior: "smooth" }), 50);
  };

  const filteredEps      = subFilter === "all" ? EPISODES : EPISODES.filter(e => e.subject === subFilter);
  const filteredResearch = subFilter === "all" ? RESEARCH : RESEARCH.filter(r => r.subject === subFilter);

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
    <div style={{ textAlign: "center", marginBottom: "28px" }}>
      <p className="font-fell" style={{ color: "var(--rust)", fontSize: "0.72rem", letterSpacing: "0.35em", fontStyle: "italic", marginBottom: "8px" }}>{eyebrow}</p>
      <h2 className="font-display" style={{ color: "var(--parchment)", fontSize: "clamp(2rem,8vw,3.2rem)", fontWeight: 900, lineHeight: 1.1 }}>{title}</h2>
      {sub && <p className="font-body" style={{ color: "var(--muted)", fontSize: "1rem", marginTop: "10px", lineHeight: 1.6, maxWidth: "400px", margin: "10px auto 0" }}>{sub}</p>}
      <hr className="section-rule" style={{ maxWidth: "160px", margin: "16px auto 0" }} />
    </div>
  );

  return (
    <>
      <style>{styles}</style>

      {/* NAV */}
      <nav className="nav-fixed">
        <div style={{ maxWidth: "700px", margin: "0 auto", padding: "0 18px", height: "52px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <span className="font-display" style={{ color: "var(--gold)", letterSpacing: "0.22em", fontSize: "0.85rem", fontWeight: 700, cursor: "pointer" }} onClick={() => scrollTo("home")}>
            THE PAPER TRAIL
          </span>
          <button onClick={() => setDrawerOpen(true)} style={{ background: "none", border: "none", cursor: "pointer", padding: "8px", display: "flex", flexDirection: "column", gap: "5px" }}>
            {[0,1,2].map(i => <span key={i} style={{ display: "block", width: "22px", height: "1.5px", background: "var(--aged)" }} />)}
          </button>
        </div>
      </nav>

      {/* DRAWER OVERLAY */}
      <div className={`drawer-overlay ${drawerOpen ? "open" : ""}`} onClick={() => setDrawerOpen(false)} />

      {/* DRAWER */}
      <div className={`drawer ${drawerOpen ? "open" : ""}`}>
        <button onClick={() => setDrawerOpen(false)} style={{ position: "absolute", top: "18px", right: "18px", background: "none", border: "none", cursor: "pointer", color: "var(--muted)", fontSize: "1.4rem" }}>✕</button>
        <p className="font-fell" style={{ color: "var(--rust)", fontSize: "0.65rem", letterSpacing: "0.3em", marginBottom: "20px" }}>NAVIGATE</p>
        {[["Subjects", "subjects"], ["Episodes", "episodes"], ["Archive", "archive"], ["Fund the Film", "fund"]].map(([label, id]) => (
          <button key={id} onClick={() => scrollTo(id)} className="font-display"
            style={{ background: "none", border: "none", borderBottom: "1px solid rgba(196,154,56,0.1)", padding: "14px 0", color: "var(--parchment)", fontSize: "1.1rem", cursor: "pointer", textAlign: "left", letterSpacing: "0.05em" }}>
            {label}
          </button>
        ))}
        <button className="support-btn" style={{ marginTop: "24px", color: "var(--cream)", padding: "12px 0", borderRadius: "2px", fontSize: "0.8rem", width: "100%" }} onClick={() => scrollTo("fund")}>
          Support the Film
        </button>
      </div>

      {/* HERO */}
      <section id="home" className="hero-bg" style={{ minHeight: "100svh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "80px 20px 60px", textAlign: "center", position: "relative", overflow: "hidden" }}>
        <svg style={{ position: "absolute", inset: 0, width: "100%", height: "100%", pointerEvents: "none", opacity: 0.04 }}>
          <defs><pattern id="grid" width="50" height="50" patternUnits="userSpaceOnUse"><path d="M 50 0 L 0 0 0 50" fill="none" stroke="#c49a38" strokeWidth="0.4"/></pattern></defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>

        <div style={{ position: "relative", zIndex: 1, maxWidth: "500px", width: "100%" }}>
          <p className="font-fell" style={{ color: "var(--rust)", fontSize: "0.72rem", letterSpacing: "0.4em", fontStyle: "italic", marginBottom: "14px" }}>A DOCUMENTARY SERIES</p>

          <h1 className="font-display" style={{ color: "var(--cream)", fontSize: "clamp(2.8rem,13vw,6rem)", fontWeight: 900, lineHeight: 1, textShadow: "0 4px 30px rgba(0,0,0,0.8)", marginBottom: "16px" }}>
            The Paper Trail
          </h1>

          <hr className="section-rule" style={{ maxWidth: "200px", margin: "0 auto 18px" }} />

          <p className="font-body" style={{ color: "var(--parchment)", fontSize: "1.1rem", fontWeight: 300, lineHeight: 1.7, marginBottom: "20px" }}>
            Four families. Four states. One century of erasure — and the documents that survived anyway.
          </p>

          {/* subject chips — scrollable row */}
          <div style={{ display: "flex", overflowX: "auto", gap: "8px", paddingBottom: "4px", marginBottom: "28px", WebkitOverflowScrolling: "touch", scrollbarWidth: "none", justifyContent: "center", flexWrap: "wrap" }}>
            {Object.entries(SUBJECTS).map(([k, s]) => (
              <span key={k} className="subject-pill" style={{ background: `${s.color}22`, border: `1px solid ${s.color}55`, color: s.color }}>{s.name}</span>
            ))}
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "10px", alignItems: "center" }}>
            <button className="support-btn" style={{ color: "var(--cream)", padding: "14px 0", borderRadius: "2px", fontSize: "0.82rem", width: "100%", maxWidth: "280px" }} onClick={() => scrollTo("fund")}>
              Support the Film
            </button>
            <button className="ghost-btn" style={{ padding: "13px 0", borderRadius: "2px", fontSize: "0.95rem", width: "100%", maxWidth: "280px" }} onClick={() => scrollTo("episodes")}>
              View Episodes
            </button>
          </div>

          <div className="stat-row" style={{ marginTop: "40px" }}>
            {[["4", "Subjects"], ["4 States", "Coverage"], ["3 Eps", "In Production"]].map(([val, label]) => (
              <div key={val} style={{ textAlign: "center" }}>
                <div className="font-display" style={{ color: "var(--gold)", fontSize: "1.5rem", fontWeight: 700 }}>{val}</div>
                <div className="font-body" style={{ color: "var(--muted)", fontSize: "0.7rem", letterSpacing: "0.12em", marginTop: "3px" }}>{label.toUpperCase()}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SUBJECTS */}
      <section id="subjects" style={{ background: "radial-gradient(ellipse at top,#2e1a0a,#1a0d04)", padding: "60px 18px" }}>
        <div style={{ maxWidth: "700px", margin: "0 auto" }}>
          <SectionHeader eyebrow="THE FOUR LINES" title="Subjects" sub="Each subject represents a distinct family line, geography, and archival challenge." />
          <div className="grid-subjects">
            {Object.entries(SUBJECTS).map(([key, s]) => (
              <div key={key} className="paper-texture card-tap" onClick={() => { setSubFilter(key); scrollTo("episodes"); }}
                style={{ borderRadius: "2px", borderLeft: `3px solid ${s.color}`, border: `1px solid rgba(196,154,56,0.12)`, borderLeftWidth: "3px", padding: "18px 16px", boxShadow: "0 4px 16px rgba(0,0,0,0.4)" }}>
                <span className="subject-pill" style={{ background: `${s.color}18`, border: `1px solid ${s.color}44`, color: s.color, marginBottom: "8px" }}>
                  {key === "thompson" ? "Family" : "Individual"}
                </span>
                <h3 className="font-display" style={{ color: "var(--sepia-dark)", fontSize: "1.05rem", fontWeight: 700, marginTop: "6px", marginBottom: "4px", lineHeight: 1.3 }}>{s.name}</h3>
                <div className="font-fell" style={{ color: "var(--sepia-light)", fontSize: "0.82rem", fontStyle: "italic", marginBottom: "2px" }}>{s.period}</div>
                <div className="font-body" style={{ color: "var(--muted)", fontSize: "0.78rem" }}>{s.region}</div>
                <div className="font-body" style={{ color: s.color, fontSize: "0.72rem", letterSpacing: "0.1em", marginTop: "10px" }}>VIEW EPISODE →</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* EPISODES */}
      <section id="episodes" style={{ background: "#120a02", padding: "60px 18px" }}>
        <div style={{ maxWidth: "700px", margin: "0 auto" }}>
          <SectionHeader eyebrow="THE SERIES" title="Episodes" />
          <FilterChips />
          <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
            {filteredEps.map(ep => {
              const sub = SUBJECTS[ep.subject];
              const state = epStates[ep.id];
              return (
                <div key={ep.id} className="ep-card" style={{ borderRadius: "2px", overflow: "hidden", background: "rgba(44,26,8,0.6)", border: "1px solid rgba(196,154,56,0.1)", boxShadow: "0 4px 16px rgba(0,0,0,0.5)" }}>
                  <div style={{ width: "4px", minHeight: "100%", background: sub.color, flexShrink: 0, position: "absolute" }} />
                  <div style={{ borderLeft: `4px solid ${sub.color}` }}>
                    <div className="ep-thumb">
                      <div style={{ textAlign: "center" }}>
                        <div className="font-display" style={{ color: sub.color, fontSize: "2.5rem", fontWeight: 900, opacity: 0.2 }}>{ep.id.toString().padStart(2, "0")}</div>
                        <div className="font-body" style={{ color: "var(--muted)", fontSize: "0.65rem", letterSpacing: "0.18em", opacity: 0.5 }}>PENDING</div>
                      </div>
                    </div>
                    <div style={{ padding: "16px" }}>
                      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "8px", gap: "8px" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "8px", flexWrap: "wrap" }}>
                          <span className="font-body" style={{ color: "var(--muted)", fontSize: "0.7rem", letterSpacing: "0.15em" }}>{ep.number}</span>
                          <span className="subject-pill" style={{ background: `${sub.color}18`, border: `1px solid ${sub.color}44`, color: sub.color }}>{sub.short}</span>
                        </div>
                        <span className={`subject-pill ${state === "watch_now" ? "watch-badge" : ""}`}
                          style={{ background: state === "watch_now" ? "rgba(196,154,56,0.15)" : "rgba(90,60,20,0.3)", border: `1px solid ${state === "watch_now" ? "rgba(196,154,56,0.5)" : "rgba(90,60,20,0.3)"}`, color: state === "watch_now" ? "var(--gold)" : "var(--muted)" }}>
                          {state === "watch_now" ? "WATCH NOW" : "COMING SOON"}
                        </span>
                      </div>
                      <h3 className="font-display" style={{ color: "var(--parchment)", fontSize: "1.15rem", fontWeight: 700, marginBottom: "6px" }}>{ep.title}</h3>
                      <p className="font-body" style={{ color: "var(--muted)", fontSize: "0.92rem", lineHeight: 1.6 }}>{ep.description}</p>
                      <div style={{ display: "flex", gap: "10px", marginTop: "12px" }}>
                        {state === "watch_now"
                          ? <button className="support-btn" style={{ color: "var(--cream)", padding: "9px 20px", borderRadius: "2px", fontSize: "0.75rem" }}>▶ Watch Now</button>
                          : <button className="ghost-btn" style={{ padding: "8px 18px", borderRadius: "2px", fontSize: "0.82rem" }}>Notify Me</button>
                        }
                        <button onClick={() => setEpStates(p => ({ ...p, [ep.id]: p[ep.id] === "watch_now" ? "coming_soon" : "watch_now" }))}
                          style={{ background: "transparent", border: "1px dashed rgba(196,154,56,0.2)", color: "var(--muted)", borderRadius: "2px", cursor: "pointer", padding: "8px 12px", fontSize: "0.72rem", opacity: 0.4, fontFamily: "Crimson Pro, serif" }}>
                          toggle
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* RESEARCH ARCHIVE */}
      <section id="archive" style={{ background: "#0f0803", padding: "60px 18px" }}>
        <div style={{ maxWidth: "700px", margin: "0 auto" }}>
          <SectionHeader eyebrow="THE EVIDENCE" title="Research Archive" sub="Primary sources, archival findings, and investigative notes from production." />
          <FilterChips />
          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            {filteredResearch.map(entry => {
              const sub = SUBJECTS[entry.subject];
              const isOpen = expanded === entry.id;
              return (
                <div key={entry.id} className="paper-texture card-tap" onClick={() => setExpanded(isOpen ? null : entry.id)}
                  style={{ borderRadius: "2px", borderLeft: `3px solid ${sub.color}`, border: `1px solid rgba(196,154,56,0.12)`, borderLeftWidth: "3px", boxShadow: "0 4px 14px rgba(0,0,0,0.35)", overflow: "hidden" }}>
                  <div style={{ padding: "16px" }}>
                    <div style={{ display: "flex", gap: "6px", marginBottom: "8px", flexWrap: "wrap" }}>
                      <span className="subject-pill" style={{ background: `${sub.color}18`, border: `1px solid ${sub.color}44`, color: sub.color }}>{sub.short}</span>
                      <span className="subject-pill" style={{ background: "rgba(139,37,0,0.1)", border: "1px solid rgba(139,37,0,0.3)", color: "var(--rust)" }}>{entry.tag}</span>
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "12px" }}>
                      <h3 className="font-display" style={{ color: "var(--sepia-dark)", fontSize: "1rem", fontWeight: 700, lineHeight: 1.3, flex: 1 }}>{entry.title}</h3>
                      <div style={{ textAlign: "right", flexShrink: 0 }}>
                        <div className="font-fell" style={{ color: "var(--sepia-light)", fontSize: "0.78rem", fontStyle: "italic" }}>{entry.date}</div>
                        <div className="font-body" style={{ color: "var(--muted)", fontSize: "0.7rem", marginTop: "2px" }}>{entry.location}</div>
                      </div>
                    </div>
                    <hr style={{ border: "none", borderTop: "1px solid rgba(90,60,20,0.2)", margin: "10px 0" }} />
                    <p className="font-body" style={{ color: "var(--sepia-mid)", fontSize: "0.95rem", lineHeight: 1.65, maxHeight: isOpen ? "none" : "3rem", overflow: "hidden" }}>
                      {entry.summary}
                    </p>
                    <button className="font-body" style={{ color: "var(--rust)", fontSize: "0.7rem", letterSpacing: "0.1em", background: "none", border: "none", cursor: "pointer", marginTop: "8px", padding: 0 }}>
                      {isOpen ? "▲ COLLAPSE" : "▼ READ MORE"}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* FUNDING HUB */}
      <section id="fund" style={{ background: "radial-gradient(ellipse at top,#2e1a0a,#1a0d04)", padding: "60px 18px" }}>
        <div style={{ maxWidth: "700px", margin: "0 auto" }}>
          <SectionHeader eyebrow="FUND THE INVESTIGATION" title="Support the Film" sub="Public crowdfunding, foundation grants, and streaming partnerships." />

          {/* Tabs */}
          <div className="tab-row">
            {[["public", "Public Campaign"], ["foundations", "Foundations"], ["streaming", "Streaming"]].map(([id, label]) => (
              <button key={id} className={`tab-btn ${fundTab === id ? "active" : ""}`} onClick={() => setFundTab(id)}>{label}</button>
            ))}
          </div>

          {/* PUBLIC */}
          {fundTab === "public" && (
            <div className="paper-texture" style={{ borderRadius: "2px", padding: "22px 18px", border: "1px solid rgba(196,154,56,0.2)", position: "relative" }}>
              <div className="stamp" style={{ position: "absolute", top: "14px", right: "14px", padding: "4px 10px", textAlign: "center" }}>
                <div className="font-display" style={{ color: "var(--rust)", fontSize: "0.6rem", letterSpacing: "0.2em" }}>CAMPAIGN</div>
                <div className="font-display" style={{ color: "var(--rust)", fontSize: "1rem", fontWeight: 700 }}>ACTIVE</div>
              </div>
              <p className="font-body" style={{ color: "var(--sepia-dark)", fontSize: "1.05rem", lineHeight: 1.7, marginBottom: "14px", maxWidth: "380px" }}>
                Willis in Alabama. Abram in Texas. The Thompsons in Mississippi. Henry in Georgia. Four families who survived in the margins of a record system that wasn't designed to remember them.
              </p>
              <p className="font-body" style={{ color: "var(--sepia-mid)", fontSize: "0.95rem", lineHeight: 1.7, marginBottom: "20px" }}>
                Your support funds courthouse travel, archival licensing, and production across all four episodes.
              </p>
              {/* Progress */}
              <div style={{ marginBottom: "20px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px" }}>
                  <span className="font-display" style={{ color: "var(--sepia-dark)", fontSize: "1.6rem", fontWeight: 700 }}>${raised.toLocaleString()}</span>
                  <span className="font-body" style={{ color: "var(--sepia-light)", fontSize: "0.9rem", alignSelf: "flex-end" }}>of ${GOAL.toLocaleString()}</span>
                </div>
                <div style={{ height: "8px", background: "rgba(90,60,20,0.2)", borderRadius: "2px", overflow: "hidden", border: "1px solid rgba(90,60,20,0.15)" }}>
                  <div className="progress-fill" style={{ height: "100%", width: `${progress.toFixed(1)}%`, transition: "width 0.8s ease" }} />
                </div>
                <div style={{ display: "flex", gap: "20px", marginTop: "10px" }}>
                  <div><div className="font-display" style={{ color: "var(--sepia-dark)", fontWeight: 700, fontSize: "1.1rem" }}>143</div><div className="font-body" style={{ color: "var(--sepia-light)", fontSize: "0.68rem", letterSpacing: "0.1em" }}>BACKERS</div></div>
                  <div><div className="font-display" style={{ color: "var(--sepia-dark)", fontWeight: 700, fontSize: "1.1rem" }}>{progress.toFixed(1)}%</div><div className="font-body" style={{ color: "var(--sepia-light)", fontSize: "0.68rem", letterSpacing: "0.1em" }}>FUNDED</div></div>
                </div>
              </div>
              {!pledged ? (
                <div>
                  <div className="pledge-row">
                    <div style={{ position: "relative", flex: 1 }}>
                      <span className="font-display" style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)", color: "var(--sepia-light)", fontWeight: 700 }}>$</span>
                      <input type="number" inputMode="numeric" placeholder="Amount" value={pledgeAmt} onChange={e => setPledgeAmt(e.target.value)} className="loi-input" style={{ paddingLeft: "28px" }} />
                    </div>
                    <button className="support-btn" style={{ color: "var(--cream)", padding: "12px 20px", borderRadius: "2px", fontSize: "0.78rem", whiteSpace: "nowrap" }} onClick={() => { const a = parseInt(pledgeAmt,10); if (!isNaN(a)&&a>0){setRaised(p=>p+a);setPledged(true);} }}>
                      Support the Film
                    </button>
                  </div>
                  <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", marginTop: "12px" }}>
                    {[10,25,50,100,250].map(a => (
                      <button key={a} onClick={() => setPledgeAmt(String(a))} className="font-body"
                        style={{ background: "rgba(90,60,20,0.08)", border: "1px solid rgba(90,60,20,0.25)", color: "var(--sepia-mid)", borderRadius: "2px", cursor: "pointer", padding: "7px 14px", fontSize: "0.9rem" }}>
                        ${a}
                      </button>
                    ))}
                  </div>
                </div>
              ) : (
                <div style={{ display: "inline-flex", alignItems: "center", gap: "10px", padding: "14px 18px", background: "rgba(139,37,0,0.08)", border: "1px solid rgba(139,37,0,0.3)", borderRadius: "2px" }}>
                  <span className="font-display" style={{ color: "var(--rust)" }}>✦</span>
                  <span className="font-body" style={{ color: "var(--sepia-dark)", fontSize: "1.05rem" }}>Thank you. Your name joins the record.</span>
                </div>
              )}
            </div>
          )}

          {/* FOUNDATIONS */}
          {fundTab === "foundations" && (
            <div>
              <div className="paper-texture" style={{ borderRadius: "2px", padding: "20px 18px", border: "1px solid rgba(196,154,56,0.2)", marginBottom: "16px" }}>
                <h3 className="font-display" style={{ color: "var(--sepia-dark)", fontSize: "1.25rem", fontWeight: 700, marginBottom: "12px" }}>Case Statement</h3>
                <hr style={{ border: "none", borderTop: "1px solid rgba(90,60,20,0.2)", marginBottom: "14px" }} />
                <div className="font-body" style={{ color: "var(--sepia-mid)", fontSize: "1rem", lineHeight: 1.75 }}>
                  <p style={{ marginBottom: "12px" }}><em>The Paper Trail</em> is a four-episode documentary series using genealogical research, archival investigation, and original filmmaking to recover the stories of four families who were enslaved across the Deep South — tracing their journeys into freedom, land, and community.</p>
                  <p style={{ marginBottom: "12px" }}>This is not heritage filmmaking. It is investigative documentary work, made with the rigor of a cold case and the intimacy of a family portrait.</p>
                  <p style={{ marginBottom: "12px" }}><strong style={{ color: "var(--sepia-dark)" }}>Subjects:</strong> Willis Henry Willoughby (AL→FL), Abram Ellis (TX), the Thompson Family (MS), Henry Reed (GA).</p>
                  <p><strong style={{ color: "var(--sepia-dark)" }}>Budget:</strong> $125,000 across four episodes — archival licensing, travel to five state archives, original music, and post-production.</p>
                </div>
              </div>
              <h3 className="font-display" style={{ color: "var(--parchment)", fontSize: "1.05rem", fontWeight: 700, marginBottom: "12px" }}>Target Funders</h3>
              <div className="grid-funders" style={{ marginBottom: "20px" }}>
                {FUNDERS.map((f, i) => (
                  <div key={i} className="funder-card" style={{ borderRadius: "2px", padding: "12px 14px" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "8px" }}>
                      <div>
                        <div className="font-display" style={{ color: "var(--parchment)", fontSize: "0.88rem", fontWeight: 700 }}>{f.name}</div>
                        <div className="font-body" style={{ color: "var(--muted)", fontSize: "0.78rem", marginTop: "3px" }}>{f.focus}</div>
                      </div>
                      <span className="subject-pill" style={{ background: "rgba(196,154,56,0.1)", border: "1px solid rgba(196,154,56,0.25)", color: "var(--aged)", flexShrink: 0 }}>{f.type}</span>
                    </div>
                  </div>
                ))}
              </div>
              <div className="paper-texture" style={{ borderRadius: "2px", padding: "20px 18px", border: "1px solid rgba(196,154,56,0.2)" }}>
                <h3 className="font-display" style={{ color: "var(--sepia-dark)", fontSize: "1.1rem", fontWeight: 700, marginBottom: "6px" }}>Letter of Inquiry</h3>
                <p className="font-body" style={{ color: "var(--sepia-light)", fontSize: "0.9rem", marginBottom: "16px" }}>Foundation officers — reach the production team directly.</p>
                {!loiSent ? (
                  <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                    <input className="loi-input" placeholder="Your name" value={loiForm.name} onChange={e => setLoiForm(p=>({...p,name:e.target.value}))} />
                    <input className="loi-input" placeholder="Organization" value={loiForm.org} onChange={e => setLoiForm(p=>({...p,org:e.target.value}))} />
                    <input className="loi-input" placeholder="Funder type" value={loiForm.type} onChange={e => setLoiForm(p=>({...p,type:e.target.value}))} />
                    <input className="loi-input" placeholder="Email address" value={loiForm.email} onChange={e => setLoiForm(p=>({...p,email:e.target.value}))} />
                    <textarea className="loi-input" placeholder="Brief note (optional)" rows={3} value={loiForm.message} onChange={e => setLoiForm(p=>({...p,message:e.target.value}))} style={{ resize: "vertical" }} />
                    <button className="support-btn" style={{ color: "var(--cream)", padding: "13px 0", borderRadius: "2px", fontSize: "0.78rem", width: "100%" }} onClick={() => { if(loiForm.name&&loiForm.email) setLoiSent(true); }}>
                      Send Letter of Inquiry
                    </button>
                  </div>
                ) : (
                  <div style={{ display: "flex", alignItems: "center", gap: "10px", padding: "14px", background: "rgba(139,37,0,0.08)", border: "1px solid rgba(139,37,0,0.3)", borderRadius: "2px" }}>
                    <span className="font-display" style={{ color: "var(--rust)" }}>✦</span>
                    <span className="font-body" style={{ color: "var(--sepia-dark)", fontSize: "1rem" }}>Received. The team will follow up within 5 business days.</span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* STREAMING */}
          {fundTab === "streaming" && (
            <div>
              <div className="paper-texture" style={{ borderRadius: "2px", padding: "20px 18px", border: "1px solid rgba(196,154,56,0.2)", marginBottom: "16px" }}>
                <h3 className="font-display" style={{ color: "var(--sepia-dark)", fontSize: "1.25rem", fontWeight: 700, marginBottom: "12px" }}>Distribution Pitch</h3>
                <hr style={{ border: "none", borderTop: "1px solid rgba(90,60,20,0.2)", marginBottom: "14px" }} />
                <div className="font-body" style={{ color: "var(--sepia-mid)", fontSize: "1rem", lineHeight: 1.75 }}>
                  <p style={{ marginBottom: "12px" }}><em>The Paper Trail</em> is a four-episode limited docuseries structured for streaming. Each episode runs 45–55 minutes: one family, one geography, one archive. Designed to stream as a complete season or as standalone episodes.</p>
                  <p style={{ marginBottom: "12px" }}>The series sits at the intersection of three audiences that over-perform on streaming: Black history documentary, genealogical investigation, and Deep South storytelling.</p>
                  <p><strong style={{ color: "var(--sepia-dark)" }}>Format:</strong> 4 × ~50 min &nbsp;·&nbsp; <strong style={{ color: "var(--sepia-dark)" }}>Stage:</strong> Pre-production &nbsp;·&nbsp; <strong style={{ color: "var(--sepia-dark)" }}>Seeking:</strong> Presale, co-production, or acquisition.</p>
                </div>
              </div>
              <div className="paper-texture" style={{ borderRadius: "2px", padding: "20px 18px", border: "1px solid rgba(196,154,56,0.2)" }}>
                <h3 className="font-display" style={{ color: "var(--sepia-dark)", fontSize: "1.1rem", fontWeight: 700, marginBottom: "6px" }}>Express Streaming Interest</h3>
                <p className="font-body" style={{ color: "var(--sepia-light)", fontSize: "0.9rem", marginBottom: "16px" }}>Development execs and acquisitions teams — contact the production team.</p>
                {!streamSent ? (
                  <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                    <input className="loi-input" placeholder="Your name" value={streamForm.name} onChange={e => setStreamForm(p=>({...p,name:e.target.value}))} />
                    <input className="loi-input" placeholder="Platform / Network" value={streamForm.platform} onChange={e => setStreamForm(p=>({...p,platform:e.target.value}))} />
                    <input className="loi-input" placeholder="Email address" value={streamForm.email} onChange={e => setStreamForm(p=>({...p,email:e.target.value}))} />
                    <div>
                      <p className="font-body" style={{ color: "var(--sepia-light)", fontSize: "0.72rem", letterSpacing: "0.1em", marginBottom: "8px" }}>INTEREST TYPE</p>
                      <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                        {["Acquisition","Co-production","Pre-sale","Development","Festival only"].map(opt => (
                          <button key={opt} onClick={() => setStreamForm(p=>({...p,interest:opt}))} className="font-body"
                            style={{ borderRadius: "20px", cursor: "pointer", padding: "6px 14px", fontSize: "0.82rem", background: streamForm.interest===opt?"rgba(196,154,56,0.15)":"rgba(90,60,20,0.08)", border:`1px solid ${streamForm.interest===opt?"rgba(196,154,56,0.5)":"rgba(90,60,20,0.25)"}`, color:streamForm.interest===opt?"var(--gold)":"var(--sepia-mid)", transition:"all 0.2s" }}>
                            {opt}
                          </button>
                        ))}
                      </div>
                    </div>
                    <button className="support-btn" style={{ color: "var(--cream)", padding: "13px 0", borderRadius: "2px", fontSize: "0.78rem", width: "100%", marginTop: "4px" }} onClick={() => { if(streamForm.name&&streamForm.email) setStreamSent(true); }}>
                      Submit Interest
                    </button>
                  </div>
                ) : (
                  <div style={{ display: "flex", alignItems: "center", gap: "10px", padding: "14px", background: "rgba(139,37,0,0.08)", border: "1px solid rgba(139,37,0,0.3)", borderRadius: "2px" }}>
                    <span className="font-display" style={{ color: "var(--rust)" }}>✦</span>
                    <span className="font-body" style={{ color: "var(--sepia-dark)", fontSize: "1rem" }}>Interest logged. Expect a full pitch package within the week.</span>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* FOOTER */}
      <footer style={{ background: "#0d0602", borderTop: "1px solid rgba(196,154,56,0.1)", padding: "40px 18px", textAlign: "center" }}>
        <p className="font-display" style={{ color: "var(--gold)", letterSpacing: "0.28em", fontSize: "0.9rem", fontWeight: 700, marginBottom: "8px" }}>THE PAPER TRAIL</p>
        <p className="font-fell" style={{ color: "var(--muted)", fontSize: "0.88rem", fontStyle: "italic", marginBottom: "16px" }}>"The record is the resistance."</p>
        <div style={{ display: "flex", justifyContent: "center", gap: "12px", flexWrap: "wrap", marginBottom: "16px" }}>
          {Object.values(SUBJECTS).map(s => (
            <span key={s.name} className="font-body" style={{ color: s.color, fontSize: "0.72rem", letterSpacing: "0.05em" }}>{s.name}</span>
          ))}
        </div>
        <hr className="section-rule" style={{ maxWidth: "200px", margin: "0 auto 16px" }} />
        <p className="font-body" style={{ color: "var(--sepia-light)", fontSize: "0.72rem", letterSpacing: "0.08em" }}>© 2025 The Paper Trail Documentary Series</p>
      </footer>
    </>
  );
}
