<template>
  <header class="bg-white/40 dark:bg-gray-900/40 backdrop-blur-glass shadow-glass-glow sticky top-0 z-40">
    <div class="flex items-center justify-between h-16 px-6">
      <!-- Left side -->
      <div class="flex items-center">
        <!-- Mobile menu button -->
        <button
          @click="$emit('toggle-sidebar')"
          class="lg:hidden touch-button min-w-[48px] min-h-[48px] flex items-center justify-center rounded-xl text-gray-400 hover:text-primary-500 hover:bg-primary-500/10 dark:hover:bg-primary-500/20 active:bg-primary-500/20 transition-all touch-no-select"
        >
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>

        <!-- Breadcrumb -->
        <nav class="hidden md:flex" aria-label="Breadcrumb">
          <ol class="flex items-center space-x-2">
            <li>
              <router-link 
                to="/dashboard" 
                class="w-8 h-8 flex items-center justify-center rounded-lg text-gray-500 hover:text-primary-500 hover:bg-primary-500/10 dark:text-gray-400 dark:hover:text-primary-400 transition-all outline-none focus-visible:ring-0"
              >
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
              </router-link>
            </li>
            <li v-for="(crumb, index) in breadcrumbs" :key="index" class="flex items-center">
              <svg class="w-4 h-4 text-gray-400 mx-1" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clip-rule="evenodd" />
              </svg>
              <span class="text-sm font-semibold text-gray-600 dark:text-gray-300">{{ crumb }}</span>
            </li>
          </ol>
        </nav>
      </div>

      <!-- Right side -->
      <div class="flex items-center space-x-2 md:space-x-4">
        <!-- Change Store button for SUPER_ADMIN -->
        <div v-if="isSuperAdmin" class="hidden md:block">
          <button 
            @click="openStoreModal" 
            class="touch-button px-4 py-2 text-sm bg-primary-500/10 dark:bg-primary-500/20 text-primary-600 dark:text-primary-400 border border-primary-500/30 rounded-xl hover:bg-primary-500 hover:text-white dark:hover:bg-primary-500 dark:hover:text-white active:scale-95 transition-all shadow-glow-sm font-bold tracking-wide touch-no-select"
          >
            Change store
          </button>
        </div>
        

        <!-- Theme toggle -->
        <button
          @click="$emit('toggle-theme')"
          class="touch-button min-w-[48px] min-h-[48px] flex items-center justify-center rounded-xl text-gray-400 hover:text-primary-500 hover:bg-primary-500/10 dark:hover:bg-primary-500/20 active:bg-primary-500/20 transition-all touch-no-select"
          :title="isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'"
        >
          <svg v-if="isDarkMode" class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
          </svg>
          <svg v-else class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
          </svg>
        </button>

        <!-- Notifications -->
        <div class="relative">
          <button
            @click="toggleNotifications"
            class="touch-button min-w-[48px] min-h-[48px] flex items-center justify-center rounded-xl text-gray-400 hover:text-primary-500 hover:bg-primary-500/10 dark:hover:bg-primary-500/20 active:bg-primary-500/20 transition-all relative touch-no-select"
          >
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-5 5v-5zM4 19h5l-5-5v5zM15 7h5l-5-5v5zM4 7h5l-5 5V7z" />
            </svg>
            <span v-if="hasUnreadNotifications" class="absolute top-2 right-2 h-3 w-3 bg-accent-pink rounded-full ring-2 ring-white dark:ring-gray-900 animate-pulse"></span>
          </button>

          <!-- Notifications dropdown - Teleported to body for proper backdrop-filter -->
          <Teleport to="body">
            <div
              v-if="showNotifications"
              class="dropdown-glass fixed rounded-2xl z-[9999] overflow-hidden"
              :style="notificationsDropdownStyle"
            >
              <div class="p-4">
                <h3 class="text-lg font-medium text-gray-900 dark:text-white">Notifications</h3>
                <div class="mt-2 space-y-2">
                  <div class="text-sm text-gray-500 dark:text-gray-400">No new notifications</div>
                </div>
              </div>
            </div>
          </Teleport>
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
            class="touch-button flex items-center space-x-3 p-2 rounded-lg text-gray-700 hover:text-gray-900 hover:bg-gray-100 dark:text-gray-300 dark:hover:text-white dark:hover:bg-gray-700 active:bg-gray-200 transition-all touch-no-select"
          >
            <img
              v-if="currentUser?.avatar"
              :src="currentUser.avatar"
              :alt="currentUser.fullName"
              class="w-9 h-9 rounded-full border-2 border-gray-200 dark:border-gray-600"
            />
            <div
              v-else
              class="w-9 h-9 rounded-full bg-gray-300 dark:bg-gray-600 flex items-center justify-center border-2 border-gray-200 dark:border-gray-600"
            >
              <span class="text-sm font-bold text-gray-700 dark:text-gray-300">
                {{ currentUser?.firstName?.charAt(0) }}{{ currentUser?.lastName?.charAt(0) }}
              </span>
            </div>
            <div class="hidden md:block text-left">
              <p class="text-sm font-semibold text-gray-900 dark:text-white">
                {{ currentUser?.fullName }}
              </p>
              <p class="text-xs text-gray-500 dark:text-gray-400 font-medium">
                {{ currentUser?.role?.displayName }}
              </p>
            </div>
            <svg class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
            </svg>
          </button>

          <!-- User dropdown - Teleported to body for proper backdrop-filter -->
          <Teleport to="body">
            <div
              v-if="showUserMenu"
              class="dropdown-glass fixed rounded-xl z-[9999] overflow-hidden"
              :style="userMenuDropdownStyle"
            >
              <div class="py-1">
                <router-link
                  to="/profile"
                  class="block px-4 py-3 text-base font-medium text-gray-700 hover:bg-primary-500/10 dark:text-gray-300 dark:hover:bg-primary-500/20 touch-no-select"
                >
                  Profile
                </router-link>
                <router-link
                  to="/settings"
                  class="block px-4 py-3 text-base font-medium text-gray-700 hover:bg-primary-500/10 dark:text-gray-300 dark:hover:bg-primary-500/20 touch-no-select"
                >
                  Settings
                </router-link>
                <div class="border-t border-gray-200/50 dark:border-white/10"></div>
                <button
                  @click="$emit('logout')"
                  class="block w-full text-left px-4 py-3 text-base font-medium text-red-600 hover:bg-red-500/10 dark:text-red-400 dark:hover:bg-red-500/20 touch-no-select"
                >
                  Sign out
                </button>
              </div>
            </div>
          </Teleport>
        </div>
      </div>
    </div>

    <!-- Store selection modal -->
    <div v-if="showStoreModal" class="fixed inset-0 z-50">
      <div class="absolute inset-0 bg-gray-500/60 backdrop-blur-md" @click="closeStoreModal"></div>
      <div class="absolute inset-0 flex items-center justify-center p-4">
        <div class="card w-full max-w-md">
          <div class="px-4 py-3 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
            <h4 class="text-sm font-medium text-gray-900 dark:text-white">Select Store</h4>
            <button @click="closeStoreModal" class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>
            </button>
          </div>
          <div class="max-h-[60vh] overflow-y-auto">
            <button
              v-for="s in stores"
              :key="s.id"
              @click="selectStore(String(s.id))"
              class="w-full text-left px-6 py-4 text-base flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-700 active:bg-gray-100 border-b border-gray-100 dark:border-gray-700 last:border-b-0 transition-colors touch-no-select"
            >
              <span class="text-gray-900 dark:text-white font-medium">{{ s.code }} - {{ s.name }}</span>
              <span v-if="String(s.code) === activeStoreCode" class="px-2 py-1 text-xs bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 rounded-full">Active</span>
            </button>
          </div>
          <div class="px-6 py-4 border-t border-gray-200 dark:border-gray-700 text-right">
            <button 
              @click="closeStoreModal" 
              class="touch-button px-6 py-2.5 text-base font-medium bg-gray-200 hover:bg-gray-300 active:bg-gray-400 dark:bg-gray-700 dark:hover:bg-gray-600 dark:text-gray-200 rounded-lg transition-colors"
            >
              Close
            </button>
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

// Dropdown positioning for teleported elements
const notificationsDropdownStyle = computed(() => ({
  top: '64px',
  right: '180px',
  width: '320px'
}))

const userMenuDropdownStyle = computed(() => ({
  top: '64px', 
  right: '24px',
  width: '224px'
}))

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

