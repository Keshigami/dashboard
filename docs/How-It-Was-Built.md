# How it was built

1. Read the PLAN.md port table and wrote `PORT_MAP` verbatim; wrote the test first so drift fails the build.
2. Wrote the thirteen one-liners from each project's original README and the three capstone problem statements.
3. Built the probe: CORS fetch of `/health` then `/`, falling back to `mode: 'no-cors'` so an opaque answer counts as up, a 5xx shows amber, a refused connection shows red; polled every ten seconds with a four-second timeout.
4. Styled on `common/ui.css` (imported directly, not copied) with Space Grotesk, IBM Plex Sans and IBM Plex Mono.
5. Added the Brief panel: `/briefs.json` is optional; when present each card gets a Brief button that opens a dialog with that project's body and an Open link.
6. Added `justfile` recipes and the root integration: `tests/check_ports.py` (status, response time, DOWN vs 5xx), `tests/test_integration.py` (`INTEGRATION=1`), `tests/record_demo.py` and `tools/stitch.sh` for the walkthrough video.

## Tech stack
| Layer | Choice | Why |
|---|---|---|
| Language and runtime | Node 24, React 18, Vite 5 | same shape as the original portfolio dashboard, builds in seconds |
| Model or core logic | none; `src/services.js` is the port map and card text | one data file, tested against PLAN.md |
| Interface | React single page on `common/ui.css` tokens | same instrument panel as every other service |
| Data | `PLAN.md` port table, `public/briefs.json` from `just briefs` | no duplicated facts |
| Tests | vitest (`tests/portmap.test.js`) plus `npm run build` | fails when the page and the plan disagree |

## Libraries
`react` and `react-dom` (the page), `vite` (dev server and build, pinned to 5173 with strictPort), `vitest` (the port-map test), `@vitejs/plugin-react` (JSX).
