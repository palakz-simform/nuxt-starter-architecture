/**
 * useCurrency — a small, PURE composable (no data fetching, no side effects).
 *
 * This is the reference example for "util composables": it wraps a bit of logic
 * behind a `useXxx` API, has no external dependencies, and is directly unit
 * testable (see tests/unit/useCurrency.spec.ts).
 */
export function useCurrency(currency = 'USD', locale = 'en-US') {
  const formatter = new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
  })

  /** Format a number as a currency string, e.g. 82.4 -> "$82.40". */
  function format(amount: number): string {
    return formatter.format(amount)
  }

  return { format }
}
