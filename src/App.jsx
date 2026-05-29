import { useWeather } from './hooks/useWeather.js'
import CurrentWeather from './components/CurrentWeather.jsx'
import HourlyForecast from './components/HourlyForecast.jsx'
import DailyForecast from './components/DailyForecast.jsx'

export default function App() {
  const { data, error, loading, lastUpdated } = useWeather()

  return (
    <div className="app">
      <header className="app-header">
        <h1>Barcelona</h1>
        <span className="app-subtitle">Weather Dashboard</span>
      </header>

      <main className="app-main">
        {loading && (
          <div className="state-center">
            <span className="spinner">⟳</span>
            <p>Loading weather…</p>
          </div>
        )}

        {error && !loading && (
          <div className="state-center error">
            <p>⚠️ {error}</p>
            <p className="error-hint">Check your connection and try refreshing.</p>
          </div>
        )}

        {data && !loading && data.current && data.hourly?.time && data.daily?.time && (
          <>
            <CurrentWeather current={data.current} lastUpdated={lastUpdated} />
            <HourlyForecast hourly={data.hourly} />
            <DailyForecast daily={data.daily} />
          </>
        )}
      </main>
    </div>
  )
}
