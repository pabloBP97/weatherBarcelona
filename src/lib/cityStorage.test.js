import { describe, it, expect, beforeEach } from 'vitest'
import { loadCity, saveCity } from './cityStorage.js'
import { DEFAULT_CITY } from './api.js'

const KEY = 'weather:city'

describe('cityStorage', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('returns DEFAULT_CITY when nothing is stored', () => {
    expect(loadCity()).toEqual(DEFAULT_CITY)
  })

  it('round-trips a saved city', () => {
    const tokyo = {
      name: 'Tokyo', country: 'Japan',
      latitude: 35.6895, longitude: 139.6917, timezone: 'Asia/Tokyo',
    }
    saveCity(tokyo)
    expect(loadCity()).toEqual(tokyo)
  })

  it('falls back on corrupt JSON', () => {
    localStorage.setItem(KEY, '{not json')
    expect(loadCity()).toEqual(DEFAULT_CITY)
  })

  it('falls back when required fields are missing', () => {
    localStorage.setItem(KEY, JSON.stringify({ name: 'Nowhere' }))
    expect(loadCity()).toEqual(DEFAULT_CITY)

    localStorage.setItem(KEY, JSON.stringify({ name: 'X', latitude: 1, longitude: 2 }))
    expect(loadCity()).toEqual(DEFAULT_CITY)
  })
})
