import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { loadForecast, saveForecast } from './forecastCache.js'

const KEY = 'weather:forecast'
const CITY = { name: 'Barcelona', latitude: 41.3874, longitude: 2.1686 }

describe('forecastCache', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('returns null when nothing is cached', () => {
    expect(loadForecast(CITY)).toBeNull()
  })

  it('round-trips a saved forecast with its timestamp', () => {
    saveForecast(CITY, { current: { temperature_2m: 21 } })

    const cached = loadForecast(CITY)
    expect(cached.data).toEqual({ current: { temperature_2m: 21 } })
    expect(cached.timestamp).toBeTypeOf('number')
    expect(Date.now() - cached.timestamp).toBeLessThan(1000)
  })

  it('ignores a forecast cached for different coordinates', () => {
    saveForecast(CITY, { current: {} })

    expect(loadForecast({ name: 'Tokyo', latitude: 35.6895, longitude: 139.6917 })).toBeNull()
  })

  it('ignores a forecast older than 6 hours', () => {
    vi.useFakeTimers()
    saveForecast(CITY, { current: {} })

    vi.setSystemTime(Date.now() + 5 * 60 * 60 * 1000)
    expect(loadForecast(CITY)).not.toBeNull()

    vi.setSystemTime(Date.now() + 2 * 60 * 60 * 1000)
    expect(loadForecast(CITY)).toBeNull()
  })

  it('returns null on corrupt JSON', () => {
    localStorage.setItem(KEY, '{not json')
    expect(loadForecast(CITY)).toBeNull()
  })

  it('returns null when the entry has no timestamp', () => {
    localStorage.setItem(KEY, JSON.stringify({
      latitude: CITY.latitude, longitude: CITY.longitude, data: {},
    }))
    expect(loadForecast(CITY)).toBeNull()
  })
})
