import { describe, it, expect } from 'vitest'
import { wallClockHour, findCurrentHourIndex, formatHour, dayLabel } from './time.js'

describe('wallClockHour', () => {
  // 2026-06-10T22:30Z — Madrid is UTC+2 (DST), so next day there
  const summerNight = new Date('2026-06-10T22:30:00Z')

  it('rolls over to the next day in Europe/Madrid during DST', () => {
    expect(wallClockHour('Europe/Madrid', summerNight)).toBe('2026-06-11T00')
  })

  it('stays on the same day in America/New_York', () => {
    expect(wallClockHour('America/New_York', summerNight)).toBe('2026-06-10T18')
  })

  it('matches UTC exactly', () => {
    expect(wallClockHour('UTC', summerNight)).toBe('2026-06-10T22')
  })

  it('formats midnight as 00, not 24', () => {
    const utcMidnight = new Date('2026-06-10T00:15:00Z')
    expect(wallClockHour('UTC', utcMidnight)).toBe('2026-06-10T00')
  })

  it('uses standard time offset in winter', () => {
    const winter = new Date('2026-01-15T23:30:00Z') // Madrid UTC+1
    expect(wallClockHour('Europe/Madrid', winter)).toBe('2026-01-16T00')
  })
})

describe('findCurrentHourIndex', () => {
  const times = ['2026-06-10T22:00', '2026-06-10T23:00', '2026-06-11T00:00', '2026-06-11T01:00']
  const now = new Date('2026-06-10T22:30:00Z') // Madrid: 2026-06-11T00:30

  it('finds the slot matching now in the given timezone', () => {
    expect(findCurrentHourIndex(times, 'Europe/Madrid', now)).toBe(2)
    expect(findCurrentHourIndex(times, 'UTC', now)).toBe(0)
  })

  it('returns -1 when no slot matches', () => {
    expect(findCurrentHourIndex(times, 'America/New_York', now)).toBe(-1)
  })
})

describe('formatHour', () => {
  it('extracts HH:mm from a wall-clock ISO string', () => {
    expect(formatHour('2026-06-10T15:00')).toBe('15:00')
    expect(formatHour('2026-06-10T05:42')).toBe('05:42')
  })
})

describe('dayLabel', () => {
  const now = new Date('2026-06-10T22:30:00Z') // Madrid: June 11, New York: June 10

  it('returns Today for the current date in the timezone', () => {
    expect(dayLabel('2026-06-11', 'Europe/Madrid', now)).toBe('Today')
    expect(dayLabel('2026-06-10', 'America/New_York', now)).toBe('Today')
  })

  it('returns the weekday name otherwise', () => {
    expect(dayLabel('2026-06-10', 'Europe/Madrid', now)).toBe('Wed')
    expect(dayLabel('2026-06-12', 'Europe/Madrid', now)).toBe('Fri')
    expect(dayLabel('2026-06-14', 'Europe/Madrid', now)).toBe('Sun')
  })
})
