import { describeWeather } from '../lib/weatherCodes.js'
import { findCurrentHourIndex, formatHour } from '../lib/time.js'

export default function HourlyForecast({ hourly, timezone }) {
  const startIdx = findCurrentHourIndex(hourly.time, timezone)
  const idx = Math.max(0, startIdx)
  const slice = hourly.time.slice(idx, idx + 12)

  return (
    <div className="section">
      <h2 className="section-title">Next 12 hours</h2>
      <div className="hourly-row">
        {slice.map((t, i) => {
          const absIdx = idx + i
          const temp = Math.round(hourly.temperature_2m[absIdx])
          const rain = hourly.precipitation_probability[absIdx]
          const { label, emoji } = describeWeather(hourly.weather_code[absIdx])

          return (
            <div className="hourly-item" key={t}>
              <span className="hourly-hour">{i === 0 && startIdx !== -1 ? 'Now' : formatHour(t)}</span>
              <span className="hourly-emoji" role="img" aria-label={label}>{emoji}</span>
              <span className="hourly-temp">{temp}°</span>
              {rain > 0 && (
                <span className="hourly-rain" aria-label={`${rain}% chance of rain`}>💧{rain}%</span>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
