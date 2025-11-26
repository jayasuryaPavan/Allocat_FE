<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useSalesStore } from '../stores/salesStore'
import { OrderStatus, PaymentStatus } from '../types'

const salesStore = useSalesStore()
const currentPage = ref(0)
const pageSize = ref(10)
const searchOrderNo = ref('')

const loadOrders = async () => {
  await salesStore.fetchOrders({
    page: currentPage.value,
    size: pageSize.value,
    sort: 'createdAt,desc',
    orderNo: searchOrderNo.value || undefined
  })
}

onMounted(() => {
  loadOrders()
})

const handleSearch = () => {
  currentPage.value = 0
  loadOrders()
}

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleString()
}

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount)
}

const getStatusClass = (status: OrderStatus) => {
  switch (status) {
    case OrderStatus.COMPLETED: return 'bg-green-100 text-green-800'
    case OrderStatus.PENDING: return 'bg-yellow-100 text-yellow-800'
    case OrderStatus.CANCELLED: return 'bg-red-100 text-red-800'
    default: return 'bg-gray-100 text-gray-800'
  }
}

const viewDetails = (orderId: number) => {
  // TODO: Implement order details modal or navigation
  console.log('View details for order', orderId)
}
</script>

<template>
  <div class="space-y-6">
    <div class="md:flex md:items-center md:justify-between">
      <div class="flex-1 min-w-0">
        <h2 class="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate">
          Sales History
        </h2>
      </div>
      <div class="mt-4 flex md:mt-0 md:ml-4">
        <div class="relative rounded-md shadow-sm">
          <input
            type="text"
            v-model="searchOrderNo"
            class="focus:ring-blue-500 focus:border-blue-500 block w-full pl-4 pr-12 sm:text-sm border-gray-300 rounded-md py-2"
            placeholder="Search Order #"
            @keydown.enter="handleSearch"
          />
          <div class="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
            <i class="fas fa-search text-gray-400"></i>
          </div>
        </div>
      </div>
    </div>

    <!-- Orders Table -->
    <div class="flex flex-col">
      <div class="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
        <div class="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8">
          <div class="shadow overflow-hidden border-b border-gray-200 sm:rounded-lg">
            <table class="min-w-full divide-y divide-gray-200">
              <thead class="bg-gray-50">
                <tr>
                  <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Order #
                  </th>
                  <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Customer
                  </th>
                  <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Total
                  </th>
                  <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th scope="col" class="relative px-6 py-3">
                    <span class="sr-only">Actions</span>
                  </th>
                </tr>
              </thead>
              <tbody class="bg-white divide-y divide-gray-200">
                <tr v-if="salesStore.isLoading">
                  <td colspan="6" class="px-6 py-4 text-center text-gray-500">
                    <i class="fas fa-spinner fa-spin mr-2"></i> Loading...
                  </td>
                </tr>
                <tr v-else-if="salesStore.orders.length === 0">
                  <td colspan="6" class="px-6 py-4 text-center text-gray-500">
                    No orders found.
                  </td>
                </tr>
                <tr v-for="order in salesStore.orders" :key="order.id" class="hover:bg-gray-50">
                  <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-blue-600">
                    {{ order.orderNo }}
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {{ formatDate(order.orderDate) }}
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {{ order.customerId ? `Customer #${order.customerId}` : 'Walk-in' }}
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-medium">
                    {{ formatCurrency(order.total) }}
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full" :class="getStatusClass(order.status)">
                      {{ order.status }}
                    </span>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button @click="viewDetails(order.id)" class="text-blue-600 hover:text-blue-900 mr-3">
                      View
                    </button>
                    <button class="text-gray-400 hover:text-gray-600">
                      <i class="fas fa-print"></i>
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>

    <!-- Pagination -->
    <div class="flex items-center justify-between border-t border-gray-200 bg-white px-4 py-3 sm:px-6">
      <div class="flex flex-1 justify-between sm:hidden">
        <button 
          @click="currentPage > 0 && (currentPage--, loadOrders())"
          :disabled="currentPage === 0"
          class="relative inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
        >
          Previous
        </button>
        <button 
          @click="(currentPage + 1) * pageSize < salesStore.totalOrders && (currentPage++, loadOrders())"
          :disabled="(currentPage + 1) * pageSize >= salesStore.totalOrders"
          class="relative ml-3 inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
        >
          Next
        </button>
      </div>
      <div class="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
        <div>
          <p class="text-sm text-gray-700">
            Showing
            <span class="font-medium">{{ currentPage * pageSize + 1 }}</span>
            to
            <span class="font-medium">{{ Math.min((currentPage + 1) * pageSize, salesStore.totalOrders) }}</span>
            of
            <span class="font-medium">{{ salesStore.totalOrders }}</span>
            results
          </p>
        </div>
        <div>
          <nav class="isolate inline-flex -space-x-px rounded-md shadow-sm" aria-label="Pagination">
            <button
              @click="currentPage > 0 && (currentPage--, loadOrders())"
              :disabled="currentPage === 0"
              class="relative inline-flex items-center rounded-l-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0 disabled:opacity-50"
            >
              <span class="sr-only">Previous</span>
              <i class="fas fa-chevron-left h-5 w-5"></i>
            </button>
            <button
              @click="(currentPage + 1) * pageSize < salesStore.totalOrders && (currentPage++, loadOrders())"
              :disabled="(currentPage + 1) * pageSize >= salesStore.totalOrders"
              class="relative inline-flex items-center rounded-r-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0 disabled:opacity-50"
            >
              <span class="sr-only">Next</span>
              <i class="fas fa-chevron-right h-5 w-5"></i>
            </button>
          </nav>
        </div>
      </div>
    </div>
  </div>
</template>
