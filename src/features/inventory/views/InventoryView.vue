<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="md:flex md:items-center md:justify-between">
      <div class="flex-1 min-w-0">
        <h2 class="text-2xl font-bold leading-7 text-gray-900 dark:text-white sm:text-3xl sm:truncate">
          Inventory Management
        </h2>
        <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Track and manage your inventory levels. Import data from CSV files.
        </p>
      </div>
      <div class="mt-4 flex md:ml-4 md:mt-0">
        <button
          @click="showImportModal = true"
          class="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          <svg class="-ml-1 mr-2 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
          </svg>
          Import CSV
        </button>
      </div>
    </div>

    <!-- Inventory Stats -->
    <div class="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
      <div class="bg-white dark:bg-gray-800 overflow-hidden shadow rounded-lg">
        <div class="p-5">
          <div class="flex items-center">
            <div class="flex-shrink-0">
              <svg class="h-6 w-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
              </svg>
            </div>
            <div class="ml-5 w-0 flex-1">
              <dl>
                <dt class="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">Total Items</dt>
                <dd class="text-lg font-medium text-gray-900 dark:text-white">{{ inventoryStats.totalItems }}</dd>
              </dl>
            </div>
          </div>
        </div>
      </div>

      <div class="bg-white dark:bg-gray-800 overflow-hidden shadow rounded-lg">
        <div class="p-5">
          <div class="flex items-center">
            <div class="flex-shrink-0">
              <svg class="h-6 w-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div class="ml-5 w-0 flex-1">
              <dl>
                <dt class="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">In Stock</dt>
                <dd class="text-lg font-medium text-gray-900 dark:text-white">{{ inventoryStats.inStock }}</dd>
              </dl>
            </div>
          </div>
        </div>
      </div>

      <div class="bg-white dark:bg-gray-800 overflow-hidden shadow rounded-lg">
        <div class="p-5">
          <div class="flex items-center">
            <div class="flex-shrink-0">
              <svg class="h-6 w-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
            <div class="ml-5 w-0 flex-1">
              <dl>
                <dt class="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">Low Stock</dt>
                <dd class="text-lg font-medium text-gray-900 dark:text-white">{{ inventoryStats.lowStock }}</dd>
              </dl>
            </div>
          </div>
        </div>
      </div>

      <div class="bg-white dark:bg-gray-800 overflow-hidden shadow rounded-lg">
        <div class="p-5">
          <div class="flex items-center">
            <div class="flex-shrink-0">
              <svg class="h-6 w-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div class="ml-5 w-0 flex-1">
              <dl>
                <dt class="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">Out of Stock</dt>
                <dd class="text-lg font-medium text-gray-900 dark:text-white">{{ inventoryStats.outOfStock }}</dd>
              </dl>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Inventory Table -->
    <div class="bg-white dark:bg-gray-800 shadow rounded-lg">
      <div class="px-4 py-5 sm:p-6">
        <div class="flex items-center justify-between mb-4">
          <h3 class="text-lg font-medium text-gray-900 dark:text-white">Inventory Items</h3>
          <div class="flex items-center space-x-3">
            <div class="relative">
              <input
                v-model="searchTerm"
                type="text"
                placeholder="Search inventory..."
                class="block w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md leading-5 bg-white dark:bg-gray-700 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              />
              <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg class="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        <div v-if="filteredInventory.length === 0" class="text-center py-12">
          <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
          </svg>
          <h3 class="mt-2 text-sm font-medium text-gray-900 dark:text-white">No inventory items</h3>
          <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Get started by importing your inventory data from a CSV file.
          </p>
          <div class="mt-6">
            <button
              @click="showImportModal = true"
              class="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <svg class="-ml-1 mr-2 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
              </svg>
              Import CSV
            </button>
          </div>
        </div>

        <div v-else class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead class="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Item
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  SKU
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Category
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Quantity
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Unit Price
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Total Value
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Status
                </th>
              </tr>
            </thead>
            <tbody class="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              <tr v-for="item in paginatedInventory" :key="item.id" class="hover:bg-gray-50 dark:hover:bg-gray-700">
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="text-sm font-medium text-gray-900 dark:text-white">{{ item.product?.name || 'N/A' }}</div>
                  <div v-if="item.product?.description" class="text-sm text-gray-500 dark:text-gray-400">{{ item.product.description }}</div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                  {{ item.product?.sku || item.product?.productCode || 'N/A' }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                  {{ item.product?.category || 'N/A' }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                  {{ item.currentQuantity.toLocaleString() }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                  ${{ item.unitCost.toFixed(2) }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                  ${{ item.totalValue.toFixed(2) }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <span 
                    class="inline-flex px-2 py-1 text-xs font-semibold rounded-full"
                    :class="getStatusClass(item)"
                  >
                    {{ getStatusText(item) }}
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Pagination -->
        <div v-if="totalPages > 1" class="mt-4 flex items-center justify-between">
          <div class="text-sm text-gray-700 dark:text-gray-300">
            Showing {{ (currentPage - 1) * itemsPerPage + 1 }} to {{ Math.min(currentPage * itemsPerPage, filteredInventory.length) }} of {{ filteredInventory.length }} results
          </div>
          <div class="flex space-x-2">
            <button
              @click="currentPage = Math.max(1, currentPage - 1)"
              :disabled="currentPage === 1"
              class="px-3 py-1 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>
            <button
              @click="currentPage = Math.min(totalPages, currentPage + 1)"
              :disabled="currentPage === totalPages"
              class="px-3 py-1 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Tabs for different views -->
    <div class="tabs-container">
      <div class="tabs-header">
        <button
          @click="activeTab = 'inventory'"
          :class="['tab-button', { 'active': activeTab === 'inventory' }]"
        >
          Current Inventory
        </button>
        <button
          @click="activeTab = 'received'"
          :class="['tab-button', { 'active': activeTab === 'received' }]"
        >
          Received Stock
        </button>
        <button
          @click="activeTab = 'discrepancies'"
          :class="['tab-button', { 'active': activeTab === 'discrepancies' }]"
        >
          Discrepancies
        </button>
      </div>

      <!-- Current Inventory Tab -->
      <div v-if="activeTab === 'inventory'" class="tab-content">
        <!-- Inventory content remains the same -->
      </div>

      <!-- Received Stock Tab -->
      <div v-if="activeTab === 'received'" class="tab-content">
        <ReceivedStockManager
          @stock-verified="handleStockVerified"
          @stock-rejected="handleStockRejected"
        />
      </div>

      <!-- Discrepancies Tab -->
      <div v-if="activeTab === 'discrepancies'" class="tab-content">
        <StockDiscrepanciesManager />
      </div>
    </div>

    <!-- Import Modal -->
    <div v-if="showImportModal" class="fixed inset-0 z-50 overflow-y-auto">
      <div class="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div class="fixed inset-0 transition-opacity" @click="showImportModal = false">
          <div class="absolute inset-0 bg-gray-500 opacity-75"></div>
        </div>

        <div class="inline-block align-bottom bg-white dark:bg-gray-800 rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-4xl sm:w-full">
          <div class="bg-white dark:bg-gray-800 px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <div class="sm:flex sm:items-start">
              <div class="w-full">
                <div class="flex items-center justify-between mb-4">
                  <h3 class="text-lg font-medium text-gray-900 dark:text-white">Import Inventory from CSV</h3>
                  <button
                    @click="showImportModal = false"
                    class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                  >
                    <svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>

                <!-- Upload Component -->
                <CSVUpload
                  v-if="!showPreview"
                  @upload-success="handleUploadSuccess"
                  @upload-error="handleUploadError"
                  @file-selected="handleFileSelected"
                />

                <!-- Preview Component -->
                <CSVDataPreview
                  v-if="showPreview && csvData"
                  :data="csvData"
                  @import="handleImport"
                  @cancel="handleCancelImport"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import CSVUpload from '../../../components/CSVUpload.vue'
import CSVDataPreview from '../../../components/CSVDataPreview.vue'
import ReceivedStockManager from '../../../components/ReceivedStockManager.vue'
import StockDiscrepanciesManager from '../../../components/StockDiscrepanciesManager.vue'
import { InventoryApiService } from '../../../core/services/inventoryApi'
import type { 
  InventoryItem, 
  CSVInventoryData, 
  Inventory, 
  ReceivedStock, 
  StockDiscrepancy,
  ReceivedStockUploadData
} from '../../../core/types/inventory'

// Reactive state
const showImportModal = ref(false)
const showPreview = ref(false)
const csvData = ref<CSVInventoryData | null>(null)
const inventoryItems = ref<Inventory[]>([])
const searchTerm = ref('')
const currentPage = ref(1)
const itemsPerPage = ref(10)
const activeTab = ref('inventory')
const loading = ref(false)
const error = ref('')

// Computed properties
const filteredInventory = computed(() => {
  if (!searchTerm.value) return inventoryItems.value
  
  const term = searchTerm.value.toLowerCase()
  return inventoryItems.value.filter(item => 
    item.product?.name.toLowerCase().includes(term) ||
    item.product?.productCode.toLowerCase().includes(term) ||
    item.product?.category.toLowerCase().includes(term) ||
    item.location?.toLowerCase().includes(term)
  )
})

const paginatedInventory = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage.value
  const end = start + itemsPerPage.value
  return filteredInventory.value.slice(start, end)
})

const totalPages = computed(() => {
  return Math.ceil(filteredInventory.value.length / itemsPerPage.value)
})

const inventoryStats = computed(() => {
  const total = inventoryItems.value.length
  const inStock = inventoryItems.value.filter(item => item.currentQuantity > 0).length
  const lowStock = inventoryItems.value.filter(item => 
    item.product?.minimumStockLevel && item.currentQuantity <= item.product.minimumStockLevel
  ).length
  const outOfStock = inventoryItems.value.filter(item => item.currentQuantity === 0).length

  return { totalItems: total, inStock, lowStock, outOfStock }
})

// Methods
const handleFileSelected = (file: File) => {
  console.log('File selected:', file.name)
}

const handleUploadSuccess = (data: CSVInventoryData) => {
  csvData.value = data
  showPreview.value = true
}

const handleUploadError = (error: string) => {
  console.error('Upload error:', error)
  // Error is already handled by the CSVUpload component
}

const handleImport = async (data: any[]) => {
  try {
    // Convert CSV data to JSON format for the new API
    const jsonData: ReceivedStockUploadData[] = data.map(row => ({
      productCode: row.product_code || row.productCode,
      productName: row.product_name || row.productName,
      expectedQuantity: parseFloat(row.expected_quantity || row.expectedQuantity),
      unitPrice: parseFloat(row.unit_price || row.unitPrice),
      supplierName: row.supplier_name || row.supplierName,
      supplierInvoice: row.supplier_invoice || row.supplierInvoice,
      batchNumber: row.batch_number || row.batchNumber,
      notes: row.notes
    }))

    console.log('Converting to JSON format:', jsonData);
    
    // Upload using the new JSON API endpoint
    const response = await InventoryApiService.uploadReceivedStockJson(jsonData)
    
    if (response.success) {
      // Close modal and reset state
      showImportModal.value = false
      showPreview.value = false
      csvData.value = null
      
      // Switch to received stock tab to show the uploaded items
      activeTab.value = 'received'
      
      // Reload inventory data
      await loadInventory()
      
      console.log(`Successfully uploaded ${response.data.length} items to received stock`)
    } else {
      console.error('Failed to upload JSON data:', response.message)
    }
  } catch (err) {
    console.error('Error importing data:', err)
  }
}

const loadInventory = async () => {
  loading.value = true
  error.value = ''
  
  try {
    const response = await InventoryApiService.getCurrentInventory()
    if (response.success) {
      inventoryItems.value = response.data
    } else {
      error.value = response.message || 'Failed to load inventory'
    }
  } catch (err) {
    error.value = 'Failed to load inventory'
    console.error('Error loading inventory:', err)
  } finally {
    loading.value = false
  }
}

const handleStockVerified = (stock: ReceivedStock) => {
  console.log('Stock verified:', stock)
  // Reload inventory to show updated quantities
  loadInventory()
}

const handleStockRejected = (stock: ReceivedStock) => {
  console.log('Stock rejected:', stock)
}

const handleCancelImport = () => {
  showPreview.value = false
  csvData.value = null
}

const getStatusClass = (item: Inventory) => {
  if (item.currentQuantity === 0) {
    return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300'
  } else if (item.product?.minimumStockLevel && item.currentQuantity <= item.product.minimumStockLevel) {
    return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-300'
  } else {
    return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300'
  }
}

const getStatusText = (item: Inventory) => {
  if (item.currentQuantity === 0) {
    return 'Out of Stock'
  } else if (item.product?.minimumStockLevel && item.currentQuantity <= item.product.minimumStockLevel) {
    return 'Low Stock'
  } else {
    return 'In Stock'
  }
}

// Load data on mount
onMounted(() => {
  loadInventory()
})
</script>

<style scoped>
.tabs-container {
  @apply space-y-4;
}

.tabs-header {
  @apply flex space-x-1 bg-gray-100 dark:bg-gray-800 p-1 rounded-lg;
}

.tab-button {
  @apply flex-1 px-4 py-2 text-sm font-medium text-gray-600 dark:text-gray-400 rounded-md transition-colors duration-200;
}

.tab-button.active {
  @apply bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm;
}

.tab-button:hover:not(.active) {
  @apply text-gray-900 dark:text-white;
}

.tab-content {
  @apply space-y-6;
}
</style>

