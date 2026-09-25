---
name: Fabian Ghani Affandi
description: A photo editor's contact sheet. Every screen is a frame on a roll, printed in WebGL.
colors:
  paper: "#f3f3f0"
  sheet: "#fafaf8"
  ink: "#1d1c1a"
  ink-soft: "#55534f"
  rule: "#cbcac4"
  film: "#1c1917"
  film-ink: "#d8d4cc"
  mark: "#d2462a"
  ground: "#dcdcd6"
  darkroom-paper: "#17120f"
  darkroom-sheet: "#1f1814"
  darkroom-ink: "#ede6dc"
  darkroom-ink-soft: "#b5aa9c"
  darkroom-rule: "#3b312b"
  darkroom-film: "#0b0908"
  darkroom-film-ink: "#8e8274"
  safelight: "#f0913f"
  darkroom-ground: "#2a221d"
  darkroom-hole: "#3d322b"
typography:
  display:
    fontFamily: "Bodoni Moda Variable, Bodoni 72, Didot, serif"
    fontSize: "clamp(3.1rem, 9.5vw, 11.5rem)"
    fontWeight: 400
    lineHeight: 0.86
    letterSpacing: "-0.035em"
  headline:
    fontFamily: "Bodoni Moda Variable, Bodoni 72, Didot, serif"
    fontSize: "clamp(2.5rem, 5.4vw, 5.6rem)"
    fontWeight: 400
    lineHeight: 0.95
    letterSpacing: "-0.025em"
  title:
    fontFamily: "Bodoni Moda Variable, Bodoni 72, Didot, serif"
    fontSize: "clamp(1.9rem, 3.4vw, 3.25rem)"
    fontWeight: 400
    lineHeight: 1
    letterSpacing: "-0.025em"
  deck:
    fontFamily: "Bodoni Moda Variable, Bodoni 72, Didot, serif"
    fontSize: "clamp(1.3rem, 1.9vw, 1.75rem)"
    fontWeight: 400
    lineHeight: 1.36
  lede:
    fontFamily: "Bodoni Moda Variable, Bodoni 72, Didot, serif"
    fontSize: "clamp(1.25rem, 1.65vw, 1.6rem)"
    fontWeight: 400
    lineHeight: 1.36
  body:
    fontFamily: "Archivo Variable, Helvetica Neue, Arial, sans-serif"
    fontSize: "1.0625rem"
    fontWeight: 400
    lineHeight: 1.6
    fontFeature: "\"onum\" 1, \"pnum\" 1"
  label:
    fontFamily: "Archivo Variable, Helvetica Neue, Arial, sans-serif"
    fontSize: "0.9375rem"
    fontWeight: 500
    lineHeight: 1.6
  caption:
    fontFamily: "Archivo Variable, Helvetica Neue, Arial, sans-serif"
    fontSize: "0.875rem"
    fontWeight: 400
    lineHeight: 1.45
  edge-code:
    fontFamily: "Archivo Variable, Helvetica Neue, Arial, sans-serif"
    fontSize: "calc(var(--frame-h) * 0.065)"
    fontWeight: 600
    lineHeight: 1
    letterSpacing: "0.06em"
    fontFeature: "\"lnum\" 1, \"tnum\" 1"
    fontVariation: "\"wdth\" 62"
rounded:
  none: "0px"
spacing:
  gutter: "clamp(16px, 3.2vw, 48px)"
  header: "64px"
  header-compact: "56px"
  xs: "6px"
  sm: "16px"
  md: "24px"
  lg: "28px"
  xl: "48px"
  section: "22vh"
components:
  button-primary:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.paper}"
    typography: "{typography.body}"
    rounded: "{rounded.none}"
    padding: "0 28px"
    height: "52px"
  button-primary-hover:
    backgroundColor: "transparent"
    textColor: "{colors.ink}"
  text-link:
    textColor: "{colors.ink}"
    typography: "{typography.body}"
  field-underline:
    backgroundColor: "transparent"
    textColor: "{colors.ink}"
    rounded: "{rounded.none}"
    padding: "10px 0 12px"
  masthead:
    textColor: "#ffffff"
    typography: "{typography.label}"
    padding: "0 clamp(16px, 3.2vw, 48px)"
    height: "{spacing.header}"
  masthead-banded:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.ink}"
  cursor-label:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.paper}"
    rounded: "{rounded.none}"
    padding: "5px 9px 6px"
  film-strip:
    backgroundColor: "{colors.film}"
    textColor: "{colors.film-ink}"
    rounded: "{rounded.none}"
  sheet:
    backgroundColor: "{colors.sheet}"
    rounded: "{rounded.none}"
---

# Design System: Fabian Ghani Affandi

## Overview

**Creative North Star: "The Contact Sheet"**

The site is a photo editor's light table. Every screenshot of the work is a frame on a roll of film: it sits on the contact sheet in the project's own colours, is magnified under a loupe, gets circled in grease pencil when it is a select, and is printed large as an enlargement. The same room is lit two ways. By day it is a light table of cool baryta paper and fixer-black ink. By night it is a warm darkroom. The layout does not change between them, and neither do the prints: frames and enlargements look the same in both themes, so only the page around them changes.

Density is editorial and unhurried. Large Bodoni Moda headlines sit at weight 400 with optical sizing, and Archivo carries every working word. Space comes from a 12-column grid with one fluid gutter and tall vh-based section breathing room. Depth comes only from overlap and parallax speed. The name overlaps the print, the film strip overlaps the margin, and prints drift at different rates. Nothing is lifted by a blurred shadow. Every image on the page goes through one WebGL print pipeline that develops it shadows-first, clips it like an easel blade, loupes it, and dissolves it into the next frame.

Motion has one orchestrated moment: the introduction sets itself line by line and a reel of frames develops beneath it. Everything after that is tied to scroll or to the visitor's hand. Prints develop as they arrive, grease pencil draws around the selects, and each contact-sheet strip steps along with its own arrows.

**Key Characteristics:**
- Two rooms, one layout: light-table tokens by default, darkroom tokens under `[data-theme="dark"]`.
- Frames in the projects' real colours (the user asked for no black and white, 2026-09-25).
- Grease pencil is the single accent, and it marks selection and attention only.
- Square corners everywhere. Hairline rules, film black, sprocket holes.
- Bodoni Moda for voice, Archivo for work, and Archivo's condensed width for film-edge codes.
- Grain at a fixed on-screen size, independent of print scale.

## Colors

The palette is neutral silver and paper with one chemical accent that changes with the light.

### Primary
- **Grease Pencil** (`mark`): the editor's red-orange china marker. It draws the select boxes on the contact sheet and also serves as the focus outline, the focused and invalid field underline, the field error tick, the active sequence tick, the range thumb, the text-link hover underline, `::selection`, caret and `accent-color`. It is never a surface fill or a button background.
- **Safelight Amber** (`safelight`): the grease pencil under darkroom light. It replaces `mark` one-for-one in the dark theme and carries exactly the same roles.

### Neutral: the light table
- **Baryta Paper** (`paper`): the page, the masthead band and the viewer backdrop. The WebGL shader reads it too, so developing prints rise out of the page colour itself.
- **Light-Table Sheet** (`sheet`): the contact-sheet surface under the strips, one step brighter than the page. It is also the colour of the sprocket holes in the light theme.
- **Fixer Ink** (`ink`): all primary text, the solid button, the cursor label, the range track and the loupe's barrel ring.
- **Silver Midtone** (`ink-soft`): secondary text, captions, strip labels, spec terms, inactive sequence steps and field underlines at rest.
- **Hairline** (`rule`): every 1px divider. That covers spec and list tops, the footer top, the banded masthead's bottom rule, the sheet's outline and link underlines at rest.
- **Film Base** (`film`): the film strips and the vertical strip in the hero.
- **Edge Print** (`film-ink`): the frame numbers and arrows printed along the film edge.
- **Easel Ground** (`ground`): the placeholder behind a frame before it loads, and the letterbox fill behind contained images when WebGL is off.

### Neutral: the darkroom
- **Darkroom Paper** (`darkroom-paper`), **Darkroom Sheet** (`darkroom-sheet`), **Warm Ink** (`darkroom-ink`), **Warm Silver** (`darkroom-ink-soft`), **Darkroom Hairline** (`darkroom-rule`), **Darkroom Film** (`darkroom-film`), **Darkroom Edge Print** (`darkroom-film-ink`) and **Darkroom Ground** (`darkroom-ground`) replace their light-table counterparts role for role.
- **Darkroom Sprocket** (`darkroom-hole`): in the dark theme the sprocket holes get their own value, a lifted warm brown, so they still read against darkroom film.

### Named Rules
**The Grease Pencil Rule.** `mark` and `safelight` mean "this one" or "you are here": selects, focus, errors and the active step. They never fill a surface, colour a heading or decorate.

**The Two Rooms Rule.** A theme is a change of light, not of layout. The dark theme swaps only the custom properties. The prints themselves are never tinted by the theme (the user found a theme-tinted print odd, 2026-09-25). Components never branch on theme.

**The True Colour Rule.** Every frame, reel frame and print shows the project in its real colours, in both themes. The pipeline's `data-mono` option stays available but is not used (user request, 2026-09-25).

## Typography

**Display Font:** Bodoni Moda Variable, with optical sizing (with Bodoni 72, Didot, serif)
**Body Font:** Archivo Variable, with the width axis (with Helvetica Neue, Arial, sans-serif)
**Label/Mono Font:** Archivo at 62% width for film-edge codes

**Character:** A magazine's Didone set large and light against a sturdy grotesque that does all the practical work. The serif speaks and the sans labels.

### Hierarchy
- **Display** (400, clamp(2.5rem, 6vw, 6.25rem), line height 1): the introduction in the first viewport, set to at most 11.5em wide. It is used once.
- **Headline** (400, `headline` clamp, 0.95, balanced wrap): section and project titles.
- **Title** (400, `title` clamp, 1.0): the viewer's project title.
- **Deck** (Bodoni 400, `deck` clamp, 1.36, max 30ch, 36ch for the practice statement): the standfirst under each project title and the practice body paragraph.
- **Lede** (Bodoni 400, `lede` clamp, 1.36): the one-line offer in the hero. It sits on one line from 900px up.
- **Body** (Archivo 400, 1.0625rem, 1.6, old-style proportional figures): running text, spec definitions and list items. Measure 32 to 40ch.
- **Label** (Archivo 500, 0.9375rem): masthead, field labels, practice sub-heads and the range label, all in sentence case.
- **Caption** (Archivo 400, 0.875rem, 1.45, `ink-soft`): figure captions, notes, strip labels (0.8125rem) and the viewer count.
- **Edge code** (Archivo 600, 62% width, 0.06em tracking, lining tabular figures, `film-ink`): frame numbers on the film edge, each preceded by a small solid triangle made from CSS borders, not a glyph. The footer's end-of-roll line uses the same setting in caps. The test-strip exposure times use 75% width.

### Named Rules
**The Light Serif Rule.** Bodoni is always weight 400 with `font-optical-sizing: auto` and negative tracking (-0.025em, -0.035em for the name). Use the size to add emphasis. Never use a bold Didone.

**The Width Axis Rule.** Archivo's condensed width belongs to film. Edge codes, exposure times and the end-of-roll line use it. Running text, labels and buttons stay at normal width.

## Layout

A 12-column grid (`repeat(12, minmax(0, 1fr))`) with a single fluid `gutter` token as both column gap and page margin. The hero, sheet intro, spreads, sequence, colophon, practice and contact all use this grid. Placement is deliberately asymmetric. In the hero the offer takes columns 1 to 4 and the print 5 to 12. Each project is one compact case study (`.case`: NOVA, Pasar Malam, then Aldergrove Hours, newest first), kept short on purpose after the user found the page too long (2026-09-25). The head takes 1 to 7 with its spec at 9 to 12. The workflow stepper follows, its print at 1 to 7 and the text with its step arrows at 9 to 12, and it carries the project's screens. Three facts close the case in one row of three columns. On phones only the active step keeps its description. The contact head takes 1 to 5 with the form at 7 to 12.

Vertical rhythm comes from vh, not fixed pixels: `section` top padding of 22vh (16vh below 900px), 18vh before the sheet and the sequence, and 24vh / 16vh around contact. Component gaps come from a short pixel set: 6, 16, 24, 28 and 48px.

The masthead is fixed at `header` height (64px, 56px below 900px). Full-height sections pad their tops by the header plus a few vh.

Breakpoints: at 1100px the hero lede and the sequence columns rebalance. At 899px everything stacks to full width, the header drops to 56px, and each workflow sequence stacks as title, print, arrows, then steps, so the print changing stays in view. At 520px the masthead shortens the name to "Fabian G. A." and hides the switch label. Contact-sheet frames scale with clamp(120px, min(29vh, 52vw), 290px), so a frame always fits a phone screen.

## Elevation & Depth

The system is flat. Depth comes from overlap and from parallax speed, never from blurred or offset shadows. In the hero the name sits nearest (it moves -30% of the viewport height over the hero scroll), then the film strip (-55%), then the print (-12%). Enlargement prints with `data-speed` drift up to 320px against their neighbours. `box-shadow` appears only as a 1px hairline, as a border that does not affect layout.

### Shadow Vocabulary
- **Masthead band rule** (`box-shadow: 0 1px 0 var(--rule)`): the bottom edge of the banded masthead.
- **Sheet outline** (`box-shadow: 0 0 0 1px var(--rule)`): the contact sheet's edge on the light table.

### Named Rules
**The Overlap Not Shadow Rule.** To bring something forward, overlap it or move it faster. No shadow has a blur radius above 0 or an offset above 1px.

**The Fixed Grain Rule.** Grain lives at screen scale and stays barely visible. A 180px noise tile covers the page at opacity 0.025 (multiply) by day and 0.018 (screen) in the darkroom, stepped at 6 frames over 1.2s. The shader adds ±0.006 per CSS pixel, so enlarging a print never enlarges its grain. The user asked for less grain, especially in the darkroom.

## Shapes

Every corner is square (`rounded.none`), including buttons, fields, the cursor label, film, frames, prints, the viewer and the range thumb (a 14 × 22px bar). The only curves in the system are hand-drawn ones: the grease-pencil boxes with round caps and joins, the circular loupe, and the lamp in the darkroom switch.

Geometry comes from film. Frames are 3:2 (the frame width is `--frame-h` × 1.5). Sprocket holes are rectangular runs of `hole-color` in a repeating gradient along both edges of a strip. The easel is a pair of ruler edges with a tick every 12px and a longer tick every 60px, drawn in `ink-soft` at 0.8 opacity.

## Components

### Buttons
Solid, square and quiet. They invert on hover rather than lifting.
- **Shape:** square corners (0px), 1px `ink` border, minimum height 52px.
- **Primary:** `ink` fill with `paper` text, Archivo 500 at 1rem, padding 0 28px. Used once per region, for "Start a project" and "Send enquiry".
- **Hover / Focus:** the fill empties to transparent and the text turns `ink` (0.35s, `ease-out`). Focus draws a 2px `mark` outline at a 3px offset. Disabled drops to 0.55 opacity with a progress cursor.
- **Text button (viewer controls):** no box. A 1px `rule` underline at a 0.28em offset turns `mark` on hover.

### Text links
- A 1px `rule` underline at a 0.28em offset. On hover it becomes a 2px `mark` underline (0.3s). This is the secondary action beside every primary button.

### Inputs / Fields
- **Style:** underline only. A 1px `ink-soft` bottom border, transparent ground, square corners, text at 1.125rem, padding 10px 0 12px. The label sits above in `label` style.
- **Focus:** the underline becomes 2px `mark`, and the padding drops 1px so nothing shifts. There is no outline ring on the field itself.
- **Error:** the underline turns `mark`. The message appears below in `ink` at 0.875rem, led by a 10 × 2px `mark` tick. Colour is never the only signal.
- **Range:** a 1px `ink` track with a 14 × 22px square `mark` thumb.

### Spec list
- A definition list under a 1px `rule` top border with 20px of padding above. Rows are a 7.5rem term column plus the definition, with a 16px gap and 18px between rows. Terms are 0.9375rem in `ink-soft`. Below 520px each term stacks above its definition. The same top-rule treatment heads the colophon list and, as a bottom rule, the practice sub-heads.

### Navigation (masthead)
- Fixed, `header` height, `label` type. Name on the left, three section links, then the Darkroom switch pushed right.
- **Over the hero:** white text in `mix-blend-mode: difference`, so it reads over paper, print and film alike.
- **Banded:** past 80% of the first viewport it takes a `paper` band with `ink` text and a 1px `rule` bottom line, and the blend mode drops away.
- **Hidden:** after a downward scroll of more than 4px while banded, it slides up by its full height plus 2px (0.55s, `ease-out`). Any upward scroll brings it back, and so does keyboard focus inside it.
- **Link hover:** a 1px `currentColor` underline grows from the left (0.45s).
- **Darkroom switch:** an 18px ring lamp whose inner glow scales in when the switch is pressed. Switching runs a circular View Transition from the lamp over 950ms, `cubic-bezier(0.7, 0, 0.2, 1)`.

### Film strip and sprockets (signature)
- A `film` band with sprocket runs along both edges. Horizontal strips size everything from `--frame-h`: hole height 0.055 × the frame height, frame gap 0.07 × the frame height, and the edge code placed 10% in beneath each frame. The hero's vertical strip uses 7px holes on a 16px pitch.
- Frames are buttons with a `ground` placeholder. The film strip and its holes are only ever drawn in `film`, `film-ink` and `hole-color`.

### Grease-pencil mark (signature)
- An SVG box stroked in `mark` at a width of 2.6 with round caps and joins, and `preserveAspectRatio="none"`. It overhangs its frame by about 10% on each side. Three hand-drawn paths rotate so that no two adjacent selects match. It is only used for select frames.

### The print (WebGL signature)
Every image with `data-gl` is a print: a DOM image that keeps its space and alt text, while a Three.js plane on one fixed canvas draws over it. Behaviours:
- **Develop** (`uDevelop` 0 to 1): tones come up from paper, the darkest first and the highlights last, through a noise threshold.
- **Clip** (`uClip` t/r/b/l): easel blades crop the print from any edge. **Clip bounds** (`uBounds`) stop a print at every `data-gl-clip` ancestor, so frames never paint outside the sheet or the strip.
- **Loupe** (`uHover`, `uMouse`, `uLens`, `uMag`): a circular lens magnifies 1.9× (1.8× in the viewer). On the sheet its radius is 26% of the frame width, clamped to 64 to 120px, and it is 150px in the viewer. It has slight chromatic aberration at the rim and a thin ring in `ink`, darkens the print outside the lens by 7%, and shows full colour inside. The cursor label "Open frame N" rides beside it.
- **Dissolve** (`uMix`): one print gives way to the next through soft noise, washing toward paper at the seam. It is used for the sequence steps and for moving between frames in the viewer.
- **Focus** (`uFocus`, from `data-focus-y`): a cover-fit print holds its top edge (or another chosen edge) as it crops.
- **Bow:** the plane bends slightly with scroll speed (clamped to ±40), like paper lifted off the easel. It is off under reduced motion.
- **Test strip** (`data-teststrip`): six exposure bands with paper seams, which the visitor can develop by hand.

### Viewer
- A full-screen enlargement on a `paper` backdrop. The print flies from its frame on the sheet (1.1s `expo.inOut`) and moves from mono to colour over 1.2s. The chrome fades in after 0.6s. It supports the keyboard (arrows, Escape, a focus trap) and typed frame numbers from anywhere on the page. Controls are text buttons.

### Motion grammar
- **Introduction (the only orchestrated moment):** the intro's lines rise out of line masks (1.4s `expo.out`, 0.12s stagger). The lede, actions and masthead fade in from 0.7s, and the reel's frames develop in sequence from 0.9s. On scroll the reel drifts left by 18% of the viewport width.
- **Prints developing:** the frames on the sheet develop once on arrival (2.2s, 0.07s stagger). Each enlargement's blade lifts from the top while it settles from 12% over-zoom and develops, all scrubbed across the band from 96% to 55% of the viewport.
- **Grease pencil drawing itself:** `drawSVG` from 0 to 100% over 1.2 to 1.3s with `power2.inOut` as a select enters. 
- **Workflow steppers:** nothing on the page pins or holds the scroll. Each `.sequence` has previous and next arrows (the strip arrow style), a live "2 of 5" count, clickable steps and arrow-key support. A step change dissolves the print to the next screenshot (1.1s `power2.inOut`, 0s under reduced motion).
- **Contact sheet strips:** each strip is a horizontal scroll-snap roll. Its previous and next arrows step one frame at a time with smooth scrolling (instant under reduced motion) and disable at either end. Each strip develops as it enters view, then its select is marked.
- **House ease:** `cubic-bezier(0.16, 1, 0.3, 1)` for CSS state changes. Lenis smooth scroll at a lerp of 0.09.

### Fallbacks
- **Reduced motion:** no Lenis and no intro. Prints are developed and marks are drawn from the start. The sheet becomes horizontally scroll-snapped strips, the sequence dissolve runs at 0s, the grain stops, the theme switch has no reveal, and CSS transitions are cut to 0.01ms.
- **No WebGL** (or `?nogl`): the DOM images stay visible. A CSS stand-in reproduces clip as `clip-path: inset()`, develop as brightness and contrast, and zoom and shift as transforms.
- **Phones (below 900px):** the sheet is static, with swipeable strips at a `--frame-h` of `min(44vw, 30vh)`. The instructions change from "Hover" to "Tap" and "Swipe".

- **Tools list** (`.hero__stack`, `.stack`): a definition list in the first viewport, set in the same hairline-row grammar as the project specs. Terms are ink-soft at 0.9375rem, values are ink, and each row is bordered top and bottom by `rule`. It lists only tools used in the shipped work, with no proficiency bars or levels.
- **Mobile menu** (`.menu-toggle`, `.menu`): below 900px the inline nav gives way to a two-line toggle that turns into a cross. It opens a full-screen paper sheet whose clip-path wipes down over 0.7s `expo.inOut`. Large Bodoni links rise out of masks, and the masthead drops its difference blend while the menu is open. Escape, a link, or a resize past 900px closes it, and the page is locked while it's open.

## Do's and Don'ts

### Do:
- **Do** route every new image through the print pipeline (`data-gl`, with `data-fit`) so it develops, clips and loupes like the rest.
- **Do** keep `mark` / `safelight` to selection, focus, error and active state. Pair it with a shape (tick, underline, box) so colour is never the only signal.
- **Do** lay out on the 12-column grid with the single `gutter` token, and place content asymmetrically.
- **Do** make depth by overlap and parallax speed. Keep dividers to 1px `rule` hairlines.
- **Do** set headings in Bodoni Moda 400 with optical sizing and negative tracking, and use Archivo for everything functional.
- **Do** give every scroll-driven effect a static, fully developed state for reduced motion and for screens below 900px.

### Don't:
- **Don't** round a corner. Buttons, fields, frames, prints and labels are all 0px.
- **Don't** use blurred or offset shadows, glass, or gradient fills. The only gradients allowed are the ones that draw sprockets.
- **Don't** show a frame in colour on the contact sheet at rest. Colour comes only from the loupe or the enlargement.
- **Don't** use the condensed width or caps for anything except film-edge codes. Put no small uppercase labels above headings.
- **Don't** add a second orchestrated intro. After the introduction sets, motion follows scroll or the visitor's hand.
- **Don't** make the dark theme a different layout or add dark-only components. Change the light only.
- **Don't** use glyph or icon-font icons. The lamp and the edge triangles are drawn in SVG and CSS.
