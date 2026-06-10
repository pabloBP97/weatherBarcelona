import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, screen, fireEvent, act } from '@testing-library/react'
import CitySearch from './CitySearch.jsx'
import { searchCities } from '../lib/geocoding.js'

vi.mock('../lib/geocoding.js', () => ({ searchCities: vi.fn() }))

describe('CitySearch', () => {
  beforeEach(() => {
    vi.useFakeTimers()
    searchCities.mockReset()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('debounces the search by 300ms', async () => {
    searchCities.mockResolvedValue([])
    render(<CitySearch onSelect={() => {}} />)

    fireEvent.change(screen.getByRole('searchbox'), { target: { value: 'tok' } })
    await act(async () => { vi.advanceTimersByTime(299) })
    expect(searchCities).not.toHaveBeenCalled()

    await act(async () => { vi.advanceTimersByTime(1) })
    expect(searchCities).toHaveBeenCalledWith('tok')
    expect(searchCities).toHaveBeenCalledTimes(1)
  })

  it('ignores queries shorter than 2 characters', async () => {
    render(<CitySearch onSelect={() => {}} />)
    fireEvent.change(screen.getByRole('searchbox'), { target: { value: 't' } })
    await act(async () => { vi.advanceTimersByTime(1000) })
    expect(searchCities).not.toHaveBeenCalled()
  })

  it('renders results and reports the selected city', async () => {
    const tokyo = {
      id: 1, name: 'Tokyo', admin1: 'Tokyo', country: 'Japan',
      latitude: 35.6895, longitude: 139.6917, timezone: 'Asia/Tokyo',
    }
    searchCities.mockResolvedValue([tokyo])
    const onSelect = vi.fn()
    render(<CitySearch onSelect={onSelect} />)

    fireEvent.change(screen.getByRole('searchbox'), { target: { value: 'tokyo' } })
    await act(async () => { vi.advanceTimersByTime(300) })

    fireEvent.click(screen.getByText('Tokyo, Tokyo, Japan'))
    expect(onSelect).toHaveBeenCalledWith(tokyo)
    expect(screen.getByRole('searchbox').value).toBe('')
    expect(screen.queryByRole('listbox')).toBeNull()
  })

  it('shows an inline error when search fails', async () => {
    searchCities.mockRejectedValue(new Error('boom'))
    render(<CitySearch onSelect={() => {}} />)

    fireEvent.change(screen.getByRole('searchbox'), { target: { value: 'tokyo' } })
    await act(async () => { vi.advanceTimersByTime(300) })

    expect(screen.getByRole('alert')).toHaveTextContent('Search failed')
  })

  it('closes on Escape', async () => {
    searchCities.mockResolvedValue([{
      id: 1, name: 'Tokyo', admin1: 'Tokyo', country: 'Japan',
      latitude: 35.6895, longitude: 139.6917, timezone: 'Asia/Tokyo',
    }])
    render(<CitySearch onSelect={() => {}} />)

    const input = screen.getByRole('searchbox')
    fireEvent.change(input, { target: { value: 'tokyo' } })
    await act(async () => { vi.advanceTimersByTime(300) })
    expect(screen.getByRole('listbox')).toBeInTheDocument()

    fireEvent.keyDown(input, { key: 'Escape' })
    expect(screen.queryByRole('listbox')).toBeNull()
    expect(input.value).toBe('')
  })
})
