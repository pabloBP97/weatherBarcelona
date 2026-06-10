import { describeWeather } from '../lib/weatherCodes.js'
import { dayLabel } from '../lib/time.js'

export default function DailyForecast({ daily, timezone }) {
  return (
    <div className="section">
      <h2 className="section-title">7-day forecast</h2>
      <div className="daily-list">
        {daily.time.map((t, i) => {
          const dayName = dayLabel(t, timezone)
          const isToday = dayName === 'Today'
          const max = Math.round(daily.temperature_2m_max[i])
          const min = Math.round(daily.temperature_2m_min[i])
          const rain = daily.precipitation_probability_max[i]
          const mm = daily.precipitation_sum[i]
          const { label, emoji } = describeWeather(daily.weather_code[i])

          return (
            <div className={`daily-item ${isToday ? 'today' : ''}`} key={t}>
              <span className="daily-day">{dayName}</span>
              <span className="daily-emoji" role="img" aria-label={label}>{emoji}</span>
              <span className="daily-rain">
                {rain > 0 && <span aria-label={`${rain}% chance of rain`}>💧{rain}%</span>}
                {mm >= 0.1 && <span className="daily-mm"> {mm.toFixed(1)} mm</span>}
              </span>
              <span className="daily-range">
                <span className="daily-max">{max}°</span>
                <span className="daily-min">{min}°</span>
              </span>
            </div>
          )
        })}
      </div>
    </div>
  )
}
