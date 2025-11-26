<script setup lang="ts">
import { ref, watch } from 'vue'
import { useApiService } from '@/core/services/api'
import { useNotificationStore } from '@/core/stores/notification'
import { usePosStore } from '../stores/posStore'

const emit = defineEmits(['product-selected'])

const searchQuery = ref('')
const searchResults = ref<any[]>([])
const isLoading = ref(false)
const showResults = ref(false)
const searchInput = ref<HTMLInputElement | null>(null)

const apiService = useApiService()
const posStore = usePosStore()
const notificationStore = useNotificationStore()

// Debounce search
let searchTimeout: number | undefined

const handleSearch = () => {
  if (searchTimeout) clearTimeout(searchTimeout)
  
  if (!searchQuery.value || searchQuery.value.length < 2) {
    searchResults.value = []
    showResults.value = false
    return
  }

  searchTimeout = window.setTimeout(async () => {
    isLoading.value = true
    try {
      const response = await apiService.get('/products/search', { 
        params: { searchTerm: searchQuery.value } 
      })
      if (response.data.success) {
        searchResults.value = response.data.data
        showResults.value = true
      }
    } catch (error) {
      console.error('Search failed', error)
    } finally {
      isLoading.value = false
    }
  }, 300)
}

const selectProduct = (product: any) => {
  emit('product-selected', product)
  searchQuery.value = ''
  searchResults.value = []
  showResults.value = false
  // Keep focus on input for rapid scanning
  searchInput.value?.focus()
}

const handleEnter = async () => {
  if (searchResults.value.length > 0) {
    // If results exist, select the first one
    selectProduct(searchResults.value[0])
  } else if (searchQuery.value) {
    // Try to find exact match (barcode) directly via store
    try {
      // We assume the parent component handles the actual addition to cart
      // But here we can try to fetch the product first to verify
      const response = await apiService.get(`/products/code/${searchQuery.value}`)
      if (response.data.success) {
        selectProduct(response.data.data)
      } else {
        // Try searching as barcode if product code fails
         const searchResp = await apiService.get('/products/search', { 
          params: { searchTerm: searchQuery.value } 
        })
        if (searchResp.data.success && searchResp.data.data.length === 1) {
          selectProduct(searchResp.data.data[0])
        } else {
           notificationStore.warning('Product not found', `No product found for "${searchQuery.value}"`)
        }
      }
    } catch (error) {
       // Try searching as barcode if product code fails
       try {
         const searchResp = await apiService.get('/products/search', { 
          params: { searchTerm: searchQuery.value } 
        })
        if (searchResp.data.success && searchResp.data.data.length > 0) {
          selectProduct(searchResp.data.data[0])
        } else {
           notificationStore.warning('Product not found', `No product found for "${searchQuery.value}"`)
        }
       } catch (e) {
         notificationStore.warning('Product not found', `No product found for "${searchQuery.value}"`)
       }
    }
  }
}

// Close results when clicking outside
const closeResults = (e: Event) => {
  // Simple check - in a real app use click-outside directive
  setTimeout(() => {
    showResults.value = false
  }, 200)
}
</script>

<template>
  <div class="relative w-full">
    <div class="relative">
      <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
        <i class="fas fa-search text-gray-400"></i>
      </div>
      <input
        ref="searchInput"
        v-model="searchQuery"
        type="text"
        class="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 sm:text-sm transition duration-150 ease-in-out"
        placeholder="Scan barcode or search product..."
        @input="handleSearch"
        @keydown.enter.prevent="handleEnter"
        @blur="closeResults"
        @focus="if(searchResults.length > 0) showResults = true"
      />
      <div v-if="isLoading" class="absolute inset-y-0 right-0 pr-3 flex items-center">
        <i class="fas fa-spinner fa-spin text-blue-500"></i>
      </div>
    </div>

    <!-- Search Results Dropdown -->
    <div
      v-if="showResults && searchResults.length > 0"
      class="absolute z-10 mt-1 w-full bg-white shadow-lg max-h-60 rounded-md py-1 text-base ring-1 ring-black ring-opacity-5 overflow-auto focus:outline-none sm:text-sm"
    >
      <ul tabindex="-1" role="listbox">
        <li
          v-for="product in searchResults"
          :key="product.id"
          class="text-gray-900 cursor-default select-none relative py-2 pl-3 pr-9 hover:bg-blue-50 cursor-pointer"
          @mousedown.prevent="selectProduct(product)"
        >
          <div class="flex justify-between items-center">
            <div>
              <span class="font-medium block truncate">{{ product.name }}</span>
              <span class="text-gray-500 text-xs">{{ product.productCode }} | {{ product.barcode || 'No Barcode' }}</span>
            </div>
            <div class="text-right">
              <span class="font-bold text-blue-600 block">{{ product.unitPrice?.toFixed(2) }}</span>
              <span 
                class="text-xs"
                :class="product.availableQuantity > 0 ? 'text-green-600' : 'text-red-600'"
              >
                {{ product.availableQuantity > 0 ? `${product.availableQuantity} in stock` : 'Out of stock' }}
              </span>
            </div>
          </div>
        </li>
      </ul>
    </div>
  </div>
</template>
