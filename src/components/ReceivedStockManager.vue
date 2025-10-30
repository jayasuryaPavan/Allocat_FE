<template>
  <div class="received-stock-manager">
    <!-- Header -->
    <div class="header">
      <h3 class="title">Received Stock Management</h3>
      <p class="subtitle">Verify and process received stock items</p>
    </div>

    <!-- Filters -->
    <div class="filters">
      <div class="filter-group">
        <label class="filter-label">Status:</label>
        <select v-model="statusFilter" class="filter-select">
          <option value="">All</option>
          <option value="PENDING">Pending</option>
          <option value="VERIFIED">Verified</option>
          <option value="REJECTED">Rejected</option>
          <option value="PARTIAL">Partial</option>
          <option value="DISCREPANCY">Discrepancy</option>
        </select>
      </div>
      <div class="filter-group">
        <label class="filter-label">Search:</label>
        <input
          v-model="searchTerm"
          type="text"
          placeholder="Search products..."
          class="filter-input"
        />
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="loading-state">
      <div class="spinner"></div>
      <p>Loading received stock...</p>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="error-state">
      <svg class="error-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
      <p>{{ error }}</p>
      <button @click="loadReceivedStock" class="retry-button">Retry</button>
    </div>

    <!-- Empty State -->
    <div v-else-if="filteredStock.length === 0" class="empty-state">
      <svg class="empty-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
      </svg>
      <h4>No received stock found</h4>
      <p>Upload a CSV file to start managing received stock.</p>
    </div>

    <!-- Stock List -->
    <div v-else class="stock-list">
      <div
        v-for="item in paginatedStock"
        :key="item.id"
        class="stock-item"
        :class="getStatusClass(item.status)"
      >
        <div class="stock-header">
          <div class="product-info">
            <h4 class="product-name">{{ item.productName }}</h4>
            <p class="product-code">{{ item.productCode }}</p>
          </div>
          <div class="status-badge" :class="getStatusBadgeClass(item.status)">
            {{ item.status }}
          </div>
        </div>

        <div class="stock-details">
          <div class="quantity-info">
            <div class="quantity-item">
              <span class="quantity-label">Expected:</span>
              <span class="quantity-value">{{ item.expectedQuantity }}</span>
            </div>
            <div class="quantity-item">
              <span class="quantity-label">Received:</span>
              <span class="quantity-value">{{ item.receivedQuantity }}</span>
            </div>
            <div class="quantity-item">
              <span class="quantity-label">Verified:</span>
              <span class="quantity-value">{{ item.verifiedQuantity }}</span>
            </div>
          </div>

          <div class="price-info">
            <div class="price-item">
              <span class="price-label">Unit Price:</span>
              <span class="price-value">${{ item.unitPrice.toFixed(2) }}</span>
            </div>
            <div class="price-item">
              <span class="price-label">Total Value:</span>
              <span class="price-value">${{ item.totalValue.toFixed(2) }}</span>
            </div>
          </div>
        </div>

        <div v-if="item.supplierName || item.batchNumber" class="additional-info">
          <div v-if="item.supplierName" class="info-item">
            <span class="info-label">Supplier:</span>
            <span class="info-value">{{ item.supplierName }}</span>
          </div>
          <div v-if="item.batchNumber" class="info-item">
            <span class="info-label">Batch:</span>
            <span class="info-value">{{ item.batchNumber }}</span>
          </div>
        </div>

        <!-- Verification Form -->
        <div v-if="item.status === 'PENDING'" class="verification-form">
          <div class="form-group">
            <label class="form-label">Verified Quantity:</label>
            <input
              v-model="verificationData[item.id]"
              type="number"
              :max="item.expectedQuantity"
              min="0"
              class="form-input"
              placeholder="Enter verified quantity"
            />
          </div>
          <div class="form-actions">
            <button
              @click="verifyStock(item.id, verificationData[item.id] || 0)"
              :disabled="!verificationData[item.id] || verificationData[item.id] < 0"
              class="verify-button"
            >
              Verify Stock
            </button>
            <button
              @click="rejectStock(item.id)"
              class="reject-button"
            >
              Reject
            </button>
          </div>
        </div>

        <!-- Verification Details -->
        <div v-if="item.status === 'VERIFIED'" class="verification-details">
          <div class="verified-info">
            <span class="verified-label">Verified by:</span>
            <span class="verified-value">{{ item.verifiedBy }}</span>
            <span class="verified-date">{{ formatDate(item.verifiedDate) }}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Pagination -->
    <div v-if="totalPages > 1" class="pagination">
      <button
        @click="currentPage = Math.max(1, currentPage - 1)"
        :disabled="currentPage === 1"
        class="pagination-button"
      >
        Previous
      </button>
      <span class="pagination-info">
        Page {{ currentPage }} of {{ totalPages }}
      </span>
      <button
        @click="currentPage = Math.min(totalPages, currentPage + 1)"
        :disabled="currentPage === totalPages"
        class="pagination-button"
      >
        Next
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { InventoryApiService } from '../core/services/inventoryApi'
import type { ReceivedStock } from '../core/types/inventory'

interface Emits {
  (e: 'stock-verified', item: ReceivedStock): void
  (e: 'stock-rejected', item: ReceivedStock): void
}

const emit = defineEmits<Emits>()

// Reactive state
const receivedStock = ref<ReceivedStock[]>([])
const loading = ref(false)
const error = ref('')
const searchTerm = ref('')
const statusFilter = ref('')
const currentPage = ref(1)
const itemsPerPage = ref(10)
const verificationData = ref<Record<number, number>>({})

// Computed properties
const filteredStock = computed(() => {
  let filtered = receivedStock.value

  // Filter by status
  if (statusFilter.value) {
    filtered = filtered.filter(item => item.status === statusFilter.value)
  }

  // Filter by search term
  if (searchTerm.value) {
    const term = searchTerm.value.toLowerCase()
    filtered = filtered.filter(item =>
      item.productName.toLowerCase().includes(term) ||
      item.productCode.toLowerCase().includes(term) ||
      item.supplierName?.toLowerCase().includes(term)
    )
  }

  return filtered
})

const paginatedStock = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage.value
  const end = start + itemsPerPage.value
  return filteredStock.value.slice(start, end)
})

const totalPages = computed(() => {
  return Math.ceil(filteredStock.value.length / itemsPerPage.value)
})

// Methods
const loadReceivedStock = async () => {
  loading.value = true
  error.value = ''
  
  try {
    const response = await InventoryApiService.getAllReceivedStock()
    if (response.success) {
      receivedStock.value = response.data
    } else {
      error.value = response.message || 'Failed to load received stock'
    }
  } catch (err) {
    error.value = 'Failed to load received stock'
    console.error('Error loading received stock:', err)
  } finally {
    loading.value = false
  }
}

const verifyStock = async (stockId: number, verifiedQuantity: number) => {
  try {
    const response = await InventoryApiService.verifyReceivedStock(
      stockId,
      verifiedQuantity,
      'Current User' // TODO: Get from auth store
    )
    
    if (response.success) {
      // Update the stock item
      const index = receivedStock.value.findIndex(item => item.id === stockId)
      if (index !== -1) {
        receivedStock.value[index].status = 'VERIFIED'
        receivedStock.value[index].verifiedQuantity = verifiedQuantity
        receivedStock.value[index].verifiedBy = 'Current User'
        receivedStock.value[index].verifiedDate = new Date().toISOString()
      }
      
      emit('stock-verified', receivedStock.value[index])
    }
  } catch (err) {
    console.error('Error verifying stock:', err)
  }
}

const rejectStock = async (stockId: number) => {
  try {
    // Update status to rejected
    const index = receivedStock.value.findIndex(item => item.id === stockId)
    if (index !== -1) {
      receivedStock.value[index].status = 'REJECTED'
      receivedStock.value[index].verifiedBy = 'Current User'
      receivedStock.value[index].verifiedDate = new Date().toISOString()
    }
    
    emit('stock-rejected', receivedStock.value[index])
  } catch (err) {
    console.error('Error rejecting stock:', err)
  }
}

const getStatusClass = (status: string) => {
  switch (status) {
    case 'PENDING':
      return 'status-pending'
    case 'VERIFIED':
      return 'status-verified'
    case 'REJECTED':
      return 'status-rejected'
    case 'PARTIAL':
      return 'status-partial'
    case 'DISCREPANCY':
      return 'status-discrepancy'
    default:
      return ''
  }
}

const getStatusBadgeClass = (status: string) => {
  switch (status) {
    case 'PENDING':
      return 'badge-pending'
    case 'VERIFIED':
      return 'badge-verified'
    case 'REJECTED':
      return 'badge-rejected'
    case 'PARTIAL':
      return 'badge-partial'
    case 'DISCREPANCY':
      return 'badge-discrepancy'
    default:
      return ''
  }
}

const formatDate = (dateString?: string) => {
  if (!dateString) return ''
  return new Date(dateString).toLocaleDateString()
}

// Load data on mount
onMounted(() => {
  loadReceivedStock()
})
</script>

<style scoped>
.received-stock-manager {
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

.filters {
  @apply flex flex-wrap gap-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg;
}

.filter-group {
  @apply flex items-center space-x-2;
}

.filter-label {
  @apply text-sm font-medium text-gray-700 dark:text-gray-300;
}

.filter-select,
.filter-input {
  @apply px-3 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500;
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

.stock-list {
  @apply space-y-4;
}

.stock-item {
  @apply p-4 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800;
}

.stock-item.status-pending {
  @apply border-yellow-300 bg-yellow-50 dark:bg-yellow-900/20;
}

.stock-item.status-verified {
  @apply border-green-300 bg-green-50 dark:bg-green-900/20;
}

.stock-item.status-rejected {
  @apply border-red-300 bg-red-50 dark:bg-red-900/20;
}

.stock-item.status-partial {
  @apply border-orange-300 bg-orange-50 dark:bg-orange-900/20;
}

.stock-item.status-discrepancy {
  @apply border-purple-300 bg-purple-50 dark:bg-purple-900/20;
}

.stock-header {
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

.badge-pending {
  @apply bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-300;
}

.badge-verified {
  @apply bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300;
}

.badge-rejected {
  @apply bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300;
}

.badge-partial {
  @apply bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-300;
}

.badge-discrepancy {
  @apply bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-300;
}

.stock-details {
  @apply grid grid-cols-1 md:grid-cols-2 gap-4 mb-3;
}

.quantity-info,
.price-info {
  @apply space-y-2;
}

.quantity-item,
.price-item {
  @apply flex justify-between items-center;
}

.quantity-label,
.price-label {
  @apply text-sm text-gray-600 dark:text-gray-400;
}

.quantity-value,
.price-value {
  @apply text-sm font-medium text-gray-900 dark:text-white;
}

.additional-info {
  @apply flex flex-wrap gap-4 mb-3;
}

.info-item {
  @apply flex items-center space-x-1;
}

.info-label {
  @apply text-xs text-gray-500 dark:text-gray-400;
}

.info-value {
  @apply text-xs font-medium text-gray-700 dark:text-gray-300;
}

.verification-form {
  @apply mt-4 p-3 bg-gray-50 dark:bg-gray-700 rounded-md space-y-3;
}

.form-group {
  @apply space-y-1;
}

.form-label {
  @apply text-sm font-medium text-gray-700 dark:text-gray-300;
}

.form-input {
  @apply w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500;
}

.form-actions {
  @apply flex space-x-2;
}

.verify-button {
  @apply px-3 py-1 text-sm font-medium text-white bg-green-600 rounded-md hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed;
}

.reject-button {
  @apply px-3 py-1 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700;
}

.verification-details {
  @apply mt-3 p-3 bg-green-50 dark:bg-green-900/20 rounded-md;
}

.verified-info {
  @apply flex items-center space-x-4 text-sm;
}

.verified-label {
  @apply text-gray-600 dark:text-gray-400;
}

.verified-value {
  @apply font-medium text-gray-900 dark:text-white;
}

.verified-date {
  @apply text-gray-500 dark:text-gray-400;
}

.pagination {
  @apply flex items-center justify-between mt-6;
}

.pagination-button {
  @apply px-3 py-1 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed;
}

.pagination-info {
  @apply text-sm text-gray-700 dark:text-gray-300;
}
</style>

