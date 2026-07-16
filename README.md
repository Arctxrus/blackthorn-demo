# Blackthorn & Co. — Demo Barbershop Website

A single-page marketing website for **Blackthorn & Co.**, a barber-led salon in Heywood, Greater Manchester. Built as a portfolio piece to show a modern, fast, fully responsive small-business site.

> ⚠️ **This is a fictional business.** The name, staff, reviews, address, phone number and email address are all made up and do not represent any real company. Photographs are Unsplash placeholders. Nothing here should be treated as a genuine business listing.

## About

- **Stack:** plain HTML, CSS and JavaScript — no frameworks, no build step.
- **Single page:** [`index.html`](index.html) + [`styles.css`](styles.css) + [`script.js`](script.js).
- **Mobile-first & responsive:** designed 375 → 768 → 1024 → 1440 px, no horizontal scroll at any width, touch targets ≥ 44 px.
- **Accessible:** semantic HTML, visible focus states, respects `prefers-reduced-motion`, WCAG-AA colour contrast.
- **Features:** sticky navigation with an always-visible booking CTA (plus a sticky Book/Call bar on mobile), a services grid with per-service booking, a Google-style reviews section, team, gallery, an FAQ accordion, a booking form with client-side validation (structured to swap for a Cal.com embed), opening hours and a location map.

## Run locally

No build step. Open `index.html` directly, or serve the folder:

```bash
python -m http.server 8000
# then visit http://localhost:8000
```

## Design system

See [`DESIGN.md`](DESIGN.md) for the colour palette, typography, spacing scale and component rules.

## Usage

A demo / portfolio piece. All business details are fictional and the imagery is placeholder — replace the copy, photography and contact details before any real-world use.
