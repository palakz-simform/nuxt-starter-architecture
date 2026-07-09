import { describe, it, expect } from 'vitest'
import { useCurrency } from '~/composables/useCurrency'

// Unit test for a pure util composable — no Nuxt runtime needed.
describe('useCurrency', () => {
  it('formats USD amounts', () => {
    const { format } = useCurrency('USD', 'en-US')
    expect(format(82.4)).toBe('$82.40')
    expect(format(0)).toBe('$0.00')
  })

  it('respects the currency argument', () => {
    const { format } = useCurrency('EUR', 'en-US')
    expect(format(10)).toContain('10.00')
    expect(format(10)).toContain('€')
  })
})
