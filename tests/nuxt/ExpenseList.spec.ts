import { describe, it, expect } from 'vitest'
import { mountSuspended } from '@nuxt/test-utils/runtime'
import type { Expense } from '#shared/schemas/expense'
import ExpenseList from '~/components/expense/ExpenseList.vue'

// Component regression test for the Expense table.
//
// The `actions` column has no visible header text. It was previously declared
// as `{ id: 'actions', header: '' }`, and UTable renders an empty-string header
// into a fragment whose anchor nesting differs between server and client —
// producing a hydration mismatch on /expenses. The fix renders the header via
// the `#actions-header` slot with a visually-hidden label. This test guards that
// fix: if the empty-string header comes back, the accessible label disappears.
const rows: Expense[] = [
  {
    id: '11111111-1111-4111-8111-111111111111',
    title: 'Coffee beans',
    amount: 14.99,
    category: 'food',
    date: '2026-07-07',
    createdAt: '2026-07-07T00:00:00.000Z',
    updatedAt: '2026-07-07T00:00:00.000Z',
  },
]

describe('ExpenseList', () => {
  it('gives the icon-only actions column an accessible, non-empty header', async () => {
    const wrapper = await mountSuspended(ExpenseList, { props: { expenses: rows } })
    expect(wrapper.find('.sr-only').text()).toBe('Actions')
  })

  it('renders each expense row with formatted date and currency', async () => {
    const wrapper = await mountSuspended(ExpenseList, { props: { expenses: rows } })
    const text = wrapper.text()
    expect(text).toContain('Coffee beans')
    expect(text).toContain('Jul 7, 2026')
    expect(text).toContain('$14.99')
  })

  it('shows an explicit empty state when there are no expenses', async () => {
    const wrapper = await mountSuspended(ExpenseList, { props: { expenses: [] } })
    expect(wrapper.text()).toContain('No expenses to show.')
  })

  it('shows the loading state (not the empty state) while fetching', async () => {
    // Guards the ordering rule: loading must win over empty. Without a #loading
    // slot, UTable falls through to #empty and flashes "No expenses to show."
    // during a client-side fetch (data defaults to []).
    const wrapper = await mountSuspended(ExpenseList, { props: { expenses: [], loading: true } })
    expect(wrapper.text()).toContain('Loading expenses…')
    expect(wrapper.text()).not.toContain('No expenses to show.')
  })
})
