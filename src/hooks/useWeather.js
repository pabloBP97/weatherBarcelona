import { useState, useEffect, useCallback, useRef } from 'react'
import { fetchWeather } from '../lib/api.js'

const POLL_INTERVAL_MS = 10 * 60 * 1000 // 10 minutes

export function useWeather(city) {
  const [data, setData] = useState(null)
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(true)
  const [lastUpdated, setLastUpdated] = useState(null)
  const requestId = useRef(0)

  const load = useCallback(async () => {
    const id = ++requestId.current
    try {
      const json = await fetchWeather(city)
      if (id !== requestId.current) return // a newer request superseded this one
      setData(json)
      setLastUpdated(new Date())
      setError(null)
    } catch (err) {
      if (id !== requestId.current) return
      setError({ kind: err.kind ?? 'unknown', message: err.message })
    } finally {
      if (id === requestId.current) setLoading(false)
    }
  }, [city])

  useEffect(() => {
    // City changed (or first mount): don't show the previous city's data
    setData(null)
    setError(null)
    setLoading(true)
    setLastUpdated(null)
    load()
    const interval = setInterval(load, POLL_INTERVAL_MS)

    const onVisibilityChange = () => {
      if (document.visibilityState === 'visible') load()
    }
    document.addEventListener('visibilitychange', onVisibilityChange)
    window.addEventListener('focus', load)

    return () => {
      clearInterval(interval)
      document.removeEventListener('visibilitychange', onVisibilityChange)
      window.removeEventListener('focus', load)
    }
  }, [load])

  return { data, error, loading, lastUpdated }
}
