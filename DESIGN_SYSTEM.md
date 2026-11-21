# KAVYA Portfolio — Design System

**Status:** Approved visual direction  
**Reference:** `design-reference.png` (the user's final isometric road-world reference)  
**Purpose:** This document is the visual source of truth for every portfolio screen and interaction.

Any AI assistant or developer working on this project must read this file before changing the UI. Do not reinterpret, replace, or casually extend the approved direction.

---

## 1. Product concept

Create a personal portfolio as a **playable-feeling, interactive 2.5D miniature road world**.

The visitor sees a small red SUV on a winding road. The road connects five distinct portfolio destinations, each represented by a small building or recognisable environment. The visitor chooses a destination; the car drives along the connected road and arrives there; the relevant portfolio content is then shown.

This is a portfolio with a simple, delightful driving interaction. It is **not** a racing game, driving simulator, dashboard, map application, railway scene, or generic portfolio template.

The experience should feel polished, welcoming, memorable, and easy to understand.

## 2. Primary visual reference

Use `design-reference.png` as the primary visual target for the overall scene.

Preserve its key visual language:
- Wide, panoramic, isometric / 2.5D miniature landscape.
- ~~Warm ivory / sand-coloured ground.~~ Replaced (approved 2026-11-14): a sun-warmed sage meadow whose colour drifts between lush, sunny and dry patches, with a trodden sandy margin along the road. The ivory/sand tone stays for the website UI around the world. The reference image guides only the car, road and buildings; the village landscape is our own.
- Dark charcoal asphalt road with pale dashed centre markings.
- A connected, winding road that visibly travels through the scene.
- A red SUV on the road.
- Five destination areas, each with a distinct small architectural setting.
- Natural landscaping: trees, shrubs, flowers, rocks, grass, stone edging and small environmental details.
- Warm, soft daylight and believable contact shadows.
- Wooden or warm stone destination signboards with clear labels.
- A handcrafted miniature-diorama feeling, with enough detail to feel rich but not cluttered.

The reference is a visual guide, not a flat background to place behind the website. Recreate the scene with suitable 3D/2.5D assets, geometry, materials and lighting. Do not simply display the reference image as the website.

Do not replace this composition with six ordinary rectangular cards in a dashboard grid.

## 3. Portfolio destinations

Use these exact five sections and labels (ACHIEVEMENTS was removed with Kavya's approval on 2026-11-14 because there are no achievements to show yet; it can return later as a sixth stop):

1. **ABOUT ME** — personal introduction, profile, background and career direction.
2. **PROJECTS** — selected projects, case studies, technologies, contributions, GitHub and live links.
3. **SKILLS & TECHNOLOGIES** — programming, web development, databases, analytics, tools and AI technologies.
4. **EXPERIENCE & EDUCATION** — employment, internships, responsibilities, academic history and qualifications.
5. **CERTIFICATES** — completed courses, certificates, issuing organisations, dates and verification links.

Do not use “ANYTHING” as a section name. Do not invent extra destinations without approval.

Resume and Contact may be accessible through a small, clear website header. They do not need to become road destinations.

## 4. Colour system

The scene must follow the reference's warm, natural, earthy palette. These are starting design tokens; tune shades only when needed to match the reference, and record any approved changes here.

| Token | Hex | Usage |
|---|---|---|
| `--color-ground` | `#F3E6D5` | Main warm ivory / sand environment |
| `--color-paper` | `#F7F0E7` | Content surfaces and light panels |
| `--color-ink` | `#292622` | Main text and dark details |
| `--color-road` | `#343536` | Asphalt road |
| `--color-road-edge` | `#B8A58E` | Road edge / kerb |
| `--color-road-marking` | `#F4F0E9` | Dashed centre markings |
| `--color-terracotta` | `#C65D35` | Main accent and vehicle body |
| `--color-wood` | `#A96D43` | Timber signboards and warm details |
| `--color-stone` | `#B8A58F` | Stone platforms, walls and edging |
| `--color-foliage` | `#65734B` | Trees and greenery |
| `--color-foliage-light` | `#89915C` | Lighter foliage |
| `--color-muted` | `#777168` | Secondary text |

Rules:
- Warm ivory, charcoal, terracotta, stone, wood and natural greens are the dominant palette.
- The red / terracotta SUV is the main visual accent.
- Keep destination labels high contrast and readable.
- Do not introduce a blue-dominant visual theme.
- Water, if present in a small environmental detail, must remain secondary and must not turn the overall design blue.
- Avoid oversaturated colours.

## 5. Environment and composition

### Scene
- Use a wide landscape composition similar to the reference.
- Present the world from a raised isometric / three-quarter view, not a flat top-down map and not a first-person camera.
- Keep the whole route and all five destinations understandable at the initial view.
- The road should be the visual structure that connects the destinations.
- Each destination should have its own recognisable architectural identity, while all locations belong to the same miniature world.
- Use layered terrain, low stone retaining walls, landscaped edges and subtle elevation changes where appropriate.
- Keep enough open ground around the road so the route remains legible.

### Road
- Charcoal asphalt, consistent width, pale dashed centre line.
- Smooth, flowing bends and clear connections between the main route and destination stops.
- Road edges should have subtle kerbs / raised borders, not thick cartoon outlines.
- The road must look physically continuous and drivable.
- The car must stay on the road surface throughout its journey.
- Avoid intersections that are visually ambiguous or routes that overlap buildings.

### Destinations
- Use five distinct miniature settings, not five identical platforms.
- Architectural forms can include a welcoming home, contemporary project studio, technology workshop, education / experience building, and certificate gallery.
- Use a restrained wooden or warm stone signboard for each destination.
- Use the exact section title on each signboard.
- Do not fill the scene with oversized labels, floating UI cards or decorative markers.
- Signboards must be readable at normal desktop scale.

### Landscaping
- Use trees, shrubs, small flowers, rocks, grass, stone paths, retaining walls and occasional bridges as supporting details.
- Landscaping should frame the road and destinations, not obscure them.
- Avoid random decoration with no spatial purpose.
- Keep the visual density balanced: detailed close to destinations, quieter around road bends.

## 6. Vehicle design

The vehicle is a **small, refined red SUV**, matching the character of the reference.

Requirements:
- Recognisable SUV proportions and silhouette.
- Premium, believable 2.5D / 3D modelling.
- Deep red / terracotta body.
- Dark windows, tyres and restrained trim.
- Visible wheels and appropriate ground contact.
- Correct perspective relative to the road.
- The car should be prominent enough to follow, but not dominate the whole scene.

Do not use:
- Childish cartoon cars.
- Toy-like proportions.
- Emoji or generic icon cars.
- A flat, crude SVG symbol as the final vehicle.
- An oversized supercar / racing car.
- A photograph pasted onto the road.
- A square bounding box, selection frame or HUD around the vehicle.

## 7. Lighting, materials and depth

- Use soft, warm daylight similar to the reference.
- Use believable contact shadows beneath buildings, trees, signboards, road edges and the car.
- Materials should have subtle texture: asphalt, stone, timber, soil, foliage and painted vehicle bodywork.
- Give buildings and landscaping clear volume and depth.
- Use ambient occlusion / soft shadowing carefully where supported.
- Maintain readable separation between road, ground and destination platforms.

Shadows should communicate form and contact. They must not become decorative glow effects.

## 8. Typography and labels

Use a clean, professional sans-serif family for headings and body text. A restrained editorial pairing is acceptable, but readability comes first.

- Destination names: bold, simple, uppercase where matching the reference.
- Supporting content: clear, calm and readable.
- Small metadata: restrained mono or sans-serif labels.
- Avoid excessive letter spacing and tiny text.
- Do not place technical telemetry, fake coordinates, fake speed, fake route numbers or decorative system readouts on the scene.

The destination signboards should feel like part of the miniature environment, not generic website cards pasted on top.

## 9. Website UI around the world

Keep website chrome minimal so the miniature world remains the hero.

- A compact header may contain KAVYA / PORTFOLIO branding, Resume and Contact.
- Keep navigation clear and accessible.
- Portfolio content opened after arrival must use the same warm, earthy design language.
- Content pages must remain professional and readable; the 2.5D world should not make the actual information difficult to access.
- Provide a clear way to return to the world / home.
- On arrival, a destination's content opens as a full-screen page (approved 2026-11-14) below the header, with "Back to the world" and "Drive on to …" actions.
- While the 3D world loads, a minimal loading screen (approved 2026-11-14) fills the stage in the ground colour: a small terracotta car moving along a short road line, with a note that the Destinations menu already works. It must stay flat and warm: no spinners with glow, no blur, no percentages or technical readouts. If the world cannot load, the same style shows a plain fallback message pointing to the menu.
- Avoid adding unrelated sections, filler copy or unnecessary pages.

## 10. Motion and interaction principles

The car interaction should be delightful but controlled.

When a visitor selects a destination:
1. Identify the destination's route.
2. Move the car along the actual road geometry.
3. Rotate the vehicle naturally according to the road tangent.
4. Keep the car aligned to the road and grounded on its surface.
5. Use smooth acceleration and deceleration.
6. Arrive at the selected destination.
7. Open that destination's content.

The car must genuinely travel through the scene. Do not fake the journey by teleporting the car, changing text only, or moving it independently of the road.

Motion rules:
- Smooth and moderately paced; never frantic or excessively fast.
- No constant idle animation that distracts from reading.
- No unnecessary bouncing, spinning, camera shaking or racing effects.
- Prevent overlapping journeys and handle repeated clicks safely.
- Provide a direct-access navigation alternative.
- Respect reduced-motion preferences.

### Sound and browser notices (requested by Kavya 2026-11-21)
- Optional ambient sound: distant town traffic, breeze, occasional passing cars and birdsong, engine hum while driving. Off by default, quiet, toggled with a plain "Sound on/off" button; never autoplays.
- When the browser limits the world (no WebGL, software-only 3D, reduced motion, lost graphics), a small flat notice in the paper colour with a terracotta left rule explains it. No WebGL shows direct buttons to every section instead of the world.

### Village landscape (approved 2026-11-14)
- Ground: soft meadow patches (sage, olive-green, dry gold), never flat colour, never blue-green.
- Grass is drawn as soft rounded clumps that match the blob trees, not thin spiky blades. Flowers grow in small drifts of one or two warm colours.
- Village landmarks in open meadow: a plaster windmill with slowly turning canvas sails, a fenced crop field (green and golden rows) with haystacks. Keep them clear of the road and away from the destinations so they never compete with the signboards.

### Ambient life (approved 2026-11-14)
- Gentle, slow motion keeps the miniature alive: trees sway in a breeze, smoke drifts from the cottage chimney, a few small dark birds glide high above, ripples spread on the pond.
- On arrival the destination's signboard gives a small hop and a burst of autumn-coloured leaves rises and falls. Earthy colours only, no sparkles, glow or confetti.
- All ambient and arrival motion stops under reduced motion.

## 11. Camera and responsive behaviour

### Desktop
- Wide three-quarter **perspective** view (approved 2026-11-14, replacing the earlier orthographic isometric view): ~37° elevation, narrow 28° FOV for a miniature-diorama feel, framed so the road and all five destinations fill the screen.
- Full 3D (approved 2026-11-14): visitors may orbit 360°, pan and zoom; signboards turn to face the viewer; a "Reset view" control restores the framed overview.
- While the car drives, the camera follows it from an elevated chase position (smooth, no shake); on arrival it glides to a close-up of the destination, then the page opens.
- The world is spread out (×1.32) with slightly larger buildings so the scene never feels crowded; the outer tree belt is sparse with an open meadow ring.
- A landscaped belt of trees, rocks and meadow surrounds the core world so wide screens have no empty ground.
- Keep the SUV visible and the destination labels readable.
- The scene should occupy the main visual area.

### Tablet
- Adjust camera framing and scene scale to preserve route readability.
- Do not crop important destinations.

### Mobile
- Use an adapted camera framing, controlled pan/zoom, or a simplified navigable scene.
- Ensure destinations remain reachable and labels remain legible.
- Provide accessible direct navigation if the complete miniature world cannot fit.
- No horizontal page overflow.

## 12. Strictly prohibited design choices

These are explicit rejections. Do not add them even if a template, library or AI suggestion recommends them.

- Blue-dominant or blue-themed palette.
- Neon colours.
- Glow effects.
- Blurry backgrounds or blur overlays.
- Glassmorphism.
- Frosted-glass cards.
- Unnecessary gradients.
- Excessive shadows used as decoration.
- Childish cartoon / toy-like vehicle.
- Flat emoji-style car icons.
- Generic dashboard layouts.
- Six generic cards replacing the miniature world.
- Generic AI-generated portfolio template styling.
- Racing-game interface or simulator controls.
- Railway, train, station or platform concepts.
- Floating HUDs, fake telemetry, fake coordinates or fake status readouts.
- Unnecessary animations and decorative motion.
- Random floating objects or visual clutter.
- Unrequested pages, filler sections or invented content.
- Using the reference image as a static background instead of recreating the environment.

## 13. Content integrity

Use only information supplied by KAVYA or verified from the project materials.

Do not fabricate:
- Employment or internship history.
- Education or qualifications.
- Project features or results.
- Statistics, users, downloads or performance claims.
- Certificates, dates or issuing organisations.
- Awards or achievements.
- Contact details or social links.

Use clearly marked editable placeholders where information is missing. Do not publish placeholders as real claims.

## 14. Approval and change control

This document is the approved visual contract.

Before changing a major visual decision:
1. Explain the proposed change.
2. Explain why it is needed.
3. Wait for approval.

If a requirement is technically difficult, explain the limitation and propose the closest faithful alternative. Do not silently replace the concept.

After each approved phase, update `PROJECT_CONTEXT.md` and `CHANGELOG.md`. If an approved visual token or rule changes, update this `DESIGN_SYSTEM.md` as well.

---

## Final quality test

Before calling the design complete, check:

- Does the scene look recognisably close to the supplied isometric road-world reference?
- Is the winding road the central organising element?
- Are all five destinations represented by distinct miniature environments?
- Does the red SUV look premium and believable rather than childish?
- Are the warm natural colours consistent throughout?
- Are the road, car, buildings and landscape visually integrated?
- Is the scene attractive without glow, blur, neon or excessive effects?
- Can a visitor understand how to choose a destination?
- Is the portfolio content still readable and accessible?

If any answer is no, refine the design before moving to the next phase.
