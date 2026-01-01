<template>
  <Teleport to="body">
    <div v-if="isOpen" class="fixed inset-0 z-50 flex items-center justify-center p-4">
      <!-- Overlay - click to close -->
      <div 
        class="absolute inset-0 bg-gray-500/40 dark:bg-gray-900/60 backdrop-blur-sm"
        @click="close"
      ></div>
      
      <!-- Modal -->
      <div class="relative chat-glass rounded-2xl shadow-glass shadow-glass-glow w-full max-w-md flex flex-col overflow-hidden">
        <!-- Header -->
        <div class="flex items-center justify-between p-4 border-b border-gray-200/50 dark:border-gray-700/50">
          <h2 class="text-xl font-bold text-primary-600">Process Return</h2>
          <button 
            @click="close"
            class="w-10 h-10 flex items-center justify-center rounded-lg text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100/50 dark:hover:bg-gray-800/50 transition-all"
          >
            <i class="fas fa-times text-xl"></i>
          </button>
        </div>

        <!-- Content -->
        <div class="p-4">
          <!-- Search Section with Keypad -->
          <div v-if="!order" class="space-y-3">
            
            <!-- Order Number Display -->
            <div class="text-2xl font-bold text-gray-900 dark:text-white bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm border border-gray-200/50 dark:border-gray-600/50 rounded-xl px-4 py-3 text-center min-h-[52px] flex items-center justify-center">
              {{ searchQuery || 'Enter Order Number' }}
            </div>
            
            <!-- Alphanumeric Keypad - Compact -->
            <div class="grid grid-cols-3 gap-1.5">
              <button v-for="n in ['1','2','3','4','5','6','7','8','9']" :key="n" @click="appendToSearch(n)" class="keypad-btn-sm">{{ n }}</button>
              <button @click="appendToSearch('S')" class="keypad-btn-sm text-primary-600 font-bold">S</button>
              <button @click="appendToSearch('0')" class="keypad-btn-sm">0</button>
              <button @click="appendToSearch('-')" class="keypad-btn-sm">-</button>
            </div>
            
            <!-- Action Buttons Row -->
            <div class="grid grid-cols-3 gap-1.5">
              <button @click="clearSearch" class="keypad-btn-sm keypad-btn-danger">Clear</button>
              <button @click="backspaceSearch" class="keypad-btn-sm keypad-btn-warning" style="color: #ea580c !important;">Del</button>
              <button 
                @click="searchOrder"
                :disabled="isLoading || !searchQuery"
                class="keypad-btn-sm keypad-btn-primary"
              >
                <i v-if="isLoading" class="fas fa-spinner fa-spin mr-1"></i>
                <span class="text-sm">Find</span>
              </button>
            </div>
            
            <!-- Empty State after search -->
            <div v-if="hasSearched && !order" class="text-center py-4 text-gray-500 dark:text-gray-400">
              <i class="fas fa-exclamation-circle text-2xl mb-2 text-orange-400"></i>
              <p class="text-sm">No order found: "{{ lastSearchQuery }}"</p>
            </div>
          </div>

          <!-- Order Details -->
          <div v-if="order" class="space-y-6">
            <div class="bg-gray-100/50 dark:bg-gray-800/50 p-4 rounded-xl flex justify-between items-start">
              <div>
                <p class="font-semibold text-lg text-gray-900 dark:text-white">{{ order.orderNo }}</p>
                <p class="text-sm text-gray-600 dark:text-gray-400">{{ formatDate(order.orderDate) }}</p>
                <p class="text-sm text-gray-600 dark:text-gray-400">Customer: {{ order.customer ? order.customer.firstName + ' ' + order.customer.lastName : 'Walk-in' }}</p>
              </div>
              <div class="text-right">
                <p class="font-bold text-lg text-gray-900 dark:text-white">{{ formatCurrency(order.total) }}</p>
                <span 
                  class="px-2 py-1 text-xs rounded-full"
                  :class="{
                    'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400': order.status === 'COMPLETED',
                    'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400': order.status === 'RETURNED',
                    'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400': order.status === 'HELD'
                  }"
                >
                  {{ order.status }}
                </span>
              </div>
            </div>

            <!-- Items Selection -->
            <div>
              <h3 class="font-medium text-gray-900 dark:text-white mb-3">Select Items to Return</h3>
              <div class="border border-gray-200/50 dark:border-gray-700/50 rounded-xl overflow-hidden">
                <table class="min-w-full divide-y divide-gray-200/50 dark:divide-gray-700/50">
                  <thead class="bg-gray-100/50 dark:bg-gray-800/50">
                    <tr>
                      <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Product</th>
                      <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Price</th>
                      <th class="px-6 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Purchased</th>
                      <th class="px-6 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Return Qty</th>
                      <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Refund</th>
                    </tr>
                  </thead>
                  <tbody class="divide-y divide-gray-200/50 dark:divide-gray-700/50">
                    <tr v-for="item in order.items" :key="item.id" class="bg-white/50 dark:bg-gray-800/30">
                      <td class="px-6 py-4">
                        <div class="text-sm font-medium text-gray-900 dark:text-white">{{ item.product.name }}</div>
                        <div class="text-xs text-gray-500 dark:text-gray-400">{{ item.product.sku }}</div>
                      </td>
                      <td class="px-6 py-4 text-right text-sm text-gray-600 dark:text-gray-300">
                        {{ formatCurrency(item.unitPrice) }}
                      </td>
                      <td class="px-6 py-4 text-center text-sm text-gray-600 dark:text-gray-300">
                        {{ item.quantity }}
                      </td>
                      <td class="px-6 py-4 text-center">
                        <div class="flex items-center justify-center gap-2">
                          <button 
                            @click="decrementReturnQty(item)"
                            class="w-10 h-10 rounded-full bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 flex items-center justify-center text-gray-600 dark:text-gray-300 text-lg font-bold transition-all active:scale-95"
                            :disabled="getReturnQty(item.id) <= 0"
                          >
                            -
                          </button>
                          <span class="w-12 text-center font-semibold text-lg text-gray-900 dark:text-white">{{ getReturnQty(item.id) }}</span>
                          <button 
                            @click="incrementReturnQty(item)"
                            class="w-10 h-10 rounded-full bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 flex items-center justify-center text-gray-600 dark:text-gray-300 text-lg font-bold transition-all active:scale-95"
                            :disabled="getReturnQty(item.id) >= item.quantity"
                          >
                            +
                          </button>
                        </div>
                      </td>
                      <td class="px-6 py-4 text-right text-sm font-medium text-gray-900 dark:text-white">
                        {{ formatCurrency(calculateItemRefund(item)) }}
                      </td>
                    </tr>
                  </tbody>
                  <tfoot class="bg-gray-100/50 dark:bg-gray-800/50">
                    <tr>
                      <td colspan="4" class="px-6 py-4 text-right font-bold text-gray-900 dark:text-white">Total Refund:</td>
                      <td class="px-6 py-4 text-right font-bold text-primary-600 text-lg">
                        {{ formatCurrency(totalRefundAmount) }}
                      </td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </div>

            <!-- Return Reason -->
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Return Reason</label>
              <textarea 
                v-model="returnReason"
                rows="3"
                class="w-full px-4 py-3 text-base border border-gray-200/50 dark:border-gray-600/50 rounded-xl bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500/30 font-medium transition-all"
                placeholder="Why is the customer returning these items?"
              ></textarea>
            </div>
          </div>

          <!-- Empty State -->
          <div v-else-if="hasSearched" class="text-center py-12 text-gray-500 dark:text-gray-400">
            <i class="fas fa-search text-4xl mb-4 text-gray-300 dark:text-gray-600"></i>
            <p>No order found with number "{{ searchQuery }}"</p>
          </div>
        </div>

        <!-- Footer -->
        <div class="p-4 border-t border-gray-200/50 dark:border-gray-700/50 flex justify-end">
          <button 
            @click="submitReturn"
            :disabled="isLoading || !canSubmit"
            class="px-8 py-4 btn-glass-blue text-white text-lg font-bold rounded-xl disabled:opacity-50 transition-all flex items-center"
          >
            <i v-if="isLoading" class="fas fa-spinner fa-spin mr-3"></i>
            Process Return
          </button>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import { ref, computed, reactive } from 'vue'
import { usePosStore } from '../stores/posStore'
import { useApiService } from '@/core/services/api'
import { useAuthStore } from '@/core/stores/auth'
import type { SalesOrder, SalesOrderItem } from '../types'

defineProps<{
  isOpen: boolean
}>()

const emit = defineEmits(['close', 'return-processed'])

const posStore = usePosStore()
const apiService = useApiService()
const authStore = useAuthStore()

const searchQuery = ref('')
const lastSearchQuery = ref('')
const order = ref<SalesOrder | null>(null)
const isLoading = ref(false)
const hasSearched = ref(false)
const returnReason = ref('')
const returnQuantities = reactive<Record<number, number>>({})

// Keypad helper methods
const appendToSearch = (char: string) => {
  searchQuery.value += char
}

const clearSearch = () => {
  searchQuery.value = ''
}

const backspaceSearch = () => {
  searchQuery.value = searchQuery.value.slice(0, -1)
}

const close = () => {
  searchQuery.value = ''
  lastSearchQuery.value = ''
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
  lastSearchQuery.value = searchQuery.value
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

<style scoped>
.keypad-btn {
  @apply min-h-[56px] text-xl font-bold rounded-xl transition-all;
  @apply bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm;
  @apply border border-gray-200/50 dark:border-gray-600/50;
  @apply text-gray-900 dark:text-white;
  @apply hover:bg-gray-100 dark:hover:bg-gray-700;
  @apply active:scale-95 active:bg-gray-200 dark:active:bg-gray-600;
}

.keypad-btn-sm {
  @apply min-h-[48px] text-lg font-bold rounded-xl transition-all;
  @apply bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm;
  @apply border border-gray-200/50 dark:border-gray-600/50;
  @apply text-gray-900 dark:text-white;
  @apply hover:bg-gray-100 dark:hover:bg-gray-700;
  @apply active:scale-95 active:bg-gray-200 dark:active:bg-gray-600;
  @apply flex items-center justify-center;
}

.keypad-btn-sm.keypad-btn-danger {
  background-color: rgba(239, 68, 68, 0.3) !important;
  color: rgb(220, 38, 38) !important;
  border-color: rgba(239, 68, 68, 0.5) !important;
}

.keypad-btn-sm.keypad-btn-warning {
  background-color: rgba(249, 115, 22, 0.3) !important;
  color: rgb(234, 88, 12) !important;
  border-color: rgba(249, 115, 22, 0.5) !important;
}

.dark .keypad-btn-sm.keypad-btn-danger {
  background-color: rgba(239, 68, 68, 0.3) !important;
  color: rgb(248, 113, 113) !important;
}

.dark .keypad-btn-sm.keypad-btn-warning {
  background-color: rgba(249, 115, 22, 0.3) !important;
  color: rgb(251, 146, 60) !important;
}

.keypad-btn-sm.keypad-btn-primary {
  background-color: rgb(59, 130, 246) !important;
  color: white !important;
  border-color: rgb(59, 130, 246) !important;
}

.keypad-btn-sm.keypad-btn-primary:disabled {
  opacity: 0.5;
}
</style>
