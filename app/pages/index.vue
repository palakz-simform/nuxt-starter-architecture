<script setup lang="ts">
// Dashboard: summary totals + a few recent expenses.
// Data comes from the useExpenses composable — the page never fetches directly.
const { expenses, pending, error } = useExpenses()

useHead({ title: 'Dashboard' })

const recent = computed(() => (expenses.value ?? []).slice(0, 4))
</script>

<template>
  <div class="space-y-8">
    <div class="flex items-center justify-between">
      <h1 class="text-xl font-semibold">
        Dashboard
      </h1>
      <UButton
        to="/expenses/new"
        icon="i-lucide-plus"
        label="Add expense"
      />
    </div>

    <UAlert
      v-if="error"
      color="error"
      variant="subtle"
      icon="i-lucide-alert-triangle"
      title="Couldn't load your dashboard"
      description="Something went wrong fetching your expenses. Please try again."
    />

    <template v-else>
      <ExpenseSummary :expenses="expenses ?? []" />

      <section class="space-y-3">
        <div class="flex items-center justify-between">
          <h2 class="font-medium">
            Recent
          </h2>
          <UButton
            to="/expenses"
            label="View all"
            variant="link"
            trailing-icon="i-lucide-arrow-right"
          />
        </div>

        <div
          v-if="pending"
          class="text-muted text-sm"
        >
          Loading…
        </div>
        <div
          v-else-if="recent.length"
          class="space-y-3"
        >
          <ExpenseCard
            v-for="expense in recent"
            :key="expense.id"
            :expense="expense"
          />
        </div>
        <UCard v-else>
          <p class="text-muted text-sm">
            No expenses yet. Add your first one to get started.
          </p>
        </UCard>
      </section>
    </template>
  </div>
</template>
