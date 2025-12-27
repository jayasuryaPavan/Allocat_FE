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
  <div class="min-h-screen bg-transparent p-6">
    <div class="max-w-7xl mx-auto">
      <!-- Header -->
      <div class="mb-8 relative">
        <h1 class="text-4xl font-black text-gray-900 dark:text-white tracking-tight">Sales Analytics</h1>
        <p class="text-gray-600 dark:text-gray-400 mt-1 font-medium">Comprehensive business intelligence and performance metrics</p>
      </div>

      <!-- Period Selector -->
      <div class="glass-card p-6 mb-8">
        <div class="flex flex-wrap gap-3 mb-4">
          <button
            v-for="(label, period) in periodLabels"
            :key="period"
            @click="selectedPeriod = period as TimePeriod"
            :class="[
              'px-5 py-2.5 rounded-xl font-bold transition-all duration-300 active:scale-95',
              selectedPeriod === period
                ? 'bg-primary-500 text-white shadow-glow border border-primary-400'
                : 'bg-white/40 dark:bg-white/5 text-gray-700 dark:text-gray-300 hover:bg-white/60 dark:hover:bg-white/10 border border-white/20 dark:border-white/5'
            ]"
          >
            {{ label }}
          </button>
        </div>

        <!-- Custom Date Range -->
        <div v-if="selectedPeriod === 'custom'" class="flex gap-4 items-end mt-4 p-4 rounded-2xl bg-white/30 dark:bg-black/20 border border-white/20 dark:border-white/5">
          <div class="flex-1">
            <label class="block text-xs font-bold text-gray-500 dark:text-gray-400 mb-1 uppercase tracking-wider">Start Date</label>
            <input
              type="date"
              v-model="startDate"
              class="w-full px-4 py-2.5 bg-white/50 dark:bg-gray-900/50 border border-white/30 dark:border-white/10 rounded-xl focus:ring-2 focus:ring-primary-500 outline-none transition-all dark:text-white"
            />
          </div>
          <div class="flex-1">
            <label class="block text-xs font-bold text-gray-500 dark:text-gray-400 mb-1 uppercase tracking-wider">End Date</label>
            <input
              type="date"
              v-model="endDate"
              class="w-full px-4 py-2.5 bg-white/50 dark:bg-gray-900/50 border border-white/30 dark:border-white/10 rounded-xl focus:ring-2 focus:ring-primary-500 outline-none transition-all dark:text-white"
            />
          </div>
          <button
            @click="applyCustomRange"
            :disabled="!startDate || !endDate"
            class="px-8 py-2.5 bg-primary-500 text-white rounded-xl font-bold hover:bg-primary-600 disabled:opacity-50 disabled:cursor-not-allowed shadow-glow transition-all active:scale-95"
          >
            Apply Range
          </button>
        </div>
      </div>

      <!-- Loading State -->
      <div v-if="isLoading" class="flex items-center justify-center py-32">
        <div class="text-center">
          <div class="relative inline-block">
            <div class="w-16 h-16 border-4 border-primary-500/20 border-t-primary-500 rounded-full animate-spin"></div>
            <div class="absolute inset-0 flex items-center justify-center">
              <div class="w-8 h-8 bg-primary-500/10 rounded-full animate-pulse"></div>
            </div>
          </div>
          <p class="text-gray-600 dark:text-gray-400 text-lg font-bold mt-6 tracking-wide">Synthesizing Data...</p>
        </div>
      </div>

      <template v-else>
        <!-- Tabs -->
        <div class="flex gap-1 bg-white/30 dark:bg-black/20 p-1.5 rounded-2xl border border-white/20 dark:border-white/5 mb-8 w-fit">
          <button
            v-for="tab in ['overview', 'products', 'employees', 'trends']"
            :key="tab"
            @click="activeTab = tab as any"
            :class="[
              'px-8 py-3 font-bold text-sm rounded-xl transition-all duration-300 capitalize',
              activeTab === tab
                ? 'bg-white dark:bg-gray-800 text-primary-600 dark:text-primary-400 shadow-medium'
                : 'text-gray-500 hover:text-gray-900 dark:hover:text-white'
            ]"
          >
            {{ tab }}
          </button>
        </div>

        <!-- Overview Tab -->
        <div v-if="activeTab === 'overview'">
          <!-- KPI Cards -->
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div class="glass-card p-6 group hover:-translate-y-1 transition-all duration-300">
              <div class="flex items-center justify-between mb-4">
                <div class="p-3 bg-green-500/20 rounded-2xl border border-green-500/30">
                  <i class="fas fa-dollar-sign text-green-500 text-xl"></i>
                </div>
                <span class="text-xs font-black text-green-500 bg-green-500/10 px-2 py-1 rounded-lg">+12.5%</span>
              </div>
              <p class="text-xs font-black text-gray-500 dark:text-gray-400 uppercase tracking-widest">Total Sales</p>
              <p class="text-3xl font-black text-gray-900 dark:text-white mt-1">{{ formatCurrency(summary?.totalSales || 0) }}</p>
            </div>

            <div class="glass-card p-6 group hover:-translate-y-1 transition-all duration-300">
              <div class="flex items-center justify-between mb-4">
                <div class="p-3 bg-primary-500/20 rounded-2xl border border-primary-500/30">
                  <i class="fas fa-receipt text-primary-500 text-xl"></i>
                </div>
                <span class="text-xs font-black text-primary-500 bg-primary-500/10 px-2 py-1 rounded-lg">High</span>
              </div>
              <p class="text-xs font-black text-gray-500 dark:text-gray-400 uppercase tracking-widest">Transactions</p>
              <p class="text-3xl font-black text-gray-900 dark:text-white mt-1">{{ formatNumber(summary?.transactionCount || 0) }}</p>
            </div>

            <div class="glass-card p-6 group hover:-translate-y-1 transition-all duration-300">
              <div class="flex items-center justify-between mb-4">
                <div class="p-3 bg-purple-500/20 rounded-2xl border border-purple-500/30">
                  <i class="fas fa-chart-line text-purple-500 text-xl"></i>
                </div>
              </div>
              <p class="text-xs font-black text-gray-500 dark:text-gray-400 uppercase tracking-widest">Average Ticket</p>
              <p class="text-3xl font-black text-gray-900 dark:text-white mt-1">{{ formatCurrency(summary?.averageTicket || 0) }}</p>
            </div>

            <div class="glass-card p-6 group hover:-translate-y-1 transition-all duration-300">
              <div class="flex items-center justify-between mb-4">
                <div class="p-3 bg-yellow-500/20 rounded-2xl border border-yellow-500/30">
                  <i class="fas fa-file-invoice-dollar text-yellow-500 text-xl"></i>
                </div>
              </div>
              <p class="text-xs font-black text-gray-500 dark:text-gray-400 uppercase tracking-widest">Tax Collected</p>
              <p class="text-3xl font-black text-gray-900 dark:text-white mt-1">{{ formatCurrency(summary?.taxCollected || 0) }}</p>
            </div>
          </div>

          <!-- Charts Row -->
          <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <!-- Top Products -->
            <div class="glass-card p-0">
              <div class="p-6 border-b border-white/10 flex items-center justify-between">
                <h2 class="text-xl font-black text-gray-900 dark:text-white flex items-center tracking-tight">
                  <i class="fas fa-trophy text-yellow-500 mr-3"></i>
                  Top Products
                </h2>
                <button class="text-xs font-bold text-primary-500 hover:underline">View All</button>
              </div>
              <div class="overflow-x-auto">
                <table class="min-w-full">
                  <thead>
                    <tr class="bg-white/10 dark:bg-black/10">
                      <th class="px-6 py-4 text-left text-xs font-black text-gray-500 uppercase tracking-widest">Rank</th>
                      <th class="px-6 py-4 text-left text-xs font-black text-gray-500 uppercase tracking-widest">Product</th>
                      <th class="px-6 py-4 text-right text-xs font-black text-gray-500 uppercase tracking-widest">Qty</th>
                      <th class="px-6 py-4 text-right text-xs font-black text-gray-500 uppercase tracking-widest">Revenue</th>
                    </tr>
                  </thead>
                  <tbody class="divide-y divide-white/10">
                    <tr v-for="(product, index) in topProducts?.products || []" :key="product.productId" class="hover:bg-white/20 dark:hover:bg-white/5 transition-colors">
                      <td class="px-6 py-4 text-sm">
                        <span class="inline-flex items-center justify-center w-6 h-6 rounded-lg bg-primary-500/10 text-primary-600 dark:text-primary-400 font-black text-xs">
                          {{ index + 1 }}
                        </span>
                      </td>
                      <td class="px-6 py-4 text-sm font-bold text-gray-900 dark:text-white">{{ product.productName }}</td>
                      <td class="px-6 py-4 text-sm text-gray-600 dark:text-gray-400 text-right">{{ product.quantitySold }}</td>
                      <td class="px-6 py-4 text-sm text-gray-900 dark:text-white text-right font-black">{{ formatCurrency(product.revenue) }}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            <!-- Cashier Performance -->
            <div class="glass-card p-0">
              <div class="p-6 border-b border-white/10 flex items-center justify-between">
                <h2 class="text-xl font-black text-gray-900 dark:text-white flex items-center tracking-tight">
                  <i class="fas fa-user-check text-primary-500 mr-3"></i>
                  Performance
                </h2>
              </div>
              <div class="overflow-x-auto">
                <table class="min-w-full">
                  <thead>
                    <tr class="bg-white/10 dark:bg-black/10">
                      <th class="px-6 py-4 text-left text-xs font-black text-gray-500 uppercase tracking-widest">Employee</th>
                      <th class="px-6 py-4 text-right text-xs font-black text-gray-500 uppercase tracking-widest">Sales</th>
                      <th class="px-6 py-4 text-right text-xs font-black text-gray-500 uppercase tracking-widest">Orders</th>
                    </tr>
                  </thead>
                  <tbody class="divide-y divide-white/10">
                    <tr v-for="cashier in cashierPerformance" :key="cashier.cashierId" class="hover:bg-white/20 dark:hover:bg-white/5 transition-colors">
                      <td class="px-6 py-4 text-sm font-bold text-gray-900 dark:text-white">
                        <div class="flex items-center">
                          <div class="w-8 h-8 rounded-full bg-primary-500/10 flex items-center justify-center mr-3 text-primary-600 text-xs font-black">
                            {{ cashier.cashierName?.charAt(0) }}
                          </div>
                          {{ cashier.cashierName }}
                        </div>
                      </td>
                      <td class="px-6 py-4 text-sm text-gray-900 dark:text-white text-right font-black">{{ formatCurrency(cashier.totalSales) }}</td>
                      <td class="px-6 py-4 text-sm text-gray-600 dark:text-gray-400 text-right">{{ cashier.transactionCount }}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          <!-- Low Stock Alerts -->
          <div v-if="lowStockAlerts.length > 0" class="glass-card p-6 mt-8 border-orange-500/20">
            <h2 class="text-xl font-black text-gray-900 dark:text-white mb-6 flex items-center">
              <i class="fas fa-exclamation-triangle text-orange-500 mr-3 animate-pulse"></i>
              Inventory Alerts ({{ lowStockAlerts.length }})
            </h2>
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div v-for="alert in lowStockAlerts" :key="alert.productId" class="bg-orange-500/10 rounded-2xl p-5 border border-orange-500/20 hover:border-orange-500/40 transition-all">
                <p class="font-black text-gray-900 dark:text-white tracking-tight">{{ alert.productName }}</p>
                <div class="flex justify-between items-end mt-4">
                  <div>
                    <p class="text-[10px] font-black text-orange-600/70 uppercase tracking-widest">Current Stock</p>
                    <p class="text-2xl font-black text-orange-600">{{ alert.currentStock }} <span class="text-sm">units</span></p>
                  </div>
                  <div class="text-right">
                    <p class="text-[10px] font-black text-gray-500 uppercase tracking-widest">Reorder Level</p>
                    <p class="text-lg font-black text-gray-600 dark:text-gray-400">{{ alert.reorderLevel }}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Products Tab -->
        <div v-else-if="activeTab === 'products'" class="glass-card p-0 overflow-hidden">
          <div class="p-6 border-b border-white/10">
            <h2 class="text-xl font-black text-gray-900 dark:text-white tracking-tight">Product Performance analysis</h2>
          </div>
          <div class="overflow-x-auto">
            <table class="min-w-full">
              <thead>
                <tr class="bg-white/10 dark:bg-black/10">
                  <th class="px-6 py-4 text-left text-xs font-black text-gray-500 uppercase tracking-widest">Rank</th>
                  <th class="px-6 py-4 text-left text-xs font-black text-gray-500 uppercase tracking-widest">Product Name</th>
                  <th class="px-6 py-4 text-left text-xs font-black text-gray-500 uppercase tracking-widest">SKU</th>
                  <th class="px-6 py-4 text-right text-xs font-black text-gray-500 uppercase tracking-widest">Qty Sold</th>
                  <th class="px-6 py-4 text-right text-xs font-black text-gray-500 uppercase tracking-widest">Revenue</th>
                  <th class="px-6 py-4 text-right text-xs font-black text-gray-500 uppercase tracking-widest">Avg Price</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-white/10">
                <tr v-for="(product, index) in topProducts?.products || []" :key="product.productId" class="hover:bg-white/20 dark:hover:bg-white/5 transition-colors">
                  <td class="px-6 py-4 text-sm">
                    <span :class="[
                      'inline-flex items-center justify-center w-8 h-8 rounded-xl font-black text-xs',
                      index === 0 ? 'bg-yellow-500/20 text-yellow-600' :
                      index === 1 ? 'bg-gray-400/20 text-gray-600 dark:text-gray-300' :
                      index === 2 ? 'bg-orange-500/20 text-orange-600' :
                      'bg-primary-500/10 text-primary-600 dark:text-primary-400'
                    ]">
                      {{ index + 1 }}
                    </span>
                  </td>
                  <td class="px-6 py-4 text-sm font-bold text-gray-900 dark:text-white">{{ product.productName }}</td>
                  <td class="px-6 py-4 text-sm text-gray-500 dark:text-gray-400 font-mono">{{ product.sku }}</td>
                  <td class="px-6 py-4 text-sm text-gray-900 dark:text-white text-right font-bold">{{ formatNumber(product.quantitySold) }}</td>
                  <td class="px-6 py-4 text-sm text-gray-900 dark:text-white text-right font-black">{{ formatCurrency(product.revenue) }}</td>
                  <td class="px-6 py-4 text-sm text-gray-600 dark:text-gray-400 text-right">{{ formatCurrency(product.revenue / product.quantitySold) }}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <!-- Employees Tab -->
        <div v-else-if="activeTab === 'employees'" class="glass-card p-0 overflow-hidden">
          <div class="p-6 border-b border-white/10">
            <h2 class="text-xl font-black text-gray-900 dark:text-white tracking-tight">Employee Performance Details</h2>
          </div>
          <div class="overflow-x-auto">
            <table class="min-w-full">
              <thead>
                <tr class="bg-white/10 dark:bg-black/10">
                  <th class="px-6 py-4 text-left text-xs font-black text-gray-500 uppercase tracking-widest">Employee</th>
                  <th class="px-6 py-4 text-right text-xs font-black text-gray-500 uppercase tracking-widest">Total Sales</th>
                  <th class="px-6 py-4 text-right text-xs font-black text-gray-500 uppercase tracking-widest">Transactions</th>
                  <th class="px-6 py-4 text-right text-xs font-black text-gray-500 uppercase tracking-widest">Avg Ticket</th>
                  <th class="px-6 py-4 text-right text-xs font-black text-gray-500 uppercase tracking-widest">Avg Time</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-white/10">
                <tr v-for="cashier in cashierPerformance" :key="cashier.cashierId" class="hover:bg-white/20 dark:hover:bg-white/5 transition-colors">
                  <td class="px-6 py-4 text-sm font-bold text-gray-900 dark:text-white">
                    <div class="flex items-center">
                      <div class="w-9 h-9 rounded-full bg-primary-500/20 flex items-center justify-center mr-3 text-primary-600 dark:text-primary-400 font-black">
                        {{ cashier.cashierName?.charAt(0) }}
                      </div>
                      {{ cashier.cashierName }}
                    </div>
                  </td>
                  <td class="px-6 py-4 text-sm text-gray-900 dark:text-white text-right font-black">{{ formatCurrency(cashier.totalSales) }}</td>
                  <td class="px-6 py-4 text-sm text-gray-600 dark:text-gray-400 text-right font-bold">{{ formatNumber(cashier.transactionCount) }}</td>
                  <td class="px-6 py-4 text-sm text-gray-900 dark:text-white text-right font-bold">{{ formatCurrency(cashier.averageTicket) }}</td>
                  <td class="px-6 py-4 text-sm text-gray-600 dark:text-gray-400 text-right">{{ cashier.averageTransactionTime || 'N/A' }}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <!-- Trends Tab -->
        <div v-else-if="activeTab === 'trends'" class="glass-card p-0 overflow-hidden">
          <div class="p-6 border-b border-white/10">
            <h2 class="text-xl font-black text-gray-900 dark:text-white tracking-tight">Sales Trends Over Time</h2>
          </div>
          <div v-if="salesTrends && salesTrends.trends && salesTrends.trends.length > 0">
            <div class="overflow-x-auto">
              <table class="min-w-full">
                <thead>
                  <tr class="bg-white/10 dark:bg-black/10">
                    <th class="px-6 py-4 text-left text-xs font-black text-gray-500 uppercase tracking-widest">Period</th>
                    <th class="px-6 py-4 text-right text-xs font-black text-gray-500 uppercase tracking-widest">Sales</th>
                    <th class="px-6 py-4 text-right text-xs font-black text-gray-500 uppercase tracking-widest">Orders</th>
                    <th class="px-6 py-4 text-right text-xs font-black text-gray-500 uppercase tracking-widest">Avg Order</th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-white/10">
                  <tr v-for="trend in salesTrends.trends" :key="trend.period" class="hover:bg-white/20 dark:hover:bg-white/5 transition-colors">
                    <td class="px-6 py-4 text-sm font-bold text-gray-900 dark:text-white tracking-wide">{{ trend.period }}</td>
                    <td class="px-6 py-4 text-sm text-gray-900 dark:text-white text-right font-black">{{ formatCurrency(trend.sales) }}</td>
                    <td class="px-6 py-4 text-sm text-gray-600 dark:text-gray-400 text-right font-bold">{{ formatNumber(trend.transactions) }}</td>
                    <td class="px-6 py-4 text-sm text-gray-900 dark:text-white text-right font-bold">
                      {{ formatCurrency(trend.transactions > 0 ? trend.sales / trend.transactions : 0) }}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
          <div v-else class="text-center py-24 text-gray-500 dark:text-gray-400">
            <div class="mb-4 inline-block p-4 bg-gray-100 dark:bg-white/5 rounded-full">
              <i class="fas fa-chart-line text-4xl"></i>
            </div>
            <p class="font-bold text-lg">No trend data available for the selected period</p>
            <p class="text-sm opacity-60">Try selecting a different time range or store</p>
          </div>
        </div>
      </template>
    </div>
  </div>
</template>





