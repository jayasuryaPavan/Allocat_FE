<template>
  <div class="h-full flex flex-col">
    <!-- Logo -->
    <div 
      :class="[
        'relative h-16 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700',
        collapsed ? 'flex items-center justify-center' : 'flex items-center justify-between px-4'
      ]"
    >
      <div v-if="!collapsed" class="flex items-center flex-1 min-w-0">
        <img 
          src="@/assets/images/logo-icon.png" 
          alt="Allocat mERP" 
          class="w-10 h-10 rounded-lg shadow-md flex-shrink-0 object-contain"
        />
        <span class="ml-3 text-lg font-bold text-gray-900 dark:text-white whitespace-nowrap">Allocat mERP</span>
      </div>
      
      <!-- Logo when collapsed (centered) -->
      <img 
        v-if="collapsed" 
        src="@/assets/images/logo-icon.png" 
        alt="Allocat mERP" 
        class="w-10 h-10 rounded-lg shadow-md object-contain"
      />
      
      <!-- Toggle button -->
      <button
        v-if="!collapsed"
        @click="$emit('toggle')"
        title="Collapse sidebar"
        class="touch-button p-3 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 dark:text-gray-500 dark:hover:text-gray-300 transition-all active:bg-gray-200 flex-shrink-0 mr-2"
      >
        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
        </svg>
      </button>
      
      <!-- Toggle button when collapsed (positioned at bottom of logo area) -->
      <button
        v-if="collapsed"
        @click="$emit('toggle')"
        title="Expand sidebar"
        class="absolute bottom-0 right-0 p-2 m-1 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 transition-all active:bg-gray-200 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm shadow-sm"
      >
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 5l7 7-7 7M5 5l7 7-7 7" />
        </svg>
      </button>
    </div>

    <!-- Navigation -->
    <nav class="flex-1 px-4 py-4 space-y-2 overflow-y-auto">
      <template v-for="item in visibleItems" :key="item.name">
        <router-link
          :to="item.href"
          :title="collapsed ? item.name : ''"
          :class="[
            'group flex items-center px-4 py-3.5 text-base font-medium rounded-xl transition-all duration-200 mb-1 touch-no-select active:scale-98',
            collapsed ? 'justify-center mx-2' : 'mx-3',
            isActiveRoute(item.href)
              ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-200 shadow-sm'
              : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-300 dark:hover:bg-gray-700 dark:hover:text-white active:bg-gray-200'
          ]"
        >
          <component
            :is="item.icon"
            :class="[
              'flex-shrink-0 w-6 h-6 transition-colors',
              isActiveRoute(item.href)
                ? 'text-blue-600 dark:text-blue-400'
                : 'text-gray-400 group-hover:text-gray-600 dark:group-hover:text-gray-300'
            ]"
          />
          <span v-if="!collapsed" class="ml-3 truncate">{{ item.name }}</span>
        </router-link>
      </template>
    </nav>

    <!-- User section -->
    <div class="border-t border-gray-200 dark:border-gray-700 p-4">
      <div v-if="!collapsed" class="flex items-center">
        <div class="flex-shrink-0">
          <img
            v-if="currentUser?.avatar"
            :src="currentUser.avatar"
            :alt="currentUser.fullName"
            class="w-8 h-8 rounded-full"
          />
          <div
            v-else
            class="w-8 h-8 rounded-full bg-gray-300 dark:bg-gray-600 flex items-center justify-center"
          >
            <span class="text-sm font-medium text-gray-700 dark:text-gray-300">
              {{ currentUser?.firstName?.charAt(0) }}{{ currentUser?.lastName?.charAt(0) }}
            </span>
          </div>
        </div>
        <div class="ml-3">
          <p class="text-sm font-medium text-gray-900 dark:text-white">
            {{ currentUser?.fullName }}
          </p>
          <p class="text-xs text-gray-500 dark:text-gray-400">
            {{ currentUser?.role?.displayName || currentUser?.role?.name }}
          </p>
        </div>
      </div>
      <div v-else class="flex justify-center">
        <div class="w-8 h-8 rounded-full bg-gray-300 dark:bg-gray-600 flex items-center justify-center">
          <span class="text-sm font-medium text-gray-700 dark:text-gray-300">
            {{ currentUser?.firstName?.charAt(0) }}{{ currentUser?.lastName?.charAt(0) }}
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { useAuthStore } from '@/core/stores/auth'

// Icons
import {
  HomeIcon,
  ShoppingCartIcon,
  CubeIcon,
  ArchiveBoxIcon,
  ShoppingBagIcon,
  UsersIcon,
  ChartBarIcon,
  CogIcon
} from '@heroicons/vue/24/outline'

interface Props {
  collapsed: boolean
}

defineProps<Props>()
defineEmits<{
  toggle: []
}>()

const route = useRoute()
const authStore = useAuthStore()

// Computed
const currentUser = computed(() => authStore.currentUser)

const navigationItems = computed(() => [
  {
    name: 'Dashboard',
    href: '/dashboard',
    icon: HomeIcon,
    roles: ['*'], // Available to all authenticated users
    permissions: []
  },
  {
    name: 'POS',
    href: '/pos',
    icon: ShoppingCartIcon,
    roles: ['SALES_STAFF', 'STORE_MANAGER', 'ADMIN', 'SUPER_ADMIN'],
    permissions: ['orders:create']
  },
  {
    name: 'Products',
    href: '/products',
    icon: CubeIcon,
    roles: ['INVENTORY_MANAGER', 'STORE_MANAGER', 'ADMIN', 'SUPER_ADMIN'],
    permissions: ['products:read']
  },
  {
    name: 'Inventory',
    href: '/inventory',
    icon: ArchiveBoxIcon,
    roles: ['INVENTORY_MANAGER', 'STORE_MANAGER', 'ADMIN', 'SUPER_ADMIN', 'WAREHOUSE_STAFF'],
    permissions: ['inventory:read']
  },
  {
    name: 'Purchases',
    href: '/purchases',
    icon: ShoppingBagIcon,
    roles: ['STORE_MANAGER', 'ADMIN', 'SUPER_ADMIN'],
    permissions: ['orders:read']
  },
  {
    name: 'Customers',
    href: '/customers',
    icon: UsersIcon,
    roles: ['SALES_STAFF', 'STORE_MANAGER', 'ADMIN', 'SUPER_ADMIN', 'VIEWER'],
    permissions: ['customers:read']
  },
  {
    name: 'Reports',
    href: '/reports',
    icon: ChartBarIcon,
    roles: ['STORE_MANAGER', 'ACCOUNTANT', 'ADMIN', 'SUPER_ADMIN'],
    permissions: ['reports:view']
  },
  {
    name: 'Analytics',
    href: '/analytics/enhanced',
    icon: ChartBarIcon,
    roles: ['STORE_MANAGER', 'ADMIN', 'SUPER_ADMIN'],
    permissions: ['analytics:read']
  },
  {
    name: 'Profitability',
    href: '/analytics/profitability',
    icon: ChartBarIcon,
    roles: ['STORE_MANAGER', 'ADMIN', 'SUPER_ADMIN'],
    permissions: ['analytics:read']
  },
  {
    name: 'Settings',
    href: '/settings',
    icon: CogIcon,
    roles: ['*'], // Available to all authenticated users
    permissions: []
  },
  {
    name: 'Admin',
    href: '/admin',
    icon: CogIcon,
    roles: ['ADMIN', 'SUPER_ADMIN'],
    permissions: ['users:read']
  },
  {
    name: 'Users',
    href: '/admin/users',
    icon: UsersIcon,
    roles: ['ADMIN', 'SUPER_ADMIN'],
    permissions: ['users:read']
  },
  // Note: Stores module is intentionally NOT added to sidebar per requirement
])

// Methods
const isActiveRoute = (href: string): boolean => {
  return route.path === href || route.path.startsWith(href + '/')
}

// Filter by role/permission
const visibleItems = computed(() => {
  const user = currentUser.value
  return (navigationItems.value as any[]).filter(item => {
    // Role check
    const roleOk = item.roles?.includes('*') || (user && authStore.hasAnyRole(item.roles || []))
    // Permission check
    const permOk = !item.permissions || item.permissions.length === 0 || (user && authStore.hasAnyPermissions(item.permissions))
    return roleOk && permOk
  })
})
</script>

