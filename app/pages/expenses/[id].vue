<script setup lang="ts">
import type { CreateExpenseInput } from '#shared/schemas/expense'

// Edit page: fetch one expense by id, prefill the form, submit an update.
const route = useRoute()
const id = route.params.id as string

const { data: expense, error, pending } = useExpense(id)
const { update } = useExpenses()
const toast = useToast()
const submitting = ref(false)

useHead({ title: 'Edit expense' })

// Map the loaded expense to the form's input shape.
const initial = computed<Partial<CreateExpenseInput> | undefined>(() =>
  expense.value
    ? {
        title: expense.value.title,
        amount: expense.value.amount,
        category: expense.value.category,
        date: expense.value.date,
        notes: expense.value.notes,
      }
    : undefined,
)

async function onSubmit(payload: CreateExpenseInput) {
  submitting.value = true
  try {
    await update(id, payload)
    toast.add({ title: 'Expense updated', color: 'success' })
    await navigateTo('/expenses')
  }
  catch {
    toast.add({ title: 'Failed to update expense', color: 'error' })
  }
  finally {
    submitting.value = false
  }
}
</script>

<template>
  <div class="mx-auto max-w-xl space-y-6">
    <div class="flex items-center gap-2">
      <UButton
        to="/expenses"
        icon="i-lucide-arrow-left"
        color="neutral"
        variant="ghost"
        size="sm"
        aria-label="Back"
      />
      <h1 class="text-xl font-semibold">
        Edit expense
      </h1>
    </div>

    <UCard>
      <div
        v-if="pending"
        class="text-muted text-sm"
      >
        Loading…
      </div>
      <UAlert
        v-else-if="error"
        color="error"
        variant="subtle"
        title="Expense not found"
        :description="`No expense with id ${id}.`"
      />
      <ExpenseForm
        v-else-if="initial"
        :initial="initial"
        submit-label="Save changes"
        :loading="submitting"
        @submit="onSubmit"
      />
    </UCard>
  </div>
</template>
