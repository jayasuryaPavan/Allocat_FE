<template>
  <div class="h-full flex flex-col">
    <!-- Logo -->
    <div 
      :class="[
        'h-16 bg-white/40 dark:bg-gray-900/40 backdrop-blur-glass shadow-glass-glow',
        collapsed ? 'flex items-center justify-center px-2' : 'flex items-center justify-between px-4'
      ]"
    >
      <div v-if="!collapsed" class="flex items-center flex-1 min-w-0">
        <img 
          src="@/assets/images/logo-icon.png" 
          alt="Allocat mERP" 
          class="w-10 h-10 rounded-xl shadow-glow-sm flex-shrink-0 object-contain p-1 bg-white/10 backdrop-blur-sm border border-white/20"
        />
        <span class="ml-3 text-lg font-bold text-gray-900 dark:text-white whitespace-nowrap tracking-tight">Allocat mERP</span>
      </div>
      
      <!-- Logo when collapsed (centered) -->
      <img 
        v-if="collapsed" 
        src="@/assets/images/logo-icon.png" 
        alt="Allocat mERP" 
        class="w-9 h-9 rounded-xl shadow-glow-sm object-contain p-1 bg-white/10 backdrop-blur-sm border border-white/20"
      />
      
      <!-- Toggle button (only when expanded) -->
      <button
        v-if="!collapsed"
        @click="$emit('toggle')"
        title="Collapse sidebar"
        class="touch-button p-2 rounded-xl text-gray-400 hover:text-primary-500 hover:bg-primary-500/10 dark:hover:bg-primary-500/20 dark:text-gray-500 dark:hover:text-primary-400 transition-all active:bg-primary-500/20 flex-shrink-0"
      >
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
        </svg>
      </button>
    </div>

    <!-- Toggle button when collapsed (at top of nav) -->
    <button
      v-if="collapsed"
      @click="$emit('toggle')"
      title="Expand sidebar"
      class="mx-auto mt-2 p-2 rounded-xl text-gray-400 hover:text-primary-500 hover:bg-primary-500/10 dark:hover:bg-primary-500/20 transition-all active:bg-primary-500/20"
    >
      <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 5l7 7-7 7M5 5l7 7-7 7" />
      </svg>
    </button>

    <!-- Navigation -->
    <nav :class="['flex-1 py-4 space-y-1.5 overflow-y-auto flex flex-col', collapsed ? 'justify-center px-1' : 'justify-start px-2']">
      <template v-for="item in visibleItems" :key="item.name">
        <router-link
          :to="item.href"
          :title="collapsed ? item.name : ''"
          :class="[
            'group flex items-center text-sm font-medium rounded-2xl transition-all duration-300 touch-no-select active:scale-95',
            collapsed ? 'justify-center p-3 mx-auto w-12' : 'px-4 py-3 mx-2',
            isActiveRoute(item.href)
              ? 'bg-primary-500/20 text-primary-600 dark:text-primary-300 shadow-glow-sm border border-primary-500/30 dark:border-primary-400/30 backdrop-blur-md'
              : 'text-gray-700 hover:bg-white/40 dark:hover:bg-white/5 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white'
          ]"
        >
          <component
            :is="item.icon"
            :class="[
              'flex-shrink-0 w-6 h-6 transition-transform duration-300 group-hover:scale-110',
              isActiveRoute(item.href)
                ? 'text-primary-500 dark:text-primary-400'
                : 'text-gray-400 group-hover:text-primary-500 dark:group-hover:text-primary-400'
            ]"
          />
          <span v-if="!collapsed" class="ml-3 truncate tracking-wide font-semibold">{{ item.name }}</span>
        </router-link>
      </template>
    </nav>

    <!-- User section -->
    <div class="p-4">
      <div v-if="!collapsed" class="flex items-center">
        <div class="flex-shrink-0">
          <img
            v-if="currentUser?.avatar"
            :src="currentUser.avatar"
            :alt="currentUser.fullName"
            class="w-9 h-9 rounded-full border border-primary-500/30"
          />
          <div
            v-else
            class="w-9 h-9 rounded-full bg-primary-500/10 dark:bg-primary-500/20 flex items-center justify-center border border-primary-500/30 shadow-glow-sm"
          >
            <span class="text-sm font-bold text-primary-600 dark:text-primary-400">
              {{ currentUser?.firstName?.charAt(0) }}{{ currentUser?.lastName?.charAt(0) }}
            </span>
          </div>
        </div>
        <div class="ml-3 min-w-0">
          <p class="text-sm font-bold text-gray-900 dark:text-white truncate">
            {{ currentUser?.fullName }}
          </p>
          <p class="text-xs text-gray-500 dark:text-gray-400 truncate">
            {{ currentUser?.role?.displayName || currentUser?.role?.name }}
          </p>
        </div>
      </div>
      <div v-else class="flex justify-center">
        <div class="w-9 h-9 rounded-full bg-primary-500/10 dark:bg-primary-500/20 flex items-center justify-center border border-primary-500/30 shadow-glow-sm">
          <span class="text-xs font-bold text-primary-600 dark:text-primary-400">
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
  ArchiveBoxIcon,
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
    href: '/pos-kiosk',
    icon: ShoppingCartIcon,
    roles: ['SALES_STAFF', 'STORE_MANAGER', 'ADMIN', 'SUPER_ADMIN'],
    permissions: ['orders:create']
  },
  {
    name: 'Inventory',
    href: '/inventory',
    icon: ArchiveBoxIcon,
    roles: ['INVENTORY_MANAGER', 'STORE_MANAGER', 'ADMIN', 'SUPER_ADMIN', 'WAREHOUSE_STAFF'],
    permissions: ['inventory:read']
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
  // Note: Settings moved to user dropdown in Header
  // Note: Customers moved to Admin section
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

