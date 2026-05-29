import { describeWeather } from '../lib/weatherCodes.js'

const DAY_NAMES = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

export default function DailyForecast({ daily }) {
  return (
    <div className="section">
      <h2 className="section-title">7-day forecast</h2>
      <div className="daily-list">
        {daily.time.map((t, i) => {
          const date = new Date(t)
          const isToday = i === 0
          const dayName = isToday ? 'Today' : DAY_NAMES[date.getDay()]
          const max = Math.round(daily.temperature_2m_max[i])
          const min = Math.round(daily.temperature_2m_min[i])
          const rain = daily.precipitation_probability_max[i]
          const { emoji } = describeWeather(daily.weather_code[i])

          return (
            <div className={`daily-item ${isToday ? 'today' : ''}`} key={t}>
              <span className="daily-day">{dayName}</span>
              <span className="daily-emoji">{emoji}</span>
              <span className="daily-rain">{rain > 0 ? `💧${rain}%` : ''}</span>
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
