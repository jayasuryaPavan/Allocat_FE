<template>
  <div class="space-y-6">
    <!-- Page header -->
    <div class="md:flex md:items-center md:justify-between">
      <div class="flex-1 min-w-0">
        <h2 class="text-2xl font-bold leading-7 text-gray-900 dark:text-white sm:text-3xl sm:truncate">
          Dashboard
        </h2>
        <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Welcome back, {{ currentUser?.firstName }}! Here's what's happening with your business today.
        </p>
      </div>
      <div class="mt-4 flex md:mt-0 md:ml-4">
        <button
          type="button"
          class="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-600 dark:text-white dark:hover:bg-gray-700"
        >
          <svg class="-ml-1 mr-2 h-5 w-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          Export
        </button>
      </div>
    </div>

    <!-- Stats grid -->
    <div class="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
      <div
        v-for="stat in stats"
        :key="stat.name"
        class="bg-white dark:bg-gray-800 overflow-hidden shadow rounded-lg"
      >
        <div class="p-5">
          <div class="flex items-center">
            <div class="flex-shrink-0">
              <component
                :is="stat.icon"
                :class="[
                  'h-6 w-6',
                  stat.iconColor
                ]"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              />
            </div>
            <div class="ml-5 w-0 flex-1">
              <dl>
                <dt class="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">
                  {{ stat.name }}
                </dt>
                <dd class="text-lg font-medium text-gray-900 dark:text-white">
                  {{ stat.value }}
                </dd>
              </dl>
            </div>
          </div>
        </div>
        <div class="bg-gray-50 dark:bg-gray-700 px-5 py-3">
          <div class="text-sm">
            <a
              :href="stat.href"
              class="font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300"
            >
              View all
            </a>
          </div>
        </div>
      </div>
    </div>

    <!-- Charts section -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <!-- Sales chart -->
      <div class="bg-white dark:bg-gray-800 shadow rounded-lg">
        <div class="px-4 py-5 sm:p-6">
          <h3 class="text-lg leading-6 font-medium text-gray-900 dark:text-white">
            Sales Overview
          </h3>
          <div class="mt-5">
            <div class="h-64 flex items-center justify-center text-gray-500 dark:text-gray-400">
              <div class="text-center">
                <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
                <p class="mt-2">Chart placeholder</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Recent activity -->
      <div class="bg-white dark:bg-gray-800 shadow rounded-lg">
        <div class="px-4 py-5 sm:p-6">
          <h3 class="text-lg leading-6 font-medium text-gray-900 dark:text-white">
            Recent Activity
          </h3>
          <div class="mt-5">
            <div class="flow-root">
              <ul class="-mb-8">
                <li
                  v-for="(activity, index) in recentActivity"
                  :key="activity.id"
                  class="relative pb-8"
                >
                  <div v-if="index !== recentActivity.length - 1" class="absolute top-4 left-4 -ml-px h-full w-0.5 bg-gray-200 dark:bg-gray-700" />
                  <div class="relative flex space-x-3">
                    <div>
                      <span :class="[
                        'h-8 w-8 rounded-full flex items-center justify-center ring-8 ring-white dark:ring-gray-800',
                        activity.iconBg
                      ]">
                        <component
                          :is="activity.icon"
                          class="h-5 w-5 text-white"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        />
                      </span>
                    </div>
                    <div class="min-w-0 flex-1 pt-1.5 flex justify-between space-x-4">
                      <div>
                        <p class="text-sm text-gray-500 dark:text-gray-400">
                          {{ activity.description }}
                        </p>
                      </div>
                      <div class="text-right text-sm whitespace-nowrap text-gray-500 dark:text-gray-400">
                        <time :datetime="activity.datetime">{{ activity.time }}</time>
                      </div>
                    </div>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Quick actions -->
    <div class="bg-white dark:bg-gray-800 shadow rounded-lg">
      <div class="px-4 py-5 sm:p-6">
        <h3 class="text-lg leading-6 font-medium text-gray-900 dark:text-white">
          Quick Actions
        </h3>
        <div class="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <button
            v-for="action in quickActions"
            :key="action.name"
            @click="handleQuickAction(action.href)"
            class="relative group bg-white dark:bg-gray-700 p-6 focus-within:ring-2 focus-within:ring-inset focus-within:ring-blue-500 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-600"
          >
            <div>
              <span :class="[
                'rounded-lg inline-flex p-3',
                action.iconBg
              ]">
                <component
                  :is="action.icon"
                  class="h-6 w-6 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                />
              </span>
            </div>
            <div class="mt-4">
              <h3 class="text-lg font-medium text-gray-900 dark:text-white">
                {{ action.name }}
              </h3>
              <p class="mt-2 text-sm text-gray-500 dark:text-gray-400">
                {{ action.description }}
              </p>
            </div>
            <span
              class="pointer-events-none absolute top-6 right-6 text-gray-300 group-hover:text-gray-400"
              aria-hidden="true"
            >
              <svg class="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clip-rule="evenodd" />
              </svg>
            </span>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/core/stores/auth'

// Icons
import {
  CurrencyDollarIcon,
  ShoppingCartIcon,
  UsersIcon,
  ChartBarIcon,
  PlusIcon,
  ShoppingBagIcon,
  ArchiveBoxIcon,
  UserGroupIcon
} from '@heroicons/vue/24/outline'

const router = useRouter()
const authStore = useAuthStore()

// Computed
const currentUser = computed(() => authStore.currentUser)

const stats = computed(() => [
  {
    name: 'Total Sales',
    value: '$45,231.89',
    icon: CurrencyDollarIcon,
    iconColor: 'text-green-600',
    href: '/reports/sales'
  },
  {
    name: 'Orders',
    value: '2,350',
    icon: ShoppingCartIcon,
    iconColor: 'text-blue-600',
    href: '/pos'
  },
  {
    name: 'Customers',
    value: '1,234',
    icon: UsersIcon,
    iconColor: 'text-purple-600',
    href: '/customers'
  },
  {
    name: 'Products',
    value: '567',
    icon: ChartBarIcon,
    iconColor: 'text-orange-600',
    href: '/products'
  }
])

const recentActivity = computed(() => [
  {
    id: 1,
    description: 'New order #1234 created',
    icon: ShoppingCartIcon,
    iconBg: 'bg-blue-500',
    datetime: '2024-01-15T10:00:00Z',
    time: '2 hours ago'
  },
  {
    id: 2,
    description: 'Product "Widget A" stock updated',
    icon: ArchiveBoxIcon,
    iconBg: 'bg-green-500',
    datetime: '2024-01-15T09:30:00Z',
    time: '3 hours ago'
  },
  {
    id: 3,
    description: 'New customer "John Doe" registered',
    icon: UserGroupIcon,
    iconBg: 'bg-purple-500',
    datetime: '2024-01-15T08:45:00Z',
    time: '4 hours ago'
  }
])

const quickActions = computed(() => [
  {
    name: 'New Sale',
    description: 'Create a new point of sale transaction',
    icon: PlusIcon,
    iconBg: 'bg-blue-500',
    href: '/pos'
  },
  {
    name: 'Add Product',
    description: 'Add a new product to inventory',
    icon: ShoppingBagIcon,
    iconBg: 'bg-green-500',
    href: '/products'
  },
  {
    name: 'Manage Inventory',
    description: 'Update stock levels and locations',
    icon: ArchiveBoxIcon,
    iconBg: 'bg-orange-500',
    href: '/inventory'
  },
  {
    name: 'View Reports',
    description: 'Access business analytics and reports',
    icon: ChartBarIcon,
    iconBg: 'bg-purple-500',
    href: '/reports'
  }
])

// Methods
const handleQuickAction = (href: string) => {
  router.push(href)
}
</script>

