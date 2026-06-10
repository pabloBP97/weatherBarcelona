import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

const CSP = [
  "default-src 'self'",
  "connect-src 'self' https://api.open-meteo.com https://geocoding-api.open-meteo.com",
  "img-src 'self' data:",
  "style-src 'self' 'unsafe-inline'",
  "script-src 'self'",
  "object-src 'none'",
  "base-uri 'self'",
  "frame-ancestors 'none'",
  "form-action 'self'",
].join('; ')

function cspPlugin() {
  return {
    name: 'inject-csp',
    apply: 'build',
    transformIndexHtml(html) {
      return html.replace(
        '<head>',
        `<head>\n    <meta http-equiv="Content-Security-Policy" content="${CSP}" />`,
      )
    },
  }
}

export default defineConfig({
  base: '/weatherBarcelona/',
  plugins: [react(), cspPlugin()],
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: './src/test/setup.js',
  },
})
