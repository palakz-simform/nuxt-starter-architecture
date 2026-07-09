<script setup lang="ts">
import type { FormSubmitEvent } from '@nuxt/ui'
import {
  createExpenseSchema,
  EXPENSE_CATEGORIES,
  type CreateExpenseInput,
} from '#shared/schemas/expense'

/**
 * ExpenseForm — reference example for FORMS.
 *
 * The SAME shared Zod schema that validates the API drives client validation:
 * pass it to <UForm :schema>. <UFormField name="…"> ties each field to a schema
 * key so errors render inline automatically. The component is presentational —
 * it emits validated data and lets the page decide create vs update.
 */
const props = defineProps<{
  initial?: Partial<CreateExpenseInput>
  submitLabel?: string
  loading?: boolean
}>()

const emit = defineEmits<{ submit: [payload: CreateExpenseInput] }>()

const state = reactive<Partial<CreateExpenseInput>>({
  title: props.initial?.title,
  amount: props.initial?.amount,
  category: props.initial?.category,
  date: props.initial?.date ?? new Date().toISOString().slice(0, 10),
  notes: props.initial?.notes,
})

const categoryItems = EXPENSE_CATEGORIES.map(value => ({
  label: formatCategory(value),
  value,
}))

function onSubmit(event: FormSubmitEvent<CreateExpenseInput>) {
  emit('submit', event.data)
}
</script>

<template>
  <UForm
    :schema="createExpenseSchema"
    :state="state"
    class="space-y-4"
    @submit="onSubmit"
  >
    <UFormField
      label="Title"
      name="title"
      required
    >
      <UInput
        v-model="state.title"
        placeholder="e.g. Groceries"
        class="w-full"
      />
    </UFormField>

    <div class="grid gap-4 sm:grid-cols-2">
      <UFormField
        label="Amount"
        name="amount"
        required
      >
        <UInput
          v-model.number="state.amount"
          type="number"
          step="0.01"
          min="0"
          class="w-full"
        >
          <template #leading>
            <span class="text-dimmed">$</span>
          </template>
        </UInput>
      </UFormField>

      <UFormField
        label="Category"
        name="category"
        required
      >
        <USelect
          v-model="state.category"
          :items="categoryItems"
          placeholder="Select a category"
          class="w-full"
        />
      </UFormField>
    </div>

    <UFormField
      label="Date"
      name="date"
      required
    >
      <UInput
        v-model="state.date"
        type="date"
        class="w-full"
      />
    </UFormField>

    <UFormField
      label="Notes"
      name="notes"
      hint="Optional"
    >
      <UTextarea
        v-model="state.notes"
        :rows="3"
        class="w-full"
      />
    </UFormField>

    <div class="flex justify-end gap-2">
      <UButton
        type="submit"
        :loading="loading"
        :label="submitLabel ?? 'Save expense'"
        icon="i-lucide-check"
      />
    </div>
  </UForm>
</template>
