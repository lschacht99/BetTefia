# Beth Tephilah Synagogue website

A self-contained static website for Beth Tephilah Synagogue in Troy, NY.

## Link to view

- Open locally: [`index.html`](index.html)
- Interactive 360° source tour: https://synagogues-360.anumuseum.org.il/gallery/beth-tephilah/
- Facebook page for live updates: https://www.facebook.com/bethtephilah.synagogue/
- From the repo root: [`../index.html`](../index.html) redirects here.
- GitHub Pages path after Pages is enabled: `https://<your-github-user>.github.io/HamsaNomads/bet-tefila-troy/`

## Pages

- `index.html` — Home / history / visitor overview
- `events.html` — Event overview and upcoming program cards
- `event-registration.html` — One shared event RSVP form for all events
- `contact.html` — Contact and visitor logistics form
- `donate.html` — Donation page and dedication form

## Shared assets

- `shared/content.js` — shared synagogue name, address, navigation, history facts, and event data
- `assets/css/styles.css` — shared liquid-glass historic visual system
- `assets/js/site.js` — shared header, footer, mobile nav, form helpers, animations, scroll progress, and event hydration
- `assets/img/` — inline SVG brand marks and decorative assets

## Design direction

The site borrows from modern museum and heritage-site web patterns: large editorial typography, cinematic hero sections, glass panels, clear calls to action, subtle scroll animation, and simple navigation. It stays serious and respectful while still feeling alive for students, travelers, families, and young adults.

## Static form behavior

Forms validate in-browser and generate a `mailto:` draft. Replace `office@bethtephilahtroy.org` in `shared/content.js` with the preferred receiving address when available.
