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

## Architecture

- `src/domain`: core data structure and validation
- `src/usecases`: application flow (add/update/delete/filter/sort)
- `src/adapters`: localStorage repository + DOM rendering
- `src/frameworks`: event wiring and runtime setup
- `src/main.js`: composition root
- `public/`: UI shell and styles
