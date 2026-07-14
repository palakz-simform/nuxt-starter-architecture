<script setup lang="ts">
import type { TableColumn } from '@nuxt/ui'
import type { Expense } from '#shared/schemas/expense'

/**
 * ExpenseList — reference example for UTable.
 *
 * Columns are TanStack `ColumnDef`s; custom rendering uses the `#<id>-cell`
 * slots (the column id defaults to `accessorKey`). Presentational: it emits a
 * `delete` event and links to the edit page — the parent handles side effects.
 */
const props = defineProps<{ expenses: Expense[], loading?: boolean }>()
const emit = defineEmits<{ delete: [expense: Expense] }>()

const { format } = useCurrency()

const columns: TableColumn<Expense>[] = [
  { accessorKey: 'title', header: 'Title' },
  { accessorKey: 'category', header: 'Category' },
  { accessorKey: 'date', header: 'Date' },
  { accessorKey: 'amount', header: 'Amount' },
  { id: 'actions' },
]
</script>

<template>
  <UTable
    :data="props.expenses"
    :columns="columns"
    :loading="loading"
  >
    <template #actions-header>
      <span class="sr-only">Actions</span>
    </template>

    <template #category-cell="{ row }">
      <UBadge
        :label="formatCategory(row.original.category)"
        color="neutral"
        variant="subtle"
      />
    </template>

    <template #date-cell="{ row }">
      {{ formatDate(row.original.date) }}
    </template>

    <template #amount-cell="{ row }">
      <span class="font-medium">{{ format(row.original.amount) }}</span>
    </template>

    <template #actions-cell="{ row }">
      <div class="flex justify-end gap-1">
        <UButton
          :to="`/expenses/${row.original.id}`"
          icon="i-lucide-pencil"
          color="neutral"
          variant="ghost"
          size="xs"
          aria-label="Edit expense"
        />
        <UButton
          icon="i-lucide-trash-2"
          color="error"
          variant="ghost"
          size="xs"
          aria-label="Delete expense"
          @click="emit('delete', row.original)"
        />
      </div>
    </template>
  </UTable>
</template>
