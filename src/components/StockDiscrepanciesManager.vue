<template>
  <div class="discrepancies-manager">
    <!-- Header -->
    <div class="header">
      <h3 class="title">Stock Discrepancies</h3>
      <p class="subtitle">Review and manage stock discrepancies</p>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="loading-state">
      <div class="spinner"></div>
      <p>Loading discrepancies...</p>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="error-state">
      <svg class="error-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
      <p>{{ error }}</p>
      <button @click="loadDiscrepancies" class="retry-button">Retry</button>
    </div>

    <!-- Empty State -->
    <div v-else-if="discrepancies.length === 0" class="empty-state">
      <svg class="empty-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
      <h4>No discrepancies found</h4>
      <p>All stock levels are accurate.</p>
    </div>

    <!-- Discrepancies List -->
    <div v-else class="discrepancies-list">
      <div
        v-for="discrepancy in discrepancies"
        :key="discrepancy.id"
        class="discrepancy-item"
      >
        <div class="discrepancy-header">
          <div class="product-info">
            <h4 class="product-name">{{ discrepancy.productName }}</h4>
            <p class="product-code">{{ discrepancy.productCode }}</p>
          </div>
          <div class="status-badge discrepancy">
            {{ discrepancy.status }}
          </div>
        </div>

        <div class="discrepancy-details">
          <div class="quantity-comparison">
            <div class="quantity-item">
              <span class="quantity-label">Expected:</span>
              <span class="quantity-value expected">{{ discrepancy.expectedQuantity }}</span>
            </div>
            <div class="quantity-item">
              <span class="quantity-label">Received:</span>
              <span class="quantity-value received">{{ discrepancy.receivedQuantity }}</span>
            </div>
            <div class="quantity-item">
              <span class="quantity-label">Verified:</span>
              <span class="quantity-value verified">{{ discrepancy.verifiedQuantity }}</span>
            </div>
            <div v-if="discrepancy.shortageQuantity" class="quantity-item">
              <span class="quantity-label">Shortage:</span>
              <span class="quantity-value shortage">{{ discrepancy.shortageQuantity }}</span>
            </div>
          </div>

          <div v-if="discrepancy.notes" class="notes-section">
            <h5 class="notes-title">Notes:</h5>
            <p class="notes-content">{{ discrepancy.notes }}</p>
          </div>

          <div class="actions">
            <button
              @click="resolveDiscrepancy(discrepancy.id)"
              class="resolve-button"
            >
              Mark as Resolved
            </button>
            <button
              @click="investigateDiscrepancy(discrepancy.id)"
              class="investigate-button"
            >
              Investigate
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Summary Stats -->
    <div v-if="discrepancies.length > 0" class="summary-stats">
      <div class="stat-card">
        <div class="stat-value">{{ discrepancies.length }}</div>
        <div class="stat-label">Total Discrepancies</div>
      </div>
      <div class="stat-card">
        <div class="stat-value">{{ totalShortage }}</div>
        <div class="stat-label">Total Shortage</div>
      </div>
      <div class="stat-card">
        <div class="stat-value">${{ totalValueImpact.toFixed(2) }}</div>
        <div class="stat-label">Value Impact</div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { InventoryApiService } from '../core/services/inventoryApi'
import type { StockDiscrepancy } from '../core/types/inventory'

// Reactive state
const discrepancies = ref<StockDiscrepancy[]>([])
const loading = ref(false)
const error = ref('')

// Computed properties
const totalShortage = computed(() => {
  return discrepancies.value.reduce((total, discrepancy) => {
    return total + (discrepancy.shortageQuantity || 0)
  }, 0)
})

const totalValueImpact = computed(() => {
  return discrepancies.value.reduce((total, discrepancy) => {
    const shortage = discrepancy.shortageQuantity || 0
    const unitPrice = 0 // TODO: Get unit price from product data
    return total + (shortage * unitPrice)
  }, 0)
})

// Methods
const loadDiscrepancies = async () => {
  loading.value = true
  error.value = ''
  
  try {
    const response = await InventoryApiService.getStockDiscrepancies()
    if (response.success) {
      discrepancies.value = response.data
    } else {
      error.value = response.message || 'Failed to load discrepancies'
    }
  } catch (err) {
    error.value = 'Failed to load discrepancies'
    console.error('Error loading discrepancies:', err)
  } finally {
    loading.value = false
  }
}

const resolveDiscrepancy = async (discrepancyId: number) => {
  try {
    // TODO: Implement API call to resolve discrepancy
    console.log('Resolving discrepancy:', discrepancyId)
    
    // Remove from list for now
    discrepancies.value = discrepancies.value.filter(d => d.id !== discrepancyId)
  } catch (err) {
    console.error('Error resolving discrepancy:', err)
  }
}

const investigateDiscrepancy = (discrepancyId: number) => {
  // TODO: Implement investigation workflow
  console.log('Investigating discrepancy:', discrepancyId)
}

// Load data on mount
onMounted(() => {
  loadDiscrepancies()
})
</script>

<style scoped>
.discrepancies-manager {
  @apply space-y-6;
}

.header {
  @apply space-y-2;
}

.title {
  @apply text-xl font-semibold text-gray-900 dark:text-white;
}

.subtitle {
  @apply text-sm text-gray-500 dark:text-gray-400;
}

.loading-state,
.error-state,
.empty-state {
  @apply flex flex-col items-center justify-center py-12 space-y-4;
}

.spinner {
  @apply w-8 h-8 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin;
}

.error-icon,
.empty-icon {
  @apply w-12 h-12 text-gray-400;
}

.retry-button {
  @apply px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700;
}

.discrepancies-list {
  @apply space-y-4;
}

.discrepancy-item {
  @apply p-4 border border-red-200 dark:border-red-800 rounded-lg bg-red-50 dark:bg-red-900/20;
}

.discrepancy-header {
  @apply flex items-center justify-between mb-3;
}

.product-info {
  @apply space-y-1;
}

.product-name {
  @apply text-lg font-medium text-gray-900 dark:text-white;
}

.product-code {
  @apply text-sm text-gray-500 dark:text-gray-400;
}

.status-badge {
  @apply px-2 py-1 text-xs font-semibold rounded-full;
}

.status-badge.discrepancy {
  @apply bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300;
}

.discrepancy-details {
  @apply space-y-4;
}

.quantity-comparison {
  @apply grid grid-cols-2 md:grid-cols-4 gap-4;
}

.quantity-item {
  @apply flex flex-col items-center space-y-1;
}

.quantity-label {
  @apply text-xs text-gray-500 dark:text-gray-400;
}

.quantity-value {
  @apply text-sm font-medium;
}

.quantity-value.expected {
  @apply text-blue-600 dark:text-blue-400;
}

.quantity-value.received {
  @apply text-yellow-600 dark:text-yellow-400;
}

.quantity-value.verified {
  @apply text-green-600 dark:text-green-400;
}

.quantity-value.shortage {
  @apply text-red-600 dark:text-red-400;
}

.notes-section {
  @apply p-3 bg-white dark:bg-gray-800 rounded-md;
}

.notes-title {
  @apply text-sm font-medium text-gray-700 dark:text-gray-300 mb-1;
}

.notes-content {
  @apply text-sm text-gray-600 dark:text-gray-400;
}

.actions {
  @apply flex space-x-2;
}

.resolve-button {
  @apply px-3 py-1 text-sm font-medium text-white bg-green-600 rounded-md hover:bg-green-700;
}

.investigate-button {
  @apply px-3 py-1 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700;
}

.summary-stats {
  @apply grid grid-cols-1 md:grid-cols-3 gap-4 mt-6;
}

.stat-card {
  @apply p-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 text-center;
}

.stat-value {
  @apply text-2xl font-bold text-gray-900 dark:text-white;
}

.stat-label {
  @apply text-sm text-gray-500 dark:text-gray-400;
}
</style>

