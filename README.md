<!-- public-top -->
# Dashboard

One page that lists every capstone and portfolio service with a live status dot, the stack, an Open link and its brief. Portfolio, front door.

**Watch it first:** the captioned walkthrough [demo/demo.mp4](demo/demo.mp4).

## Try it in three commands

```bash
git clone https://github.com/Keshigami/dashboard.git && cd dashboard
just setup        # creates the venv with uv (Python 3.11)
just up           # http://127.0.0.1:5173/  (just down to stop)
```

You need [uv](https://docs.astral.sh/uv/) and [just](https://github.com/casey/just) (`brew install uv just` on a Mac). Everything the app needs is in the repo (synthetic sample data where a dataset is used). No API key is needed anywhere in this project. `just test` runs the lint and the offline tests.

Step by step: [docs/Getting-Started.md](docs/Getting-Started.md), then [how it was built](docs/How-It-Was-Built.md), [results](docs/Results.md), [limits](docs/Limits-and-Next-Steps.md). The same pages are on the [wiki](https://github.com/Keshigami/dashboard/wiki).
<!-- /public-top -->
## Demo walkthrough
<!-- demo:auto -->
![demo](demo/demo.gif)

Full walkthrough with captions: [demo/demo.mp4](demo/demo.mp4) (57 s, 1280x800, animated intro and end card). Run it yourself: `just setup && just up`, then open http://localhost:5173/.

Two-minute walkthrough:
1. The front door: every capstone and portfolio service on one page
2. The header counts the services up; each dot polls /health every ten seconds
3. Capstones: three Caltech capstones as five services, each with a port and an Open link
4. Portfolio: eight apps grouped by target role
5. Computer vision: the Headstorm blueprint and menu pipelines
6. Every card has a Brief: the problem, the build, the numbers and the limits
7. Close it; the page keeps polling
8. The hint box: just up, just check, just down from the repository root
9. Back to the top: everything green means every service answered
<!-- /demo:auto -->

The front door: one React 18 + Vite page that lists every service in `../PLAN.md` (five capstone
services, eight portfolio apps), grouped as Capstones and Portfolio by target role. Each card has the
one-liner, the stack, the port, an Open link and a live status dot that probes `/health` then `/`
every ten seconds (CORS fetch first, `no-cors` opaque fallback, so any answering port counts as up;
a 5xx shows amber). The header counts how many are up. A hint box shows `just up` / `just check` /
`just down`; the page cannot run them.

Look and tokens come from `../common/ui.css` (imported directly, not copied) with Space Grotesk,
IBM Plex Sans and IBM Plex Mono from Google Fonts; without network the system fallbacks load.

## Run
```
just setup      # npm install
just run        # vite dev server, foreground, strict port 5173
just up         # background, pid in .dashboard.pid, waits until / answers
just down
just test       # npm run build + vitest: src/services.js PORT_MAP must equal the PLAN.md table
just demo       # up, curl /, print title, down
```

## How it was built
`src/services.js` is the only data file: `PORT_MAP` mirrors the PLAN.md table verbatim and
`SERVICES` holds the thirteen cards (text written from each project's README and the capstone problem
statements). `tests/portmap.test.js` parses PLAN.md and fails the build if names, ports or order
drift. `src/App.jsx` has the probe (`probe(port)`) and the polling hook; `src/index.css` only adds
layout on top of the shared tokens.

## What an interviewer can try in two minutes
Open http://localhost:5173/, watch the count in the top right fill in, click Open on any green
card. Stop one service with its `just down` and watch the dot go red within ten seconds.

## Standalone repo

Exported from Max's `caltech-capstone` workspace. `common/` is vendored (LLM door, UI tokens). Run: `just setup && just test && just up`.
LLM-backed features read `ANTHROPIC_API_KEY` (or `LLM_PROVIDER` + `OPENAI_API_KEY` / `GOOGLE_API_KEY`); with no key they run in a deterministic offline mode.
