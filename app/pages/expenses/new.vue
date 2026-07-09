<script setup lang="ts">
import type { CreateExpenseInput } from '#shared/schemas/expense'

// Create page: renders ExpenseForm and delegates persistence to useExpenses.
const { create } = useExpenses()
const toast = useToast()
const submitting = ref(false)

useHead({ title: 'Add expense' })

async function onSubmit(payload: CreateExpenseInput) {
  submitting.value = true
  try {
    await create(payload)
    toast.add({ title: 'Expense added', color: 'success' })
    await navigateTo('/expenses')
  }
  catch {
    toast.add({ title: 'Failed to add expense', color: 'error' })
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
        Add expense
      </h1>
    </div>

    <UCard>
      <ExpenseForm
        submit-label="Add expense"
        :loading="submitting"
        @submit="onSubmit"
      />
    </UCard>
  </div>
</template>
