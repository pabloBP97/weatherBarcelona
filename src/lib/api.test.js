import { describe, it, expect, vi, beforeEach } from 'vitest'
import { fetchWeather, WeatherError, DEFAULT_CITY } from './api.js'

describe('fetchWeather', () => {
  beforeEach(() => {
    vi.unstubAllGlobals()
  })

  it('requests the expected URL parameters', async () => {
    const mock = vi.fn().mockResolvedValue({ ok: true, json: () => Promise.resolve({}) })
    vi.stubGlobal('fetch', mock)

    await fetchWeather(DEFAULT_CITY)

    const url = new URL(mock.mock.calls[0][0])
    expect(url.origin).toBe('https://api.open-meteo.com')
    expect(url.pathname).toBe('/v1/forecast')
    expect(url.searchParams.get('latitude')).toBe('41.3874')
    expect(url.searchParams.get('longitude')).toBe('2.1686')
    expect(url.searchParams.get('timezone')).toBe('Europe/Madrid')
    expect(url.searchParams.get('forecast_days')).toBe('7')
    expect(url.searchParams.get('current')).toContain('uv_index')
    expect(url.searchParams.get('current')).toContain('wind_direction_10m')
    expect(url.searchParams.get('daily')).toContain('sunrise')
    expect(url.searchParams.get('daily')).toContain('precipitation_sum')
    expect(url.searchParams.get('hourly')).toContain('precipitation_probability')
  })

  it('uses the given city coordinates', async () => {
    const mock = vi.fn().mockResolvedValue({ ok: true, json: () => Promise.resolve({}) })
    vi.stubGlobal('fetch', mock)

    await fetchWeather({ latitude: 35.6895, longitude: 139.6917, timezone: 'Asia/Tokyo' })

    const url = new URL(mock.mock.calls[0][0])
    expect(url.searchParams.get('latitude')).toBe('35.6895')
    expect(url.searchParams.get('timezone')).toBe('Asia/Tokyo')
  })

  it("falls back to timezone=auto when the city has none", async () => {
    const mock = vi.fn().mockResolvedValue({ ok: true, json: () => Promise.resolve({}) })
    vi.stubGlobal('fetch', mock)

    await fetchWeather({ latitude: -10, longitude: -55, timezone: undefined })

    const url = new URL(mock.mock.calls[0][0])
    expect(url.searchParams.get('timezone')).toBe('auto')
  })

  it('throws WeatherError kind=api on non-ok response', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok: false, status: 500 }))

    await expect(fetchWeather(DEFAULT_CITY, { retryDelayMs: 0 })).rejects.toMatchObject({
      name: 'WeatherError',
      kind: 'api',
      message: 'Weather API error: 500',
      status: 500,
    })
  })

  it('throws WeatherError kind=network when fetch rejects', async () => {
    vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new TypeError('Failed to fetch')))

    await expect(fetchWeather(DEFAULT_CITY, { retryDelayMs: 0 })).rejects.toMatchObject({
      name: 'WeatherError',
      kind: 'network',
    })
  })

  it('retries after a transient network failure and succeeds', async () => {
    const mock = vi.fn()
      .mockRejectedValueOnce(new TypeError('connection reset'))
      .mockResolvedValueOnce({ ok: true, json: () => Promise.resolve({ t: 1 }) })
    vi.stubGlobal('fetch', mock)

    await expect(fetchWeather(DEFAULT_CITY, { retryDelayMs: 0 })).resolves.toEqual({ t: 1 })
    expect(mock).toHaveBeenCalledTimes(2)
  })

  it('retries 5xx responses', async () => {
    const mock = vi.fn()
      .mockResolvedValueOnce({ ok: false, status: 503 })
      .mockResolvedValueOnce({ ok: true, json: () => Promise.resolve({ t: 2 }) })
    vi.stubGlobal('fetch', mock)

    await expect(fetchWeather(DEFAULT_CITY, { retryDelayMs: 0 })).resolves.toEqual({ t: 2 })
    expect(mock).toHaveBeenCalledTimes(2)
  })

  it('does not retry 4xx responses', async () => {
    const mock = vi.fn().mockResolvedValue({ ok: false, status: 404 })
    vi.stubGlobal('fetch', mock)

    await expect(fetchWeather(DEFAULT_CITY, { retryDelayMs: 0 })).rejects.toMatchObject({
      kind: 'api',
      status: 404,
    })
    expect(mock).toHaveBeenCalledTimes(1)
  })

  it('gives up after exhausting retries', async () => {
    const mock = vi.fn().mockRejectedValue(new TypeError('connection reset'))
    vi.stubGlobal('fetch', mock)

    await expect(fetchWeather(DEFAULT_CITY, { retryDelayMs: 0 })).rejects.toMatchObject({
      kind: 'network',
    })
    expect(mock).toHaveBeenCalledTimes(3) // initial attempt + 2 retries
  })

  it('exports WeatherError carrying its kind', () => {
    const err = new WeatherError('boom', 'api')
    expect(err).toBeInstanceOf(Error)
    expect(err.kind).toBe('api')
  })
})
