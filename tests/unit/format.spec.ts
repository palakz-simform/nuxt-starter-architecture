import { describe, it, expect } from 'vitest'
import { formatDate, formatCategory } from '~/utils/format'

// Unit test for pure util helpers (write-tests skill: kind 1). No Nuxt runtime.
describe('formatDate', () => {
  it('formats an ISO date as a short label', () => {
    expect(formatDate('2026-07-05')).toBe('Jul 5, 2026')
  })

  it('returns the input unchanged when it is not a valid date', () => {
    expect(formatDate('not-a-date')).toBe('not-a-date')
  })
})

describe('formatCategory', () => {
  it('capitalizes the first letter', () => {
    expect(formatCategory('food')).toBe('Food')
    expect(formatCategory('transport')).toBe('Transport')
  })
})
