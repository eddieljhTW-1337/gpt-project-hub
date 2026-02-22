# GPT Project Hub

A minimal web app to organize and quickly open your ChatGPT projects using PARA + tags.

## How to run

1. Start a local server from the repo root:

```bash
python3 -m http.server 8000
```

2. Open the app in Safari:

```
http://localhost:8000/public/
```

3. Add it to your iPhone Home Screen if desired (Share → Add to Home Screen).

## GitHub Pages

This repo is ready for GitHub Pages using the `/docs` folder. In GitHub:

1. Settings → Pages
2. Source: `Deploy from a branch`
3. Branch: `main` / Folder: `/docs`

After saving, the site will be available at your GitHub Pages URL.

## Architecture

- `src/domain`: core data structure and validation
- `src/usecases`: application flow (add/update/delete/filter/sort)
- `src/adapters`: localStorage repository + DOM rendering
- `src/frameworks`: event wiring and runtime setup
- `src/main.js`: composition root
- `public/`: UI shell and styles
