# The Paper Trail — Site

## Project Structure

```
paper-trail/
├── src/
│   ├── config.js       ← EDIT THIS to update all content
│   ├── PaperTrail.jsx  ← Main component (rarely need to touch)
│   ├── App.jsx
│   └── main.jsx
├── index.html
├── package.json
└── vite.config.js
```

---

## Day-to-Day Editing

**All content lives in `src/config.js`.** Open it to:

- Update campaign raised/backers amounts
- Add Formspree IDs once you sign up
- Change subject names, colors, regions
- Update episode descriptions or flip status from `"coming_soon"` to `"watch_now"`
- **Add a video** — paste the embed URL into `videoUrl` for an episode:
  - YouTube: `"https://www.youtube.com/embed/VIDEO_ID"`
  - Vimeo: `"https://player.vimeo.com/video/VIDEO_ID"`
- Add new research archive entries

---

## Setting Up Email (Formspree)

1. Go to [formspree.io](https://formspree.io) and create a free account
2. Create 3 forms: "LOI", "Pledge", "Streaming Interest"
3. Each form gives you a URL like `https://formspree.io/f/xyzabcde`
4. Copy the ID part (`xyzabcde`) into `src/config.js` under `FORMSPREE`
5. Formspree emails you every submission. Free tier = 50 submissions/month.

---

## Running Locally

```bash
npm install
npm run dev
```

Visit `http://localhost:5173`

---

## Deploy to Vercel (Free)

### First time:

1. Push this folder to a GitHub repo
2. Go to [vercel.com](https://vercel.com) → "Add New Project"
3. Import your GitHub repo
4. Leave all settings as default — Vercel auto-detects Vite
5. Click Deploy

Your site is live at `yourproject.vercel.app`

### Every update after that:

```bash
git add .
git commit -m "update episode 1 video"
git push
```

Vercel auto-deploys on every push. No other steps.

---

## Custom Domain

1. Buy domain at Namecheap (cheapest) or Squarespace Domains
2. In Vercel: Settings → Domains → Add your domain
3. Vercel shows you 2 DNS records to add at your registrar
4. Takes ~10 minutes to go live

---

## Adding a New Research Entry

In `src/config.js`, add to the `RESEARCH` array:

```js
{
  id:       5,                        // next sequential number
  subject:  "willis",                 // must match a key in SUBJECTS
  title:    "1882 Land Deed — Marion County",
  date:     "1882",
  location: "Marion County, FL",
  tag:      "Primary Document",
  summary:  "Description of the finding...",
},
```

That's it. The site picks it up automatically.
