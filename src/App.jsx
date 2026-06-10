import { useState, useEffect } from 'react'
import { useWeather } from './hooks/useWeather.js'
import { loadCity, saveCity } from './lib/cityStorage.js'
import CurrentWeather from './components/CurrentWeather.jsx'
import HourlyForecast from './components/HourlyForecast.jsx'
import DailyForecast from './components/DailyForecast.jsx'
import CitySearch from './components/CitySearch.jsx'

const ERROR_MESSAGES = {
  network: "Can't reach the weather service. Check your connection.",
  api: 'The weather service returned an error. Try again later.',
  unknown: 'Something went wrong loading the weather.',
}

export default function App() {
  const [city, setCity] = useState(loadCity)
  const { data, error, loading, lastUpdated } = useWeather(city)

  useEffect(() => {
    document.title = `${city.name} Weather`
  }, [city.name])

  const handleSelectCity = (next) => {
    setCity(next)
    saveCity(next)
  }

  const timezone = data?.timezone ?? city.timezone
  const updatedStr = lastUpdated
    ? lastUpdated.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit', timeZone: timezone })
    : null

  return (
    <div className="app">
      <header className="app-header">
        <div className="app-title">
          <h1>{city.name}</h1>
          <span className="app-subtitle">Weather Dashboard</span>
        </div>
        <CitySearch onSelect={handleSelectCity} />
      </header>

      <main className="app-main">
        {loading && !data && (
          <div className="state-center">
            <span className="spinner">⟳</span>
            <p>Loading weather…</p>
          </div>
        )}

        {error && !data && !loading && (
          <div className="state-center error" role="alert">
            <p>⚠️ {ERROR_MESSAGES[error.kind] ?? ERROR_MESSAGES.unknown}</p>
            <p className="error-hint">Try refreshing the page.</p>
          </div>
        )}

        {error && data && (
          <div className="stale-banner" role="status">
            Couldn't refresh — showing data from {updatedStr}
          </div>
        )}

        {data && data.current && data.hourly?.time && data.daily?.time && (
          <>
            <CurrentWeather
              current={data.current}
              today={{ sunrise: data.daily.sunrise[0], sunset: data.daily.sunset[0] }}
              lastUpdated={lastUpdated}
              timezone={timezone}
            />
            <HourlyForecast hourly={data.hourly} timezone={timezone} />
            <DailyForecast daily={data.daily} timezone={timezone} />
          </>
        )}
      </main>
    </div>
  )
}
