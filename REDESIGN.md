# The Blackthorn Almanac — Redesign Plan

> A layout redesign around one coherent editorial concept. Restyle is not the goal;
> structure is. Palette, type, copy, pricing and the interaction furniture that already
> works are all kept (see **What's kept**). Everything else is re-composed.

---

## 1. The concept (one paragraph)

**The Blackthorn Almanac.** We treat the page as a printed almanac — a small-town
barbershop written up with the typographic seriousness of a magazine feature. The whole
site is bound by one device: a **numbered chapter spine**. A hairline vertical rule runs
down the left margin, and each section opens with a folio line — `01 · The Shop`,
`02 · The Ritual`, `03 · The Menu` — set in small-caps Hanken with a fine rule bleeding
across the page. Fraunces does the heavy lifting: an oversized masthead on the cover,
italic pull-quotes at chapter breaks. The palette and photography are unchanged, but the
photos are now handled like editorial plates (breaking the grid, mixed sizes, captioned)
rather than uniform tiles. The feel is premium print — generous whitespace, ruled leaders,
confident single CTAs — executed digitally with restrained, native, transform/opacity
motion. No section uses the "competent template" shape it uses today.

**My one addition to your direction (endorsing, not replacing):** bind the concept with a
persistent **folio system** — the chapter number + name as a ruled header on every section,
plus the thin left spine rule — so the "almanac" reads as a single bound document rather
than a stack of independently-styled sections. This is what stops it sliding back into
"template with nicer fonts." Everything else in your brief I'm building as written.

---

## 2. Running order & chapter map

The almanac tells a story, so the order becomes a narrative arc rather than a
conversion funnel. This is the one **structural decision I want your nod on** (it moves a
couple of sections):

| Folio | Section | Was |
|-------|---------|-----|
| Cover | Hero (masthead) | Hero |
| 01 · The Shop | Story / about + stat row | Story (near end) → **moves to front** |
| 02 · The Ritual | **NEW** scrollytelling craft section | — |
| 03 · The Menu | Services price list | Services |
| 04 · The Chairs | Team ("Choose your chair") | Team |
| 05 · The Work | Gallery (editorial spread) | Our work |
| 06 · In Their Words | Reviews (pull-quote, dark band) | Reviews |
| 07 · Good to Know | FAQ (two-column index) | FAQ |
| 08 · Book In | Booking (editorial form) | Booking |
| Colophon | Visit / hours / map | Visit |

This puts The Ritual "between about and services" as you asked, and gives a clean arc:
*who we are → how we work → what it costs → who does it → proof → words → practicalities →
book → find us.* **Trade-off to flag:** the last conversion pass deliberately put *Our work*
directly after *Services* to justify prices, and led with *Services*. The Almanac leads with
*The Shop* instead and puts proof (gallery/reviews) later. If you'd rather protect that
conversion adjacency, I can open with **03 · The Menu** and keep *The Work* right after it —
say the word. Default I'll build: the narrative order above.

Nav pill (moving selector kept) tracks the main chapters: **Shop · Ritual · Menu · Chairs ·
Work · Visit**, with the **Book** pill. Reviews/FAQ are reached by scroll (the pill simply
shows no active item across them, which the current scroll-spy already handles).

---

## 3. Section-by-section plan

Each entry: **the reinvention → the 21st.dev pattern it draws on → how it differs from today.**

### Cover — Hero
Masthead cover, not hero-with-image-beside-text. Oversized Fraunces wordmark/headline set
like a magazine cover; the **arched photo breaks the grid** (bleeds past the type column /
overlaps the masthead baseline) instead of sitting in a tidy right-hand panel. An issue-style
dateline replaces the sub-badges: **`Est. 2012 · Market Street · Heywood`** in small-caps
with rules. One confident CTA (**Book your chair**); the phone becomes a quiet ruled line, the
10% offer a small "insert" tag. Kept copy verbatim.
- **Pattern:** Heroes (editorial cover treatment) + **Text Reveal** (Texts) for a one-shot
  masthead settle on load.
- **Differs:** today it's a 50/50 copy-left / arched-photo-right grid. Now the photo is a
  grid-breaking plate and the type is the hero, not a peer of the image.

### 01 · The Shop — Story
Opens the almanac. Chapter folio + rule, an oversized **Fraunces pull-quote** drawn from the
existing story copy, body set in a narrow measure beside it, the 2012 / 4.9 / 6 stat row kept
(count-up kept) but re-set as ruled almanac figures rather than a card strip.
- **Pattern:** Texts (**Text Reveal**) + Numbers (**Number Flow** — our existing count-up).
- **Differs:** today it's image-left / copy-right two-column. Now it's an editorial opener:
  pull-quote + measure + ruled figures, photo as a bled plate.

### 02 · The Ritual — NEW centrepiece (scrollytelling)
The proof-of-craft section. A **sticky image pane** holds one plate; as you scroll, four
numbered chapter fragments swap the plate and advance a numbered progress rail:
**01 Consultation → 02 The cut → 03 Hot towel → 04 The finish**, each 1–2 sentences.
- **Pattern:** **Sticky Scroll Reveal** + **Sticky Section Tabs** (Scroll Areas), with a
  **Stepper / Timeline** rail (Steppers, Timelines) for the 01–04 markers.
- **Differs:** nothing like it exists in the build. It's the signature moment.
- **Degrades:** on mobile and `prefers-reduced-motion`, it becomes a plain **stacked list** —
  each step is its own block with its image above the text, in normal flow, no sticky, no JS.
  (Full technical approach in §4.)

### 03 · The Menu — Services
Kills the card grid. A **letterpress price list**: section headings (Cuts / Beard & Shave /
Styling), each line `Name · · · · · · · · £price   duration` with **ruled dot-leaders**, and a
per-line **Book** link that deep-links into the form with that service pre-selected. One
atmospheric plate bled alongside, not a photo per card.
- **Pattern:** Texts (ruled lists) + the menu-board idea already prototyped; per-line CTA is a
  Calls-to-Action micro-pattern.
- **Differs:** the current build is *already* a menu board — good — but it's a self-contained
  block. Now it's a chapter in the almanac (folio + spine), the leaders are finer, and each
  line books its own service (deep-link). Prices/names/durations unchanged.

### 04 · The Chairs — Team
"Choose your chair." Each barber is a **numbered chair**: `Chair 01 — Callum Reid`,
specialisms as **small-caps chips**, and the whole chair is a link that opens the booking form
with **that barber pre-selected**. Presented as a ruled roster, not a 4-up avatar grid.
- **Pattern:** Team Sections + **Stepper** numbering + Tags (small-caps chips).
- **Differs:** today it's four identical photo cards. Now it's a numbered editorial roster
  where each entry is a booking deep-link (Chair 01–04 → pre-filled barber).

### 05 · The Work — Gallery
Kills the uniform grid. An **expanding image accordion**: a row of vertical columns that widen
on hover / tap / keyboard focus to reveal the cut, each with a small caption. Falls back to an
**editorial spread** (mixed sizes, captioned) at narrow widths where an accordion is fiddly.
- **Pattern:** **Expandable Gallery** / **Interactive Image Accordion** (Galleries, 2.8k).
- **Differs:** today it's six equal tiles. Now it's an interactive, caption-led accordion —
  keyboard-accessible (arrow/enter, visible focus), touch-friendly (tap to expand), and on
  mobile it collapses to a captioned vertical spread rather than an accordion.

### 06 · In Their Words — Reviews
Kills the card row. **One oversized rotating pull-quote** in Fraunces italic on the dark
espresso band, attribution in small caps, **manual prev/next only (no autoplay)**, crossfade
via opacity. The Google 4.9 / 214 summary stays as a small ruled figure.
- **Pattern:** **Animated Testimonials** (Testimonials, 1.5k) — stripped to manual controls.
- **Differs:** today it's two side-by-side review cards. Now it's a single editorial quote you
  step through, on the dark band, no cards.

### 07 · Good to Know — FAQ
Not a centred accordion column. A **two-column index**: numbered questions listed left
(`01 … 05`), the answer revealed on the right when a question is chosen; ruled editorial rows.
Under the hood it stays native `<details>`/`<summary>` (or an equivalent that works JS-off and
is fully keyboard-accessible); the two-column index is the visual reinvention on top.
- **Pattern:** FAQs + **Sticky Section Tabs** (index-left / content-right).
- **Differs:** today it's a single centred accordion stack. Now it's a numbered index spread;
  on mobile it degrades to stacked ruled rows (still native details).

### 08 · Book In — Booking
Away from the left-text / right-white-panel split. The form is set **as part of the editorial
system**: full-measure ruled fields, **small-caps labels**, an "Optional" rule (kept), the
offer as an inset next to submit (kept). It **receives deep-links**: a service chosen in
*The Menu* or a barber chosen in *The Chairs* arrives pre-selected. All existing client-side
**validation and the demo-honest success message are kept exactly**.
- **Pattern:** Forms (ruled/underlined field style) + the deep-link wiring from Chairs/Menu.
- **Differs:** today it's intro-copy-left, white form-card-right. Now the form is ruled into
  the page like a booking slip in the almanac, and it's the destination of the deep-links.

### Colophon — Visit / hours / map
Not the info-left / map-right split. A **colophon-style closing page**: the address, the
opening-hours table and the map composed like a magazine's final page — a wide ruled masthead
(`Blackthorn & Co. · Heywood · OL10`), hours as a ruled ledger, the map as a bled plate with
the existing styled fallback, and the footer folding in as the imprint line.
- **Pattern:** Footers + editorial colophon layout.
- **Differs:** today it's a 50/50 info/map split. Now it's a composed final page with one
  ruled system, map bled rather than boxed beside text.

---

## 4. Scrollytelling technical approach (The Ritual)

**Layout.** Desktop (≥ ~900px): two columns. Left column is a **`position: sticky`** media
pane (`top` set so it centres in the viewport, height ~80vh) containing the four plates stacked
**absolutely** on top of each other. Right column is a tall track of four `.ritual-step`
blocks, each tall enough (min-height ~70–90vh) to occupy the viewport as you scroll.

**Active state.** One **IntersectionObserver** watches the four steps with a
`rootMargin` that defines a narrow horizontal "trigger band" across the vertical centre
(e.g. `rootMargin: "-45% 0px -45% 0px"`, `threshold: 0`). When a step enters the band it
becomes active: it gets `.is-active`, and the matching plate in the sticky pane gets
`.is-active`. The progress rail's current number updates the same way.

**Motion budget.** Plate swaps are **opacity + a small `translateY`/`scale` only** — plates are
`position:absolute; opacity:0` and the active one animates to `opacity:1`. No width/height/top
animation, no layout thrash, no scroll-position math driving styles, **no scroll hijacking**
(the page scrolls natively; the observer only toggles classes). Text steps fade/rise in with
the same reveal primitive used elsewhere.

**Reduced-motion & mobile fallback.** The **CSS default** for the section is the *stacked*
layout — no sticky, no absolute stacking: each step renders its own plate above its own text in
normal document flow, all visible. The sticky/observer behaviour is **added only when it's
safe**: JS checks `window.matchMedia('(min-width: 900px)').matches` **and**
`!window.matchMedia('(prefers-reduced-motion: reduce)').matches` before wiring the observer and
adding the `is-enhanced` class that switches on `position:sticky`. So:
- `prefers-reduced-motion: reduce` → static stacked list, every plate shown, zero JS motion.
- mobile widths → static stacked list.
- JS off entirely → static stacked list (progressive enhancement; content fully present).

No `@keyframes` autoplay, no marquee, nothing moves on its own — motion only responds to the
user's own scroll and clicks.

**Deep-links (Menu/Chairs → Booking).** Per-line Book links and each Chair carry
`data-book-service` / `data-book-barber` and point at `#booking`. A small handler pre-selects
the matching `<select>` option, then the native hash jump scrolls to the form. JS-off falls
back to a plain jump to `#booking` (no pre-fill, still works). No data in the URL query string.

---

## 5. What's kept (unchanged)

- **Palette** — cream / espresso / caramel-gold, `--sand` bands, dark espresso reviews band.
- **Type** — Fraunces (display), Hanken Grotesk (body), Caveat (handwritten, ≤2 uses).
- **All copy, pricing, durations, names, reviews text** — verbatim; no new claims.
- **Floating pill nav with the moving selector** (scroll-spy pill) — kept; labels re-mapped to
  chapters, still sorts by document order.
- **Segmented mobile Book / Call bar** (fixed) — kept.
- **Overlay mobile menu** (absolute, floats over page) — kept.
- **Form validation** (UK mobile regex, inline errors, styled state) + **demo success message**
  and the **demo/Cal.com disclaimers** — kept exactly.
- **Count-up** figures, **scroll-reveal** primitive (reused for chapter reveals), **lazy**
  images + map iframe, **structured data**, **canonical**, real social links.
- **Accessibility & performance rules** — single-page vanilla HTML/CSS/JS, no build step,
  mobile-first 375→1440, no horizontal scroll, ≥44px targets, transform/opacity-only motion,
  `prefers-reduced-motion` honoured everywhere, WCAG-AA contrast, UK English, no em dashes.

---

## 6. Build & verify plan (after approval)

1. Rebuild `index.html` + `styles.css` + `script.js` around the folio system, chapter by
   chapter, keeping the kept-list intact.
2. Verify with the Playwright + Edge harness at **375px** and **1440px** at three scroll
   positions: **cover**, **Ritual mid-scroll**, **booking**.
3. Audit against the web-interface-guidelines (focus states, target sizes, contrast, motion,
   reduced-motion, no layout shift), fix findings.
4. Bump `?v=`, commit, push, confirm live at the GitHub Pages URL.

---

**Stopping here for your approval.** Confirm (a) the concept + my folio addition, and
(b) the running order in §2 (narrative order, or protect the Menu→Work conversion adjacency).
Then I'll build.
