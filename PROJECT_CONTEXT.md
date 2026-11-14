# KAVYA Portfolio — Project Context

Visual contract: `DESIGN_SYSTEM.md` (read it before any UI change). Reference: `design-reference.png.png`.

## Stack
- React 19 + TypeScript + Vite
- three.js via @react-three/fiber and @react-three/drei (real 3D geometry, perspective full-3D camera)
- Manrope (self-hosted via @fontsource-variable/manrope)

Run: `npm install`, `npm run dev`, `npm run build`.

## Structure
| Path | Purpose |
|---|---|
| `src/content/destinations.ts` | The five destinations and exact sign labels (Achievements removed 2026-11-14) |
| `src/content/portfolio.ts` | **All portfolio content.** Every unknown value is a `todo(...)` placeholder that renders as a dashed "To add" note. Replace with real strings/URLs. |
| `src/world/roadPath.ts` | Single closed road loop (Catmull-Rom control points), arc-length helpers |
| `src/world/layout.ts` | Platform, building, signboard and car-stop positions per destination |
| `src/world/Road.tsx` | Asphalt ribbon, raised kerbs, shoulders, dashed centre line |
| `src/world/Car.tsx` | Red SUV model + journey logic (arc-length travel, tangent heading, eased speed) |
| `src/world/buildings/*` | Cottage (About), Studio (Projects), Workshop (Skills), Academy (Experience), CertificateStand, TrophyMonument |
| `src/world/Landscape.tsx` | Trees, shrubs, rocks, grass/flower scatter, pond with stone bridge |
| `src/world/camera.ts` | Perspective camera constants and the auto-framing solver |
| `src/world/CameraRig.tsx` | Full 3D camera: framed overview, free orbit/pan/zoom, chase view while driving, arrival close-up, Reset view |
| `src/world/scale.ts` | World spacing, building and platform scale factors |
| `src/world/shots.ts` | Arrival close-up camera for each destination |
| `src/world/Periphery.tsx` | Instanced trees/rocks/grass belt outside the core world |
| `src/world/Meadow.tsx` | Meadow ground with patchy vertex colours and a worn margin along the road |
| `src/world/Village.tsx` | Windmill, fenced crop field and haystacks |
| `src/world/life.tsx` | Ambient motion (tree sway, smoke, birds, ripples) and the arrival leaf burst; shared `worldTime` clock that freezes under reduced motion |
| `src/world/events.ts` | Window event names shared with the UI (no three.js import) |
| `src/ui/Loader.tsx` | Loading screen and the no-WebGL fallback |
| `src/ui/*` | Header (Destinations menu, Resume, Contact), content panel, section renderers |

## Interaction model
- The road is one closed loop; the car always drives forward to the selected stop (no reversing or U-turns).
- Selecting a signboard/building or a Destinations menu item starts a journey; further selections are ignored until arrival.
- On arrival the destination's content opens as a full-screen page. "Back to the world" or Esc closes it; "Drive on to …" continues to the next stop.
- `prefers-reduced-motion`: the car moves to the stop instantly and the panel opens.

## Phase status
- **Phase 01 — complete (awaiting review):** miniature world, road, six destinations, SUV journeys, header, content panels with placeholders, responsive camera.
- **Phase 01.3 — speed and loading:** scene lazy-loaded behind a loading screen; vendor chunks split (see `vite.config.ts`). Keep `App.tsx` and `src/ui/*` free of three.js imports so the first download stays small.
- **Phase 02 — real content:** content in `src/content/portfolio.ts` (sources: `Personal INFO.txt`, Kavya's résumé). Project screenshots live in `public/projects/`.
- Open items: Microsoft Excel and Web Designing & PHP certificate files (dates, links, "K P B" vs "LBP" Hinduja); Diwali invitation link; updated résumé PDF.
- Certificate PDFs are published from `public/certificates/`; the originals Kavya uploaded stay in the project root.
