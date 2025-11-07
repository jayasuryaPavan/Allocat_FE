<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="md:flex md:items-center md:justify-between">
      <div class="flex-1 min-w-0">
        <h2 class="text-2xl font-bold leading-7 text-gray-900 dark:text-white sm:text-3xl sm:truncate">
          Products
        </h2>
        <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Manage your product catalog and inventory.
        </p>
      </div>
      <div class="mt-4 flex space-x-2 md:ml-4 md:mt-0">
        <button
          @click="fetchProducts"
          class="inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600"
        >
          <svg class="-ml-1 mr-2 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          Refresh
        </button>
      </div>
    </div>

    <!-- Search and Filters -->
    <div class="bg-white dark:bg-gray-800 shadow rounded-lg p-4">
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <input
          v-model="searchTerm"
          @input="debouncedSearch"
          type="text"
          placeholder="Search products..."
          class="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 dark:text-white"
        />
        <select
          v-model="selectedCategory"
          @change="fetchProducts"
          class="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 dark:text-white"
        >
          <option value="">All Categories</option>
          <option v-for="cat in categories" :key="cat" :value="cat">{{ cat }}</option>
        </select>
        <div class="flex items-center space-x-2">
          <span class="text-sm text-gray-600 dark:text-gray-400">Show:</span>
          <select
            v-model="pageSize"
            @change="fetchProducts"
            class="pl-[0.75rem] pr-[1.75rem] py-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 dark:text-white"
          >
            <option :value="10">10</option>
            <option :value="25">25</option>
            <option :value="50">50</option>
            <option :value="100">100</option>
          </select>
        </div>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="text-center py-12">
      <svg class="animate-spin h-8 w-8 text-blue-600 mx-auto" fill="none" viewBox="0 0 24 24">
        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
      </svg>
      <p class="mt-2 text-sm text-gray-500 dark:text-gray-400">Loading products...</p>
    </div>

    <!-- Products Table -->
    <div v-else class="bg-white dark:bg-gray-800 shadow rounded-lg overflow-hidden">
      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead class="bg-gray-50 dark:bg-gray-700">
            <tr>
              <th 
                @click="handleSort('productCode')"
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600"
              >
                Code
                <span v-if="sortBy === 'productCode'" class="ml-1">{{ sortDirection === 'asc' ? '↑' : '↓' }}</span>
              </th>
              <th 
                @click="handleSort('name')"
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600"
              >
                Name
                <span v-if="sortBy === 'name'" class="ml-1">{{ sortDirection === 'asc' ? '↑' : '↓' }}</span>
              </th>
              <th 
                @click="handleSort('category')"
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600"
              >
                Category
                <span v-if="sortBy === 'category'" class="ml-1">{{ sortDirection === 'asc' ? '↑' : '↓' }}</span>
              </th>
              <th 
                @click="handleSort('unitPrice')"
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600"
              >
                Price
                <span v-if="sortBy === 'unitPrice'" class="ml-1">{{ sortDirection === 'asc' ? '↑' : '↓' }}</span>
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Status
              </th>
            </tr>
          </thead>
          <tbody class="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
            <tr v-if="products.length === 0">
              <td colspan="5" class="px-6 py-12 text-center text-sm text-gray-500 dark:text-gray-400">
                No products found. Try adjusting your search or filters.
              </td>
            </tr>
            <tr v-for="product in products" :key="product.id" class="hover:bg-gray-50 dark:hover:bg-gray-700">
              <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                {{ product.productCode }}
              </td>
              <td class="px-6 py-4 text-sm text-gray-900 dark:text-white">
                <div class="font-medium">{{ product.name }}</div>
                <div v-if="product.description" class="text-gray-500 dark:text-gray-400 text-xs truncate max-w-xs">
                  {{ product.description }}
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                {{ product.category || '-' }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                ${{ product.unitPrice?.toFixed(2) || '0.00' }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span 
                  :class="product.isActive ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'"
                  class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full"
                >
                  {{ product.isActive ? 'Active' : 'Inactive' }}
                </span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Pagination -->
      <div v-if="totalPages > 1" class="bg-white dark:bg-gray-800 px-4 py-3 border-t border-gray-200 dark:border-gray-700 sm:px-6">
        <div class="flex items-center justify-between">
          <div class="text-sm text-gray-700 dark:text-gray-300">
            Showing <span class="font-medium">{{ (currentPage * pageSize) + 1 }}</span> to 
            <span class="font-medium">{{ Math.min((currentPage + 1) * pageSize, totalProducts) }}</span> of 
            <span class="font-medium">{{ totalProducts }}</span> products
          </div>
          <div class="flex space-x-2">
            <button
              @click="goToPage(currentPage - 1)"
              :disabled="currentPage === 0"
              :class="currentPage === 0 ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-50 dark:hover:bg-gray-700'"
              class="px-3 py-1 border border-gray-300 dark:border-gray-600 rounded-md text-sm text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-800"
            >
              Previous
            </button>
            <button
              @click="goToPage(currentPage + 1)"
              :disabled="currentPage >= totalPages - 1"
              :class="currentPage >= totalPages - 1 ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-50 dark:hover:bg-gray-700'"
              class="px-3 py-1 border border-gray-300 dark:border-gray-600 rounded-md text-sm text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-800"
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { InventoryApiService } from '@/core/services/inventoryApi'
import type { Product } from '@/core/types/inventory'

// State
const products = ref<Product[]>([])
const categories = ref<string[]>([])
const loading = ref(false)
const searchTerm = ref('')
const selectedCategory = ref('')
const currentPage = ref(0)
const pageSize = ref(25)
const totalProducts = ref(0)
const totalPages = ref(0)
const sortBy = ref('name')
const sortDirection = ref<'asc' | 'desc'>('asc')

// Debounce timer
let searchTimeout: NodeJS.Timeout

// Fetch products
const fetchProducts = async () => {
  loading.value = true
  try {
    const response = await InventoryApiService.getAllProducts({
      page: currentPage.value,
      size: pageSize.value,
      search: searchTerm.value || undefined,
      category: selectedCategory.value || undefined,
      sortBy: sortBy.value,
      sortDirection: sortDirection.value
    })
    
    console.log('Products API response:', response)
    
    if (response && response.success && response.data) {
      const pageData = response.data as any
      products.value = Array.isArray(pageData.content) ? pageData.content : []
      totalProducts.value = pageData.totalElements || products.value.length
      totalPages.value = pageData.totalPages || 1
    } else {
      products.value = []
      totalProducts.value = 0
      totalPages.value = 0
    }
  } catch (error: any) {
    console.error('Failed to fetch products:', error)
    console.error('Error details:', error.response?.data)
    products.value = []
    totalProducts.value = 0
    totalPages.value = 0
  } finally {
    loading.value = false
  }
}

// Handle column sorting
const handleSort = (field: string) => {
  if (sortBy.value === field) {
    sortDirection.value = sortDirection.value === 'asc' ? 'desc' : 'asc'
  } else {
    sortBy.value = field
    sortDirection.value = 'asc'
  }
  currentPage.value = 0
  fetchProducts()
}

// Fetch categories
const fetchCategories = async () => {
  try {
    const response = await InventoryApiService.getCategories()
    if (response.success && response.data) {
      categories.value = response.data
    }
  } catch (error) {
    console.error('Failed to fetch categories:', error)
  }
}

// Debounced search
const debouncedSearch = () => {
  clearTimeout(searchTimeout)
  searchTimeout = setTimeout(() => {
    currentPage.value = 0
    fetchProducts()
  }, 500)
}

// Pagination
const goToPage = (page: number) => {
  currentPage.value = page
  fetchProducts()
}

// Lifecycle
onMounted(async () => {
  await Promise.all([
    fetchProducts(),
    fetchCategories()
  ])
})
</script>