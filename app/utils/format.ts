/**
 * Pure formatting helpers. Auto-imported (Nuxt 4 auto-imports `app/utils`).
 * Keep these framework-free and side-effect-free so they are trivial to test.
 */

/** Format an ISO date string (YYYY-MM-DD) as a short, locale-aware label. */
export function formatDate(iso: string, locale = 'en-US'): string {
  const date = new Date(`${iso}T00:00:00`)
  if (Number.isNaN(date.getTime())) return iso
  return new Intl.DateTimeFormat(locale, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  }).format(date)
}

/** Title-case a category slug for display, e.g. `food` -> `Food`. */
export function formatCategory(category: string): string {
  return category.charAt(0).toUpperCase() + category.slice(1)
}
