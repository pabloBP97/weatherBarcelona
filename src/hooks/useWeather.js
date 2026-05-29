import { useState, useEffect, useCallback } from 'react'
import { fetchWeather } from '../lib/api.js'

const POLL_INTERVAL_MS = 10 * 60 * 1000 // 10 minutes

export function useWeather() {
  const [data, setData] = useState(null)
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(true)
  const [lastUpdated, setLastUpdated] = useState(null)

  const load = useCallback(async () => {
    try {
      const json = await fetchWeather()
      setData(json)
      setLastUpdated(new Date())
      setError(null)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
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
