<script setup lang="ts">
import { ref } from 'vue'
import { useApiService } from '@/core/services/api'

const props = defineProps<{
  modelValue?: any
}>()

const emit = defineEmits(['update:modelValue'])

const searchQuery = ref('')
const searchResults = ref<any[]>([])
const isLoading = ref(false)
const showResults = ref(false)
const apiService = useApiService()

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
      // Assuming there's a customer search endpoint
      // If not, we might need to fetch all and filter, or use a specific endpoint
      // For now, let's assume /customers/search or similar exists, or use /customers with filter
      const response = await apiService.get('/customers', { 
        params: { search: searchQuery.value, page: 0, size: 5 } 
      })
      if (response.data.success) {
        searchResults.value = response.data.data.content
        showResults.value = true
      }
    } catch (error) {
      console.error('Customer search failed', error)
    } finally {
      isLoading.value = false
    }
  }, 300)
}

const handleFocus = () => {
  if (searchResults.value.length > 0) {
    showResults.value = true
  }
}

const selectCustomer = (customer: any) => {
  emit('update:modelValue', customer)
  searchQuery.value = ''
  searchResults.value = []
  showResults.value = false
}

const clearSelection = () => {
  emit('update:modelValue', null)
}

// Close results when clicking outside
const closeResults = () => {
  setTimeout(() => {
    showResults.value = false
  }, 200)
}
</script>

<template>
  <div class="relative">
    <div v-if="modelValue" class="flex items-center justify-between p-2 border border-blue-300 bg-blue-50 rounded-md">
      <div class="flex items-center">
        <div class="h-8 w-8 rounded-full bg-blue-200 flex items-center justify-center text-blue-700 font-bold mr-2">
          {{ modelValue.name.charAt(0).toUpperCase() }}
        </div>
        <div>
          <div class="text-sm font-medium text-blue-900">{{ modelValue.name }}</div>
          <div class="text-xs text-blue-700">{{ modelValue.phone || modelValue.email }}</div>
        </div>
      </div>
      <button @click="clearSelection" class="touch-button min-w-[48px] min-h-[48px] text-blue-400 hover:text-blue-600 active:text-blue-700 active:bg-blue-50 focus:outline-none rounded-lg transition-all flex items-center justify-center">
        <i class="fas fa-times text-xl"></i>
      </button>
    </div>

    <div v-else class="relative">
      <div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
        <i class="fas fa-user text-gray-400 dark:text-gray-500 text-xl"></i>
      </div>
      <input
        type="text"
        v-model="searchQuery"
        class="touch-input block w-full pl-12 pr-4 border border-gray-200/50 dark:border-gray-600/50 rounded-xl leading-5 bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm placeholder-gray-500 dark:placeholder-gray-400 text-gray-900 dark:text-white focus:outline-none focus:placeholder-gray-400 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/30 text-lg font-medium transition duration-150 ease-in-out"
        placeholder="Search customer..."
        @input="handleSearch"
        @blur="closeResults"
        @focus="handleFocus"
      />
      <div v-if="isLoading" class="absolute inset-y-0 right-0 pr-3 flex items-center">
        <i class="fas fa-spinner fa-spin text-blue-500"></i>
      </div>

      <!-- Search Results Dropdown -->
      <div
        v-if="showResults && searchResults.length > 0"
        class="absolute z-10 mt-1 w-full bg-white shadow-lg max-h-60 rounded-md py-1 text-base ring-1 ring-black ring-opacity-5 overflow-auto focus:outline-none sm:text-sm"
      >
        <ul tabindex="-1" role="listbox">
          <li
            v-for="customer in searchResults"
            :key="customer.id"
            class="text-gray-900 cursor-default select-none relative py-4 px-4 hover:bg-blue-50 active:bg-blue-100 cursor-pointer touch-no-select border-b border-gray-100 last:border-b-0 transition-colors"
            @mousedown.prevent="selectCustomer(customer)"
            @touchstart.prevent="selectCustomer(customer)"
          >
            <div class="flex items-center">
              <div class="h-6 w-6 rounded-full bg-gray-200 flex items-center justify-center text-gray-600 text-xs font-bold mr-2">
                {{ customer.name.charAt(0).toUpperCase() }}
              </div>
              <div>
                <span class="font-medium block truncate">{{ customer.name }}</span>
                <span class="text-gray-500 text-xs">{{ customer.phone || customer.email }}</span>
              </div>
            </div>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>
