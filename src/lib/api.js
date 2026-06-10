export const DEFAULT_CITY = {
  name: 'Barcelona',
  country: 'Spain',
  latitude: 41.3874,
  longitude: 2.1686,
  timezone: 'Europe/Madrid',
}

const BASE = 'https://api.open-meteo.com/v1/forecast'

export class WeatherError extends Error {
  constructor(message, kind) {
    super(message)
    this.name = 'WeatherError'
    this.kind = kind // 'network' | 'api'
  }
}

export async function fetchWeather({ latitude, longitude, timezone } = DEFAULT_CITY) {
  const params = new URLSearchParams({
    latitude,
    longitude,
    current: 'temperature_2m,relative_humidity_2m,apparent_temperature,is_day,precipitation,weather_code,wind_speed_10m,wind_direction_10m,uv_index',
    hourly: 'temperature_2m,precipitation_probability,precipitation,weather_code',
    daily: 'weather_code,temperature_2m_max,temperature_2m_min,precipitation_probability_max,precipitation_sum,sunrise,sunset,uv_index_max',
    timezone: timezone ?? 'auto',
    forecast_days: 7,
  })

  let res
  try {
    res = await fetch(`${BASE}?${params}`)
  } catch {
    throw new WeatherError('Could not reach the weather service', 'network')
  }
  if (!res.ok) throw new WeatherError(`Weather API error: ${res.status}`, 'api')
  return res.json()
}
