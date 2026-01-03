<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { productsApiService } from '@/core/services/productsApi'
import type { Product } from '@/core/types/inventory'
import { useNotificationStore } from '@/core/stores/notification'

const emit = defineEmits<{
  (e: 'product-selected', product: Product): void
}>()

const notificationStore = useNotificationStore()
const products = ref<Product[]>([])
const isLoading = ref(false)
const searchQuery = ref('')

const filteredProducts = computed(() => {
  if (!searchQuery.value) return products.value
  
  const query = searchQuery.value.toLowerCase()
  return products.value.filter(p => 
    p.name.toLowerCase().includes(query) || 
    p.productCode.toLowerCase().includes(query) ||
    (p.barcode && p.barcode.includes(query))
  )
})

const loadProducts = async () => {
  isLoading.value = true
  try {
    const response = await productsApiService.getAllProducts({ 
      page: 0, 
      size: 100, // Fetch first 100 active products
      sort: 'name,asc'
    })
    
    if (response.success && response.data) {
      // Filter for active products only if the API doesn't do it automatically
      // But usually the API should handle filtering if params are passed. 
      // The current API might return a Page object or List. Let's assume response.data.content if page, or response.data if list.
      // Based on typical Spring Data REST similar responses seen in this codebase.
      // Checking productsApi.ts again would confirm, but let's handle both.
      
      const data = response.data as any
      if (Array.isArray(data)) {
        products.value = data.filter(p => p.isActive)
      } else if (data.content && Array.isArray(data.content)) {
        products.value = data.content.filter((p: Product) => p.isActive)
      }
    }
  } catch (error: any) {
    console.error('Failed to load products:', error)
    notificationStore.error('Error', 'Failed to load products')
  } finally {
    isLoading.value = false
  }
}

const handleProductClick = (product: Product) => {
  emit('product-selected', product)
}

onMounted(() => {
  loadProducts()
})

// Expose filter method if parent wants to filter
defineExpose({
  filter: (query: string) => {
    searchQuery.value = query
  }
})
</script>

<template>
  <div class="h-full flex flex-col">
    <!-- Loading State -->
    <div v-if="isLoading" class="flex-1 flex items-center justify-center">
      <div class="flex flex-col items-center space-y-3">
        <div class="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-500"></div>
        <p class="text-gray-500">Loading products...</p>
      </div>
    </div>

    <!-- Empty State -->
    <div v-else-if="filteredProducts.length === 0" class="flex-1 flex items-center justify-center text-gray-400">
      <div class="text-center">
        <i class="fas fa-box-open text-4xl mb-2"></i>
        <p>No products found</p>
      </div>
    </div>

    <!-- Product Grid -->
    <div v-else class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 overflow-y-auto pr-1 pb-1 content-start">
      <button
        v-for="product in filteredProducts"
        :key="product.id"
        class="group relative flex flex-col items-start p-3 bg-white dark:bg-slate-800 rounded-xl border border-gray-200 dark:border-slate-700 shadow-sm hover:shadow-md hover:border-blue-500 dark:hover:border-blue-400 transition-all duration-200 text-left w-full h-full min-h-[100px]"
        @click="handleProductClick(product)"
      >
        <!-- Price Badge -->
        <div class="absolute top-2 right-2 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 text-xs font-bold px-2 py-1 rounded-md">
          ${{ product.unitPrice.toFixed(2) }}
        </div>
        
        <!-- Icon/Image Placeholder -->
        <div class="mb-2 w-8 h-8 rounded-lg bg-gray-100 dark:bg-slate-700 flex items-center justify-center text-gray-500 dark:text-gray-400 group-hover:bg-blue-50 dark:group-hover:bg-blue-900/20 group-hover:text-blue-500 transition-colors">
          <i class="fas fa-box"></i>
        </div>

        <!-- content -->
        <div class="w-full">
          <h3 class="font-semibold text-gray-900 dark:text-white leading-tight mb-1 line-clamp-2">{{ product.name }}</h3>
          <p class="text-xs text-gray-500 dark:text-gray-400 truncate">SKU: {{ product.productCode }}</p>
          <div v-if="product.unitOfMeasure" class="mt-1 text-xs text-gray-400">
            {{ product.unitOfMeasure }}
          </div>
        </div>
      </button>
    </div>
  </div>
</template>

<style scoped>
/* Custom scrollbar for grid container */
.grid::-webkit-scrollbar {
  width: 6px;
}
.grid::-webkit-scrollbar-track {
  background: transparent;
}
.grid::-webkit-scrollbar-thumb {
  background-color: rgba(156, 163, 175, 0.3);
  border-radius: 3px;
}
.grid::-webkit-scrollbar-thumb:hover {
  background-color: rgba(156, 163, 175, 0.5);
}
</style>
