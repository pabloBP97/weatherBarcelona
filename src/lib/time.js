// Open-Meteo returns times as wall-clock ISO strings in the requested
// timezone with no UTC offset (e.g. "2026-06-10T15:00"). Never parse them
// with `new Date()` — that reinterprets them in the client's timezone.
// All helpers here work in string space instead.

/** Returns 'YYYY-MM-DDTHH' for the given moment in an IANA timezone. */
export function wallClockHour(timeZone, now = new Date()) {
  // hourCycle 'h23' (not hour12: false) so midnight is '00', never '24'
  const parts = new Intl.DateTimeFormat('en-CA', {
    timeZone,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    hourCycle: 'h23',
  }).formatToParts(now)
  const get = type => parts.find(p => p.type === type).value
  return `${get('year')}-${get('month')}-${get('day')}T${get('hour')}`
}

/** Index of the hourly slot matching "now" in timeZone; -1 if not found. */
export function findCurrentHourIndex(times, timeZone, now = new Date()) {
  const key = wallClockHour(timeZone, now)
  return times.findIndex(t => t.startsWith(key))
}

/** '15:00' from '2026-06-10T15:00'. */
export function formatHour(isoLocal) {
  return isoLocal.slice(11, 16)
}

/** 'Today' or 'Mon'…'Sun' for a 'YYYY-MM-DD' daily date, relative to timeZone. */
export function dayLabel(dateStr, timeZone, now = new Date()) {
  if (dateStr === wallClockHour(timeZone, now).slice(0, 10)) return 'Today'
  // Weekday of a calendar date is timezone-independent; noon UTC avoids day shift
  return new Date(`${dateStr}T12:00:00Z`).toLocaleDateString('en-GB', {
    weekday: 'short',
    timeZone: 'UTC',
  })
}
