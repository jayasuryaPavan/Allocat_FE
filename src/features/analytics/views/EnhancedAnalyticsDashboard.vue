<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { useAnalyticsStore } from '../stores/analyticsStore'
import { useAuthStore } from '@/core/stores/auth'

const analyticsStore = useAnalyticsStore()
const authStore = useAuthStore()

type TimePeriod = 'today' | 'yesterday' | 'week' | 'month' | '6months' | 'year' | 'custom'

const selectedPeriod = ref<TimePeriod>('today')
const startDate = ref('')
const endDate = ref('')
const activeTab = ref<'overview' | 'products' | 'employees' | 'trends'>('overview')

const getStoreId = () => {
  const userDetails = JSON.parse(sessionStorage.getItem('user_details') || '{}')
  return Number(userDetails.storeId || (authStore.currentUser as any)?.storeId || 1)
}

const calculateDateRange = (period: TimePeriod): { start: string; end: string } => {
  const now = new Date()
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
  
  switch (period) {
    case 'today':
      return {
        start: today.toISOString().split('T')[0],
        end: today.toISOString().split('T')[0]
      }
    case 'yesterday':
      const yesterday = new Date(today)
      yesterday.setDate(yesterday.getDate() - 1)
      return {
        start: yesterday.toISOString().split('T')[0],
        end: yesterday.toISOString().split('T')[0]
      }
    case 'week':
      const weekAgo = new Date(today)
      weekAgo.setDate(weekAgo.getDate() - 7)
      return {
        start: weekAgo.toISOString().split('T')[0],
        end: today.toISOString().split('T')[0]
      }
    case 'month':
      const monthAgo = new Date(today)
      monthAgo.setMonth(monthAgo.getMonth() - 1)
      return {
        start: monthAgo.toISOString().split('T')[0],
        end: today.toISOString().split('T')[0]
      }
    case '6months':
      const sixMonthsAgo = new Date(today)
      sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6)
      return {
        start: sixMonthsAgo.toISOString().split('T')[0],
        end: today.toISOString().split('T')[0]
      }
    case 'year':
      const yearAgo = new Date(today)
      yearAgo.setFullYear(yearAgo.getFullYear() - 1)
      return {
        start: yearAgo.toISOString().split('T')[0],
        end: today.toISOString().split('T')[0]
      }
    case 'custom':
      return {
        start: startDate.value,
        end: endDate.value
      }
  }
}

const loadAnalytics = async () => {
  const dates = calculateDateRange(selectedPeriod.value)
  const storeId = getStoreId()
  
  await Promise.all([
    analyticsStore.getSalesSummary(dates.start, dates.end, storeId),
    analyticsStore.getCashierPerformance(dates.start, dates.end, storeId),
    analyticsStore.getTopSellingProducts(dates.start, dates.end, storeId, 'revenue', 10),
    analyticsStore.getSalesTrends(dates.start, dates.end, storeId, 'daily'),
    analyticsStore.getLowStockAlerts(storeId, 10)
  ])
}

watch(selectedPeriod, () => {
  if (selectedPeriod.value !== 'custom') {
    loadAnalytics()
  }
})

const applyCustomRange = () => {
  if (startDate.value && endDate.value) {
    loadAnalytics()
  }
}

onMounted(() => {
  loadAnalytics()
})

const summary = computed(() => analyticsStore.salesSummary)
const topProducts = computed(() => analyticsStore.topProducts)
const cashierPerformance = computed(() => analyticsStore.cashierPerformance)
const salesTrends = computed(() => analyticsStore.salesTrends)
const lowStockAlerts = computed(() => analyticsStore.lowStockAlerts)
const isLoading = computed(() => analyticsStore.isLoading)

const formatCurrency = (value?: number) => {
  if (value === undefined || value === null) return '$0.00'
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
  }).format(value)
}

const formatNumber = (value?: number) => {
  if (value === undefined || value === null) return '0'
  return new Intl.NumberFormat('en-US').format(value)
}

const periodLabels: Record<TimePeriod, string> = {
  today: 'Today',
  yesterday: 'Yesterday',
  week: 'Last 7 Days',
  month: 'Last 30 Days',
  '6months': 'Last 6 Months',
  year: 'Last Year',
  custom: 'Custom Range'
}
</script>

<template>
  <div class="min-h-screen bg-gray-50 p-6">
    <div class="max-w-7xl mx-auto">
      <!-- Header -->
      <div class="mb-6">
        <h1 class="text-3xl font-bold text-gray-900">Sales Analytics</h1>
        <p class="text-gray-600 mt-1">Comprehensive business intelligence and performance metrics</p>
      </div>

      <!-- Period Selector -->
      <div class="bg-white rounded-lg shadow-sm p-4 mb-6">
        <div class="flex flex-wrap gap-2 mb-4">
          <button
            v-for="(label, period) in periodLabels"
            :key="period"
            @click="selectedPeriod = period as TimePeriod"
            :class="[
              'px-4 py-2 rounded-lg font-semibold transition-all',
              selectedPeriod === period
                ? 'bg-blue-600 text-white shadow-md'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            ]"
          >
            {{ label }}
          </button>
        </div>

        <!-- Custom Date Range -->
        <div v-if="selectedPeriod === 'custom'" class="flex gap-4 items-end">
          <div class="flex-1">
            <label class="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
            <input
              type="date"
              v-model="startDate"
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>
          <div class="flex-1">
            <label class="block text-sm font-medium text-gray-700 mb-1">End Date</label>
            <input
              type="date"
              v-model="endDate"
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>
          <button
            @click="applyCustomRange"
            :disabled="!startDate || !endDate"
            class="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Apply
          </button>
        </div>
      </div>

      <!-- Loading State -->
      <div v-if="isLoading" class="flex items-center justify-center py-20">
        <div class="text-center">
          <i class="fas fa-spinner fa-spin text-blue-600 text-5xl mb-4"></i>
          <p class="text-gray-600 text-lg">Loading analytics...</p>
        </div>
      </div>

      <template v-else>
        <!-- Tabs -->
        <div class="flex gap-2 border-b border-gray-200 mb-6">
          <button
            @click="activeTab = 'overview'"
            :class="[
              'px-6 py-3 font-semibold text-base border-b-2 transition-colors',
              activeTab === 'overview'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-gray-600 hover:text-gray-900 hover:border-gray-300'
            ]"
          >
            <i class="fas fa-chart-line mr-2"></i>
            Overview
          </button>
          <button
            @click="activeTab = 'products'"
            :class="[
              'px-6 py-3 font-semibold text-base border-b-2 transition-colors',
              activeTab === 'products'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-gray-600 hover:text-gray-900 hover:border-gray-300'
            ]"
          >
            <i class="fas fa-box mr-2"></i>
            Products
          </button>
          <button
            @click="activeTab = 'employees'"
            :class="[
              'px-6 py-3 font-semibold text-base border-b-2 transition-colors',
              activeTab === 'employees'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-gray-600 hover:text-gray-900 hover:border-gray-300'
            ]"
          >
            <i class="fas fa-users mr-2"></i>
            Employees
          </button>
          <button
            @click="activeTab = 'trends'"
            :class="[
              'px-6 py-3 font-semibold text-base border-b-2 transition-colors',
              activeTab === 'trends'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-gray-600 hover:text-gray-900 hover:border-gray-300'
            ]"
          >
            <i class="fas fa-chart-area mr-2"></i>
            Trends
          </button>
        </div>

        <!-- Overview Tab -->
        <div v-if="activeTab === 'overview'">
          <!-- KPI Cards -->
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
            <div class="bg-gradient-to-br from-green-500 to-green-600 rounded-lg shadow-lg p-6 text-white">
              <div class="flex items-center justify-between mb-2">
                <p class="text-sm font-medium opacity-90">Total Sales</p>
                <i class="fas fa-dollar-sign text-2xl opacity-75"></i>
              </div>
              <p class="text-3xl font-bold">{{ formatCurrency(summary?.totalSales || 0) }}</p>
              <p class="text-sm opacity-75 mt-1">Net revenue for period</p>
            </div>

            <div class="bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg shadow-lg p-6 text-white">
              <div class="flex items-center justify-between mb-2">
                <p class="text-sm font-medium opacity-90">Transactions</p>
                <i class="fas fa-receipt text-2xl opacity-75"></i>
              </div>
              <p class="text-3xl font-bold">{{ formatNumber(summary?.transactionCount || 0) }}</p>
              <p class="text-sm opacity-75 mt-1">Total orders</p>
            </div>

            <div class="bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg shadow-lg p-6 text-white">
              <div class="flex items-center justify-between mb-2">
                <p class="text-sm font-medium opacity-90">Average Ticket</p>
                <i class="fas fa-chart-line text-2xl opacity-75"></i>
              </div>
              <p class="text-3xl font-bold">{{ formatCurrency(summary?.averageTicket || 0) }}</p>
              <p class="text-sm opacity-75 mt-1">Per transaction</p>
            </div>

            <div class="bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-lg shadow-lg p-6 text-white">
              <div class="flex items-center justify-between mb-2">
                <p class="text-sm font-medium opacity-90">Tax Collected</p>
                <i class="fas fa-file-invoice-dollar text-2xl opacity-75"></i>
              </div>
              <p class="text-3xl font-bold">{{ formatCurrency(summary?.taxCollected || 0) }}</p>
              <p class="text-sm opacity-75 mt-1">Total tax</p>
            </div>
          </div>

          <!-- Charts Row -->
          <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <!-- Top Products -->
            <div class="bg-white rounded-lg shadow-sm p-6">
              <h2 class="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                <i class="fas fa-trophy text-yellow-500 mr-2"></i>
                Top Selling Products
              </h2>
              <div class="overflow-x-auto">
                <table class="min-w-full">
                  <thead class="bg-gray-50">
                    <tr>
                      <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">#</th>
                      <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Product</th>
                      <th class="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Qty</th>
                      <th class="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Revenue</th>
                    </tr>
                  </thead>
                  <tbody class="divide-y divide-gray-200">
                    <tr v-for="(product, index) in topProducts?.products || []" :key="product.productId" class="hover:bg-gray-50">
                      <td class="px-4 py-3 text-sm font-bold text-gray-900">{{ index + 1 }}</td>
                      <td class="px-4 py-3 text-sm text-gray-900">{{ product.productName }}</td>
                      <td class="px-4 py-3 text-sm text-gray-600 text-right">{{ product.quantitySold }}</td>
                      <td class="px-4 py-3 text-sm text-gray-900 text-right font-semibold">{{ formatCurrency(product.revenue) }}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            <!-- Cashier Performance -->
            <div class="bg-white rounded-lg shadow-sm p-6">
              <h2 class="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                <i class="fas fa-user-check text-green-500 mr-2"></i>
                Employee Performance
              </h2>
              <div class="overflow-x-auto">
                <table class="min-w-full">
                  <thead class="bg-gray-50">
                    <tr>
                      <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Employee</th>
                      <th class="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Sales</th>
                      <th class="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Orders</th>
                    </tr>
                  </thead>
                  <tbody class="divide-y divide-gray-200">
                    <tr v-for="cashier in cashierPerformance" :key="cashier.cashierId" class="hover:bg-gray-50">
                      <td class="px-4 py-3 text-sm text-gray-900">{{ cashier.cashierName }}</td>
                      <td class="px-4 py-3 text-sm text-gray-900 text-right font-semibold">{{ formatCurrency(cashier.totalSales) }}</td>
                      <td class="px-4 py-3 text-sm text-gray-600 text-right">{{ cashier.transactionCount }}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          <!-- Low Stock Alerts -->
          <div v-if="lowStockAlerts.length > 0" class="bg-white rounded-lg shadow-sm p-6 mt-6">
            <h2 class="text-xl font-semibold text-gray-900 mb-4 flex items-center">
              <i class="fas fa-exclamation-triangle text-orange-500 mr-2"></i>
              Low Stock Alerts ({{ lowStockAlerts.length }})
            </h2>
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div v-for="alert in lowStockAlerts" :key="alert.productId" class="border-2 border-orange-200 rounded-lg p-4 bg-orange-50 hover:shadow-md transition-shadow">
                <p class="font-semibold text-gray-900">{{ alert.productName }}</p>
                <p class="text-sm text-gray-600">SKU: {{ alert.sku }}</p>
                <p class="text-sm text-orange-600 font-bold mt-2">Stock: {{ alert.currentStock }} units</p>
                <p class="text-xs text-gray-500">Reorder at: {{ alert.reorderLevel }}</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Products Tab -->
        <div v-else-if="activeTab === 'products'" class="bg-white rounded-lg shadow-sm p-6">
          <h2 class="text-xl font-semibold text-gray-900 mb-4">Product Performance Analysis</h2>
          <div class="overflow-x-auto">
            <table class="min-w-full">
              <thead class="bg-gray-50">
                <tr>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Rank</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Product Name</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">SKU</th>
                  <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Qty Sold</th>
                  <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Revenue</th>
                  <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Avg Price</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-gray-200">
                <tr v-for="(product, index) in topProducts?.products || []" :key="product.productId" class="hover:bg-gray-50">
                  <td class="px-6 py-4 text-sm">
                    <span :class="[
                      'inline-flex items-center justify-center w-8 h-8 rounded-full font-bold',
                      index === 0 ? 'bg-yellow-100 text-yellow-800' :
                      index === 1 ? 'bg-gray-100 text-gray-800' :
                      index === 2 ? 'bg-orange-100 text-orange-800' :
                      'bg-gray-50 text-gray-600'
                    ]">
                      {{ index + 1 }}
                    </span>
                  </td>
                  <td class="px-6 py-4 text-sm font-medium text-gray-900">{{ product.productName }}</td>
                  <td class="px-6 py-4 text-sm text-gray-500">{{ product.productCode }}</td>
                  <td class="px-6 py-4 text-sm text-gray-900 text-right font-semibold">{{ formatNumber(product.quantitySold) }}</td>
                  <td class="px-6 py-4 text-sm text-gray-900 text-right font-bold">{{ formatCurrency(product.revenue) }}</td>
                  <td class="px-6 py-4 text-sm text-gray-600 text-right">{{ formatCurrency(product.revenue / product.quantitySold) }}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <!-- Employees Tab -->
        <div v-else-if="activeTab === 'employees'" class="bg-white rounded-lg shadow-sm p-6">
          <h2 class="text-xl font-semibold text-gray-900 mb-4">Employee Performance Details</h2>
          <div class="overflow-x-auto">
            <table class="min-w-full">
              <thead class="bg-gray-50">
                <tr>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Employee</th>
                  <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Total Sales</th>
                  <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Transactions</th>
                  <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Avg Ticket</th>
                  <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Avg Time</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-gray-200">
                <tr v-for="cashier in cashierPerformance" :key="cashier.cashierId" class="hover:bg-gray-50">
                  <td class="px-6 py-4 text-sm font-medium text-gray-900">{{ cashier.cashierName }}</td>
                  <td class="px-6 py-4 text-sm text-gray-900 text-right font-bold">{{ formatCurrency(cashier.totalSales) }}</td>
                  <td class="px-6 py-4 text-sm text-gray-600 text-right">{{ formatNumber(cashier.transactionCount) }}</td>
                  <td class="px-6 py-4 text-sm text-gray-900 text-right font-semibold">{{ formatCurrency(cashier.averageTicket) }}</td>
                  <td class="px-6 py-4 text-sm text-gray-600 text-right">{{ cashier.averageTransactionTime || 'N/A' }}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <!-- Trends Tab -->
        <div v-else-if="activeTab === 'trends'" class="bg-white rounded-lg shadow-sm p-6">
          <h2 class="text-xl font-semibold text-gray-900 mb-4">Sales Trends Over Time</h2>
          <div v-if="salesTrends && salesTrends.trends && salesTrends.trends.length > 0">
            <div class="overflow-x-auto">
              <table class="min-w-full">
                <thead class="bg-gray-50">
                  <tr>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Period</th>
                    <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Sales</th>
                    <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Orders</th>
                    <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Avg Order</th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-gray-200">
                  <tr v-for="trend in salesTrends.trends" :key="trend.period" class="hover:bg-gray-50">
                    <td class="px-6 py-4 text-sm font-medium text-gray-900">{{ trend.period }}</td>
                    <td class="px-6 py-4 text-sm text-gray-900 text-right font-bold">{{ formatCurrency(trend.sales) }}</td>
                    <td class="px-6 py-4 text-sm text-gray-600 text-right">{{ formatNumber(trend.transactions) }}</td>
                    <td class="px-6 py-4 text-sm text-gray-900 text-right font-semibold">
                      {{ formatCurrency(trend.transactions > 0 ? trend.sales / trend.transactions : 0) }}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
          <div v-else class="text-center py-12 text-gray-500">
            <i class="fas fa-chart-line text-4xl mb-3"></i>
            <p>No trend data available for the selected period</p>
          </div>
        </div>
      </template>
    </div>
  </div>
</template>





