# uBeer artwork brief

This is the image-generation handoff for the customer and driver PWA. The site currently draws its hero bottles, product pack, waitlist mark and app mark with CSS/SVG; these assets are intended to replace or enrich those illustrations. Put generated files under `apps/web/public/images/` using the filenames below. Keep interface copy, prices, legal copy and the uBeer wordmark as HTML/SVG overlays so they stay readable and easy to localize.

## Shared art direction

- Brand palette: forest green `#244D35`, lime `#D7F36A`, warm ivory `#F7F7EF`, sage `#D9E1CC`, and a restrained warm orange `#E99360`.
- Visual character: polished independent Montréal delivery brand; friendly, local, editorial, tactile, premium without looking exclusive. Natural warm light, honest materials, clean shapes, considered negative space.
- People: adults who clearly appear 25 or older. Show responsible handoff and sealed products. Never show drinking, intoxication, an open alcohol container, or a courier handling a phone while moving.
- Image rules: no generated slogans, interface text, prices, QR codes, fake legal marks, watermarks, or invented uBeer/Heineken logos. Add brand lettering and copy in the app. Do not put map lines, pins or generated island silhouettes into the server geofence; only the checked-in GeoJSON boundary is used for that.
- Mobile and performance: compose the main subject inside the middle 70% of the frame, leave a 10% crop-safe margin, and avoid tiny details. Export photographs as WebP (sRGB, quality 82–88, target under 350 KB); export transparent product art as WebP with alpha (target under 250 KB). Keep a high-resolution PNG master for transparent artwork.

## Required artwork

### 1. Customer home hero — `hero-delivery.webp`

**Output:** 1800 × 1500 px, 6:5 landscape, sRGB WebP, no transparency; quality 84, target ≤350 KB. The current hero panel is about 6:5 on desktop and nearly square on phones, so keep the bag and bottles centered enough to survive a centered 1:1 mobile crop. No text is baked into the image.

**Prompt:**

> Create a premium editorial campaign photograph for a Montréal neighbourhood beverage delivery app. A handsome forest-green insulated delivery tote with no logo sits on a small ivory stone café table beside a neat, sealed six-bottle pack of dark green glass bottles; the packaging is intentionally unbranded and has no readable text. Beads of condensation catch warm late-afternoon light. In soft focus behind it: a leafy Montréal residential street, classic grey stone triplex façade, black iron outdoor staircase and a glimpse of a corner café, recognizable as lived-in Montréal without tourist landmarks. Forest green, soft sage, warm ivory and one small citrus-orange accent. Eye-level three-quarter product view, natural 50 mm lens, tactile paper and glass, gentle film grain, sophisticated art direction, welcoming and real, crisp main objects, quiet background. Arrange the tote and bottle pack in the central 70% of frame, leave comfortable breathing room around every edge, with no object cropped. 6:5 landscape composition, exact canvas 1800 × 1500 pixels. Photorealistic, high detail, natural light.

**Negative prompt:** text, lettering, logo, watermark, people drinking, open bottle, visible alcohol being consumed, intoxication, spills, car, moving bicycle, delivery bag covered in branding, garbled labels, extra bottles, distorted glass, clutter, neon nightlife, stock-photo smiles, oversaturated colors.

### 2. Product catalogue image — `heineken-six-pack.png` / `heineken-six-pack.webp`

**Output:** 1600 × 1600 px square transparent RGBA PNG master; also export 1200 × 1200 transparent WebP, sRGB with alpha, quality 88, target ≤250 KB. Keep the complete pack and a soft contact shadow within an 80% safe area. This image sits on a pale sage product card and may be reduced to a small phone thumbnail.

**Prompt:**

> Create a clean, accurate e-commerce packshot of one six-pack of Heineken beer in six dark-green glass bottles, upright in its authentic green cardboard carrier, front three-quarter view at eye level. Show exactly six bottles, correctly proportioned caps and necks, the familiar red star and green-and-white Heineken label with the brand spelled exactly “Heineken”; make the pack look new, sealed and untampered. Keep all product edges fully visible. The carrier is the hero and fills about 78% of the square canvas. Neutral softbox studio lighting, subtle realistic glass reflections and a very soft grounding shadow. Transparent background, no pedestal, no props, no perspective distortion. Exact canvas 1600 × 1600 pixels, product photography, crisp commercial detail.

**Negative prompt:** extra or missing bottles, cans, broken glass, open bottle, poured beer, foam, ice bucket, hands, people, text outside the printed package, invented certification, misspelled brand, duplicate labels, floating product, hard black shadow, colored backdrop, watermark.

**Brand accuracy note:** use a licensed Heineken packshot or provide an approved product-photo reference if the generator cannot render the printed label precisely. Keep the scene and crop from the prompt; do not publish misspelled product packaging.

### 3. Driver recruitment and delivery handoff — `driver-montreal.webp`

**Output:** 1800 × 1200 px, 3:2 landscape, sRGB WebP, no transparency; quality 84, target ≤350 KB. Keep both people and the sealed tote in the center 75% so the same image can crop into a phone-width banner and a delivery confirmation panel.

**Prompt:**

> Make a warm, credible editorial lifestyle photograph for a responsible local delivery service in Montréal. A professional adult courier who clearly looks over 25 has stopped beside a safely parked city bicycle, helmet secured, and is handing a sealed forest-green insulated tote to an adult customer who also clearly looks over 25 at the entrance of a classic Montréal triplex. The customer is calmly showing an ID card for an age check; do not reveal readable personal information. Both people look relaxed and respectful, with natural unscripted expressions. The tote remains closed; no bottles or alcohol are visible and nobody is drinking. Grey stone façade, black iron stairs, leafy street, soft early-evening daylight. Documentary fashion photography, authentic local casting, tasteful forest-green and ivory accents, natural skin tones, 50 mm lens, subtle grain. Compose a clear visual triangle between courier, tote and customer, with safe crop room on all four sides. Exact 3:2 canvas, 1800 × 1200 pixels.

**Negative prompt:** anyone under 25, drinking, open alcohol, intoxication, unsafe biking, moving vehicle, courier using a phone while moving, visible license or personal ID data, brand logos, readable signs, text, watermark, staged handshake, nightclub, police imagery, excessive delivery uniform branding.

### 4. Outside-area waitlist illustration — `waitlist-neighbourhood.webp`

**Output:** 1200 × 900 px, 4:3 landscape, sRGB WebP, no transparency; quality 84, target ≤220 KB. The composition will sit in a pale card and crop responsively, so keep the route, building forms and focal parcel away from the edges.

**Prompt:**

> Create a refined, friendly editorial illustration for a Montréal delivery app’s “coming soon” waitlist state. Show a small cluster of stylized Montréal row houses, black spiral staircases, leafy trees and a simple delivery route that ends at a warmly lit doorstep with a sealed forest-green parcel. A subtle orange location dot sits near the route endpoint. The scene feels hopeful and local, as if nearby service is on its way. Use flat gouache shapes with fine paper texture and a few precise architectural lines; forest green, sage, warm ivory and lime accents, sparse composition, soft daylight. Do not draw a map, island outline, street labels, boundaries, text or geographic pin coverage. Center the artwork with generous blank margin; it must read clearly when reduced. Exact 4:3 canvas, 1200 × 900 pixels.

**Negative prompt:** text, map, accurate or invented geography, city labels, roads with names, logo, watermark, alcohol bottle, drinking, children, clutter, gradients with banding, tiny unreadable details, dark nighttime scene.

### 5. Order status / delivery confirmation illustration — `delivery-confirmed.webp`

**Output:** 1400 × 1000 px, 7:5 landscape, sRGB WebP, no transparency; quality 84, target ≤280 KB. Keep the handoff in the central 70% for a responsive card crop. Reuse the image on the customer order-status screen and driver completion panel.

**Prompt:**

> Create an optimistic but understated editorial illustration for a completed Montréal doorstep delivery. An adult customer, clearly over 25, receives a closed, sealed forest-green delivery tote from an adult courier, clearly over 25, in a bright apartment vestibule with a subtle black iron Montréal staircase visible outside. The handoff is finished and calm; no alcohol product is exposed, nobody is drinking, and no one is shown celebrating with a drink. Add a small lime check-shaped motif as a simple abstract accent, not a letter or interface symbol. Modern cut-paper illustration with soft grain, rounded human forms, warm ivory light, forest green and sage shadows, limited orange highlight. Leave open breathing room around the figures; no words or lettering. Exact 7:5 canvas, 1400 × 1000 pixels.

**Negative prompt:** people under 25, glass or bottle in hand, drinking, visible alcohol, open package, ID details, text, logos, watermark, confetti, UI elements, map, harsh shadows, crowded scene.

### 6. Social sharing / open-graph background — `ubeer-open-graph.webp`

**Output:** exactly 1200 × 630 px, 1.905:1 landscape, sRGB WebP, no transparency; quality 84, target ≤300 KB. Leave the left 42% quiet for a title and wordmark added separately as vector/text by the website; put the still-life subject on the right. Keep important elements within a 5% safe border.

**Prompt:**

> Create a high-end wide social-sharing background for uBeer, a responsible Montréal neighbourhood delivery service. On the right half only, arrange a forest-green insulated tote beside a neat sealed six-bottle green-glass pack on a warm ivory stone counter; packaging has no brand, no readable label and no text. Add a softly focused classic Montréal stone triplex and iron staircase in the distance, late-afternoon light, a few leaves, restrained sage and citrus-orange accents. The left 42% of the canvas is uncluttered warm ivory/sage negative space with only subtle natural texture so a designer can add a headline and logo later. Editorial commercial still-life photography, premium but approachable, natural color, crisp products, clean silhouette, tasteful soft shadows. Exact 1200 × 630 pixel canvas, very wide landscape.

**Negative prompt:** words, letters, logo, watermark, bottle labels, people drinking, open containers, map, landmark clichés, excess props, subject on the left, busy background, clipped products, dark nightclub lighting.

## Already covered by code

- App icon: keep `apps/web/public/ubeer-icon.svg` and the existing 192 × 192 and 512 × 512 PNG exports unless the mark is being redesigned. If a refresh is desired, create a vector master at 1024 × 1024 (SVG preferred; no raster detail), then export 192 × 192 and 512 × 512 PNGs. Keep the mark inset by 15% for Android’s maskable crop. Do not use generated lettering; the `uBeer` wordmark belongs in app text.
- Admin maps, region polygons, status marks and small interface icons are rendered from live GeoJSON, Leaflet or vector/CSS. They need no generated picture.

---

Contact: Stephane Jacob <jacobstephane@outlook.com>
