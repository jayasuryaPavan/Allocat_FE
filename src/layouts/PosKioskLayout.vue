<template>
  <div class="min-h-screen relative z-10 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
    <!-- STATE 1: POS User Sign-In (Kiosk Locked) -->
    <PosUserSignIn 
      v-if="!isPosUserSignedIn"
      @sign-in-success="handlePosUserSignIn"
    />

    <!-- STATE 2: POS View (Kiosk Unlocked) -->
    <template v-else>
      <!-- Top-right action bar -->
      <div class="fixed top-4 right-4 z-50 flex items-center space-x-3">
        <!-- Current Associate Display -->
        <div v-if="signedInAssociate" class="flex items-center space-x-2 bg-white/80 backdrop-blur-md rounded-xl px-4 py-2 border border-blue-100 shadow-sm">
          <div class="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center shadow-sm">
            <svg class="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </div>
          <span class="text-gray-900 font-medium">{{ signedInAssociate.name }}</span>
        </div>

        <!-- Shifts Button -->
        <button 
          @click="showShiftsDialog = true" 
          class="flex items-center space-x-2 bg-white/80 backdrop-blur-md border border-blue-100 text-gray-700 px-4 py-2 rounded-xl hover:bg-white hover:text-blue-600 hover:border-blue-200 transition-all shadow-sm"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span>Shifts</span>
          <span v-if="signedInAssociate" class="bg-green-500 text-white text-xs px-2 py-0.5 rounded-full">1</span>
        </button>
        
        <!-- Logout Button (POS User) -->
        <button 
          @click="handlePosUserLogout" 
          class="flex items-center space-x-2 bg-white/80 backdrop-blur-md border border-red-100 text-gray-700 px-4 py-2 rounded-xl hover:bg-red-50 hover:text-red-600 hover:border-red-200 transition-all shadow-sm"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
          </svg>
          <span>Logout</span>
        </button>
      </div>

      <!-- Main POS Content (full screen) -->
      <main class="h-screen">
        <router-view />
      </main>

      <!-- Shifts Dialog (Associate Sign-In/Out) -->
      <ShiftSignInDialog 
        :is-open="showShiftsDialog" 
        :signed-in-associate="signedInAssociate"
        @close="showShiftsDialog = false"
        @sign-in="handleAssociateSignIn"
        @sign-out="handleAssociateSignOut"
      />

      <!-- Associate Sign-Out Summary Popup (3 seconds) -->
      <AssociateSignOutSummary 
        v-if="showSignOutSummary"
        :associate="lastSignedOutAssociate"
        @close="showSignOutSummary = false"
      />
    </template>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useShiftStore } from '@/features/pos/stores/shiftStore'
import { useAuthStore } from '@/core/stores/auth'
import { useThemeStore } from '@/core/stores/theme'
import PosUserSignIn from '@/features/pos/components/PosUserSignIn.vue'
import ShiftSignInDialog from '@/features/pos/components/ShiftSignInDialog.vue'
import AssociateSignOutSummary from '@/features/pos/components/AssociateSignOutSummary.vue'

const shiftStore = useShiftStore()
const authStore = useAuthStore()
const themeStore = useThemeStore()

// POS User state (Tier 1)
const isPosUserSignedIn = ref(false)
const posUser = ref<{ id: number; name: string; associateNumber: string } | null>(null)

// Associate state (Tier 2)
const showShiftsDialog = ref(false)
const signedInAssociate = computed(() => shiftStore.signedInAssociate)

// Sign-out summary state
const showSignOutSummary = ref(false)
const lastSignedOutAssociate = ref<{
  name: string
  associateNumber: string
  signInTime: string
  signOutTime: string
} | null>(null)

// Theme Management
const previousTheme = ref<'light' | 'dark'>('light')

onMounted(() => {
  // Save current theme to restore later
  previousTheme.value = themeStore.currentTheme
  
  // Force Light Mode for Kiosk
  if (themeStore.isDarkMode) {
    themeStore.setTheme('light')
  }
})

onUnmounted(() => {
  // Restore previous theme when leaving Kiosk mode
  if (previousTheme.value && previousTheme.value !== themeStore.currentTheme) {
    themeStore.setTheme(previousTheme.value)
  }
})

// POS User Sign-In (unlocks kiosk)
const handlePosUserSignIn = (user: { id: number; name: string; associateNumber: string }) => {
  posUser.value = user
  isPosUserSignedIn.value = true
}

// POS User Logout (locks kiosk)
const handlePosUserLogout = async () => {
  // Sign out any associate first
  if (signedInAssociate.value) {
    try {
      await shiftStore.signOutAssociate('')
    } catch (e) {
      // Ignore errors during logout
    }
  }
  isPosUserSignedIn.value = false
  posUser.value = null
  // Kiosk is now locked - shows POS User Sign-In screen
}

// Associate Sign-In
const handleAssociateSignIn = (associate: { id: number; name: string; associateNumber: string; signInTime: string }) => {
  showShiftsDialog.value = false
}

// Associate Sign-Out (shows 3-second summary)
const handleAssociateSignOut = (associate: { name: string; associateNumber: string; signInTime: string }) => {
  lastSignedOutAssociate.value = {
    ...associate,
    signOutTime: new Date().toLocaleString()
  }
  showShiftsDialog.value = false
  showSignOutSummary.value = true
  
  // Auto-close after 3 seconds
  setTimeout(() => {
    showSignOutSummary.value = false
  }, 3000)
}
</script>
