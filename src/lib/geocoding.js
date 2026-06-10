import { WeatherError } from './api.js'

const BASE = 'https://geocoding-api.open-meteo.com/v1/search'

/** Returns up to 5 matches: { id, name, country, admin1, latitude, longitude, timezone }. */
export async function searchCities(name) {
  const params = new URLSearchParams({ name, count: 5, language: 'en', format: 'json' })

  let res
  try {
    res = await fetch(`${BASE}?${params}`)
  } catch {
    throw new WeatherError('Could not reach the city search service', 'network')
  }
  if (!res.ok) throw new WeatherError(`Geocoding API error: ${res.status}`, 'api')

  const json = await res.json()
  // The API omits `results` entirely when there is no match. Country-level
  // entries (feature_code PCL*, e.g. searching "Brazil") point at the
  // country's centroid and carry no timezone — meaningless as a weather
  // location, so they are dropped
  return (json.results ?? [])
    .filter(r => r.timezone && !r.feature_code?.startsWith('PCL'))
    .map(({ id, name, country, admin1, latitude, longitude, timezone }) =>
      ({ id, name, country, admin1, latitude, longitude, timezone }))
}
