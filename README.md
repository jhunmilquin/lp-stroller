# Canadian Parent — new parents landing page

The complete static page includes Tailwind v4 source and compiled CSS, vanilla ES2020 JavaScript, eleven standalone SVG icons and their inline sprite, the supplied Canadian Parent logo, and all eight content images. Per the updated request, the five form avatars are omitted; the 400,000+ members text remains. There are no image placeholders or references to absent avatars.

## Open and build

Open `index.html` directly in a modern browser. The compiled stylesheet is included; no build or server is required to preview it. Google Fonts requires an internet connection. The SVG sprite works from disk.

To edit and rebuild, install a current Node.js LTS release, open a terminal in this folder, and run:

```sh
npm install
npm run build
```

During editing, use:

```sh
npm run dev
```

The CLI compiles `src/css/app.css` into `assets/css/app.css`. The build script minifies the output. `package-lock.json` records the tested dependency versions. Only Tailwind and its CLI are development dependencies; the page has no JavaScript dependencies, framework, CDN compiler, or runtime build step.

## Image files

Keep these paths relative to the project folder. Use real alpha transparency for PNG cut-outs. Do not bake a checkerboard into the pixels.

| Path under `assets/images/` | Dimensions | Status |
| --- | --- | --- |
| `brand/canadian-parent-logo.webp` | 1600 × 400 | Included; lossless conversion of the supplied PNG, no redesign or cropping |
| `hero/hero-mother-stroller.png` | 1200 × 1200 | Included; transparent mother, baby, and green Maxi-Cosi Zelia Luxe stroller |
| `prizes/prize-sound-machine.png` | 800 × 600 | Included; transparent |
| `prizes/prize-audio-player.png` | 800 × 600 | Included; transparent |
| `prizes/prize-formula-dispenser.png` | 800 × 600 | Included; transparent |
| `prizes/prize-baby-carrier.png` | 800 × 600 | Included; transparent |
| `illustrations/member-pass-samples-box.png` | 800 × 600 | Included; transparent illustration |
| `photos/step-parcel.webp` | 768 × 512 | Included |
| `photos/cta-mother-newborn.webp` | 1200 × 900 | Included |

All requested content images have been generated and installed together, following the updated request. The two gift cards and the first two step tiles are HTML/CSS and need no image files. All image elements have explicit dimensions and lazy loading except the preloaded, eager hero. The hero was generated using the supplied Essential Green Maxi-Cosi Zelia Luxe product photo as a visual reference; it is an AI-generated scene, not an official catalog photograph.

## Form behaviour and validation

This is a local demonstration. The form has no `action` or `method`, and `handleSubmit` always prevents default submission. No entry, email, or consent is transmitted or persisted. The requested success wording is a visual demo; it does not represent a real registration. A successful submission logs the sanitized payload to the browser console under `Demo only, not sent`. A filled honeypot produces the same success state without logging anything.

Edit `assets/js/app.js` to change validation:

- `REQUIRE_NEWSLETTER_CONSENT` is `false`. Set it to `true` only if newsletter consent should become required; the configured error is already implemented. It is optional and unchecked by default.
- `validateName` contains the Unicode letter expression and the 2–40 character checks. Names are trimmed, repeated ordinary spaces collapse, and Unicode is normalized to NFC.
- `validateEmail` checks total/local/domain-label lengths, exactly one at-sign, whitespace, dot placement, domain labels, and an alphabetic top-level domain.
- `showEmailHint` contains the common domain typo map. Suggestions are optional and can be applied with the keyboard.
- `showError`, `clearError`, and `renderSummary` manage `aria-invalid`, associated live messages, error links, and focus.
- `handleSubmit` enforces one submission at a time and an 800ms busy state before `showSuccess`.
- `initScrollLinks` handles all `data-scroll-to-form` links and respects reduced motion. After success, these links focus the confirmation heading.

There is no `localStorage`, `sessionStorage`, cookie storage, fetch, XHR, beacon, or form redirect. The only authored animation is the 300ms Entered stamp. The loading spinner glyph is static so it does not add a second animation. Reduced motion disables the stamp animation and smooth scrolling.

## Styles and icons

The `@theme` block defines the palette, Fraunces heading font, Poppins UI font, Geist body font, and the single card shadow. The updated mint theme uses `#EAF8F6` for the hero and final CTA, `#D6F1EE` for the soft organic blob behind the hero, `#F1FAF8` for the winners section, and `#F7FBFA` for quiet surfaces. The blob is a separate CSS pseudo-element, so the hero PNG remains fully transparent and reusable. Google Fonts is loaded with `display=swap`. The ticket and winner notches are genuine CSS masks; the entry ticket's outer wrapper supplies its drop shadow.

All eleven SVG icons live in `assets/icons/` and are also declared once as symbols near the top of `index.html`. Update the standalone asset and its matching inline symbol together. The winner location pin uses an unfilled outline, as requested in the follow-up. No logo is recreated with SVG or CSS.

No arbitrary Tailwind bracket values are used. Named CSS component rules cover values that are not appropriate utility tokens: the 400px name-field breakpoint, ticket notch geometry and perforation alignment, the -6-degree gift card, 15% prize padding, and the stamp animation. The 192 × 128px step tiles and responsive ticket-stub heights are also centralized there.

## Brief decisions and checks

- The specified gift cards use coral, as section 7.6 explicitly requires. Coral also supplies the specified caret colour, in addition to buttons and selected chips.
- The prize amount occurs once in visible copy, inside the H1. It also appears in the explicitly requested description metadata and matching Open Graph description.
- The supplied logo is preserved visually and losslessly encoded as WebP to match the requested filename.
- The desktop H1 uses the requested explicit line break and fits two lines at 1280px and above. At 1024px it naturally wraps to three lines to preserve the required font size and prevent overflow.
- The static build and form were checked in Chrome at 320, 390, 768, 1024, 1280, and 1600px. The completed mint page is also checked with all content images installed.
- Validation checks cover empty fields, name length and character errors, normalized Unicode names, email structure and domain errors, typo correction, native radio arrow keys, optional consent, summary focus, preserved inputs, the busy/success state, honeypot silence, reduced motion, and zero requests caused by submit.

The included files are ready for a static host. A real membership or giveaway backend is outside this intentionally local form demonstration.
