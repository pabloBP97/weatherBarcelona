# Security Policy

## Overview

This is a purely client-side static web application. It has no backend, no database, no user authentication, and collects no personal data.

- **Weather data** comes from the public [Open-Meteo API](https://open-meteo.com) over HTTPS; city search uses the Open-Meteo geocoding API. No API key is used or stored.
- **No secrets or credentials** exist anywhere in this codebase.
- A **Content-Security-Policy** is injected at build time, restricting network requests to `api.open-meteo.com` and `geocoding-api.open-meteo.com` only.
- The selected city is saved in the browser's `localStorage` so it survives reloads. It never leaves the device except as coordinates in the weather request itself.

## Supported Versions

Only the latest version on the `main` branch is maintained.

## Reporting a Vulnerability

If you find a security issue, please open a [GitHub Issue](../../issues) with the label `security`. For sensitive findings you'd prefer to disclose privately, use GitHub's [private vulnerability reporting](../../security/advisories/new) feature.
