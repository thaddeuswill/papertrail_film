// ============================================================
//  THE PAPER TRAIL — SITE CONFIG
//  Edit this file to update content, emails, and videos.
//  You should rarely need to touch any other file.
// ============================================================

// ── EMAIL ──────────────────────────────────────────────────
// Sign up at https://formspree.io, create a form, paste your form ID below.
// It looks like: https://formspree.io/f/xyzabcde  →  use "xyzabcde"
export const FORMSPREE = {
  loi:      "xwvnzrpr",       // Letter of Inquiry form
  pledge:   "mzdawjdzD",    // Public pledge form
  streaming:"meeldree", // Streaming interest form
};

// ── CAMPAIGN ───────────────────────────────────────────────
export const CAMPAIGN = {
  goal:       25000,
  raised:     8740,   // Update this as real pledges come in
  backers:    143,
};

// ── SUBJECTS ───────────────────────────────────────────────
// color: pick any CSS hex color for each subject's accent
export const SUBJECTS = {
  willis: {
    name:    "Willis Henry Willoughby",
    short:   "Willis",
    color:   "#c0392b",
    region:  "Lowndes Co., AL → Marion Co., FL",
    period:  "1848–1910s",
    ep:      "Ep. 01",
    epTitle: "From Lowndes",
  },
  abram: {
    name:    "Abram Ellis",
    short:   "Abram",
    color:   "#7a9e3b",
    region:  "East Texas",
    period:  "c. 1850–1900s",
    ep:      "Ep. 02",
    epTitle: "Deep East",
  },
  thompson: {
    name:    "The Thompson Family",
    short:   "Thompson",
    color:   "#4a7fa0",
    region:  "Amite County, Mississippi",
    period:  "c. 1840s–1890s",
    ep:      "Ep. 03",
    epTitle: "The Amite Line",
  },
  henry: {
    name:    "Henry Reed",
    short:   "Henry",
    color:   "#c49a38",
    region:  "Wilkes County, Georgia",
    period:  "c. 1845–1900s",
    ep:      "Ep. 04",
    epTitle: "The Wilkes County Deed",
  },
};

// ── EPISODES ───────────────────────────────────────────────
// status: "coming_soon" | "watch_now"
// videoUrl: paste a YouTube or Vimeo embed URL when ready
//   YouTube:  https://www.youtube.com/embed/VIDEO_ID
//   Vimeo:    https://player.vimeo.com/video/VIDEO_ID
export const EPISODES = [
  {
    id:          1,
    subject:     "willis",
    number:      "Ep. 01",
    title:       "From Lowndes",
    status:      "coming_soon",
    videoUrl:    null, // paste embed URL here when ready
    description: "Born enslaved in Alabama's Black Belt in 1848, Willis Henry Willoughby survived Reconstruction, migrated south, and built a life in Marion County, Florida — buying land and founding a church. The archive opens here.",
  },
  {
    id:          2,
    subject:     "abram",
    number:      "Ep. 02",
    title:       "Deep East",
    status:      "coming_soon",
    videoUrl:    null,
    description: "Abram Ellis emerges from the post-war chaos of East Texas, a region where emancipation arrived late and resistance ran deep. Land, family, and the long shadow of Juneteenth.",
  },
  {
    id:          3,
    subject:     "thompson",
    number:      "Ep. 03",
    title:       "The Amite Line",
    status:      "coming_soon",
    videoUrl:    null,
    description: "The Thompson family of Amite County, Mississippi — traced through church rolls, estate inventories, and Freedmen's Bureau labor contracts across two adjoining plantations.",
  },
  {
    id:          4,
    subject:     "henry",
    number:      "Ep. 04",
    title:       "The Wilkes County Deed",
    status:      "coming_soon",
    videoUrl:    null,
    description: "A single deed names Henry Reed as purchaser of a small parcel in the 1870s. One document. A whole life behind it. This episode reconstructs what that paper cost to earn.",
  },
];

// ── RESEARCH ARCHIVE ───────────────────────────────────────
// Add new entries here as your research grows.
// tag options: "Primary Subject" | "Active Investigation" | "Archival Investigation" | "Primary Document"
export const RESEARCH = [
  {
    id:       1,
    subject:  "willis",
    title:    "Willis Henry Willoughby — From Bondage to Landowner",
    date:     "c. 1865–1882",
    location: "Lowndes Co., AL → Marion Co., FL",
    tag:      "Primary Subject",
    summary:  "Born enslaved in Alabama, 1848. Post-emancipation records trace Willis through Reconstruction before his documented arrival in Marion County, Florida, where he acquired land, established a household, and became a founding member of a local church. County deed records and an 1880 Federal Census entry confirm his standing as a landowning head of household.",
  },
  {
    id:       2,
    subject:  "abram",
    title:    "Abram Ellis — Juneteenth Country",
    date:     "c. 1865–1900",
    location: "East Texas",
    tag:      "Active Investigation",
    summary:  "East Texas freedmen faced a distinct post-war landscape — Confederate holdouts, delayed emancipation, extreme land concentration. Abram Ellis appears in Reconstruction-era Freedmen's Bureau records and again in an 1880 census as head of household. The gap between those appearances is the central mystery.",
  },
  {
    id:       3,
    subject:  "thompson",
    title:    "The Thompson Family — Amite County Church Records",
    date:     "1860s–1890s",
    location: "Amite County, Mississippi",
    tag:      "Archival Investigation",
    summary:  "Mississippi's Amite County presents one of the sparsest documentary records for formerly enslaved people in the region. The Thompson family is traced through church membership rolls, a single estate inventory from the 1850s, and two Freedmen's Bureau labor contracts.",
  },
  {
    id:       4,
    subject:  "henry",
    title:    "Henry Reed — The Wilkes County Deed",
    date:     "c. 1870–1905",
    location: "Wilkes County, Georgia",
    tag:      "Primary Document",
    summary:  "A single deed in the Wilkes County land records names Henry Reed as the purchaser of a small parcel in the 1870s. For a formerly enslaved man in post-war Georgia, that transaction was an act of extraordinary persistence. This entry reconstructs the legal and economic landscape that made such a purchase nearly impossible.",
  },
];

// ── FUNDERS ────────────────────────────────────────────────
export const FUNDERS = [
  { name: "Sundance Documentary Fund",   type: "Foundation",   focus: "Documentary features & series" },
  { name: "Ford Foundation / JustFilms", type: "Foundation",   focus: "Social justice documentary" },
  { name: "ITVS / Independent Lens",     type: "Public Media", focus: "PBS documentary series" },
  { name: "Firelight Media",             type: "Foundation",   focus: "Black documentary filmmakers" },
  { name: "Netflix Documentary Films",   type: "Streaming",    focus: "Feature documentary acquisition" },
  { name: "HBO Documentary Films",       type: "Streaming",    focus: "Prestige documentary series" },
  { name: "Hulu Originals",             type: "Streaming",    focus: "Docuseries development" },
  { name: "American Documentary | POV",  type: "Public Media", focus: "PBS documentary anthology" },
];
