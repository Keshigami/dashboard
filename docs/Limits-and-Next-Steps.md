# Limits and next steps

- The page cannot start or stop services; the hint box shows the `just` commands instead.
- Status is reachability, not correctness: a port that answers anything counts as up.
- Briefs render the collector's HTML; without `just briefs` the buttons are hidden.
- A production version would serve the built `dist/` behind the same reverse proxy as the services and drop the per-port links.
