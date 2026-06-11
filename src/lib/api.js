export const DEFAULT_CITY = {
  name: 'Barcelona',
  country: 'Spain',
  latitude: 41.3874,
  longitude: 2.1686,
  timezone: 'Europe/Madrid',
}

const BASE = 'https://api.open-meteo.com/v1/forecast'

const MAX_RETRIES = 2
const RETRY_BASE_DELAY_MS = 500

export class WeatherError extends Error {
  constructor(message, kind, status) {
    super(message)
    this.name = 'WeatherError'
    this.kind = kind // 'network' | 'api'
    this.status = status // HTTP status for kind 'api', undefined otherwise
  }
}

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms))

async function fetchJson(url) {
  let res
  try {
    res = await fetch(url)
  } catch {
    throw new WeatherError('Could not reach the weather service', 'network')
  }
  if (!res.ok) throw new WeatherError(`Weather API error: ${res.status}`, 'api', res.status)
  return res.json()
}

export async function fetchWeather(
  { latitude, longitude, timezone } = DEFAULT_CITY,
  { retries = MAX_RETRIES, retryDelayMs = RETRY_BASE_DELAY_MS } = {},
) {
  const params = new URLSearchParams({
    latitude,
    longitude,
    current: 'temperature_2m,relative_humidity_2m,apparent_temperature,is_day,precipitation,weather_code,wind_speed_10m,wind_direction_10m,uv_index',
    hourly: 'temperature_2m,precipitation_probability,precipitation,weather_code',
    daily: 'weather_code,temperature_2m_max,temperature_2m_min,precipitation_probability_max,precipitation_sum,sunrise,sunset,uv_index_max',
    timezone: timezone ?? 'auto',
    forecast_days: 7,
  })

  for (let attempt = 0; ; attempt++) {
    try {
      return await fetchJson(`${BASE}?${params}`)
    } catch (err) {
      // Connection drops and 5xx are often transient; 4xx won't change on retry
      const retryable = err.kind === 'network' || err.status >= 500
      if (!retryable || attempt >= retries) throw err
      await sleep(retryDelayMs * 2 ** attempt)
    }
  }
}
