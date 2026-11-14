# Changelog

## Phase 04 — 2026-11-14 (published)
- Hosted free on GitHub Pages (repo `kavya-arch-cmd/portfolio`, deployed by `.github/workflows/deploy.yml` on every push to `main`).
- Live at https://www.kavyawani.indevs.in/ (Stackryze DNS: `www` CNAME → `kavya-arch-cmd.github.io`; the bare domain could not take a root record in the Stackryze form).
- Portfolio project card: added Live site and GitHub links, removed "In development".

## Phase 02.7 — 2026-11-14
- Added "Prompt engineering" to AI-Driven Development & Productivity.
- Added this portfolio as the first project ("Interactive 3D Portfolio", in development) with a real screenshot (`public/projects/portfolio.jpg`). No links until it is published.

## Phase 02.6 — 2026-11-14
- Data Analytics skills trimmed to what Kavya has done hands-on: SQL, Microsoft Excel, data analysis, KPI reporting, financial and MIS reporting.
- Vibe Analysis now says Kavya planned and directed the build through AI-driven development; the cleaning, star schema and dashboard are described as features of the project, not as hand-built skills.

## Phase 02.5 — 2026-11-14
- About Me now uses Kavya's own text (intro, My Journey, Where I'm Heading, Beyond Technology); the interests/hobbies cards were removed since the text covers them.
- Skills replaced with Kavya's list: four groups (Programming & Web Development; Databases & Database Management; Data Analytics & Business Intelligence; AI-Driven Development & Productivity). The Creative & content group was dropped.
- Education: added SSC — M. D. Bhatia English Medium High School, 70.40%, completed 2021.

## Phase 03.1 — 2026-11-14 (village landscape)
- New meadow ground (`Meadow.tsx`): vertex-coloured patches of lush, sunny and dry grass with a trodden sandy margin along the road, replacing the flat sand plane.
- Spiky grass tufts replaced by soft rounded grass clumps (also in the outer belt); flowers now grow in small two-colour drifts.
- New village landmarks (`Village.tsx`): windmill with turning sails behind About Me and Projects, a fenced crop field with green and golden rows, and haystacks.

## Phase 03 — 2026-11-14 (world polish: life & arrivals)
- Ambient life (`src/world/life.tsx`): canopies and conifers sway in a light breeze (shader patch on foliage materials, including the instanced outer belt), chimney smoke from the About Me cottage, five small birds gliding in loops, slow ripples on the pond.
- Car: body dips slightly when braking and squats when pulling away; brake lights brighten while slowing.
- Arrivals: the destination's signboard hops and wobbles, and a short burst of autumn leaves rises from it and flutters down.
- All of it runs off one shared clock that stops under `prefers-reduced-motion` (scene stays still; no burst or hop).

## Phase 02.4 — 2026-11-14
- About Me: interests and hobbies shown as two cards with line icons instead of pill rows; "Beyond work" keeps only hobbies (games, music, video editing & content).
- Current job trimmed to the three most relevant points (AI automation & product testing, MIS reporting, Excel dashboards). Removed the "Professional skills" group; "Financial & MIS reporting" moved into Data analytics.

## Phase 02.3 — 2026-11-14
- About Me: new "Beyond work" list (playing games, listening to music, video editing, social media content creation).
- Skills: new "Creative & content" group (video editing, social media content, Canva Pro, CapCut on PC, image editing) and "Professional skills" group drawn from the current role.

## Phase 02.2 — 2026-11-14
- Headline is now "Aspiring Data Scientist · AI-driven development & data analytics"; introduction and goals describe AI-driven development without naming specific AI tools; the tool names were also removed from the Skills list.

## Phase 02.1 — 2026-11-14
- Certificates now show issuer and date from Kavya's certificate files, with "Verify" links (Claude Academy, Credly) and "View certificate" PDFs in `public/certificates/`; listed newest first.
- Removed the ACHIEVEMENTS destination (approved by Kavya: nothing to show yet) — sign, trophy monument, platform, car stop and page. A small grove fills its place inside the road loop. DESIGN_SYSTEM.md updated to five destinations.

## Phase 02 — 2026-11-14 (real content)
- Filled the portfolio with Kavya Wani's information from "Personal INFO.txt" and the résumé: About Me, Projects, Skills & Technologies, Education, Certificates and Contact.
- Projects are short case studies (summary, highlights, technologies, links) with real screenshots captured from the live Vibe Analysis and OppHub sites (`public/projects/`). Smaller projects are listed under "Other projects"; unfinished work is tagged "In development".
- Added the current role (Junior Analyst – AI Automation, Prophetic Business Solutions / PROSOL.AI, from October 2026) from the appointment letter, with the MIS reporting work under it; Anthropic as issuer of the Claude certificates; phone number; Ganpati invitation link; OppHub credited as built with a teammate.
- Still waiting on Kavya: certificate files (dates, verification links), Diwali invitation link, achievements, updated résumé PDF.

## Phase 01.3 — 2026-11-14 (speed and loading)
- The 3D world is lazy-loaded: the header, menu and loading screen arrive in ~75 kB gzipped; three.js and the scene (~265 kB gzipped) download separately.
- Vendor code split into cached chunks: `react`, `three`, `r3f`, plus the scene itself (`World`).
- Loading screen (warm sand, small terracotta car on a road line; static under reduced motion) stays until all materials are compiled and the first frame is drawn, then fades.
- If WebGL or the scene fails, a fallback message points to the Destinations menu, which still opens every section.
- Phones and tablets use a 2048 px shadow map and a pixel ratio capped at 1.5.

## Phase 01.2 — 2026-11-14 (approved changes)
- Decluttered: world layout spread out ×1.32 (road, destinations, landscaping); buildings ×1.14 and platforms ×1.1; outer tree belt much sparser with an open meadow ring.
- Full 3D camera: free 360° orbit, pan and zoom (touch: drag to pan, pinch/twist); signboards billboard toward the viewer.
- Chase camera follows the SUV during journeys; on arrival the camera glides to a destination close-up (building, sign and parked car) for ~1.4 s before the full-screen page opens. Reduced motion cuts directly.
- Paved footpaths now connect the About, Projects and Experience steps to the road.

## Phase 01.1 — 2026-11-14 (approved changes)
- Camera: switched from orthographic isometric to a perspective three-quarter view at a lower angle; whole world is auto-framed to fill the screen at any aspect ratio.
- Desktop: limited orbit (drag) and zoom (scroll), plus a "Reset view" button. Mobile keeps pan/zoom with car-follow.
- Added an instanced forest/meadow belt around the world so wide screens are filled edge to edge.
- Destination content now opens full-screen on arrival (also Resume and Contact).
- Moved the About Me and Projects car stops (and their steps) so the parked car is not hidden behind the trophy or the Experience building; moved trees that covered other stops.

## Phase 01 — 2026-11-14
- Scaffolded React + TypeScript + Vite project with three.js / react-three-fiber.
- Built the isometric 2.5D miniature world: warm sand ground, single winding asphalt loop with kerbs and dashed centre line, warm daylight with soft shadows.
- Six distinct destinations on stone-walled platforms with timber signboards using the exact section titles: stone cottage, glass-and-timber studio, timber workshop, classical academy, certificate easel, trophy monument.
- Landscaping: deciduous/autumn/golden trees, conifers, shrubs, rocks, grass and flowers, pond with stone arch bridge.
- Red SUV drives along the real road geometry with eased acceleration/deceleration, heading from the road tangent and rolling wheels; overlapping journeys are blocked.
- Header with KAVYA / PORTFOLIO, Destinations menu (direct navigation), Resume and Contact.
- Content panels for all six sections plus Resume and Contact, using clearly marked "To add" placeholders (no invented content).
- Responsive camera: whole-world view on desktop; pan/zoom with car-follow on tablet/mobile. Reduced-motion support.
