import { describe, it, expect } from 'vitest'
import { describeWeather } from './weatherCodes.js'

describe('describeWeather', () => {
  it('maps known WMO codes', () => {
    expect(describeWeather(0)).toEqual({ label: 'Clear sky', emoji: '☀️' })
    expect(describeWeather(95)).toEqual({ label: 'Thunderstorm', emoji: '⛈️' })
  })

  it('falls back for unknown codes', () => {
    expect(describeWeather(42)).toEqual({ label: 'Unknown', emoji: '🌡️' })
    expect(describeWeather(undefined)).toEqual({ label: 'Unknown', emoji: '🌡️' })
  })
})
