import { describe, it, expect } from 'vitest'
import { degreesToCompass } from './format.js'

describe('degreesToCompass', () => {
  it('maps cardinal directions', () => {
    expect(degreesToCompass(0)).toBe('N')
    expect(degreesToCompass(90)).toBe('E')
    expect(degreesToCompass(180)).toBe('S')
    expect(degreesToCompass(270)).toBe('W')
  })

  it('handles sector boundaries', () => {
    expect(degreesToCompass(22.4)).toBe('N')
    expect(degreesToCompass(22.5)).toBe('NE')
    expect(degreesToCompass(359)).toBe('N')
  })

  it('normalizes out-of-range degrees', () => {
    expect(degreesToCompass(360)).toBe('N')
    expect(degreesToCompass(450)).toBe('E')
    expect(degreesToCompass(-45)).toBe('NW')
  })
})
