<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { usePosStore } from '../stores/posStore'
import { useAuthStore } from '@/core/stores/auth'
import type { SalesOrder } from '../types'

const props = defineProps<{
  isOpen: boolean
}>()

const emit = defineEmits<{
  (e: 'close'): void
  (e: 'resume', order: SalesOrder): void
}>()

const posStore = usePosStore()
const authStore = useAuthStore()
const heldOrders = ref<SalesOrder[]>([])
const isLoading = ref(false)

const loadHeldOrders = async () => {
  // TODO: Get actual store ID from auth or context
  const storeId = 1
  isLoading.value = true
  try {
    heldOrders.value = await posStore.getHeldOrders(storeId)
  } finally {
    isLoading.value = false
  }
}

onMounted(() => {
  if (props.isOpen) {
    loadHeldOrders()
  }
})

const handleResume = async (order: SalesOrder) => {
  try {
    await posStore.resumeOrder(order.id)
    emit('resume', order)
    emit('close')
  } catch (error) {
    // Error handled in store
  }
}

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleString()
}

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount)
}
</script>

<template>
  <div v-if="isOpen" class="fixed inset-0 z-50 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
    <div class="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
      <div class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" aria-hidden="true" @click="$emit('close')"></div>
      <span class="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
      <div class="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-3xl sm:w-full">
        <div class="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
          <div class="sm:flex sm:items-start">
            <div class="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
              <h3 class="text-lg leading-6 font-medium text-gray-900" id="modal-title">
                Held Orders
              </h3>
              <div class="mt-4">
                <div v-if="isLoading" class="text-center py-4">
                  <i class="fas fa-spinner fa-spin text-blue-600 text-2xl"></i>
                  <p class="mt-2 text-gray-500">Loading held orders...</p>
                </div>
                <div v-else-if="heldOrders.length === 0" class="text-center py-8 text-gray-500">
                  No held orders found.
                </div>
                <div v-else class="overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
                  <table class="min-w-full divide-y divide-gray-300">
                    <thead class="bg-gray-50">
                      <tr>
                        <th scope="col" class="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6">Order #</th>
                        <th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Date</th>
                        <th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Customer</th>
                        <th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Items</th>
                        <th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Total</th>
                        <th scope="col" class="relative py-3.5 pl-3 pr-4 sm:pr-6">
                          <span class="sr-only">Actions</span>
                        </th>
                      </tr>
                    </thead>
                    <tbody class="divide-y divide-gray-200 bg-white">
                      <tr v-for="order in heldOrders" :key="order.id">
                        <td class="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">{{ order.orderNo }}</td>
                        <td class="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{{ formatDate(order.orderDate) }}</td>
                        <td class="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{{ order.customer ? `${order.customer.firstName} ${order.customer.lastName}` : 'Walk-in' }}</td>
                        <td class="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{{ order.items.length }} items</td>
                        <td class="whitespace-nowrap px-3 py-4 text-sm text-gray-900 font-bold">{{ formatCurrency(order.total) }}</td>
                        <td class="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                          <button @click="handleResume(order)" class="text-blue-600 hover:text-blue-900">Resume<span class="sr-only">, {{ order.orderNo }}</span></button>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
          <button @click="$emit('close')" type="button" class="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm">
            Close
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
