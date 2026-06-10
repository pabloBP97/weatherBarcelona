import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useWeather } from './useWeather.js'
import { fetchWeather } from '../lib/api.js'

vi.mock('../lib/api.js', () => ({ fetchWeather: vi.fn() }))

const CITY_A = { name: 'Barcelona', latitude: 41.3874, longitude: 2.1686, timezone: 'Europe/Madrid' }
const CITY_B = { name: 'Tokyo', latitude: 35.6895, longitude: 139.6917, timezone: 'Asia/Tokyo' }

async function flush() {
  await act(async () => { await Promise.resolve() })
}

describe('useWeather', () => {
  beforeEach(() => {
    vi.useFakeTimers()
    fetchWeather.mockReset()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('loads data on mount', async () => {
    fetchWeather.mockResolvedValue({ timezone: 'Europe/Madrid' })
    const { result } = renderHook(() => useWeather(CITY_A))

    expect(result.current.loading).toBe(true)
    await flush()

    expect(result.current.data).toEqual({ timezone: 'Europe/Madrid' })
    expect(result.current.loading).toBe(false)
    expect(result.current.error).toBeNull()
    expect(result.current.lastUpdated).toBeInstanceOf(Date)
    expect(fetchWeather).toHaveBeenCalledWith(CITY_A)
  })

  it('refetches on the 10-minute interval', async () => {
    fetchWeather.mockResolvedValue({})
    renderHook(() => useWeather(CITY_A))
    await flush()
    expect(fetchWeather).toHaveBeenCalledTimes(1)

    await act(async () => { vi.advanceTimersByTime(10 * 60 * 1000) })
    expect(fetchWeather).toHaveBeenCalledTimes(2)
  })

  it('refetches on window focus and on tab becoming visible', async () => {
    fetchWeather.mockResolvedValue({})
    renderHook(() => useWeather(CITY_A))
    await flush()

    await act(async () => { window.dispatchEvent(new Event('focus')) })
    expect(fetchWeather).toHaveBeenCalledTimes(2)

    // jsdom's visibilityState is 'visible' by default
    await act(async () => { document.dispatchEvent(new Event('visibilitychange')) })
    expect(fetchWeather).toHaveBeenCalledTimes(3)
  })

  it('keeps previous data when a refresh fails', async () => {
    fetchWeather.mockResolvedValueOnce({ ok: 1 })
    const { result } = renderHook(() => useWeather(CITY_A))
    await flush()

    fetchWeather.mockRejectedValueOnce(Object.assign(new Error('boom'), { kind: 'network' }))
    await act(async () => { window.dispatchEvent(new Event('focus')) })

    expect(result.current.data).toEqual({ ok: 1 })
    expect(result.current.error).toEqual({ kind: 'network', message: 'boom' })
  })

  it('clears data and refetches when the city changes', async () => {
    fetchWeather.mockResolvedValue({ city: 'A' })
    const { result, rerender } = renderHook(({ city }) => useWeather(city), {
      initialProps: { city: CITY_A },
    })
    await flush()
    expect(result.current.data).toEqual({ city: 'A' })

    fetchWeather.mockResolvedValue({ city: 'B' })
    rerender({ city: CITY_B })
    expect(result.current.data).toBeNull()
    expect(result.current.loading).toBe(true)

    await flush()
    expect(result.current.data).toEqual({ city: 'B' })
    expect(fetchWeather).toHaveBeenLastCalledWith(CITY_B)
  })

  it('ignores a stale response from a previous city', async () => {
    let resolveA
    fetchWeather.mockImplementationOnce(() => new Promise(r => { resolveA = r }))
    const { result, rerender } = renderHook(({ city }) => useWeather(city), {
      initialProps: { city: CITY_A },
    })

    fetchWeather.mockResolvedValueOnce({ city: 'B' })
    rerender({ city: CITY_B })
    await flush()
    expect(result.current.data).toEqual({ city: 'B' })

    await act(async () => { resolveA({ city: 'A' }) })
    expect(result.current.data).toEqual({ city: 'B' })
  })

  it('stops polling and listening after unmount', async () => {
    fetchWeather.mockResolvedValue({})
    const { unmount } = renderHook(() => useWeather(CITY_A))
    await flush()
    unmount()

    window.dispatchEvent(new Event('focus'))
    document.dispatchEvent(new Event('visibilitychange'))
    vi.advanceTimersByTime(10 * 60 * 1000)
    expect(fetchWeather).toHaveBeenCalledTimes(1)
  })
})
