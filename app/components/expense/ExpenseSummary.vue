<script setup lang="ts">
import type { Expense } from '#shared/schemas/expense'
import type { ExpenseSummary } from '#shared/types/expense'

/**
 * ExpenseSummary — derives dashboard totals from the expense list.
 * Presentational + computed only; the parent owns the data. The derived view
 * model is typed with the shared `ExpenseSummary` type (single source of truth).
 */
const props = defineProps<{ expenses: Expense[] }>()

const { format } = useCurrency()

const summary = computed<ExpenseSummary>(() => {
  const byCategory: Record<string, number> = {}
  for (const e of props.expenses) {
    byCategory[e.category] = (byCategory[e.category] ?? 0) + e.amount
  }
  return {
    total: props.expenses.reduce((sum, e) => sum + e.amount, 0),
    count: props.expenses.length,
    byCategory,
  }
})

// Categories sorted by spend, largest first (for display).
const categoriesByAmount = computed(() =>
  Object.entries(summary.value.byCategory).sort((a, b) => b[1] - a[1]),
)
</script>

<template>
  <div class="grid gap-4 sm:grid-cols-3">
    <UCard class="sm:col-span-1">
      <p class="text-muted text-sm">
        Total spent
      </p>
      <p class="text-2xl font-semibold">
        {{ format(summary.total) }}
      </p>
      <p class="text-dimmed text-xs">
        {{ summary.count }} expenses
      </p>
    </UCard>

    <UCard class="sm:col-span-2">
      <p class="text-muted mb-3 text-sm">
        By category
      </p>
      <div
        v-if="categoriesByAmount.length"
        class="space-y-2"
      >
        <div
          v-for="[category, amount] in categoriesByAmount"
          :key="category"
          class="flex items-center justify-between text-sm"
        >
          <UBadge
            :label="formatCategory(category)"
            color="neutral"
            variant="subtle"
          />
          <span class="font-medium">{{ format(amount) }}</span>
        </div>
      </div>
      <p
        v-else
        class="text-dimmed text-sm"
      >
        No expenses yet.
      </p>
    </UCard>
  </div>
</template>
