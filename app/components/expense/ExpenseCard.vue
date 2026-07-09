<script setup lang="ts">
import type { Expense } from '#shared/schemas/expense'

/**
 * ExpenseCard — small presentational component for a single expense.
 * Pure display: no data fetching, no store access. Used on the dashboard's
 * "recent" list. Reuses the auto-imported format helpers + useCurrency.
 */
defineProps<{ expense: Expense }>()

const { format } = useCurrency()
</script>

<template>
  <UCard>
    <div class="flex items-center justify-between gap-4">
      <div class="min-w-0">
        <p class="truncate font-medium">
          {{ expense.title }}
        </p>
        <p class="text-muted text-sm">
          <UBadge
            :label="formatCategory(expense.category)"
            color="neutral"
            variant="subtle"
          />
          <span class="ml-2">{{ formatDate(expense.date) }}</span>
        </p>
      </div>
      <p class="text-primary shrink-0 font-semibold">
        {{ format(expense.amount) }}
      </p>
    </div>
  </UCard>
</template>
