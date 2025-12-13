<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useProfitStore } from '../stores/profitStore'
import { useAuthStore } from '@/core/stores/auth'

type QuickRange = 'today' | 'week' | 'month'

const profitStore = useProfitStore()
const authStore = useAuthStore()

const storeId = ref<number>(() => {
  const userDetails = JSON.parse(sessionStorage.getItem('user_details') || '{}')
  return Number(userDetails.storeId || (authStore.currentUser as any)?.storeId || 1)
}() as number)

const startDate = ref('')
const endDate = ref('')
const validationError = ref<string | null>(null)

const isLoading = computed(() => profitStore.isLoading)
const error = computed(() => profitStore.error)
const data = computed(() => profitStore.data)

const setDefaultRange = (range: QuickRange) => {
  const now = new Date()
  const todayStr = now.toISOString().split('T')[0]

  if (range === 'today') {
    startDate.value = todayStr
    endDate.value = todayStr
  } else if (range === 'week') {
    const weekAgo = new Date(now)
    weekAgo.setDate(weekAgo.getDate() - 6)
    startDate.value = weekAgo.toISOString().split('T')[0]
    endDate.value = todayStr
  } else if (range === 'month') {
    const firstDay = new Date(now.getFullYear(), now.getMonth(), 1)
    startDate.value = firstDay.toISOString().split('T')[0]
    endDate.value = todayStr
  }
}

const validateDates = () => {
  if (!startDate.value || !endDate.value) {
    validationError.value = 'Please select both start and end dates.'
    return false
  }
  if (endDate.value < startDate.value) {
    validationError.value = 'End date cannot be earlier than start date.'
    return false
  }
  validationError.value = null
  return true
}

const fetchData = async () => {
  if (!validateDates()) return
  await profitStore.loadProfitability(storeId.value, startDate.value, endDate.value)
}

const handleQuickRange = async (range: QuickRange) => {
  setDefaultRange(range)
  await fetchData()
}

const formatCurrency = (value?: number) => {
  if (value === undefined || value === null) return '$0.00'
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(value)
}

const formatPercent = (value?: number) => {
  if (value === undefined || value === null) return '0%'
  return `${value.toFixed(2)}%`
}

const isEmptyState = computed(() => {
  if (!data.value) return true
  const d = data.value
  return (
    (!d.topProfitableProducts || d.topProfitableProducts.length === 0) &&
    (!d.leastProfitableProducts || d.leastProfitableProducts.length === 0) &&
    (!d.categoryProfit || d.categoryProfit.length === 0) &&
    (!d.dailyProfitTrend || d.dailyProfitTrend.length === 0)
  )
})

onMounted(() => {
  setDefaultRange('week')
  fetchData()
})
</script>

<template>
  <div class="min-h-screen bg-gray-50 p-6">
    <div class="max-w-7xl mx-auto">
      <div class="mb-6 flex items-center justify-between">
        <div>
          <h1 class="text-3xl font-bold text-gray-900">Profitability</h1>
          <p class="text-gray-600 mt-1">Track revenue, cost, and profit performance</p>
        </div>
      </div>

      <!-- Filters -->
      <div class="bg-white rounded-lg shadow-sm p-4 mb-6 border border-gray-100">
        <div class="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Store ID</label>
            <input
              v-model.number="storeId"
              type="number"
              min="1"
              class="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
            <input
              v-model="startDate"
              type="date"
              class="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">End Date</label>
            <input
              v-model="endDate"
              type="date"
              class="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>
          <div class="flex gap-2">
            <button
              @click="fetchData"
              class="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
              :disabled="isLoading"
            >
              <i v-if="isLoading" class="fas fa-spinner fa-spin mr-2"></i>
              Fetch
            </button>
            <button
              @click="handleQuickRange('today')"
              class="px-3 py-2 bg-gray-100 text-gray-800 rounded-lg hover:bg-gray-200 transition"
            >
              Today
            </button>
            <button
              @click="handleQuickRange('week')"
              class="px-3 py-2 bg-gray-100 text-gray-800 rounded-lg hover:bg-gray-200 transition"
            >
              Last 7 Days
            </button>
            <button
              @click="handleQuickRange('month')"
              class="px-3 py-2 bg-gray-100 text-gray-800 rounded-lg hover:bg-gray-200 transition"
            >
              This Month
            </button>
          </div>
        </div>
        <p v-if="validationError" class="text-red-600 text-sm mt-2">{{ validationError }}</p>
      </div>

      <!-- Loading State -->
      <div v-if="isLoading" class="flex items-center justify-center py-16">
        <div class="text-center">
          <i class="fas fa-spinner fa-spin text-blue-600 text-4xl mb-3"></i>
          <p class="text-gray-600">Loading profitability data...</p>
        </div>
      </div>

      <!-- Error State -->
      <div v-else-if="error" class="bg-red-50 border border-red-200 text-red-800 rounded-lg p-4">
        <div class="flex items-center">
          <i class="fas fa-exclamation-circle mr-2"></i>
          <span>{{ error }}</span>
        </div>
      </div>

      <!-- Empty State -->
      <div v-else-if="isEmptyState" class="bg-white border border-dashed border-gray-300 rounded-lg p-10 text-center text-gray-500">
        <i class="fas fa-box-open text-4xl mb-3"></i>
        <p>No profitability data found for the selected range.</p>
      </div>

      <!-- Content -->
      <div v-else>
        <!-- Summary Cards -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
          <div class="bg-white rounded-lg shadow-sm p-4 border border-gray-100">
            <p class="text-sm text-gray-500">Total Revenue</p>
            <p class="text-3xl font-bold text-gray-900">{{ formatCurrency(data?.summary.totalRevenue) }}</p>
          </div>
          <div class="bg-white rounded-lg shadow-sm p-4 border border-gray-100">
            <p class="text-sm text-gray-500">Total Cost</p>
            <p class="text-3xl font-bold text-gray-900">{{ formatCurrency(data?.summary.totalCost) }}</p>
          </div>
          <div class="bg-white rounded-lg shadow-sm p-4 border border-gray-100">
            <p class="text-sm text-gray-500">Net Profit</p>
            <p class="text-3xl font-bold text-green-600">{{ formatCurrency(data?.summary.netProfit) }}</p>
          </div>
          <div class="bg-white rounded-lg shadow-sm p-4 border border-gray-100">
            <p class="text-sm text-gray-500">Profit Margin</p>
            <p class="text-3xl font-bold text-blue-600">{{ formatPercent(data?.summary.profitMargin) }}</p>
          </div>
          <div class="bg-white rounded-lg shadow-sm p-4 border border-gray-100">
            <p class="text-sm text-gray-500">Orders</p>
            <p class="text-3xl font-bold text-gray-900">{{ data?.summary.orders ?? 0 }}</p>
          </div>
          <div class="bg-white rounded-lg shadow-sm p-4 border border-gray-100">
            <p class="text-sm text-gray-500">Items Sold</p>
            <p class="text-3xl font-bold text-gray-900">{{ data?.summary.itemsSold ?? 0 }}</p>
          </div>
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <!-- Top Profitable Products -->
          <div class="bg-white rounded-lg shadow-sm border border-gray-100">
            <div class="p-4 border-b border-gray-100 flex items-center justify-between">
              <h2 class="text-lg font-semibold text-gray-900">Top Profitable Products</h2>
            </div>
            <div class="overflow-x-auto">
              <table class="min-w-full divide-y divide-gray-200">
                <thead class="bg-gray-50">
                  <tr>
                    <th class="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">#</th>
                    <th class="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Product</th>
                    <th class="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">SKU</th>
                    <th class="px-4 py-2 text-right text-xs font-medium text-gray-500 uppercase">Net Profit</th>
                    <th class="px-4 py-2 text-right text-xs font-medium text-gray-500 uppercase">Margin %</th>
                    <th class="px-4 py-2 text-right text-xs font-medium text-gray-500 uppercase">Qty</th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-gray-200 bg-white">
                  <tr v-for="(row, idx) in data?.topProfitableProducts || []" :key="`${row.productName}-${idx}`" class="hover:bg-gray-50">
                    <td class="px-4 py-2 text-sm font-semibold text-gray-900">{{ row.rank || idx + 1 }}</td>
                    <td class="px-4 py-2 text-sm text-gray-900">{{ row.productName }}</td>
                    <td class="px-4 py-2 text-sm text-gray-500">{{ row.sku }}</td>
                    <td class="px-4 py-2 text-sm text-right font-semibold text-gray-900">{{ formatCurrency(row.netProfit) }}</td>
                    <td class="px-4 py-2 text-sm text-right text-gray-700">{{ formatPercent(row.profitMargin) }}</td>
                    <td class="px-4 py-2 text-sm text-right text-gray-700">{{ row.quantity }}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <!-- Least Profitable Products -->
          <div class="bg-white rounded-lg shadow-sm border border-gray-100">
            <div class="p-4 border-b border-gray-100 flex items-center justify-between">
              <h2 class="text-lg font-semibold text-gray-900">Least Profitable Products</h2>
            </div>
            <div class="overflow-x-auto">
              <table class="min-w-full divide-y divide-gray-200">
                <thead class="bg-gray-50">
                  <tr>
                    <th class="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Product</th>
                    <th class="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">SKU</th>
                    <th class="px-4 py-2 text-right text-xs font-medium text-gray-500 uppercase">Net Profit</th>
                    <th class="px-4 py-2 text-right text-xs font-medium text-gray-500 uppercase">Margin %</th>
                    <th class="px-4 py-2 text-right text-xs font-medium text-gray-500 uppercase">Qty</th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-gray-200 bg-white">
                  <tr v-for="(row, idx) in data?.leastProfitableProducts || []" :key="`${row.productName}-${idx}`" class="hover:bg-gray-50">
                    <td class="px-4 py-2 text-sm text-gray-900">{{ row.productName }}</td>
                    <td class="px-4 py-2 text-sm text-gray-500">{{ row.sku }}</td>
                    <td class="px-4 py-2 text-sm text-right font-semibold text-gray-900">{{ formatCurrency(row.netProfit) }}</td>
                    <td class="px-4 py-2 text-sm text-right text-gray-700">{{ formatPercent(row.profitMargin) }}</td>
                    <td class="px-4 py-2 text-sm text-right text-gray-700">{{ row.quantity }}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <!-- Category Profit -->
        <div class="bg-white rounded-lg shadow-sm border border-gray-100 mb-6">
          <div class="p-4 border-b border-gray-100 flex items-center justify-between">
            <h2 class="text-lg font-semibold text-gray-900">Category Profit</h2>
          </div>
          <div class="overflow-x-auto">
            <table class="min-w-full divide-y divide-gray-200">
              <thead class="bg-gray-50">
                <tr>
                  <th class="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Category</th>
                  <th class="px-4 py-2 text-right text-xs font-medium text-gray-500 uppercase">Qty</th>
                  <th class="px-4 py-2 text-right text-xs font-medium text-gray-500 uppercase">Revenue</th>
                  <th class="px-4 py-2 text-right text-xs font-medium text-gray-500 uppercase">Cost</th>
                  <th class="px-4 py-2 text-right text-xs font-medium text-gray-500 uppercase">Net Profit</th>
                  <th class="px-4 py-2 text-right text-xs font-medium text-gray-500 uppercase">Margin %</th>
                  <th class="px-4 py-2 text-right text-xs font-medium text-gray-500 uppercase">% of Total</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-gray-200 bg-white">
                <tr v-for="(row, idx) in data?.categoryProfit || []" :key="`${row.categoryName}-${idx}`" class="hover:bg-gray-50">
                  <td class="px-4 py-2 text-sm text-gray-900">{{ row.categoryName }}</td>
                  <td class="px-4 py-2 text-sm text-right text-gray-700">{{ row.quantity }}</td>
                  <td class="px-4 py-2 text-sm text-right font-semibold text-gray-900">{{ formatCurrency(row.revenue) }}</td>
                  <td class="px-4 py-2 text-sm text-right text-gray-700">{{ formatCurrency(row.cost) }}</td>
                  <td class="px-4 py-2 text-sm text-right font-semibold text-gray-900">{{ formatCurrency(row.netProfit) }}</td>
                  <td class="px-4 py-2 text-sm text-right text-gray-700">{{ formatPercent(row.profitMargin) }}</td>
                  <td class="px-4 py-2 text-sm text-right text-gray-700">{{ formatPercent(row.percentOfTotal) }}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <!-- Daily Profit Trend -->
        <div class="bg-white rounded-lg shadow-sm border border-gray-100">
          <div class="p-4 border-b border-gray-100 flex items-center justify-between">
            <h2 class="text-lg font-semibold text-gray-900">Daily Profit Trend</h2>
          </div>
          <div class="overflow-x-auto">
            <table class="min-w-full divide-y divide-gray-200">
              <thead class="bg-gray-50">
                <tr>
                  <th class="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                  <th class="px-4 py-2 text-right text-xs font-medium text-gray-500 uppercase">Revenue</th>
                  <th class="px-4 py-2 text-right text-xs font-medium text-gray-500 uppercase">Cost</th>
                  <th class="px-4 py-2 text-right text-xs font-medium text-gray-500 uppercase">Net Profit</th>
                  <th class="px-4 py-2 text-right text-xs font-medium text-gray-500 uppercase">Margin %</th>
                  <th class="px-4 py-2 text-right text-xs font-medium text-gray-500 uppercase">Orders</th>
                  <th class="px-4 py-2 text-right text-xs font-medium text-gray-500 uppercase">Items</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-gray-200 bg-white">
                <tr v-for="(row, idx) in data?.dailyProfitTrend || []" :key="`${row.date}-${idx}`" class="hover:bg-gray-50">
                  <td class="px-4 py-2 text-sm text-gray-900">{{ row.date }}</td>
                  <td class="px-4 py-2 text-sm text-right font-semibold text-gray-900">{{ formatCurrency(row.revenue) }}</td>
                  <td class="px-4 py-2 text-sm text-right text-gray-700">{{ formatCurrency(row.cost) }}</td>
                  <td class="px-4 py-2 text-sm text-right font-semibold text-gray-900">{{ formatCurrency(row.netProfit) }}</td>
                  <td class="px-4 py-2 text-sm text-right text-gray-700">{{ formatPercent(row.profitMargin) }}</td>
                  <td class="px-4 py-2 text-sm text-right text-gray-700">{{ row.orders }}</td>
                  <td class="px-4 py-2 text-sm text-right text-gray-700">{{ row.items }}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>





