import { describeWeather } from '../lib/weatherCodes.js'

export default function CurrentWeather({ current, lastUpdated }) {
  const { temperature_2m, apparent_temperature, relative_humidity_2m, wind_speed_10m, weather_code, is_day } = current
  const { label, emoji } = describeWeather(weather_code)

  const updatedStr = lastUpdated
    ? lastUpdated.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })
    : null

  return (
    <div className={`current-card ${is_day ? 'day' : 'night'}`}>
      <div className="current-main">
        <span className="current-emoji">{emoji}</span>
        <span className="current-temp">{Math.round(temperature_2m)}°</span>
      </div>
      <p className="current-label">{label}</p>
      <div className="current-meta">
        <span>Feels like {Math.round(apparent_temperature)}°</span>
        <span>💧 {relative_humidity_2m}%</span>
        <span>💨 {Math.round(wind_speed_10m)} km/h</span>
      </div>
      {updatedStr && (
        <p className="current-updated">Updated {updatedStr}</p>
      )}
    </div>
  )
}
