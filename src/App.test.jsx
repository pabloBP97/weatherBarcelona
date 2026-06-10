import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, act } from '@testing-library/react'
import App from './App.jsx'
import { fetchWeather } from './lib/api.js'

vi.mock('./lib/api.js', async (importOriginal) => {
  const actual = await importOriginal()
  return { ...actual, fetchWeather: vi.fn() }
})

const PAYLOAD = {
  timezone: 'America/Cuiaba',
  current: {
    temperature_2m: 25, apparent_temperature: 26, relative_humidity_2m: 50,
    wind_speed_10m: 10, wind_direction_10m: 90, uv_index: 5,
    weather_code: 0, is_day: 1,
  },
  hourly: {
    time: ['2026-06-10T15:00'], temperature_2m: [25],
    precipitation_probability: [0], precipitation: [0], weather_code: [0],
  },
  daily: {
    time: ['2026-06-10'], temperature_2m_max: [30], temperature_2m_min: [20],
    precipitation_probability_max: [0], precipitation_sum: [0], weather_code: [0],
    sunrise: ['2026-06-10T06:00'], sunset: ['2026-06-10T18:00'], uv_index_max: [7],
  },
}

describe('App with a stored city whose timezone is auto', () => {
  beforeEach(() => {
    fetchWeather.mockReset()
    localStorage.setItem('weather:city', JSON.stringify({
      name: 'Brazil', country: 'Brazil',
      latitude: -10, longitude: -55, timezone: 'auto',
    }))
  })

  it('renders the loading state without crashing on Intl', () => {
    fetchWeather.mockReturnValue(new Promise(() => {})) // stays pending
    render(<App />)
    expect(screen.getByText('Loading weather…')).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Brazil' })).toBeInTheDocument()
  })

  it('renders the dashboard once data resolves', async () => {
    fetchWeather.mockResolvedValue(PAYLOAD)
    render(<App />)
    await act(async () => { await Promise.resolve() })

    expect(screen.getByText('Next 12 hours')).toBeInTheDocument()
    expect(screen.getByText('7-day forecast')).toBeInTheDocument()
    expect(screen.getByText(/Updated/)).toBeInTheDocument()
  })
})
