# CLAUDE.md — Kavya Wani's portfolio (handover)

This file is a complete handover. A new AI assistant (or a new chat) should be able to read only this file and know what exists, what was decided, where we stopped, and how to make each kind of change. Keep it updated after every piece of work.

Last updated: 21 November 2026.

---

## 1. What this is

An interactive 3D portfolio website for **Kavya Wani** (Mumbai, India), an aspiring Data Scientist. Instead of scrolling, a visitor watches a small red SUV drive along a road through a miniature meadow village to five destinations. Each destination opens a full-screen page of portfolio content.

- **Live site:** https://www.kavyawani.indevs.in/
- **Code:** https://github.com/kavya-arch-cmd/portfolio (public; branch `main`)
- **Local folder:** `C:\Users\HP\Downloads\Portfolio`
- **Owner's GitHub account:** `kavya-arch-cmd`

The five destinations (exact labels): **ABOUT ME · PROJECTS · SKILLS & TECHNOLOGIES · EXPERIENCE & EDUCATION · CERTIFICATES**. Header links: Destinations menu (direct navigation), Resume, Contact.

---

## 2. Status: where we left off

Everything below is **done and live**:
- 3D world (village, road, car journeys, camera, ambient motion, arrival effects), loading screen, mobile layout.
- All real content filled in (about, projects with screenshots, skills, current job, education, certificates with verify links, contact).
- Hosted on GitHub Pages with HTTPS on `www.kavyawani.indevs.in`.
- One-page ATS résumé (Word + PDF) connected to the site's Resume button.
- LinkedIn banner (`branding/linkedin-banner.png`) and a tech-stack PDF (`Portfolio_Tech_Stack.pdf`) created.

- Phase 05 (21 Nov 2026, live): mobile layout fixes, ambient sound toggle, smoother motion (throttled shadows, adaptive pixel ratio, paused rendering behind pages), WebGL / slow-3D / reduced-motion warnings. See `CHANGELOG.md`.

**All work is committed and live** as of 21 Nov 2026, including the Phase 05.1 phone camera fix. The `branding/` folder (LinkedIn banner, tech-stack sheet) is **local only by choice** and is git-ignored — never commit it.

**Open items / waiting on Kavya:**
1. Certificate files for **Microsoft Excel (SkillCourse, 2026)** and **Web Designing & PHP Development (Asterix Solution, 2024)** — to add dates/"View certificate" links and confirm whether the college is "K P B" or "LBP" Hinduja.
2. **Diwali invitation website** link (only the Ganpati one was found on GitHub).
3. The bare domain `kavyawani.indevs.in` (without `www`) does not work: the Stackryze DNS form would not accept a root (`@`) record. Only `www.` works. If Stackryze support explains how to add a root record, add four A records (185.199.108.153 / .109.153 / .110.153 / .111.153) so the bare name also works.
4. Optional ideas offered but not started: more village life (sheep, well, garden), sound effects, a darker warm version of the banner, spelling "BI" out as "Business Intelligence" on the résumé.

---

## 3. Kavya's content rules (follow strictly)

- **Never invent** facts, numbers, employers, dates, achievements or skills. If something is unknown, ask Kavya; in code use a `todo('…')` placeholder (it renders as a dashed "To add" note).
- Title is **Aspiring Data Scientist**. Never use the old résumé's "Aspiring Data Analyst".
- Describe AI use only as **"AI-driven development"** / **"AI-driven productivity"** / **"Prompt engineering"**. **Do not name chatbots** (ChatGPT, Claude, Gemini, Antigravity) as skills or in prose. Exceptions that stay: the **Gemini API** as an OppHub feature, and **Anthropic (Claude Academy)** as the issuer of two certificates. Do not use the term "vibe coding".
- **Only hands-on skills.** Work that AI produced from her direction is described as a project feature she *planned and directed*, not as her skill (e.g. Vibe Analysis's data cleaning, star schema and Chart.js dashboard).
- **OppHub** was built **with a teammate**; both worked across frontend, backend and database.
- The **MIS web application** at her job belongs to the employer: describe it at a high level only — no client names, figures, internal setup, screenshots or links.
- **Achievements** was removed as a destination (nothing to show yet). It can come back later as a sixth stop.
- Her phone number appears on the Contact page and résumé (approved), not on the LinkedIn banner.
- Private source files in the project root — `Personal INFO.txt`, original certificate PDFs, all `.docx` files, `design-reference.png.png` — are git-ignored. Never publish them.
- Tone: professional, natural, concise, recruiter-friendly; no exaggeration.

---

## 4. Current content (snapshot — the source of truth is `src/content/portfolio.ts`)

**About Me** (Kavya's own text, keep as written): intro (aspiring Data Scientist with a background in full-stack development, data analytics and AI-driven development, based in Mumbai); *My Journey* (BCA 2026 from K P B Hinduja College of Commerce; OppHub with a teammate; Vibe Analysis; Junior Analyst – AI Automation at Prophetic Business Solutions since October 2026); *Where I'm Heading* (grow into a Data Scientist: Python, statistics, data analysis, machine learning); *Beyond Technology* (games, music, video editing, digital content).

**Projects**
1. **Interactive 3D Portfolio** (this site) — personal project 2026; Live site + GitHub links. (Website only — *not* on the résumé.)
2. **Vibe Analysis** — e-commerce data analytics, 2026. ~25,000 transactions, 2,000 customers, 100 products, 20 regions; star schema; dashboard revenue $29.5M, profit $6.76M. Planned and directed through AI-driven development. Live: kavya-arch-cmd.github.io/vibe-analysis · GitHub: github.com/kavya-arch-cmd/vibe-analysis
3. **OppHub** — scholarship & opportunity aggregator, final-year project with a teammate, 2024–2025. HTML/CSS/JS, Node.js, Express.js, MongoDB Atlas, Gemini API. Live: kavya-arch-cmd.github.io/OppHub · GitHub: github.com/kavya-arch-cmd/OppHub
4. Other projects: Travel Agent Booking Application (Google Apps Script); Question Paper Scanner – OCR to DOCX (**In development**); festival invitation websites (Ganpati link: kavya-arch-cmd.github.io/ganpati-invitation).

**Skills & Technologies** (Kavya's exact list)
- Programming & Web Development: HTML, CSS, JavaScript, Python, Node.js, Express.js
- Databases & Database Management: MySQL, MySQL Workbench, PostgreSQL, MongoDB Atlas, Mongoose, DBMS
- Data Analytics & Business Intelligence: SQL, Microsoft Excel, Data analysis, KPI reporting, Financial and MIS reporting
- AI-Driven Development & Productivity: AI-driven development, AI-assisted productivity, Prompt engineering, Visual Studio Code, GitHub

**Experience:** Junior Analyst – AI Automation, Prophetic Business Solutions (PBS) / PROSOL.AI, Mumbai, October 2026 – Present.
- Work on AI automation with the accounting team; help enhance and test the company's software products.
- Built an MIS web application through AI-driven development that turns Tally Trial Balances into monthly P&L, EBITDA, working capital and budget-variance reports.
- Build Excel-based reports and dashboards.

**Education:** BCA, K P B Hinduja College of Commerce, 2023–2026, CGPA 7.72 · HSC (Commerce), S. K. Somaiya Vinay Mandir Junior College, 2021–2023, 72.67% · SSC, M. D. Bhatia English Medium High School, 2021, 70.40%.

**Certificates** (newest first): Claude 101 and AI Capabilities and Limitations — Anthropic/Claude Academy, Nov 2026 (verify links) · Data Literacy — IBM SkillsBuild, Nov 2026 (Credly link) · Essentials of Prompt Engineering — AWS, Sep 2026 · Pre Security Learning Path — TryHackMe, Apr 2026 · Microsoft Excel — SkillCourse, 2026 · Web Designing & PHP Development — Asterix Solution, 2024.

**Contact:** kavyawani98@gmail.com · +91 88790 15066 · linkedin.com/in/kavya-wani-319014360 · github.com/kavya-arch-cmd · Mumbai, India.

---

## 5. Tech stack

React 19.3 + TypeScript 7.0 + Vite 8.3 · three.js 0.187 via @react-three/fiber 9.8 and @react-three/drei 10.7 · plain CSS · Manrope font (self-hosted via @fontsource-variable) · GitHub Actions → GitHub Pages · DNS at Stackryze. The 3D scene is lazy-loaded (first download ~75 kB gzipped).

---

## 6. Project map

| Path | What it is |
|---|---|
| `src/content/portfolio.ts` | **All portfolio text, links, skills, jobs, certificates.** Edit content here. |
| `src/content/destinations.ts` | The five destinations and signboard labels |
| `src/ui/Sections.tsx` | How each section page renders |
| `src/ui/ContentPanel.tsx`, `Header.tsx`, `Loader.tsx` | Full-screen page, header/menu, loading screen |
| `src/ui/ambience.ts`, `Sound.tsx` | Synthesised ambient sound (Web Audio) and the Sound on/off toggle |
| `src/ui/webgl.ts`, `Notices.tsx` | WebGL check before the 3D loads; no-WebGL fallback and slow/reduced-motion/context-lost notices |
| `src/world/perf.tsx` | Frame budget: hitch-proof `sceneTime` clock and throttled shadow-map updates |
| `src/styles.css` | All styles (colour tokens at top) |
| `src/App.tsx` | App shell; lazy-loads the 3D world. Keep three.js imports out of here and `src/ui/*`. |
| `src/world/World.tsx` | 3D canvas: lights, ground, road, scene parts |
| `src/world/layout.ts` | Positions of platforms, buildings, signs, car stops (authored coords × `WORLD_SCALE` in `scale.ts`) |
| `src/world/roadPath.ts`, `Road.tsx` | The road loop and its geometry |
| `src/world/Car.tsx` | The SUV and journey logic |
| `src/world/CameraRig.tsx`, `camera.ts`, `shots.ts` | Camera: overview framing, free orbit, chase view, arrival close-ups (chase distance and close-ups adapt to screen shape on phones) |
| `src/world/Destinations.tsx`, `Signboard.tsx`, `buildings/*` | Destination platforms, buildings, signboards |
| `src/world/Landscape.tsx`, `Periphery.tsx` | Trees, rocks, grass clumps, flowers, pond, outer forest belt |
| `src/world/Meadow.tsx`, `Village.tsx` | Meadow ground; windmill, crop field, haystacks |
| `src/world/life.tsx` | Tree sway, chimney smoke, birds, pond ripples, arrival leaf burst (all freeze under reduced motion) |
| `public/` | Published files: `CNAME`, `Kavya_Wani_Resume.pdf`, `projects/*.jpg` (real screenshots), `certificates/*.pdf` |
| `resume-tools/` | Résumé generator (git-ignored, local only — see §8) |
| `branding/` | LinkedIn banner and tech-stack sources (see §9); git-ignored, local only |
| `DESIGN_SYSTEM.md` | Visual contract: palette, rules, approved changes. Read before UI/3D changes. |
| `PROJECT_CONTEXT.md`, `CHANGELOG.md` | Project notes and change log (add an entry for each change, newest first) |
| `.github/workflows/deploy.yml` | Build + deploy to GitHub Pages on every push to `main` |

---

## 7. How to do common things

**Run it locally** (Windows; PowerShell blocks `npm.ps1`, so type `npm.cmd`):
```
npm.cmd install          # first time only
npm.cmd run dev          # http://localhost:5173
npm.cmd run build        # type-check + production build
npm.cmd run preview      # http://localhost:4173
```

**Change text, links, skills, jobs, certificates** → edit `src/content/portfolio.ts`, run `npm.cmd run build` to check, then commit and push. Also update the résumé if the same text appears there (§8), and add a `CHANGELOG.md` entry.

**Add a certificate** → copy the PDF into `public/certificates/` with a clean lowercase name, add an entry to `certificates` in `portfolio.ts` (`name`, `issuer`, `date`, optional `verifyUrl`, `file: '/certificates/<name>.pdf'`), newest first.

**Add a project** → add to `projects` (full case study, optional screenshot in `public/projects/`) or `otherProjects` (one line, optional link, `status: 'In development'` if unfinished) in `portfolio.ts`.

**Publish** → `git add -A && git commit -m "…" && git push`. GitHub Actions rebuilds and the live site updates in about a minute. Check: https://github.com/kavya-arch-cmd/portfolio/actions. Commit/push only when Kavya asks.

**Change the 3D world** → read `DESIGN_SYSTEM.md` first (warm earthy palette; no blue themes, glow, blur or glassmorphism; reduced-motion must keep the scene still). Positions live in `layout.ts`/`Landscape.tsx` in authored coordinates passed through `relocate()`.

---

## 8. Résumé

One page, ATS-friendly, in the exact format of Kavya's original Word résumé (Calibri, navy name, navy section headings with rules, right-aligned links/dates). The portfolio website is **not** listed as a résumé project.

- Files: `Kavya_Wani_Resume.docx` and `Kavya_Wani_Resume.pdf` in the project root (private), plus the published copy `public/Kavya_Wani_Resume.pdf` (the site's Resume button).
- To change it: edit the wording in `resume-tools/content.py`, then run
  ```
  python resume-tools/make_resume.py
  ```
  It needs Microsoft Word installed. It rebuilds the .docx from `resume-tools/template.docx` (her original), exports the PDF with Word, warns if it is not exactly one page, and copies the PDF into `public/`. Then commit + push to update the site.
- If `resume-tools/` is missing (it is not in git): open `Kavya_Wani_Resume.docx` in Word, edit, keep it to one page, File → Save As → PDF, and copy that PDF to `public/Kavya_Wani_Resume.pdf`.
- Keep the résumé and the website's Experience/Skills text consistent.

---

## 9. Other assets

- **LinkedIn banner:** `branding/linkedin-banner.png` (3168×792 = LinkedIn's 1584×396 at 2×). Source: `branding/linkedin-banner.html` — warm portfolio palette (ivory, charcoal, terracotta, olive), flat shapes, no glow. Re-render with headless Chrome:
  ```
  chrome --headless=new --hide-scrollbars --force-device-scale-factor=2 --window-size=1584,396 --screenshot=branding/linkedin-banner.png branding/linkedin-banner.html
  ```
  Keep important content out of the bottom-left (profile photo covers it).
- **Tech stack PDF:** `Portfolio_Tech_Stack.pdf` (root) from `branding/tech-stack.html` — print with `chrome --headless=new --no-pdf-header-footer --print-to-pdf=Portfolio_Tech_Stack.pdf branding/tech-stack.html`; keep it one A4 page.

---

## 10. Hosting and domain

- GitHub Pages, source = **GitHub Actions** (repo Settings → Pages). Custom domain `www.kavyawani.indevs.in`, **Enforce HTTPS** on.
- `public/CNAME` must contain `www.kavyawani.indevs.in`.
- Domain registered free at **domain.stackryze.com** (indevs.in); its nameservers are ns1/ns2/ns3.stackryze.com. DNS records are managed at **dns.stackryze.com** → zone `kavyawani.indevs.in`, which holds a `CNAME` record: name `www` → `kavya-arch-cmd.github.io`. Do not delete it.

---

## 11. Working on another device

The project is moved between computers as a **zip of the whole `Portfolio` folder** (it includes `.git`, so history and the GitHub link come along).
- Before zipping you may delete `node_modules/` and `dist/` to make the zip much smaller; they are rebuilt.
- On the new device:
  1. Install **Node.js** (20 or newer; 24 was used) and **Git**.
  2. Unzip, open a terminal in the `Portfolio` folder, run `npm.cmd install` (or `npm install` outside PowerShell), then `npm.cmd run dev`.
  3. To push to GitHub, sign in as `kavya-arch-cmd` when Git asks (Git Credential Manager opens a browser window). Commits are made as "Kavya Wani" with a GitHub no-reply email (set per-repo in `.git/config`).
  4. Before working, run `git pull` in case the other device pushed changes; after working, commit and push so both devices stay in step.
- The résumé generator (`resume-tools/make_resume.py`) needs **Python** and **Microsoft Word** on that device; without Word, edit `Kavya_Wani_Resume.docx` by hand (§8).
- Claude's private memory from the old device does not travel; this file replaces it. If you use Claude Code there, open the `Portfolio` folder and it reads this file automatically; with any other AI, give it this file first.

## 12. Checking changes

- `npm.cmd run build` must pass.
- For visual checks, headless Chrome screenshots work (software rendering is slow: wait ~12–15 s after load). Check desktop (~1440×860), phone (390×844) and reduced motion (`prefers-reduced-motion: reduce` → scene must not move).
- After pushing, confirm the Actions run is green and the live site shows the change (hard refresh with Ctrl+F5).

---

## 13. History in brief

1. Phase 01 — built the 3D world from `DESIGN_SYSTEM.md` with placeholder content.
2. 01.1–01.2 — full-screen perspective camera, full 3D orbit, chase camera, arrival close-ups, spread-out decluttered world.
3. 01.3 — speed: lazy-loaded scene, split bundles, loading screen.
4. 02 — real content from `Personal INFO.txt`, résumé, appointment letter and certificate PDFs; Achievements removed; wording rules set (§3).
5. 03 — ambient life (sway, smoke, birds, ripples, braking car, arrival leaf burst); meadow ground, soft grass clumps, windmill, farm field.
6. 04 — published on GitHub Pages at www.kavyawani.indevs.in with HTTPS; one-page résumé connected; MIS-application line added; LinkedIn banner and tech-stack PDF made.

Full details are in `CHANGELOG.md`.
