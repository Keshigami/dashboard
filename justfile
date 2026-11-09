# Dashboard (React 18 + Vite) on port 5173. Front door for every service in ../PLAN.md.
set shell := ["bash", "-cu"]
port := "5173"
pidfile := ".dashboard.pid"
logfile := ".dashboard.log"

setup:
    npm install --no-audit --no-fund

# Foreground dev server
run:
    npm run dev -- --port {{port}} --strictPort

# Background dev server with pid file; waits until / answers
up:
    #!/usr/bin/env bash
    set -eu
    cd "{{justfile_directory()}}"
    just down >/dev/null 2>&1 || true
    nohup ./node_modules/.bin/vite --port {{port}} --strictPort --host 127.0.0.1 > {{logfile}} 2>&1 &
    echo $! > {{pidfile}}
    for i in $(seq 1 40); do curl -sf -o /dev/null http://127.0.0.1:{{port}}/ && break; sleep 0.5; done
    if curl -sf -o /dev/null http://127.0.0.1:{{port}}/; then echo "dashboard up on http://localhost:{{port}}/ (pid $(cat {{pidfile}}))"; else echo "dashboard failed to start, see {{logfile}}"; exit 1; fi

down:
    if [ -f {{pidfile}} ]; then kill "$(cat {{pidfile}})" 2>/dev/null || true; rm -f {{pidfile}}; fi
    lsof -ti tcp:{{port}} -sTCP:LISTEN 2>/dev/null | xargs -r kill 2>/dev/null || true
    echo "dashboard down"

# Production build + the PLAN.md port-map test
test:
    npm run build
    npx vitest run

# Scripted end-to-end: start, fetch the page, report, stop
demo:
    just up
    curl -s -o /dev/null -w "GET / -> %{http_code} in %{time_total}s\n" http://127.0.0.1:{{port}}/
    curl -s http://127.0.0.1:{{port}}/ | grep -o '<title>[^<]*</title>'
    just down
