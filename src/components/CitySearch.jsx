import { useState, useEffect } from 'react'
import { searchCities } from '../lib/geocoding.js'

const DEBOUNCE_MS = 300

export default function CitySearch({ onSelect }) {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState([])
  const [searchError, setSearchError] = useState(false)

  useEffect(() => {
    const q = query.trim()
    if (q.length < 2) {
      setResults([])
      setSearchError(false)
      return
    }

    let cancelled = false
    const timer = setTimeout(async () => {
      try {
        const cities = await searchCities(q)
        if (!cancelled) {
          setResults(cities)
          setSearchError(false)
        }
      } catch {
        if (!cancelled) {
          setResults([])
          setSearchError(true)
        }
      }
    }, DEBOUNCE_MS)

    return () => {
      cancelled = true
      clearTimeout(timer)
    }
  }, [query])

  const close = () => {
    setQuery('')
    setResults([])
    setSearchError(false)
  }

  return (
    <div className="city-search">
      <input
        type="search"
        className="city-search-input"
        placeholder="Search city…"
        aria-label="Search city"
        value={query}
        onChange={e => setQuery(e.target.value)}
        onKeyDown={e => { if (e.key === 'Escape') close() }}
      />
      {searchError && <p className="city-search-error" role="alert">Search failed</p>}
      {results.length > 0 && (
        <ul className="city-search-results" role="listbox" aria-label="City matches">
          {results.map(city => (
            <li key={city.id} role="option" aria-selected="false">
              <button type="button" onClick={() => { onSelect(city); close() }}>
                {[city.name, city.admin1, city.country].filter(Boolean).join(', ')}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
