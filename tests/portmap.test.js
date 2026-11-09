// The dashboard's PORT_MAP must equal the table in ../PLAN.md, name for name, port for port, in order.
import { readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import path from 'node:path'
import { describe, it, expect } from 'vitest'
import { PORT_MAP, SERVICES, SELF_PORT, GROUPS, portOf } from '../src/services.js'

const here = path.dirname(fileURLToPath(import.meta.url))
const plan = readFileSync(path.resolve(here, '../../PLAN.md'), 'utf8')

function parsePlan(text) {
  const rows = []
  for (const line of text.split('\n')) {
    const m = line.match(/^\|\s*([^|]+?)\s*\|\s*(\d{4})\s*\|/)
    if (m) rows.push({ name: m[1], port: Number(m[2]) })
  }
  return rows
}

describe('port map', () => {
  const planRows = parsePlan(plan)
  it('PLAN.md has a port table', () => {
    expect(planRows.length).toBeGreaterThanOrEqual(14)
  })
  it('matches PLAN.md exactly (names, ports, order)', () => {
    expect(PORT_MAP).toEqual(planRows)
  })
  it('has unique ports', () => {
    expect(new Set(PORT_MAP.map((r) => r.port)).size).toBe(PORT_MAP.length)
  })
  it('dashboard is 5173', () => {
    expect(PORT_MAP[0].port).toBe(SELF_PORT)
    expect(PORT_MAP[0].name.startsWith('dashboard')).toBe(true)
  })
})

describe('cards', () => {
  it('cover every non-dashboard row once', () => {
    const ids = SERVICES.map((s) => s.id).sort()
    const expected = PORT_MAP.filter((r) => r.port !== SELF_PORT).map((r) => r.name).sort()
    expect(ids).toEqual(expected)
    expect(SERVICES.length).toBe(13)
  })
  it('each card has content and a known group', () => {
    const keys = new Set(GROUPS.map((g) => g.key))
    for (const s of SERVICES) {
      expect(s.title.length).toBeGreaterThan(2)
      expect(s.what.length).toBeGreaterThan(20)
      expect(s.stack.length).toBeGreaterThan(0)
      expect(keys.has(s.group)).toBe(true)
      expect(portOf(s.id)).toBeGreaterThan(8100)
    }
  })
})
