import { describe, it, expect, vi, beforeEach } from 'vitest'
import { searchCities } from './geocoding.js'

describe('searchCities', () => {
  beforeEach(() => {
    vi.unstubAllGlobals()
  })

  it('URL-encodes the query', async () => {
    const mock = vi.fn().mockResolvedValue({ ok: true, json: () => Promise.resolve({}) })
    vi.stubGlobal('fetch', mock)

    await searchCities('san sebastián')

    const url = new URL(mock.mock.calls[0][0])
    expect(url.origin).toBe('https://geocoding-api.open-meteo.com')
    expect(url.searchParams.get('name')).toBe('san sebastián')
    expect(url.searchParams.get('count')).toBe('5')
  })

  it('returns [] when the response has no results field', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ generationtime_ms: 0.5 }),
    }))

    expect(await searchCities('xyzzy')).toEqual([])
  })

  it('maps result fields', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({
        results: [{
          id: 3128760, name: 'Barcelona', country: 'Spain', admin1: 'Catalonia',
          latitude: 41.38879, longitude: 2.15899, timezone: 'Europe/Madrid',
          population: 1620343, extra_field: 'dropped',
        }],
      }),
    }))

    const cities = await searchCities('barcelona')
    expect(cities).toEqual([{
      id: 3128760, name: 'Barcelona', country: 'Spain', admin1: 'Catalonia',
      latitude: 41.38879, longitude: 2.15899, timezone: 'Europe/Madrid',
    }])
  })

  it("defaults missing timezone to 'auto' (country-level results)", async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({
        results: [{
          id: 3469034, name: 'Brazil', country: 'Brazil',
          latitude: -10, longitude: -55,
        }],
      }),
    }))

    const [brazil] = await searchCities('brazil')
    expect(brazil.timezone).toBe('auto')
  })

  it('throws WeatherError kinds on failure', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok: false, status: 429 }))
    await expect(searchCities('a b')).rejects.toMatchObject({ kind: 'api' })

    vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new TypeError('offline')))
    await expect(searchCities('a b')).rejects.toMatchObject({ kind: 'network' })
  })
})
