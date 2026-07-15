<script setup lang="ts">
import type { Expense } from '#shared/schemas/expense'
import { EXPENSE_CATEGORIES } from '#shared/schemas/expense'

// List page: server data via composable, UI filter/sort via Pinia store.
const { expenses, pending, error, remove } = useExpenses()
const filter = useExpenseFilterStore()
const toast = useToast()

useHead({ title: 'Expenses' })

const categoryItems = [
  { label: 'All categories', value: 'all' as const },
  ...EXPENSE_CATEGORIES.map(value => ({ label: formatCategory(value), value })),
]
const sortItems = [
  { label: 'Sort by date', value: 'date' as const },
  { label: 'Sort by amount', value: 'amount' as const },
]

// Derive the visible list from server data + store filters (never duplicated).
const visible = computed<Expense[]>(() => {
  let list = expenses.value ?? []
  if (filter.category !== 'all') {
    list = list.filter(e => e.category === filter.category)
  }
  return [...list].sort((a, b) =>
    filter.sortBy === 'amount' ? b.amount - a.amount : b.date.localeCompare(a.date),
  )
})

// Delete confirmation modal state.
const pendingDelete = ref<Expense | null>(null)
const deleting = ref(false)
const isConfirmOpen = computed({
  get: () => pendingDelete.value !== null,
  set: (open: boolean) => {
    if (!open) pendingDelete.value = null
  },
})

async function performDelete() {
  if (!pendingDelete.value) return
  deleting.value = true
  try {
    await remove(pendingDelete.value.id)
    toast.add({ title: 'Expense deleted', color: 'success' })
    pendingDelete.value = null
  }
  catch {
    toast.add({ title: 'Failed to delete expense', color: 'error' })
  }
  finally {
    deleting.value = false
  }
}
</script>

<template>
  <div class="space-y-6">
    <div class="flex items-center justify-between">
      <h1 class="text-xl font-semibold">
        Expenses
      </h1>
      <UButton
        to="/expenses/new"
        icon="i-lucide-plus"
        label="Add expense"
      />
    </div>

    <div class="flex flex-wrap items-center gap-2">
      <USelect
        v-model="filter.category"
        :items="categoryItems"
        class="w-48"
      />
      <USelect
        v-model="filter.sortBy"
        :items="sortItems"
        class="w-48"
      />
      <UButton
        v-if="filter.isFiltered"
        label="Clear"
        icon="i-lucide-x"
        color="neutral"
        variant="ghost"
        size="sm"
        @click="filter.reset()"
      />
    </div>

    <UAlert
      v-if="error"
      color="error"
      variant="subtle"
      icon="i-lucide-alert-triangle"
      title="Couldn't load expenses"
      description="Something went wrong fetching your expenses. Please try again."
    />
    <ExpenseList
      v-else
      :expenses="visible"
      :loading="pending"
      @delete="pendingDelete = $event"
    />

    <UModal
      v-model:open="isConfirmOpen"
      title="Delete expense"
    >
      <template #body>
        <p class="text-muted text-sm">
          Delete <span class="text-default font-medium">{{ pendingDelete?.title }}</span>? This
          cannot be undone.
        </p>
      </template>
      <template #footer>
        <div class="flex w-full justify-end gap-2">
          <UButton
            label="Cancel"
            color="neutral"
            variant="ghost"
            @click="() => { isConfirmOpen = false }"
          />
          <UButton
            label="Delete"
            color="error"
            :loading="deleting"
            @click="performDelete"
          />
        </div>
      </template>
    </UModal>
  </div>
</template>
