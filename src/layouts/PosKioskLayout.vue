<template>
  <div class="min-h-screen relative z-10 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
    <!-- STATE 1: POS User Sign-In (Kiosk Locked) -->
    <PosUserSignIn 
      v-if="!isPosUserSignedIn"
      @sign-in-success="handlePosUserSignIn"
    />

    <!-- STATE 2: POS View (Kiosk Unlocked) -->
    <template v-else>
      <!-- Top-left: Back to Dashboard (for non-POS_USER roles only) -->
      <div v-if="!isPosUserRole" class="fixed top-4 left-4 z-50">
        <button 
          @click="showExitConfirmDialog = true"
          class="flex items-center space-x-2 bg-white/80 backdrop-blur-md border border-gray-200 text-gray-700 px-4 py-2 rounded-xl hover:bg-white hover:text-blue-600 hover:border-blue-200 transition-all shadow-sm"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          <span>Back to Dashboard</span>
        </button>
      </div>

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

        <!-- Lock Button -->
        <button 
          @click="lockScreen"
          class="flex items-center space-x-2 bg-white/80 backdrop-blur-md border border-yellow-100 text-gray-700 px-4 py-2 rounded-xl hover:bg-yellow-50 hover:text-yellow-600 hover:border-yellow-200 transition-all shadow-sm"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
          </svg>
          <span>Lock</span>
        </button>

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

      <!-- Lock Screen Overlay -->
      <Teleport to="body">
        <div v-if="isScreenLocked" class="fixed inset-0 z-[70] flex items-center justify-center">
          <!-- Blurred backdrop -->
          <div class="absolute inset-0 bg-gradient-to-br from-blue-900/95 via-indigo-900/95 to-purple-900/95 backdrop-blur-xl"></div>
          
          <!-- Lock Screen Content -->
          <div class="relative z-10 flex flex-col items-center max-w-md w-full px-6">
            <!-- Lock Icon -->
            <div class="w-24 h-24 bg-white/10 rounded-full flex items-center justify-center mb-6 border-2 border-white/20">
              <svg class="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>

            <!-- Title -->
            <h2 class="text-2xl font-bold text-white mb-2">Screen Locked</h2>
            <p class="text-white/70 text-center mb-6">Enter your PIN to unlock</p>

            <!-- User Display -->
            <div v-if="posUser" class="flex items-center space-x-3 bg-white/10 rounded-xl px-4 py-3 mb-6 border border-white/20">
              <div class="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
                <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <span class="text-white font-medium">{{ posUser.name }}</span>
            </div>

            <!-- PIN Input -->
            <div class="w-full mb-4">
              <div class="flex justify-center gap-3 mb-4">
                <div 
                  v-for="i in 4" 
                  :key="i" 
                  class="w-14 h-14 rounded-xl border-2 flex items-center justify-center transition-all"
                  :class="unlockPasscode.length >= i ? 'bg-blue-500 border-blue-400' : 'bg-white/10 border-white/30'"
                >
                  <span v-if="unlockPasscode.length >= i" class="text-white text-2xl">•</span>
                </div>
              </div>
              <p v-if="unlockError" class="text-red-400 text-center text-sm font-medium">{{ unlockError }}</p>
            </div>

            <!-- Keypad -->
            <div class="grid grid-cols-3 gap-3 mb-6">
              <button 
                v-for="n in [1,2,3,4,5,6,7,8,9]" 
                :key="n" 
                @click="handleUnlockKeypad(String(n))" 
                class="lock-keypad-btn"
              >
                {{ n }}
              </button>
              <button @click="unlockPasscode = ''" class="lock-keypad-btn text-red-400 bg-red-500/20 border-red-400/30">C</button>
              <button @click="handleUnlockKeypad('0')" class="lock-keypad-btn">0</button>
              <button @click="unlockPasscode = unlockPasscode.slice(0, -1)" class="lock-keypad-btn text-orange-400 bg-orange-500/20 border-orange-400/30">
                <i class="fas fa-backspace"></i>
              </button>
            </div>

            <!-- Time Display -->
            <div class="text-white/50 text-lg">
              {{ currentTime }}
            </div>
          </div>
        </div>
      </Teleport>

      <!-- Exit Confirmation Dialog -->
      <Teleport to="body">
        <div v-if="showExitConfirmDialog" class="fixed inset-0 z-[60] flex items-center justify-center p-4">
          <!-- Backdrop -->
          <div class="absolute inset-0 bg-black/40 backdrop-blur-sm" @click="cancelExitConfirm"></div>
          
          <!-- Dialog -->
          <div class="relative bg-white/95 backdrop-blur-xl border border-white/50 rounded-2xl p-6 w-full max-w-md shadow-2xl">
            <!-- Warning Icon -->
            <div class="flex flex-col items-center text-center mb-4">
              <div class="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mb-4">
                <svg class="w-8 h-8 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <h3 class="text-xl font-bold text-gray-900 mb-2">Exit POS Kiosk?</h3>
              <p class="text-gray-600 text-sm">This will log you out of the POS Kiosk. Enter your PIN to confirm.</p>
            </div>

            <!-- PIN Input -->
            <div class="mb-4">
              <input 
                v-model="exitPasscode"
                type="password"
                inputmode="numeric"
                maxlength="4"
                placeholder="Enter PIN"
                class="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-gray-900 text-center text-xl tracking-[0.3em] placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all font-mono"
                @keyup.enter="confirmExit"
              />
              <p v-if="exitError" class="text-red-500 text-center text-sm mt-2 font-medium">{{ exitError }}</p>
            </div>

            <!-- Keypad -->
            <div class="grid grid-cols-3 gap-2 mb-4">
              <button v-for="n in [1,2,3,4,5,6,7,8,9]" :key="n" @click="exitPasscode += String(n)" class="exit-keypad-btn">{{ n }}</button>
              <button @click="exitPasscode = ''" class="exit-keypad-btn text-red-500 bg-red-50 border-red-100">C</button>
              <button @click="exitPasscode += '0'" class="exit-keypad-btn">0</button>
              <button @click="exitPasscode = exitPasscode.slice(0, -1)" class="exit-keypad-btn text-orange-500 bg-orange-50 border-orange-100">
                <i class="fas fa-backspace"></i>
              </button>
            </div>

            <!-- Actions -->
            <div class="flex gap-3">
              <button 
                @click="cancelExitConfirm"
                class="flex-1 px-4 py-3 bg-gray-100 text-gray-700 font-semibold rounded-xl hover:bg-gray-200 transition-colors"
              >
                Cancel
              </button>
              <button 
                @click="confirmExit"
                :disabled="exitPasscode.length !== 4 || isExiting"
                class="flex-1 px-4 py-3 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                {{ isExiting ? 'Exiting...' : 'Confirm' }}
              </button>
            </div>
          </div>
        </div>
      </Teleport>
    </template>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { useShiftStore } from '@/features/pos/stores/shiftStore'
import { useAuthStore } from '@/core/stores/auth'
import { useThemeStore } from '@/core/stores/theme'
import PosUserSignIn from '@/features/pos/components/PosUserSignIn.vue'
import ShiftSignInDialog from '@/features/pos/components/ShiftSignInDialog.vue'
import AssociateSignOutSummary from '@/features/pos/components/AssociateSignOutSummary.vue'

const router = useRouter()
const shiftStore = useShiftStore()
const authStore = useAuthStore()
const themeStore = useThemeStore()

// POS User state (Tier 1)
const isPosUserSignedIn = ref(false)
const posUser = ref<{ id: number; name: string; associateNumber: string } | null>(null)

// Associate state (Tier 2)
const showShiftsDialog = ref(false)
const signedInAssociate = computed(() => shiftStore.signedInAssociate)

// Check if current user is a POS_USER role (hide "Back to Dashboard" for POS_USER)
const isPosUserRole = computed(() => {
  const role = authStore.currentUser?.role?.name?.toUpperCase()
  return role === 'POS_USER'
})

// Lock Screen state
const isScreenLocked = ref(false)
const unlockPasscode = ref('')
const unlockError = ref('')
const currentTime = ref('')
const INACTIVITY_TIMEOUT = 2 * 60 * 1000 // 2 minutes in ms
let inactivityTimer: number | undefined
let clockInterval: number | undefined

// Exit confirmation state
const showExitConfirmDialog = ref(false)
const exitPasscode = ref('')
const exitError = ref('')
const isExiting = ref(false)

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

// Activity tracking for inactivity lock
const resetInactivityTimer = () => {
  if (inactivityTimer) clearTimeout(inactivityTimer)
  if (!isPosUserSignedIn.value || isScreenLocked.value) return
  
  inactivityTimer = window.setTimeout(() => {
    if (isPosUserSignedIn.value && !isScreenLocked.value) {
      lockScreen()
    }
  }, INACTIVITY_TIMEOUT)
}

const handleActivity = () => {
  if (!isScreenLocked.value) {
    resetInactivityTimer()
  }
}

// Lock screen function
const lockScreen = () => {
  isScreenLocked.value = true
  unlockPasscode.value = ''
  unlockError.value = ''
  updateClock()
  startClock()
}

// Unlock screen function
const unlockScreen = () => {
  isScreenLocked.value = false
  unlockPasscode.value = ''
  unlockError.value = ''
  stopClock()
  resetInactivityTimer()
}

// Handle unlock keypad input
const handleUnlockKeypad = (digit: string) => {
  if (unlockPasscode.value.length < 4) {
    unlockPasscode.value += digit
    
    // Auto-unlock when 4 digits entered
    if (unlockPasscode.value.length === 4) {
      setTimeout(() => {
        // Accept any 4-digit PIN to unlock
        unlockScreen()
      }, 200)
    }
  }
}

// Clock functions for lock screen
const updateClock = () => {
  const now = new Date()
  currentTime.value = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
}

const startClock = () => {
  updateClock()
  clockInterval = window.setInterval(updateClock, 1000)
}

const stopClock = () => {
  if (clockInterval) {
    clearInterval(clockInterval)
    clockInterval = undefined
  }
}

onMounted(() => {
  // Save current theme to restore later
  previousTheme.value = themeStore.currentTheme
  
  // Force Light Mode for Kiosk
  if (themeStore.isDarkMode) {
    themeStore.setTheme('light')
  }

  // Add activity listeners
  window.addEventListener('mousemove', handleActivity)
  window.addEventListener('mousedown', handleActivity)
  window.addEventListener('keydown', handleActivity)
  window.addEventListener('touchstart', handleActivity)
  window.addEventListener('scroll', handleActivity)
  
  // Start inactivity timer if signed in
  if (isPosUserSignedIn.value) {
    resetInactivityTimer()
  }
})

onUnmounted(() => {
  // Restore previous theme when leaving Kiosk mode
  if (previousTheme.value && previousTheme.value !== themeStore.currentTheme) {
    themeStore.setTheme(previousTheme.value)
  }

  // Remove activity listeners
  window.removeEventListener('mousemove', handleActivity)
  window.removeEventListener('mousedown', handleActivity)
  window.removeEventListener('keydown', handleActivity)
  window.removeEventListener('touchstart', handleActivity)
  window.removeEventListener('scroll', handleActivity)
  
  // Clear timers
  if (inactivityTimer) clearTimeout(inactivityTimer)
  stopClock()
})

// POS User Sign-In (unlocks kiosk)
const handlePosUserSignIn = (user: { id: number; name: string; associateNumber: string }) => {
  posUser.value = user
  isPosUserSignedIn.value = true
  resetInactivityTimer() // Start inactivity timer after sign-in
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
  if (inactivityTimer) clearTimeout(inactivityTimer)
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

// Exit confirmation handlers
const cancelExitConfirm = () => {
  showExitConfirmDialog.value = false
  exitPasscode.value = ''
  exitError.value = ''
}

const confirmExit = async () => {
  if (exitPasscode.value.length !== 4) return
  
  isExiting.value = true
  exitError.value = ''
  
  // Simple validation - just check PIN length is 4 digits
  // No API call needed
  try {
    // Sign out any associate first (end their shift)
    if (signedInAssociate.value) {
      try {
        await shiftStore.signOutAssociate(exitPasscode.value)
      } catch (e) {
        // Continue even if sign-out fails - important to exit
        console.warn('Failed to sign out associate during exit:', e)
      }
    }
    
    // Sign out the POS user
    isPosUserSignedIn.value = false
    posUser.value = null
    showExitConfirmDialog.value = false
    if (inactivityTimer) clearTimeout(inactivityTimer)
    
    // Navigate to dashboard
    router.push('/dashboard')
  } finally {
    isExiting.value = false
  }
}
</script>

<style scoped>
.exit-keypad-btn {
  @apply h-12 text-lg font-bold rounded-xl transition-all;
  @apply bg-white border border-gray-200 shadow-sm text-gray-900;
  @apply hover:bg-gray-50 hover:border-gray-300;
  @apply active:scale-95 active:bg-gray-100;
  @apply flex items-center justify-center;
}

.lock-keypad-btn {
  @apply w-16 h-16 text-xl font-bold rounded-2xl transition-all;
  @apply bg-white/10 border border-white/30 text-white;
  @apply hover:bg-white/20 hover:border-white/50;
  @apply active:scale-95 active:bg-white/30;
  @apply flex items-center justify-center;
}
</style>

