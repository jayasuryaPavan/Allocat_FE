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
        <div class="w-10 h-10 bg-gradient-to-br from-blue-600 to-blue-700 rounded-lg flex items-center justify-center shadow-md flex-shrink-0">
          <svg class="w-6 h-6 text-white" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2L3 7v3l9 5 9-5V7L12 2zm0 2.18L18.09 7 12 10.82 5.91 7 12 4.18zM5 9.37l7 3.89v7.56l-7-3.89V9.37zm9 11.45v-7.56l7-3.89v7.56l-7 3.89z"/>
          </svg>
        </div>
        <span class="ml-3 text-xl font-bold text-gray-900 dark:text-white truncate">Allocat</span>
      </div>
      
      <!-- Logo when collapsed (centered) -->
      <div v-if="collapsed" class="w-10 h-10 bg-gradient-to-br from-blue-600 to-blue-700 rounded-lg flex items-center justify-center shadow-md">
        <svg class="w-6 h-6 text-white" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 2L3 7v3l9 5 9-5V7L12 2zm0 2.18L18.09 7 12 10.82 5.91 7 12 4.18zM5 9.37l7 3.89v7.56l-7-3.89V9.37zm9 11.45v-7.56l7-3.89v7.56l-7 3.89z"/>
        </svg>
      </div>
      
      <!-- Toggle button -->
      <button
        v-if="!collapsed"
        @click="$emit('toggle')"
        title="Collapse sidebar"
        class="p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors flex-shrink-0"
      >
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
        </svg>
      </button>
      
      <!-- Toggle button when collapsed (positioned at bottom of logo area) -->
      <button
        v-if="collapsed"
        @click="$emit('toggle')"
        title="Expand sidebar"
        class="absolute bottom-1 right-1 p-1.5 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
      >
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
            'group flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors duration-200',
            collapsed ? 'justify-center' : '',
            isActiveRoute(item.href)
              ? 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-200'
              : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-300 dark:hover:bg-gray-700 dark:hover:text-white'
          ]"
        >
          <component
            :is="item.icon"
            :class="[
              'flex-shrink-0 w-5 h-5',
              isActiveRoute(item.href)
                ? 'text-blue-500 dark:text-blue-400'
                : 'text-gray-400 group-hover:text-gray-500 dark:group-hover:text-gray-300'
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

