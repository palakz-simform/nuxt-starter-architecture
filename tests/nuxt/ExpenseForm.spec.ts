import { describe, it, expect } from 'vitest'
import { mountSuspended } from '@nuxt/test-utils/runtime'
import ExpenseForm from '~/components/expense/ExpenseForm.vue'

// Component regression test for the create/edit form.
//
// The date field defaults to "today". It was previously computed inline as
// `new Date().toISOString().slice(0, 10)`, which runs separately on server and
// client and mismatches across a midnight boundary (a hydration bug). The fix
// computes it once via `useState`. These tests assert the default is present and
// a valid YYYY-MM-DD value, and that an explicit `initial.date` still wins.
describe('ExpenseForm', () => {
  it('defaults the date input to a valid YYYY-MM-DD value', async () => {
    const wrapper = await mountSuspended(ExpenseForm)
    const dateInput = wrapper.find('input[type="date"]')
    expect(dateInput.exists()).toBe(true)
    expect((dateInput.element as HTMLInputElement).value).toMatch(/^\d{4}-\d{2}-\d{2}$/)
  })

  it('prefills fields from `initial` when provided', async () => {
    const wrapper = await mountSuspended(ExpenseForm, {
      props: { initial: { title: 'Rent', amount: 1200, category: 'housing', date: '2026-01-31' } },
    })
    const dateInput = wrapper.find('input[type="date"]').element as HTMLInputElement
    expect(dateInput.value).toBe('2026-01-31')
  })
})
