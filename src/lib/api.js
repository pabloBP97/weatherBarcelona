const LAT = 41.3874
const LON = 2.1686

const BASE = 'https://api.open-meteo.com/v1/forecast'
const PARAMS = [
  `latitude=${LAT}`,
  `longitude=${LON}`,
  'current=temperature_2m,relative_humidity_2m,apparent_temperature,is_day,precipitation,weather_code,wind_speed_10m',
  'hourly=temperature_2m,precipitation_probability,weather_code',
  'daily=weather_code,temperature_2m_max,temperature_2m_min,precipitation_probability_max',
  'timezone=Europe/Madrid',
  'forecast_days=7',
].join('&')

export async function fetchWeather() {
  const res = await fetch(`${BASE}?${PARAMS}`)
  if (!res.ok) throw new Error(`Weather API error: ${res.status}`)
  return res.json()
}
