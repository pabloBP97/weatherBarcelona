const KEY = 'weather:forecast'

// A forecast this old is more misleading than helpful — don't show it
const MAX_AGE_MS = 6 * 60 * 60 * 1000 // 6 hours

/**
 * Last successfully fetched forecast for this city, or null if none,
 * stale, or stored for different coordinates.
 * Returns { data, timestamp } with timestamp in epoch ms.
 */
export function loadForecast(city) {
  try {
    const entry = JSON.parse(localStorage.getItem(KEY))
    if (
      entry &&
      entry.latitude === city.latitude &&
      entry.longitude === city.longitude &&
      Number.isFinite(entry.timestamp) &&
      Date.now() - entry.timestamp <= MAX_AGE_MS &&
      entry.data
    ) {
      return { data: entry.data, timestamp: entry.timestamp }
    }
  } catch {
    // corrupt JSON or storage unavailable
  }
  return null
}

export function saveForecast(city, data) {
  try {
    localStorage.setItem(KEY, JSON.stringify({
      latitude: city.latitude,
      longitude: city.longitude,
      timestamp: Date.now(),
      data,
    }))
  } catch {
    // quota exceeded or storage unavailable — forecast just won't persist
  }
}
