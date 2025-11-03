# SuperSneaks

A modular, scalable HTML/CSS/JS starter.

## Structure
- `index.html`: main entry
- `src/assets/`: images, fonts, icons
- `src/components/`: self-contained UI modules (each with its own HTML/CSS/JS)
- `src/css/`: global styles (`base/`, `layout/`, `main.css`)
- `src/js/`: global and utility JS (`utils/`, `App.js`, `vendor.js`)
- `src/pages/`: full-page views
- `dist/`: distribution build output

## Development
Use any static file server (e.g., VS Code Live Server) and open `index.html`.

## Conventions
- Keep component styles/scripts colocated within each component folder.
- Keep global resets/structure within `src/css`.
- Avoid global side effects in component scripts.
