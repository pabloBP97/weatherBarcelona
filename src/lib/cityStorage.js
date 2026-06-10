import { DEFAULT_CITY } from './api.js'

const KEY = 'weather:city'

export function loadCity() {
  try {
    const city = JSON.parse(localStorage.getItem(KEY))
    if (
      city &&
      typeof city.name === 'string' &&
      Number.isFinite(city.latitude) &&
      Number.isFinite(city.longitude) &&
      typeof city.timezone === 'string'
    ) {
      return city
    }
  } catch {
    // corrupt JSON or storage unavailable
  }
  return DEFAULT_CITY
}

export function saveCity(city) {
  try {
    localStorage.setItem(KEY, JSON.stringify(city))
  } catch {
    // quota exceeded or storage unavailable — city just won't persist
  }
}
