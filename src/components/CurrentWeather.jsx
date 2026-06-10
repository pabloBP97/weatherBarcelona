import { describeWeather } from '../lib/weatherCodes.js'
import { degreesToCompass } from '../lib/format.js'
import { formatHour } from '../lib/time.js'

export default function CurrentWeather({ current, today, lastUpdated, timezone }) {
  const {
    temperature_2m, apparent_temperature, relative_humidity_2m,
    wind_speed_10m, wind_direction_10m, uv_index, weather_code, is_day,
  } = current
  const { label, emoji } = describeWeather(weather_code)

  const updatedStr = lastUpdated
    ? lastUpdated.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit', timeZone: timezone })
    : null

  return (
    <div className={`current-card ${is_day ? 'day' : 'night'}`}>
      <div className="current-main">
        <span className="current-emoji" aria-hidden="true">{emoji}</span>
        <span className="current-temp">{Math.round(temperature_2m)}°</span>
      </div>
      <p className="current-label">{label}</p>
      <div className="current-meta">
        <span>Feels like {Math.round(apparent_temperature)}°</span>
        <span><span aria-label="Humidity">💧</span> {relative_humidity_2m}%</span>
        <span>
          <span aria-label="Wind">💨</span> {Math.round(wind_speed_10m)} km/h {degreesToCompass(wind_direction_10m)}
        </span>
        <span><span aria-label="UV index">☀️</span> UV {Math.round(uv_index)}</span>
      </div>
      {today && (
        <div className="current-meta current-sun">
          <span><span aria-label="Sunrise">🌅</span> {formatHour(today.sunrise)}</span>
          <span><span aria-label="Sunset">🌇</span> {formatHour(today.sunset)}</span>
        </div>
      )}
      {updatedStr && (
        <p className="current-updated" aria-live="polite">Updated {updatedStr}</p>
      )}
    </div>
  )
}
