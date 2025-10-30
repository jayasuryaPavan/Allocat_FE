<template>
  <div id="app" :class="themeClasses">
    <router-view />
    
    <!-- Global loading overlay -->
    <div v-if="loadingStore.isLoading" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white rounded-lg p-6 flex items-center space-x-3">
        <div class="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
        <span class="text-gray-700">Loading...</span>
      </div>
    </div>

    <!-- Global notifications -->
    <div class="fixed top-4 z-50 space-y-2" style="width: -webkit-fill-available;">
      <transition-group name="notification" tag="div">
        <div
          v-for="notification in notificationStore.notifications"
          :key="notification.id"
          :class="[
            'max-w-sm w-full bg-white shadow-lg rounded-lg pointer-events-auto ring-1 ring-black ring-opacity-5 overflow-hidden',
            notification.type === 'success' ? 'border-l-4 border-green-400' : '',
            notification.type === 'error' ? 'border-l-4 border-red-400' : '',
            notification.type === 'warning' ? 'border-l-4 border-yellow-400' : '',
            notification.type === 'info' ? 'border-l-4 border-blue-400' : ''
          ]"
        >
          <div class="p-4">
            <div class="flex items-start">
              <div class="flex-shrink-0">
                <svg
                  v-if="notification.type === 'success'"
                  class="h-6 w-6 text-green-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <svg
                  v-else-if="notification.type === 'error'"
                  class="h-6 w-6 text-red-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <svg
                  v-else-if="notification.type === 'warning'"
                  class="h-6 w-6 text-yellow-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
                <svg
                  v-else
                  class="h-6 w-6 text-blue-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div class="ml-3 w-0 flex-1 pt-0.5">
                <p class="text-sm font-medium text-gray-900">
                  {{ notification.title }}
                </p>
                <p v-if="notification.message" class="mt-1 text-sm text-gray-500">
                  {{ notification.message }}
                </p>
              </div>
              <div class="ml-4 flex-shrink-0 flex">
                <button
                  @click="notificationStore.removeNotification(notification.id)"
                  class="bg-white rounded-md inline-flex text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  <span class="sr-only">Close</span>
                  <svg class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      </transition-group>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useThemeStore } from '@/core/stores/theme'
import { useLoadingStore } from '@/core/stores/loading'
import { useNotificationStore } from '@/core/stores/notification'

const themeStore = useThemeStore()
const loadingStore = useLoadingStore()
const notificationStore = useNotificationStore()

const themeClasses = computed(() => ({
  'dark': themeStore.isDarkMode,
  'light': !themeStore.isDarkMode
}))
</script>

<style>
/* Global styles */
#app {
  min-height: 100vh;
}

/* Notification transitions */
.notification-enter-active,
.notification-leave-active {
  transition: all 0.3s ease;
}

.notification-enter-from {
  opacity: 0;
  transform: translateX(100%);
}

.notification-leave-to {
  opacity: 0;
  transform: translateX(100%);
}

/* Responsive body classes */
body.mobile {
  font-size: 14px;
}

body.tablet {
  font-size: 15px;
}

body.desktop {
  font-size: 16px;
}

body.scrolled {
  /* Add any scrolled state styles */
}
</style>

