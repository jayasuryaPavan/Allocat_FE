<template>
  <div class="min-h-screen relative z-10">
    <div 
      :class="[
        'fixed inset-y-0 left-0 z-50 bg-white/40 dark:bg-gray-900/40 backdrop-blur-glass shadow-glass-glow transition-all duration-300 ease-in-out',
        sidebarCollapsed 
          ? '-translate-x-full lg:translate-x-0 lg:w-20' 
          : 'translate-x-0 w-64'
      ]"
    >
      <Sidebar 
        :collapsed="sidebarCollapsed"
        @toggle="toggleSidebar"
      />
    </div>

    <!-- Main content -->
    <div 
      :class="[
        'flex-1 transition-all duration-300 ease-in-out',
        sidebarCollapsed ? 'lg:ml-20' : 'lg:ml-64'
      ]"
    >
      <!-- Header -->
      <Header 
        :sidebar-collapsed="sidebarCollapsed"
        @toggle-sidebar="toggleSidebar"
        @toggle-theme="toggleTheme"
        @logout="logout"
      />

      <!-- Page content -->
      <main class="p-6">
        <router-view />
      </main>
    </div>

    <!-- Mobile sidebar overlay -->
    <div 
      v-if="!sidebarCollapsed"
      class="fixed inset-0 z-40 bg-black bg-opacity-50 lg:hidden"
      @click="toggleSidebar"
    />

    <!-- InvenGadu Chat -->
    <InvenGaduChat />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/core/stores/auth'
import { useThemeStore } from '@/core/stores/theme'
import Sidebar from '@/layouts/components/Sidebar.vue'
import Header from '@/layouts/components/Header.vue'
import InvenGaduChat from '@/components/InvenGaduChat.vue'

const router = useRouter()
const authStore = useAuthStore()
const themeStore = useThemeStore()

// State
const sidebarCollapsed = ref(false)

// Computed
const currentUser = computed(() => authStore.currentUser)

// Methods
const toggleSidebar = () => {
  sidebarCollapsed.value = !sidebarCollapsed.value
  
  // Save to localStorage only (no API call for frequent sidebar toggles)
  const preferences = authStore.getUserPreferences()
  preferences.sidebarCollapsed = sidebarCollapsed.value
  localStorage.setItem('user_preferences', JSON.stringify(preferences))
}

const toggleTheme = () => {
  themeStore.toggleTheme()
}

const logout = () => {
  authStore.logout()
}

// Handle window resize
const handleResize = () => {
  const width = window.innerWidth
  
  // Auto-collapse sidebar on mobile
  if (width < 1024) {
    sidebarCollapsed.value = true
  } else {
    // Restore saved preference on desktop
    const preferences = authStore.getUserPreferences()
    sidebarCollapsed.value = preferences.sidebarCollapsed
  }
}

// Handle scroll
const handleScroll = () => {
  const scrollTop = window.pageYOffset || document.documentElement.scrollTop
  const body = document.body
  
  if (scrollTop > 100) {
    body.classList.add('scrolled')
  } else {
    body.classList.remove('scrolled')
  }
}

// Lifecycle
onMounted(() => {
  // Initialize sidebar state from preferences
  const preferences = authStore.getUserPreferences()
  sidebarCollapsed.value = preferences.sidebarCollapsed

  // Add event listeners
  window.addEventListener('resize', handleResize)
  window.addEventListener('scroll', handleScroll)
  
  // Initial resize check
  handleResize()
})

onUnmounted(() => {
  // Remove event listeners
  window.removeEventListener('resize', handleResize)
  window.removeEventListener('scroll', handleScroll)
})
</script>

