# Barcelona Weather Dashboard

Live weather dashboard for Barcelona, built with Vite + React. Pulls data from [Open-Meteo](https://open-meteo.com) — no API key, no backend, no signup required.

## Features

- **Current conditions** — temperature, feels-like, humidity, wind speed, weather description
- **12-hour hourly forecast** — temp + rain probability per hour, horizontally scrollable
- **7-day daily forecast** — high/low temps, weather emoji, max rain probability
- **Auto-refresh** — polls every 10 minutes; also refreshes immediately when you switch back to the tab or refocus the window
- **Last-updated timestamp** — always visible so you know how fresh the data is
- **Light/dark theme** — follows system `prefers-color-scheme`
- **Responsive** — works on mobile and desktop

## Data source

[Open-Meteo](https://open-meteo.com) — free, open-source weather API backed by national meteorological services (including AEMET for Spain). No registration or API key needed.

Barcelona coordinates used: `41.3874°N, 2.1686°E`, timezone `Europe/Madrid`.

## Requirements

- **Node 22 LTS** (or ≥ 20.19). An `.nvmrc` is included: `nvm use` will select the right version automatically.

## Getting started

```bash
nvm use       # switch to Node 22 (if using nvm)
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173).

## Available scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Start dev server with hot reload |
| `npm run build` | Build optimised production bundle to `dist/` |
| `npm run preview` | Preview the production build locally |

## Deploy to GitHub Pages

The repo includes a GitHub Actions workflow ([.github/workflows/deploy.yml](.github/workflows/deploy.yml)) that builds and publishes to Pages automatically on every push to `main`.

**First-time setup:**
1. Go to **Settings → Pages** in your GitHub repo.
2. Under *Source*, select **GitHub Actions**.
3. Push to `main` — the workflow will build and deploy.

> **Custom domain or root site?** If hosting at `https://username.github.io/` (not a project subpath), change `base: '/weatherBarcelona/'` in [vite.config.js](vite.config.js) to `base: '/'`.

## Security

- No secrets or API keys anywhere in the code.
- A strict **Content-Security-Policy** is injected at build time, restricting all network requests to `api.open-meteo.com` only.
- `npm audit` reports 0 vulnerabilities.
- See [SECURITY.md](SECURITY.md) for the full policy and vulnerability reporting process.

## Project structure

```
weatherBarcelona/
├── .github/workflows/deploy.yml   # GitHub Pages CI/CD
├── .gitignore
├── .nvmrc                         # Node 22
├── index.html
├── vite.config.js                 # CSP injected at build, base path
├── package.json
├── LICENSE
├── SECURITY.md
└── src/
    ├── main.jsx
    ├── App.jsx
    ├── index.css
    ├── lib/
    │   ├── api.js            # Open-Meteo fetch + URL construction
    │   └── weatherCodes.js   # WMO weather code → label + emoji
    ├── hooks/
    │   └── useWeather.js     # Polling logic, tab-focus refresh, error state
    └── components/
        ├── CurrentWeather.jsx
        ├── HourlyForecast.jsx
        └── DailyForecast.jsx
```

## Tech stack

- [Vite 8](https://vitejs.dev) — build tool and dev server
- [React 19](https://react.dev) — UI
- [Open-Meteo API](https://open-meteo.com/en/docs) — weather data

## License

[MIT](LICENSE)
