import { useEffect, useMemo, useRef, useState } from 'react'
import { GROUPS, OWNER, PORT_MAP, SELF_PORT, SERVICES, portOf } from './services.js'

const POLL_MS = 10_000
const TIMEOUT_MS = 4_000

// Probe one port. CORS first (real status if the service sends CORS headers), then
// no-cors on /health, then no-cors on /. An opaque response means the port answered.
async function probe(port) {
  const base = `http://localhost:${port}`
  const t0 = performance.now()
  const ms = () => Math.round(performance.now() - t0)
  for (const path of ['/health', '/']) {
    const ctl = new AbortController()
    const timer = setTimeout(() => ctl.abort(), TIMEOUT_MS)
    try {
      const r = await fetch(base + path, { cache: 'no-store', signal: ctl.signal })
      clearTimeout(timer)
      if (r.ok) return { state: 'up', ms: ms(), via: path, code: r.status }
      if (r.status >= 500) return { state: 'error', ms: ms(), via: path, code: r.status }
      continue // 404 on /health: try /
    } catch {
      clearTimeout(timer)
    }
    const ctl2 = new AbortController()
    const timer2 = setTimeout(() => ctl2.abort(), TIMEOUT_MS)
    try {
      const r = await fetch(base + path, { mode: 'no-cors', cache: 'no-store', signal: ctl2.signal })
      clearTimeout(timer2)
      if (r.type === 'opaque' || r.ok) return { state: 'up', ms: ms(), via: path, code: null }
    } catch {
      clearTimeout(timer2)
    }
  }
  return { state: 'down', ms: null, via: null, code: null }
}

function useStatuses(ports) {
  const [statuses, setStatuses] = useState({})
  const [checkedAt, setCheckedAt] = useState(null)
  const alive = useRef(true)
  useEffect(() => {
    alive.current = true
    const run = async () => {
      const entries = await Promise.all(ports.map(async (p) => [p, await probe(p)]))
      if (!alive.current) return
      setStatuses(Object.fromEntries(entries))
      setCheckedAt(new Date())
    }
    run()
    const id = setInterval(run, POLL_MS)
    return () => {
      alive.current = false
      clearInterval(id)
    }
  }, [ports])
  return { statuses, checkedAt }
}

// /briefs.json is written by `just briefs` (tools/collect_briefs.py) into public/. Optional:
// when it is missing or empty every Brief button stays hidden and the cards work as before.
function useBriefs() {
  const [briefs, setBriefs] = useState({})
  useEffect(() => {
    let on = true
    fetch('/briefs.json', { cache: 'no-store' })
      .then((r) => (r.ok ? r.json() : []))
      .then((items) => {
        if (!on || !Array.isArray(items)) return
        setBriefs(Object.fromEntries(items.filter((b) => b && b.folder).map((b) => [b.folder, b])))
      })
      .catch(() => {})
    return () => {
      on = false
    }
  }, [])
  return briefs
}

function BriefPanel({ brief, onClose }) {
  const ref = useRef(null)
  useEffect(() => {
    const d = ref.current
    if (!d) return
    if (brief && !d.open) d.showModal()
    if (!brief && d.open) d.close()
  }, [brief])
  return (
    <dialog ref={ref} className="brief" onClose={onClose} aria-label={brief ? `${brief.title} brief` : 'brief'}>
      {brief && (
        <div className="brief-inner">
          <div className="brief-head">
            <div>
              <p className="eyebrow">{brief.group} · {brief.role} · port {brief.port} · {brief.status}</p>
              <h2>{brief.title}</h2>
              <p className="muted">{brief.one_liner}</p>
            </div>
            <div className="brief-links">
              <a className="btn" href={`http://localhost:${brief.port}/`} target="_blank" rel="noreferrer">Open :{brief.port} ↗</a>
              <a className="btn ghost" href={`/${brief.brief_html}`} target="_blank" rel="noreferrer">Static page</a>
              <button className="ghost" type="button" onClick={onClose}>Close</button>
            </div>
          </div>
          <div className="brief-body" dangerouslySetInnerHTML={{ __html: brief.body_html || '' }} />
        </div>
      )}
    </dialog>
  )
}

function Dot({ status }) {
  const state = status?.state ?? 'checking'
  const label = { up: 'up', down: 'down', error: '5xx', checking: 'checking' }[state]
  return (
    <span className={`status status-${state}`} title={status?.via ? `answered on ${status.via}` : ''}>
      <i aria-hidden="true" />
      <span className="status-label">{label}</span>
      {status?.ms != null && <span className="status-ms">{status.ms} ms</span>}
    </span>
  )
}

function Card({ s, status, index, brief, onBrief }) {
  const port = portOf(s.id)
  const href = `http://localhost:${port}/`
  return (
    <article className={`svc svc-${status?.state ?? 'checking'}`} id={`svc-${port}`}>
      <div className="svc-top">
        <span className="svc-index">{String(index).padStart(2, '0')}</span>
        <span className="svc-tag">{s.tag}</span>
        <Dot status={status} />
      </div>
      <h3 className="svc-title">{s.title}</h3>
      <p className="svc-what">{s.what}</p>
      <ul className="chips" aria-label="stack">
        {s.stack.map((t) => (
          <li key={t}>{t}</li>
        ))}
      </ul>
      <div className="svc-foot">
        <span className="svc-port">
          <span className="meta">{s.ui}</span>
          <code>:{port}</code>
        </span>
        <span className="svc-actions">
          {brief && (
            <button type="button" className="ghost brief-btn" onClick={() => onBrief(brief)}>
              Brief
            </button>
          )}
          <a className="open" href={href} target="_blank" rel="noreferrer">
            Open <span aria-hidden="true">↗</span>
          </a>
        </span>
      </div>
      <p className="svc-try">{s.tryIt}</p>
    </article>
  )
}

export default function App() {
  const ports = useMemo(() => SERVICES.map((s) => portOf(s.id)), [])
  const { statuses, checkedAt } = useStatuses(ports)
  const briefs = useBriefs()
  const [openBrief, setOpenBrief] = useState(null)
  const up = ports.filter((p) => statuses[p]?.state === 'up').length
  const checked = Object.keys(statuses).length > 0
  const capstones = SERVICES.filter((s) => s.group === 'Capstones')
  const portfolio = GROUPS.filter((g) => g.key !== 'Capstones')
  let n = 0

  return (
    <div className="wrap">
      <header className="top hero">
        <div className="hero-left">
          <p className="eyebrow">{OWNER.programme}</p>
          <h1 className="hero-name">{OWNER.name}</h1>
          <p className="hero-headline">{OWNER.headline}</p>
          <p className="hero-roles" aria-label="target roles">
            {OWNER.roles.map((r, i) => (
              <span key={r}>
                {i > 0 && <span className="sep" aria-hidden="true"> · </span>}
                {r}
              </span>
            ))}
          </p>
        </div>
        <div className="hero-right">
          <div className="stat" id="result" aria-live="polite">
            <b>{checked ? `${up} / ${ports.length}` : '— / 13'}</b>
            <span>services up{checkedAt ? ` · checked ${checkedAt.toLocaleTimeString()}` : ' · checking'}</span>
          </div>
          <span className="badge">dashboard :{SELF_PORT}</span>
        </div>
      </header>

      <section className="group" aria-labelledby="g-capstones">
        <div className="group-head">
          <h2 id="g-capstones">Capstones</h2>
          <span className="group-sub">Caltech CTME PGC AIML · three capstones, five services</span>
        </div>
        <div className="svc-grid">
          {capstones.map((s) => (
            <Card key={s.id} s={s} status={statuses[portOf(s.id)]} index={++n} brief={briefs[s.id]} onBrief={setOpenBrief} />
          ))}
        </div>
      </section>

      <section className="group" aria-labelledby="g-portfolio">
        <div className="group-head">
          <h2 id="g-portfolio">Portfolio</h2>
          <span className="group-sub">eight applications across the three target roles</span>
        </div>
        {portfolio.map((g) => (
          <div className="role" key={g.key}>
            <div className="role-head">
              <h3>{g.label}</h3>
              <span className="group-sub">{g.sub}</span>
            </div>
            <div className="svc-grid">
              {SERVICES.filter((s) => s.group === g.key).map((s) => (
                <Card key={s.id} s={s} status={statuses[portOf(s.id)]} index={++n} brief={briefs[s.id]} onBrief={setOpenBrief} />
              ))}
            </div>
          </div>
        ))}
      </section>

      <section className="hint card flat" aria-labelledby="hint-h">
        <div className="hint-text">
          <h2 id="hint-h">Start all / stop all</h2>
          <p className="muted">
            This page only polls <code>/health</code> and <code>/</code> every ten seconds; it cannot start anything.
            Run these from the repository root.
          </p>
        </div>
        <pre>
{`just up      # start all ${PORT_MAP.length} services, then check every port
just check   # one line per port: ok / 5xx / DOWN, ms
just down    # stop them all`}
        </pre>
      </section>

      <BriefPanel brief={openBrief} onClose={() => setOpenBrief(null)} />

      <footer className="foot meta">
        Port map is PLAN.md; <code>just test</code> here fails if this page and the plan disagree.
      </footer>
    </div>
  )
}
