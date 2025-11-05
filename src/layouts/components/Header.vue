<template>
  <header class="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
    <div class="flex items-center justify-between h-16 px-4">
      <!-- Left side -->
      <div class="flex items-center">
        <!-- Mobile menu button -->
        <button
          @click="$emit('toggle-sidebar')"
          class="lg:hidden p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700"
        >
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>

        <!-- Desktop sidebar toggle -->
        <!-- <button
          @click="$emit('toggle-sidebar')"
          class="hidden lg:block p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button> -->

        <!-- Breadcrumb -->
        <nav class="hidden md:flex ml-4" aria-label="Breadcrumb">
          <ol class="flex items-center space-x-2">
            <li>
              <router-link to="/dashboard" class="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z" />
                </svg>
              </router-link>
            </li>
            <li v-for="(crumb, index) in breadcrumbs" :key="index">
              <div class="flex items-center">
                <svg class="w-4 h-4 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clip-rule="evenodd" />
                </svg>
                <span class="ml-2 text-sm text-gray-500 dark:text-gray-400">{{ crumb }}</span>
              </div>
            </li>
          </ol>
        </nav>
      </div>

      <!-- Right side -->
      <div class="flex items-center space-x-4">
        <!-- Change Store button for SUPER_ADMIN -->
        <div v-if="isSuperAdmin" class="hidden md:block">
          <button @click="openStoreModal" class="px-3 py-1 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700">Change store</button>
        </div>
        

        <!-- Theme toggle -->
        <button
          @click="$emit('toggle-theme')"
          class="p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700"
          :title="isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'"
        >
          <svg v-if="isDarkMode" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
          </svg>
          <svg v-else class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
          </svg>
        </button>

        <!-- Notifications -->
        <div class="relative">
          <button
            @click="toggleNotifications"
            class="p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700 relative"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-5 5v-5zM4 19h5l-5-5v5zM15 7h5l-5-5v5zM4 7h5l-5 5V7z" />
            </svg>
            <span v-if="hasUnreadNotifications" class="absolute -top-1 -right-1 h-3 w-3 bg-red-500 rounded-full"></span>
          </button>

          <!-- Notifications dropdown -->
          <div
            v-if="showNotifications"
            class="absolute right-0 mt-2 w-80 bg-white dark:bg-gray-800 rounded-md shadow-lg ring-1 ring-black ring-opacity-5 z-50"
          >
            <div class="p-4">
              <h3 class="text-lg font-medium text-gray-900 dark:text-white">Notifications</h3>
              <div class="mt-2 space-y-2">
                <div class="text-sm text-gray-500 dark:text-gray-400">No new notifications</div>
              </div>
            </div>
          </div>
        </div>

        <!-- Development Toggle (only in development) -->
        <div v-if="isDevelopment" class="mr-4">
          <button
            @click="toggleDevMode"
            :class="[
              'px-3 py-1 text-xs font-medium rounded-full transition-colors',
              isDevMode ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' : 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300'
            ]"
            title="Toggle Development Mode"
          >
            {{ isDevMode ? 'DEV ON' : 'DEV OFF' }}
          </button>
        </div>

        <!-- User menu -->
        <div class="relative">
          <button
            @click="toggleUserMenu"
            class="flex items-center space-x-3 p-2 rounded-md text-gray-700 hover:text-gray-900 hover:bg-gray-100 dark:text-gray-300 dark:hover:text-white dark:hover:bg-gray-700"
          >
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
            <div class="hidden md:block text-left">
              <p class="text-sm font-medium text-gray-900 dark:text-white">
                {{ currentUser?.fullName }}
              </p>
              <p class="text-xs text-gray-500 dark:text-gray-400">
                {{ currentUser?.role?.displayName }}
              </p>
            </div>
            <svg class="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
            </svg>
          </button>

          <!-- User dropdown -->
          <div
            v-if="showUserMenu"
            class="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-md shadow-lg ring-1 ring-black ring-opacity-5 z-50"
          >
            <div class="py-1">
              <router-link
                to="/profile"
                class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"
              >
                Profile
              </router-link>
              <router-link
                to="/settings"
                class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"
              >
                Settings
              </router-link>
              <div class="border-t border-gray-100 dark:border-gray-700"></div>
              <button
                @click="$emit('logout')"
                class="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"
              >
                Sign out
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Store selection modal -->
    <div v-if="showStoreModal" class="fixed inset-0 z-50">
      <div class="absolute inset-0 bg-black/50" @click="closeStoreModal"></div>
      <div class="absolute inset-0 flex items-center justify-center p-4">
        <div class="w-full max-w-md bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700">
          <div class="px-4 py-3 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
            <h4 class="text-sm font-medium text-gray-900 dark:text-white">Select Store</h4>
            <button @click="closeStoreModal" class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>
            </button>
          </div>
          <div class="max-h-80 overflow-y-auto">
            <button
              v-for="s in stores"
              :key="s.id"
              @click="selectStore(String(s.id))"
              class="w-full text-left px-4 py-3 text-sm flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-700"
            >
              <span class="text-gray-900 dark:text-white">{{ s.code }} - {{ s.name }}</span>
              <span v-if="String(s.code) === activeStoreCode" class="text-xs text-blue-600 dark:text-blue-400">Active</span>
            </button>
          </div>
          <div class="px-4 py-3 border-t border-gray-200 dark:border-gray-700 text-right">
            <button @click="closeStoreModal" class="px-3 py-1 text-sm bg-gray-200 dark:bg-gray-700 rounded-md">Close</button>
          </div>
        </div>
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRoute } from 'vue-router'
import { useAuthStore } from '@/core/stores/auth'
import { useThemeStore } from '@/core/stores/theme'
import { environment } from '@/environments'
import { StoresApiService } from '@/core/services/storesApi'

interface Props {
  sidebarCollapsed: boolean
}

defineProps<Props>()

defineEmits<{
  'toggle-sidebar': []
  'toggle-theme': []
  logout: []
}>()

const route = useRoute()
const authStore = useAuthStore()
const themeStore = useThemeStore()

// State
const showUserMenu = ref(false)
const showNotifications = ref(false)
const hasUnreadNotifications = ref(false)
const isDevMode = ref(environment.features.enableDevBypass)

// Computed
const isDevelopment = computed(() => environment.development)

// Computed
const currentUser = computed(() => authStore.currentUser)
const isDarkMode = computed(() => themeStore.isDarkMode)
const isSuperAdmin = computed(() => (currentUser.value?.role?.name || '').toUpperCase() === 'SUPER_ADMIN')

// Store switcher state (using store code instead of ID)
const activeStoreCode = ref<string | null>(localStorage.getItem('active_store_code'))
const stores = ref<{ id: number; code: string; name: string }[]>([])

const showStoreModal = ref(false)
const openStoreModal = () => { showStoreModal.value = true }
const closeStoreModal = () => { showStoreModal.value = false }
const selectStore = (code: string) => {
  activeStoreCode.value = code
  localStorage.setItem('active_store_code', code)
  showStoreModal.value = false
}

onMounted(async () => {
  if (isSuperAdmin.value) {
    try {
      const resp = await StoresApiService.list({ active: true })
      if (resp.success) {
        stores.value = resp.data
        if (!activeStoreCode.value && stores.value.length > 0) {
          activeStoreCode.value = stores.value[0].code
          localStorage.setItem('active_store_code', stores.value[0].code)
        }
      }
    } catch {}
  }
})

const breadcrumbs = computed(() => {
  const path = route.path
  const segments = path.split('/').filter(Boolean)
  
  return segments.map(segment => {
    return segment.charAt(0).toUpperCase() + segment.slice(1)
  })
})

// Methods
const toggleUserMenu = () => {
  showUserMenu.value = !showUserMenu.value
  showNotifications.value = false
}

const toggleNotifications = () => {
  showNotifications.value = !showNotifications.value
  showUserMenu.value = false
}

const toggleDevMode = () => {
  isDevMode.value = !isDevMode.value
  environment.features.enableDevBypass = isDevMode.value
  
  if (isDevMode.value) {
    // Re-initialize auth with dev bypass
    authStore.initializeAuth()
    console.log('🚀 Development mode enabled - Auto-logged in')
  } else {
    // Logout and require real authentication
    authStore.logout()
    console.log('🔒 Development mode disabled - Authentication required')
  }
}

const handleClickOutside = (event: MouseEvent) => {
  const target = event.target as HTMLElement
  if (!target.closest('.relative')) {
    showUserMenu.value = false
    showNotifications.value = false
  }
}

// Lifecycle
onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})
</script>

