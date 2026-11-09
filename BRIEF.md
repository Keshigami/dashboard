---
title: Dashboard
group: portfolio
role: front door
port: 5173
status: working
one_liner: One page that lists every capstone and portfolio service with a live status dot, the stack, an Open link and its brief.
---
# Dashboard

## Demo
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

## Brief
Fourteen services on fourteen ports are hard to show in an interview. The dashboard is the one address to open: it groups the five capstone services and the eight portfolio apps by target role, shows which are up right now, and opens each one or its brief in a click. "Solved" is an interviewer finding a working demo within ten seconds of opening http://localhost:5173/.

## Tech stack
| Layer | Choice | Why |
|---|---|---|
| Language and runtime | Node 24, React 18, Vite 5 | same shape as the original portfolio dashboard, builds in seconds |
| Model or core logic | none; `src/services.js` is the port map and card text | one data file, tested against PLAN.md |
| Interface | React single page on `common/ui.css` tokens | same instrument panel as every other service |
| Data | `PLAN.md` port table, `public/briefs.json` from `just briefs` | no duplicated facts |
| Tests | vitest (`tests/portmap.test.js`) plus `npm run build` | fails when the page and the plan disagree |

## Libraries used
`react` and `react-dom` (the page), `vite` (dev server and build, pinned to 5173 with strictPort), `vitest` (the port-map test), `@vitejs/plugin-react` (JSX).

## How it was built
1. Read the PLAN.md port table and wrote `PORT_MAP` verbatim; wrote the test first so drift fails the build.
2. Wrote the thirteen one-liners from each project's original README and the three capstone problem statements.
3. Built the probe: CORS fetch of `/health` then `/`, falling back to `mode: 'no-cors'` so an opaque answer counts as up, a 5xx shows amber, a refused connection shows red; polled every ten seconds with a four-second timeout.
4. Styled on `common/ui.css` (imported directly, not copied) with Space Grotesk, IBM Plex Sans and IBM Plex Mono.
5. Added the Brief panel: `/briefs.json` is optional; when present each card gets a Brief button that opens a dialog with that project's body and an Open link.
6. Added `justfile` recipes and the root integration: `tests/check_ports.py` (status, response time, DOWN vs 5xx), `tests/test_integration.py` (`INTEGRATION=1`), `tests/record_demo.py` and `tools/stitch.sh` for the walkthrough video.

## Results
| Check | Result |
|---|---|
| `npm run build` | passes |
| `vitest` port map vs PLAN.md | 6 tests pass |
| `curl localhost:5173/` | 200 |

The numbers that matter are on the other cards; this page has none of its own.

## Demo details
- Run: `just setup && just up`, open `http://localhost:5173/`.
- Two-minute walkthrough: watch the "services up" count fill in; click Open on a green card; click Brief on any card; stop one service and watch its dot turn red within ten seconds.
- Video clip: `demo/clips/dashboard.webm` (recorded by `just demo-video`).
- Sample inputs: none needed; the page polls on load.

## Limits and next steps
- The page cannot start or stop services; the hint box shows the `just` commands instead.
- Status is reachability, not correctness: a port that answers anything counts as up.
- Briefs render the collector's HTML; without `just briefs` the buttons are hidden.
- A production version would serve the built `dist/` behind the same reverse proxy as the services and drop the per-port links.
