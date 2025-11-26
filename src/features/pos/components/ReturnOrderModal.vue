<template>
  <div v-if="isOpen" class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
    <div class="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] flex flex-col">
      <!-- Header -->
      <div class="flex items-center justify-between p-4 border-b">
        <h2 class="text-xl font-semibold text-gray-800">Process Return</h2>
        <button @click="close" class="text-gray-500 hover:text-gray-700">
          <i class="fas fa-times text-xl"></i>
        </button>
      </div>

      <!-- Content -->
      <div class="flex-1 overflow-y-auto p-6">
        <!-- Search Section -->
        <div class="mb-6">
          <label class="block text-sm font-medium text-gray-700 mb-2">Find Order</label>
          <div class="flex gap-2">
            <input 
              v-model="searchQuery" 
              type="text" 
              placeholder="Enter Order Number (e.g., S001-2023...)" 
              class="flex-1 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              @keyup.enter="searchOrder"
            />
            <button 
              @click="searchOrder"
              :disabled="isLoading || !searchQuery"
              class="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
            >
              <i class="fas fa-search mr-2"></i>
              Search
            </button>
          </div>
        </div>

        <!-- Order Details -->
        <div v-if="order" class="space-y-6">
          <div class="bg-gray-50 p-4 rounded-lg flex justify-between items-start">
            <div>
              <p class="font-semibold text-lg">{{ order.orderNo }}</p>
              <p class="text-sm text-gray-600">{{ formatDate(order.orderDate) }}</p>
              <p class="text-sm text-gray-600">Customer: {{ order.customer ? order.customer.firstName + ' ' + order.customer.lastName : 'Walk-in' }}</p>
            </div>
            <div class="text-right">
              <p class="font-bold text-lg">{{ formatCurrency(order.total) }}</p>
              <span 
                class="px-2 py-1 text-xs rounded-full"
                :class="{
                  'bg-green-100 text-green-800': order.status === 'COMPLETED',
                  'bg-red-100 text-red-800': order.status === 'RETURNED',
                  'bg-yellow-100 text-yellow-800': order.status === 'HELD'
                }"
              >
                {{ order.status }}
              </span>
            </div>
          </div>

          <!-- Items Selection -->
          <div>
            <h3 class="font-medium text-gray-900 mb-3">Select Items to Return</h3>
            <div class="border rounded-lg overflow-hidden">
              <table class="min-w-full divide-y divide-gray-200">
                <thead class="bg-gray-50">
                  <tr>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Product</th>
                    <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Price</th>
                    <th class="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">Purchased</th>
                    <th class="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">Return Qty</th>
                    <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Refund</th>
                  </tr>
                </thead>
                <tbody class="bg-white divide-y divide-gray-200">
                  <tr v-for="item in order.items" :key="item.id">
                    <td class="px-6 py-4">
                      <div class="text-sm font-medium text-gray-900">{{ item.product.name }}</div>
                      <div class="text-xs text-gray-500">{{ item.product.sku }}</div>
                    </td>
                    <td class="px-6 py-4 text-right text-sm text-gray-500">
                      {{ formatCurrency(item.unitPrice) }}
                    </td>
                    <td class="px-6 py-4 text-center text-sm text-gray-500">
                      {{ item.quantity }}
                    </td>
                    <td class="px-6 py-4 text-center">
                      <div class="flex items-center justify-center gap-2">
                        <button 
                          @click="decrementReturnQty(item)"
                          class="w-6 h-6 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-600"
                          :disabled="getReturnQty(item.id) <= 0"
                        >
                          -
                        </button>
                        <span class="w-8 text-center font-medium">{{ getReturnQty(item.id) }}</span>
                        <button 
                          @click="incrementReturnQty(item)"
                          class="w-6 h-6 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-600"
                          :disabled="getReturnQty(item.id) >= item.quantity"
                        >
                          +
                        </button>
                      </div>
                    </td>
                    <td class="px-6 py-4 text-right text-sm font-medium text-gray-900">
                      {{ formatCurrency(calculateItemRefund(item)) }}
                    </td>
                  </tr>
                </tbody>
                <tfoot class="bg-gray-50">
                  <tr>
                    <td colspan="4" class="px-6 py-4 text-right font-bold text-gray-900">Total Refund:</td>
                    <td class="px-6 py-4 text-right font-bold text-blue-600 text-lg">
                      {{ formatCurrency(totalRefundAmount) }}
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>

          <!-- Return Reason -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Return Reason</label>
            <textarea 
              v-model="returnReason"
              rows="3"
              class="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              placeholder="Why is the customer returning these items?"
            ></textarea>
          </div>
        </div>

        <!-- Empty State -->
        <div v-else-if="hasSearched" class="text-center py-12 text-gray-500">
          <i class="fas fa-search text-4xl mb-4 text-gray-300"></i>
          <p>No order found with number "{{ searchQuery }}"</p>
        </div>
      </div>

      <!-- Footer -->
      <div class="p-4 border-t bg-gray-50 flex justify-end gap-3">
        <button 
          @click="close"
          class="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-100 text-gray-700 font-medium"
        >
          Cancel
        </button>
        <button 
          @click="submitReturn"
          :disabled="isLoading || !canSubmit"
          class="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 font-medium flex items-center"
        >
          <i v-if="isLoading" class="fas fa-spinner fa-spin mr-2"></i>
          Process Return
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, reactive } from 'vue'
import { usePosStore } from '../stores/posStore'
import { useApiService } from '@/core/services/api'
import { useAuthStore } from '@/core/stores/auth'
import type { SalesOrder, SalesOrderItem } from '../types'

const props = defineProps<{
  isOpen: boolean
}>()

const emit = defineEmits(['close', 'return-processed'])

const posStore = usePosStore()
const apiService = useApiService()
const authStore = useAuthStore()

const searchQuery = ref('')
const order = ref<SalesOrder | null>(null)
const isLoading = ref(false)
const hasSearched = ref(false)
const returnReason = ref('')
const returnQuantities = reactive<Record<number, number>>({})

const close = () => {
  searchQuery.value = ''
  order.value = null
  hasSearched.value = false
  returnReason.value = ''
  Object.keys(returnQuantities).forEach(key => delete returnQuantities[Number(key)])
  emit('close')
}

const searchOrder = async () => {
  if (!searchQuery.value) return
  
  isLoading.value = true
  hasSearched.value = true
  order.value = null
  
  try {
    const response = await apiService.get(`/pos/orders/search?query=${searchQuery.value}`)
    if (response.data.success) {
      order.value = response.data.data
      if (order.value) {
        order.value.items.forEach(item => {
          returnQuantities[item.id] = 0
        })
      }
    }
  } catch (error) {
    order.value = null
  } finally {
    isLoading.value = false
  }
}

const getReturnQty = (itemId: number) => returnQuantities[itemId] || 0

const incrementReturnQty = (item: SalesOrderItem) => {
  const current = getReturnQty(item.id)
  if (current < item.quantity) {
    returnQuantities[item.id] = current + 1
  }
}

const decrementReturnQty = (item: SalesOrderItem) => {
  const current = getReturnQty(item.id)
  if (current > 0) {
    returnQuantities[item.id] = current - 1
  }
}

const calculateItemRefund = (item: SalesOrderItem) => {
  const qty = getReturnQty(item.id)
  const unitTax = item.taxAmount / item.quantity
  return (item.unitPrice * qty) + (unitTax * qty)
}

const totalRefundAmount = computed(() => {
  if (!order.value) return 0
  return order.value.items.reduce((total, item) => {
    return total + calculateItemRefund(item)
  }, 0)
})

const canSubmit = computed(() => {
  return totalRefundAmount.value > 0 && returnReason.value.trim().length > 0
})

const submitReturn = async () => {
  if (!order.value || !canSubmit.value) return

  const itemsToReturn = order.value.items
    .filter(item => getReturnQty(item.id) > 0)
    .map(item => ({
      productId: item.product.id,
      quantity: getReturnQty(item.id)
    }))

  const returnRequest = {
    originalOrderId: order.value.id,
    storeId: order.value.store.id,
    cashierId: Number(authStore.currentUser?.id) || 1,
    items: itemsToReturn,
    reason: returnReason.value
  }

  try {
    await posStore.processReturn(returnRequest)
    emit('return-processed')
    close()
  } catch (error) {
    // Error handled in store
  }
}

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
  }).format(value)
}

const formatDate = (dateStr: string) => {
  return new Date(dateStr).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}
</script>
