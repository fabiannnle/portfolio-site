# Fabian Ghani Affandi, portfolio

This is an editorial portfolio built around a photo editor's contact sheet. Your real projects appear as film frames that develop in WebGL. You can look at them through a loupe, open each one as an enlargement, and switch the page between a light table and a darkroom.

## Run it

```bash
npm install
npm run dev
```

`npm run build` writes the site to `dist/`. Netlify reads `netlify.toml`, which runs the build and publishes `dist/`. The contact form still goes through Netlify Forms.

## How it's put together

- `index.html` holds all the content: the frames, the project spreads, the practice section and the contact form.
- `src/styles/main.css` contains the design tokens (light table and darkroom), the layout and the fallbacks.
- `src/js/gl/` has the Three.js stage and shaders. They handle the develop effect, the loupe, the image dissolves and the test strip.
- `src/js/*.js` holds the behaviour: `hero` (opening sequence), `sheet` (pinned contact sheet), `spreads` (reveals, parallax, the Focus Timer sequence), `viewer` (frame enlargements, arrow keys, typed frame numbers, `#frame-N` links), `cursor` (loupe), `theme`, `scroll` (Lenis) and `form`.
- `public/images/work/` stores screenshots of your projects, in two sizes: `-sm` for the frames and `-lg` for the enlargements.

## Adding a project

1. Screenshot it and export `name-sm.webp` (about 1000px wide) and `name-lg.webp` (up to 2400px wide) into `public/images/work/`.
2. Add a `.strip` in the contact sheet with one `.frame` button per screenshot. Number the frames in order and set `data-lg`, `data-caption` and `data-project`.
3. Add the project's title and anchor to `PROJECTS` in `src/js/viewer.js`.
4. Optionally, add an enlargement spread for it, modelled on the GreenLeaf one.

Visitors who turn off motion get a still, fully readable page. Without WebGL, the ordinary images show instead of the canvas. You can test that fallback with `?nogl`.
