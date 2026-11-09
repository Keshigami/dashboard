import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { existsSync, readFileSync } from 'node:fs'
import path from 'node:path'

// Serve ../briefs/<folder>.html (written by `just briefs`) at /briefs/... in dev and preview.
function serveBriefs() {
  const dir = path.resolve(__dirname, '../briefs')
  const handler = (req, res, next) => {
    if (!req.url.startsWith('/briefs/')) return next()
    const file = path.join(dir, path.basename(req.url.split('?')[0]))
    if (!existsSync(file)) return next()
    res.setHeader('Content-Type', file.endsWith('.css') ? 'text/css' : 'text/html; charset=utf-8')
    res.end(readFileSync(file))
  }
  return {
    name: 'serve-briefs',
    configureServer(server) { server.middlewares.use(handler) },
    configurePreviewServer(server) { server.middlewares.use(handler) },
  }
}

// Dev server pinned to 5173 (PLAN.md port map); strictPort so a clash fails loudly.
// fs.allow '..' lets src import ../../common/ui.css, the one shared token sheet.
export default defineConfig({
  plugins: [react(), serveBriefs()],
  server: { port: 5173, strictPort: true, host: '127.0.0.1', fs: { allow: ['..'] } },
  preview: { port: 5173, strictPort: true, host: '127.0.0.1' },
  test: { environment: 'node', include: ['tests/**/*.test.js'] },
})
