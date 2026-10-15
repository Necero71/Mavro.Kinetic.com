# Mavro Kinetic

Portfolio and enquiry site for Mavro Kinetic (web design, branding and small web apps, Cape Town).
Plain HTML, CSS and JavaScript. No build step, no framework.

Live: https://necero71.github.io/Mavro.Kinetic.com/

## Structure

```
index.html            page
assets/css/style.css  styles (brand palette lives in :root)
assets/js/main.js     menu, start-lights intro, project brief builder
assets/img/           favicon, share image, portfolio screenshots
```

## Turn on the Send buttons

The brief form works out of the box (copy to clipboard). To show "Send on WhatsApp" and
"Send by email" buttons, fill in the contact settings at the top of `assets/js/main.js`:

```js
var CONTACT = { whatsapp: '27XXXXXXXXX', email: 'you@example.com' };
```

WhatsApp is the international number, digits only (no + or spaces).

## Deploy

GitHub Pages lets browsers cache CSS and JS for ~10 minutes. The page links them as
`style.css?v=...` and `main.js?v=...`. **Change that `v` value in `index.html` whenever you edit
the CSS or JS**, so visitors never get new HTML with old styling.


GitHub Pages, branch `main`, root folder. Repo Settings > Pages > Deploy from a branch.

## Run locally

```bash
python3 -m http.server 8000
```
