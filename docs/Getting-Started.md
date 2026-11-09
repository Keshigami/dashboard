# Getting started

## What you need
- [uv](https://docs.astral.sh/uv/) and [just](https://github.com/casey/just). On a Mac: `brew install uv just`.
- Python 3.11 is installed by uv.
- No API key is needed anywhere in this project.

## Three commands
```bash
git clone https://github.com/Keshigami/dashboard.git && cd dashboard
just setup
just up           # http://127.0.0.1:5173/  (just down to stop)
```
Everything the app needs is in the repo (synthetic sample data where a dataset is used).

## Commands
```
just setup      # npm install
just run        # vite dev server, foreground, strict port 5173
just up         # background, pid in .dashboard.pid, waits until / answers
just down
just test       # npm run build + vitest: src/services.js PORT_MAP must equal the PLAN.md table
just demo       # up, curl /, print title, down
```

## What you see
- Run: `just setup && just up`, open `http://localhost:5173/`.
- Two-minute walkthrough: watch the "services up" count fill in; click Open on a green card; click Brief on any card; stop one service and watch its dot turn red within ten seconds.
- Video clip: `demo/clips/dashboard.webm` (recorded by `just demo-video`).
- Sample inputs: none needed; the page polls on load.

## Try this

