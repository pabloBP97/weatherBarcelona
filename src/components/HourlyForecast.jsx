import { describeWeather } from '../lib/weatherCodes.js'

export default function HourlyForecast({ hourly }) {
  const now = new Date()
  const currentHour = now.getHours()

  // Find the index matching current hour in the hourly time array
  const startIdx = hourly.time.findIndex(t => {
    const d = new Date(t)
    return d.getFullYear() === now.getFullYear() &&
      d.getMonth() === now.getMonth() &&
      d.getDate() === now.getDate() &&
      d.getHours() === currentHour
  })

  const idx = startIdx === -1 ? 0 : startIdx
  const slice = hourly.time.slice(idx, idx + 12)

  return (
    <div className="section">
      <h2 className="section-title">Next 12 hours</h2>
      <div className="hourly-row">
        {slice.map((t, i) => {
          const absIdx = idx + i
          const hour = new Date(t).getHours()
          const temp = Math.round(hourly.temperature_2m[absIdx])
          const rain = hourly.precipitation_probability[absIdx]
          const { emoji } = describeWeather(hourly.weather_code[absIdx])

          return (
            <div className="hourly-item" key={t}>
              <span className="hourly-hour">{hour === currentHour && i === 0 ? 'Now' : `${hour}:00`}</span>
              <span className="hourly-emoji">{emoji}</span>
              <span className="hourly-temp">{temp}°</span>
              {rain > 0 && <span className="hourly-rain">💧{rain}%</span>}
            </div>
          )
        })}
      </div>
    </div>
  )
}
