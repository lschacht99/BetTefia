# Beth Tephila Synagogue website

A self-contained static website for Beth Tephila Synagogue in Troy, NY.

## Link to view

- Open locally: [`index.html`](index.html)
- Interactive 360° source tour: https://synagogues-360.anumuseum.org.il/gallery/beth-tephilah/
- Facebook page for live updates: https://www.facebook.com/bethtephilah.synagogue/
- From the repo root: [`../index.html`](../index.html) redirects here.
- GitHub Pages path after Pages is enabled: `https://<your-github-user>.github.io/<repo-name>/bet-tefila-troy/`

## Pages

- `index.html` — Home with the Synagogues360 tour as the immersive hero background
- `events.html` — “We welcome your event” page for engagements, Bar/Bat Mitzvah, Brit Milah, Upsherin/Chalakah first haircut, Shabbat meals, and small simchos
- `event-registration.html` — One shared event RSVP form for all events
- `contact.html` — Contact and visitor logistics form
- `donate.html` — Donation page and dedication form

## Shared assets

- `shared/content.js` — shared synagogue name, address, navigation, history facts, and event data
- `assets/css/styles.css` — shared warm oak/parchment/copper historic visual system
- `assets/js/site.js` — shared header, footer, mobile nav, form helpers, animations, scroll progress, and event hydration
- `assets/img/` — inline SVG brand marks and decorative assets

## Design direction

The site borrows from modern museum and heritage-site web patterns: a cinematic 360° hero background, large editorial typography, glass panels, clear calls to action, subtle scroll animation, and simple navigation. The main color is the blue-gray sanctuary wall tone from the reference image. It stays serious and respectful while still feeling alive for students, travelers, families, and young adults.

## Static form behavior

Forms validate in-browser and generate a `mailto:` draft. Replace `office@bethtephilahtroy.org` in `shared/content.js` with the preferred receiving address when available.
