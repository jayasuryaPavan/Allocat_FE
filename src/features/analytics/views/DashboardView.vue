<template>
  <div class="min-h-screen bg-gray-50 p-6">
    <div class="max-w-7xl mx-auto">
      <!-- Header -->
      <div class="mb-6">
        <h1 class="text-3xl font-bold text-gray-900">Analytics Dashboard</h1>
        <p class="text-gray-600 mt-1">Sales performance and business intelligence</p>
      </div>

      <!-- Date Range Filter -->
      <div class="bg-white rounded-lg shadow p-4 mb-6">
        <div class="flex gap-4 items-end">
          <div class="flex-1">
            <label class="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
            <input 
              v-model="startDate" 
              type="date" 
              class="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>
          <div class="flex-1">
            <label class="block text-sm font-medium text-gray-700 mb-1">End Date</label>
            <input 
              v-model="endDate" 
              type="date" 
              class="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>
          <button 
            @click="loadDashboardData"
            :disabled="analyticsStore.isLoading"
            class="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
          >
            <i v-if="analyticsStore.isLoading" class="fas fa-spinner fa-spin mr-2"></i>
            Refresh
          </button>
        </div>
      </div>

      <!-- Summary Cards -->
      <div class="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        <div class="bg-white rounded-lg shadow p-6">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm text-gray-600">Total Sales</p>
              <p class="text-2xl font-bold text-gray-900">{{ formatCurrency(summary?.totalSales || 0) }}</p>
            </div>
            <div class="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
              <i class="fas fa-dollar-sign text-green-600 text-xl"></i>
            </div>
          </div>
        </div>

        <div class="bg-white rounded-lg shadow p-6">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm text-gray-600">Transactions</p>
              <p class="text-2xl font-bold text-gray-900">{{ summary?.transactionCount || 0 }}</p>
            </div>
            <div class="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
              <i class="fas fa-receipt text-blue-600 text-xl"></i>
            </div>
          </div>
        </div>

        <div class="bg-white rounded-lg shadow p-6">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm text-gray-600">Avg Ticket</p>
              <p class="text-2xl font-bold text-gray-900">{{ formatCurrency(summary?.averageTicket || 0) }}</p>
            </div>
            <div class="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
              <i class="fas fa-chart-line text-purple-600 text-xl"></i>
            </div>
          </div>
        </div>

        <div class="bg-white rounded-lg shadow p-6">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm text-gray-600">Tax Collected</p>
              <p class="text-2xl font-bold text-gray-900">{{ formatCurrency(summary?.taxCollected || 0) }}</p>
            </div>
            <div class="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center">
              <i class="fas fa-file-invoice-dollar text-yellow-600 text-xl"></i>
            </div>
          </div>
        </div>
      </div>

      <!-- Charts and Tables Row -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <!-- Top Products -->
        <div class="bg-white rounded-lg shadow p-6">
          <h2 class="text-lg font-semibold text-gray-900 mb-4">Top Selling Products</h2>
          <div class="overflow-x-auto">
            <table class="min-w-full">
              <thead class="bg-gray-50">
                <tr>
                  <th class="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Product</th>
                  <th class="px-4 py-2 text-right text-xs font-medium text-gray-500 uppercase">Qty</th>
                  <th class="px-4 py-2 text-right text-xs font-medium text-gray-500 uppercase">Revenue</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-gray-200">
                <tr v-for="product in topProducts?.products || []" :key="product.productId">
                  <td class="px-4 py-3 text-sm text-gray-900">{{ product.productName }}</td>
                  <td class="px-4 py-3 text-sm text-gray-600 text-right">{{ product.quantitySold }}</td>
                  <td class="px-4 py-3 text-sm text-gray-900 text-right font-medium">{{ formatCurrency(product.revenue) }}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <!-- Cashier Performance -->
        <div class="bg-white rounded-lg shadow p-6">
          <h2 class="text-lg font-semibold text-gray-900 mb-4">Cashier Performance</h2>
          <div class="overflow-x-auto">
            <table class="min-w-full">
              <thead class="bg-gray-50">
                <tr>
                  <th class="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Cashier</th>
                  <th class="px-4 py-2 text-right text-xs font-medium text-gray-500 uppercase">Sales</th>
                  <th class="px-4 py-2 text-right text-xs font-medium text-gray-500 uppercase">Trans</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-gray-200">
                <tr v-for="cashier in cashierPerformance" :key="cashier.cashierId">
                  <td class="px-4 py-3 text-sm text-gray-900">{{ cashier.cashierName }}</td>
                  <td class="px-4 py-3 text-sm text-gray-900 text-right font-medium">{{ formatCurrency(cashier.totalSales) }}</td>
                  <td class="px-4 py-3 text-sm text-gray-600 text-right">{{ cashier.transactionCount }}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <!-- Low Stock Alerts -->
      <div v-if="lowStockAlerts.length > 0" class="bg-white rounded-lg shadow p-6">
        <h2 class="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <i class="fas fa-exclamation-triangle text-orange-500 mr-2"></i>
          Low Stock Alerts
        </h2>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div v-for="alert in lowStockAlerts" :key="alert.productId" class="border border-orange-200 rounded-lg p-4 bg-orange-50">
            <p class="font-medium text-gray-900">{{ alert.productName }}</p>
            <p class="text-sm text-gray-600">SKU: {{ alert.sku }}</p>
            <p class="text-sm text-orange-600 font-medium mt-2">Stock: {{ alert.currentStock }} units</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useAnalyticsStore } from '../stores/analyticsStore'

const analyticsStore = useAnalyticsStore()

const startDate = ref(new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0])
const endDate = ref(new Date().toISOString().split('T')[0])

const summary = computed(() => analyticsStore.salesSummary)
const topProducts = computed(() => analyticsStore.topProducts)
const cashierPerformance = computed(() => analyticsStore.cashierPerformance)
const lowStockAlerts = computed(() => analyticsStore.lowStockAlerts)

const loadDashboardData = async () => {
  const storeId = 1 // Default store, should come from authStore
  
  await Promise.all([
    analyticsStore.getSalesSummary(startDate.value, endDate.value, storeId),
    analyticsStore.getTopSellingProducts(startDate.value, endDate.value, storeId, 'revenue', 5),
    analyticsStore.getCashierPerformance(startDate.value, endDate.value, storeId),
    analyticsStore.getLowStockAlerts(storeId, 10)
  ])
}

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
  }).format(value)
}

onMounted(() => {
  loadDashboardData()
})
</script>
