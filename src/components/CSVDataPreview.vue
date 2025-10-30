<template>
  <div class="csv-preview-container">
    <!-- Header -->
    <div class="preview-header">
      <div class="preview-title">
        <h3 class="title">CSV Data Preview</h3>
        <p class="subtitle">
          Review your data before importing to inventory
        </p>
      </div>
      <div class="preview-stats">
        <div class="stat-item">
          <span class="stat-label">Total Rows:</span>
          <span class="stat-value">{{ data.totalRows }}</span>
        </div>
        <div class="stat-item">
          <span class="stat-label">Valid:</span>
          <span class="stat-value text-green-600 dark:text-green-400">{{ data.validRows }}</span>
        </div>
        <div class="stat-item">
          <span class="stat-label">Invalid:</span>
          <span class="stat-value text-red-600 dark:text-red-400">{{ data.invalidRows }}</span>
        </div>
      </div>
    </div>

    <!-- Errors Section -->
    <div v-if="data.errors.length > 0" class="errors-section">
      <div class="errors-header">
        <h4 class="errors-title">Validation Errors</h4>
        <button 
          @click="showErrors = !showErrors"
          class="toggle-button"
        >
          {{ showErrors ? 'Hide' : 'Show' }} Errors ({{ data.errors.length }})
        </button>
      </div>
      
      <div v-if="showErrors" class="errors-list">
        <div 
          v-for="(error, index) in data.errors" 
          :key="index"
          class="error-item"
        >
          <div class="error-header">
            <span class="error-location">Row {{ error.row }}, Column: {{ error.column }}</span>
            <span class="error-value">{{ error.value }}</span>
          </div>
          <p class="error-message">{{ error.message }}</p>
        </div>
      </div>
    </div>

    <!-- Data Table -->
    <div class="data-section">
      <div class="data-header">
        <h4 class="data-title">Preview Data</h4>
        <div class="data-controls">
          <div class="search-box">
            <svg class="search-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              v-model="searchTerm"
              type="text"
              placeholder="Search data..."
              class="search-input"
            />
          </div>
          <select v-model="itemsPerPage" class="page-select">
            <option value="10">10 per page</option>
            <option value="25">25 per page</option>
            <option value="50">50 per page</option>
            <option value="100">100 per page</option>
          </select>
        </div>
      </div>

      <!-- Table -->
      <div class="table-container">
        <table class="data-table">
          <thead>
            <tr>
              <th 
                v-for="header in visibleHeaders" 
                :key="header"
                class="table-header"
              >
                {{ formatHeader(header) }}
              </th>
            </tr>
          </thead>
          <tbody>
            <tr 
              v-for="(row, index) in paginatedData" 
              :key="index"
              class="table-row"
            >
              <td 
                v-for="header in visibleHeaders" 
                :key="header"
                class="table-cell"
              >
                <span v-if="row[header] !== undefined && row[header] !== null">
                  {{ formatCellValue(row[header], header) }}
                </span>
                <span v-else class="empty-cell">-</span>
              </td>
            </tr>
          </tbody>
        </table>
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
        
        <div class="pagination-info">
          Page {{ currentPage }} of {{ totalPages }}
        </div>
        
        <button 
          @click="currentPage = Math.min(totalPages, currentPage + 1)"
          :disabled="currentPage === totalPages"
          class="pagination-button"
        >
          Next
        </button>
      </div>
    </div>

    <!-- Actions -->
    <div class="actions-section">
      <button 
        @click="$emit('cancel')"
        class="action-button secondary"
      >
        Cancel
      </button>
      <button 
        @click="$emit('import', filteredData)"
        :disabled="data.validRows === 0"
        class="action-button primary"
      >
        Import {{ data.validRows }} Items
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import type { CSVInventoryData } from '../core/types/inventory'

interface Props {
  data: CSVInventoryData
}

interface Emits {
  (e: 'import', data: any[]): void
  (e: 'cancel'): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

// Reactive state
const showErrors = ref(false)
const searchTerm = ref('')
const currentPage = ref(1)
const itemsPerPage = ref(25)

// Computed properties
const filteredData = computed(() => {
  if (!searchTerm.value) return props.data.rows
  
  const term = searchTerm.value.toLowerCase()
  return props.data.rows.filter(row => 
    Object.values(row).some(value => 
      value?.toString().toLowerCase().includes(term)
    )
  )
})

const visibleHeaders = computed(() => {
  return props.data.headers.filter(header => 
    props.data.rows.some(row => row[header] !== undefined)
  )
})

const paginatedData = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage.value
  const end = start + itemsPerPage.value
  return filteredData.value.slice(start, end)
})

const totalPages = computed(() => {
  return Math.ceil(filteredData.value.length / itemsPerPage.value)
})

// Methods
const formatHeader = (header: string): string => {
  return header.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())
}

const formatCellValue = (value: any, header: string): string => {
  if (value === null || value === undefined) return '-'
  
  // Format numbers
  if (header.includes('price') || header.includes('quantity') || header.includes('value')) {
    return typeof value === 'number' ? value.toLocaleString() : value.toString()
  }
  
  // Format dates
  if (header.includes('date') && value instanceof Date) {
    return value.toLocaleDateString()
  }
  
  return value.toString()
}
</script>

<style scoped>
.csv-preview-container {
  @apply space-y-6;
}

.preview-header {
  @apply flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0;
}

.preview-title {
  @apply space-y-1;
}

.title {
  @apply text-lg font-semibold text-gray-900 dark:text-white;
}

.subtitle {
  @apply text-sm text-gray-500 dark:text-gray-400;
}

.preview-stats {
  @apply flex space-x-6;
}

.stat-item {
  @apply flex flex-col items-center space-y-1;
}

.stat-label {
  @apply text-xs text-gray-500 dark:text-gray-400;
}

.stat-value {
  @apply text-sm font-medium text-gray-900 dark:text-white;
}

.errors-section {
  @apply bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 space-y-3;
}

.errors-header {
  @apply flex items-center justify-between;
}

.errors-title {
  @apply text-sm font-medium text-red-800 dark:text-red-200;
}

.toggle-button {
  @apply text-xs text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-200;
}

.errors-list {
  @apply space-y-2 max-h-40 overflow-y-auto;
}

.error-item {
  @apply bg-white dark:bg-gray-800 rounded border border-red-200 dark:border-red-700 p-2;
}

.error-header {
  @apply flex items-center justify-between text-xs;
}

.error-location {
  @apply font-medium text-red-800 dark:text-red-200;
}

.error-value {
  @apply text-red-600 dark:text-red-400 font-mono;
}

.error-message {
  @apply text-xs text-red-700 dark:text-red-300 mt-1;
}

.data-section {
  @apply bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700;
}

.data-header {
  @apply flex flex-col sm:flex-row sm:items-center sm:justify-between p-4 border-b border-gray-200 dark:border-gray-700 space-y-3 sm:space-y-0;
}

.data-title {
  @apply text-sm font-medium text-gray-900 dark:text-white;
}

.data-controls {
  @apply flex items-center space-x-3;
}

.search-box {
  @apply relative;
}

.search-icon {
  @apply absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400;
}

.search-input {
  @apply pl-10 pr-3 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500;
}

.page-select {
  @apply text-sm border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500;
}

.table-container {
  @apply overflow-x-auto;
}

.data-table {
  @apply w-full;
}

.table-header {
  @apply px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider bg-gray-50 dark:bg-gray-700;
}

.table-row {
  @apply border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50;
}

.table-cell {
  @apply px-4 py-3 text-sm text-gray-900 dark:text-white;
}

.empty-cell {
  @apply text-gray-400 dark:text-gray-500 italic;
}

.pagination {
  @apply flex items-center justify-between px-4 py-3 border-t border-gray-200 dark:border-gray-700;
}

.pagination-button {
  @apply px-3 py-1 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed;
}

.pagination-info {
  @apply text-sm text-gray-700 dark:text-gray-300;
}

.actions-section {
  @apply flex items-center justify-end space-x-3;
}

.action-button {
  @apply px-4 py-2 text-sm font-medium rounded-md transition-colors duration-200;
}

.action-button.primary {
  @apply bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed;
}

.action-button.secondary {
  @apply bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white hover:bg-gray-300 dark:hover:bg-gray-600;
}
</style>
