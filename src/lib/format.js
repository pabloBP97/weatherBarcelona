const COMPASS = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW']

/** 8-point compass direction from degrees (0 = N). */
export function degreesToCompass(deg) {
  const normalized = ((deg % 360) + 360) % 360
  return COMPASS[Math.round(normalized / 45) % 8]
}
