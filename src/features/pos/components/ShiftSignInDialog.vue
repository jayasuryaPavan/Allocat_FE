<template>
  <Teleport to="body">
    <div v-if="isOpen" class="fixed inset-0 z-50 flex items-center justify-center">
      <!-- Backdrop -->
      <div class="absolute inset-0 bg-black/40 backdrop-blur-sm" @click="close"></div>
      
      <!-- Dialog -->
      <div class="relative bg-white/90 backdrop-blur-xl border border-white/50 rounded-3xl p-6 w-[450px] max-h-[95vh] overflow-y-auto shadow-2xl flex flex-col items-center">
        <!-- Close Button -->
        <button 
          @click="close" 
          class="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors z-10"
        >
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <!-- Logo -->
        <div class="mb-6 shrink-0">
          <div class="w-20 h-20 bg-white rounded-2xl flex items-center justify-center p-4 shadow-md border border-gray-100">
            <img src="@/assets/images/logo-icon.png" alt="Allocat" class="w-full h-full object-contain" />
          </div>
        </div>

        <!-- Tab Navigation -->
        <div class="flex space-x-2 mb-6 shrink-0 w-full">
          <button 
            @click="activeView = 'signin'"
            :class="[
              'flex-1 py-2 px-4 rounded-xl font-medium transition-all',
              activeView === 'signin' 
                ? 'bg-blue-600 text-white shadow-md' 
                : 'bg-gray-100 text-gray-500 hover:bg-gray-200 hover:text-gray-700'
            ]"
          >
            Sign In
          </button>
          <button 
            @click="activeView = 'inshift'"
            :class="[
              'flex-1 py-2 px-4 rounded-xl font-medium transition-all',
              activeView === 'inshift' 
                ? 'bg-green-600 text-white shadow-md' 
                : 'bg-gray-100 text-gray-500 hover:bg-gray-200 hover:text-gray-700'
            ]"
          >
            In Shift
            <span v-if="signedInAssociate" class="ml-2 bg-white/20 px-2 py-0.5 rounded-full text-xs">1</span>
          </button>
        </div>

        <!-- Sign In View -->
        <div v-if="activeView === 'signin'" class="space-y-4 flex-1 flex flex-col w-full">
          <h3 class="text-xl font-bold text-gray-800 text-center mb-2 shrink-0">Associate Sign In</h3>
          
          <div class="shrink-0 space-y-3">
            <div>
              <label class="block text-gray-600 text-sm mb-1 font-medium">Associate Number</label>
              <input 
                ref="assocInput"
                v-model="associateNumber" 
                type="text" 
                name="allocat_associate_id_v2"
                id="allocat_associate_id_v2"
                inputmode="numeric"
                autocomplete="off"
                maxlength="4"
                placeholder="0000"
                class="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-gray-900 text-center text-xl tracking-[0.3em] placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all font-mono shadow-inner"
                :class="{'ring-2 ring-blue-500 bg-white': activeInput === 'associateNumber'}"
                @focus="activeInput = 'associateNumber'"
                @click="activeInput = 'associateNumber'"
                @keyup.enter="handleEnterKey"
                readonly
                onfocus="this.removeAttribute('readonly');"
              />
            </div>
            
            <div>
              <label class="block text-gray-600 text-sm mb-1 font-medium">PIN</label>
              <input 
                ref="pinInput"
                v-model="passcode" 
                type="text" 
                name="allocat_associate_pin_v2"
                id="allocat_associate_pin_v2"
                inputmode="numeric"
                autocomplete="off"
                maxlength="4"
                placeholder="••••"
                class="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-gray-900 text-center text-xl tracking-[0.3em] placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all font-mono shadow-inner security-disc"
                :class="{'ring-2 ring-blue-500 bg-white': activeInput === 'passcode'}"
                @focus="activeInput = 'passcode'"
                @click="activeInput = 'passcode'"
                @keyup.enter="handleEnterKey"
                readonly
                onfocus="this.removeAttribute('readonly');"
              />
            </div>
          </div>
          
          <!-- Shared Numeric Keypad -->
          <div class="grid grid-cols-3 gap-2 mt-4 flex-1">
            <button v-for="n in [7,8,9,4,5,6,1,2,3]" :key="n" @click="handleKeypad(String(n))" class="keypad-btn">{{ n }}</button>
            <button @click="handleKeypad('C')" class="keypad-btn text-red-500 bg-red-50 hover:bg-red-100 border-red-100">C</button>
            <button @click="handleKeypad('0')" class="keypad-btn">0</button>
            <button @click="handleKeypad('backspace')" class="keypad-btn text-orange-500 bg-orange-50 hover:bg-orange-100 border-orange-100">
              <i class="fas fa-backspace"></i>
            </button>
          </div>
          
          <button 
            @click="handleSignIn" 
            :disabled="!isSignInValid || isLoading"
            class="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold py-3 px-4 rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all disabled:opacity-50 disabled:cursor-not-allowed mt-2 shrink-0 shadow-lg shadow-blue-200"
          >
            <span v-if="isLoading">Signing In...</span>
            <span v-else>Sign In</span>
          </button>
          
          <p v-if="error" class="text-red-500 text-center text-sm shrink-0 font-medium">{{ error }}</p>
        </div>

        <!-- In Shift View -->
        <div v-if="activeView === 'inshift'" class="space-y-4 w-full">
          <h3 class="text-xl font-bold text-gray-800 text-center mb-4">Currently On Shift</h3>
          
          <div v-if="signedInAssociate" class="text-center space-y-4">
            <!-- Associate Avatar -->
            <div class="w-20 h-20 bg-gradient-to-br from-green-400 to-green-600 rounded-full mx-auto flex items-center justify-center shadow-lg">
              <span class="text-3xl font-bold text-white">{{ signedInAssociate.name.charAt(0) }}</span>
            </div>
            
            <!-- Associate Name -->
            <p class="text-2xl font-bold text-gray-800">{{ signedInAssociate.name }}</p>
            <p class="text-gray-500">Associate #{{ signedInAssociate.associateNumber }}</p>
            <p class="text-gray-400 text-sm">Since {{ signedInAssociate.signInTime }}</p>
            
            <!-- Sign Out Section -->
            <div v-if="!showSignOutConfirm" class="pt-4">
              <button 
                @click="startSignOut"
                class="w-full bg-gradient-to-r from-red-500 to-red-600 text-white font-semibold py-3 px-4 rounded-xl hover:from-red-600 hover:to-red-700 transition-all shadow-lg shadow-red-200"
              >
                Sign Out
              </button>
            </div>
            
            <!-- Sign Out Confirmation -->
            <div v-else class="pt-4 space-y-3">
              <p class="text-gray-600 text-sm font-medium">Enter your PIN to confirm sign out</p>
              <input 
                v-model="signOutPasscode" 
                type="text" 
                name="allocat_signout_pin_v2"
                id="allocat_signout_pin_v2"
                inputmode="numeric"
                autocomplete="off"
                maxlength="4"
                placeholder="••••"
                class="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-gray-900 text-center text-xl tracking-[0.3em] placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-red-500 focus:bg-white font-mono shadow-inner security-disc"
                @focus="activeInput = 'signOutPasscode'"
                @click="activeInput = 'signOutPasscode'"
                @keyup.enter="confirmSignOut"
                readonly
                onfocus="this.removeAttribute('readonly');"
              />
              
              <!-- Keypad for SignOut -->
               <div class="grid grid-cols-3 gap-2 mt-2 mb-2">
                <button v-for="n in [7,8,9,4,5,6,1,2,3]" :key="n" @click="handleKeypad(String(n))" class="keypad-btn py-1 text-lg">{{ n }}</button>
                <button @click="handleKeypad('C')" class="keypad-btn text-red-500 bg-red-50 hover:bg-red-100 border-red-100 py-1 text-lg">C</button>
                <button @click="handleKeypad('0')" class="keypad-btn py-1 text-lg">0</button>
                <button @click="handleKeypad('backspace')" class="keypad-btn text-orange-500 bg-orange-50 hover:bg-orange-100 border-orange-100 py-1 text-lg"><i class="fas fa-backspace"></i></button>
              </div>

              <div class="flex space-x-2">
                <button 
                  @click="cancelSignOut"
                  class="flex-1 bg-gray-100 text-gray-700 py-2 px-4 rounded-xl hover:bg-gray-200 transition-all font-medium"
                >
                  Cancel
                </button>
                <button 
                  @click="confirmSignOut"
                  :disabled="signOutPasscode.length !== 4 || isLoading"
                  class="flex-1 bg-red-500 text-white py-2 px-4 rounded-xl hover:bg-red-600 transition-all disabled:opacity-50 font-medium"
                >
                  Confirm
                </button>
              </div>
              <p v-if="signOutError" class="text-red-500 text-center text-sm font-medium">{{ signOutError }}</p>
            </div>
          </div>
          
          <div v-else class="text-center py-8">
            <div class="w-16 h-16 bg-gray-100 rounded-full mx-auto flex items-center justify-center mb-4">
              <img src="@/assets/images/logo-icon.png" alt="Allocat" class="w-12 h-12 object-contain filter grayscale opacity-50" />
            </div>
            <p class="text-gray-500">No associate signed in</p>
            <p class="text-gray-400 text-sm mt-2">Use the Sign In tab to start a shift</p>
          </div>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import { ref, computed, watch, nextTick } from 'vue'
import { useShiftStore } from '@/features/pos/stores/shiftStore'

interface SignedInAssociate {
  id: number
  name: string
  associateNumber: string
  signInTime: string
}

const props = defineProps<{
  isOpen: boolean
  signedInAssociate: SignedInAssociate | null
}>()

const emit = defineEmits<{
  (e: 'close'): void
  (e: 'sign-in', associate: SignedInAssociate): void
  (e: 'sign-out', associate: { name: string; associateNumber: string; signInTime: string }): void
}>()

const shiftStore = useShiftStore()

// View state
const activeView = ref<'signin' | 'inshift'>('signin')
const activeInput = ref<'associateNumber' | 'passcode' | 'signOutPasscode'>('associateNumber')

// Sign-in state
const associateNumber = ref('')
const passcode = ref('')
const isLoading = ref(false)
const error = ref('')

// Sign-out state
const showSignOutConfirm = ref(false)
const signOutPasscode = ref('')
const signOutError = ref('')

// Refs for focus management
const assocInput = ref<HTMLInputElement | null>(null)
const pinInput = ref<HTMLInputElement | null>(null)

const isSignInValid = computed(() => {
  return associateNumber.value.length === 4 && passcode.value.length === 4
})

watch(() => props.isOpen, (open) => {
  if (open) {
    if (!props.signedInAssociate) {
      activeView.value = 'signin'
      activeInput.value = 'associateNumber'
      nextTick(() => {
        assocInput.value?.focus()
      })
    }
  } else {
    associateNumber.value = ''
    passcode.value = ''
    error.value = ''
    showSignOutConfirm.value = false
    signOutPasscode.value = ''
    signOutError.value = ''
  }
})

watch(() => props.signedInAssociate, (associate) => {
  if (associate) {
    activeView.value = 'inshift'
  }
}, { immediate: true })

const close = () => {
  emit('close')
}

const handleKeypad = (key: string) => {
  if (key === 'C') {
    if (activeInput.value === 'associateNumber') associateNumber.value = ''
    else if (activeInput.value === 'passcode') passcode.value = ''
    else if (activeInput.value === 'signOutPasscode') signOutPasscode.value = ''
    return
  }

  if (key === 'backspace') {
    if (activeInput.value === 'associateNumber') associateNumber.value = associateNumber.value.slice(0, -1)
    else if (activeInput.value === 'passcode') passcode.value = passcode.value.slice(0, -1)
    else if (activeInput.value === 'signOutPasscode') signOutPasscode.value = signOutPasscode.value.slice(0, -1)
    return
  }

  // Number input
  if (activeInput.value === 'associateNumber' && associateNumber.value.length < 4) {
    associateNumber.value += key
    if (associateNumber.value.length === 4) {
      activeInput.value = 'passcode'
      nextTick(() => pinInput.value?.focus())
    }
  } else if (activeInput.value === 'passcode' && passcode.value.length < 4) {
    passcode.value += key
    if (passcode.value.length === 4) {
      handleSignIn()
    }
  } else if (activeInput.value === 'signOutPasscode' && signOutPasscode.value.length < 4) {
    signOutPasscode.value += key
    if (signOutPasscode.value.length === 4) {
      confirmSignOut()
    }
  }
}

const handleEnterKey = () => {
  if (activeInput.value === 'associateNumber') {
    activeInput.value = 'passcode'
    nextTick(() => pinInput.value?.focus())
  } else if (activeInput.value === 'passcode') {
    handleSignIn()
  }
}

const handleSignIn = async () => {
  if (!isSignInValid.value) return

  isLoading.value = true
  error.value = ''

  try {
    const storeId = Number(sessionStorage.getItem('active_store_id') || localStorage.getItem('active_store_id') || 1)
    
    // Convert to string in case it came from keypad as number
    const assocNum = String(associateNumber.value)
    const pin = String(passcode.value)

    const result = await shiftStore.signInAssociate(storeId, assocNum, pin)

    emit('sign-in', {
      id: result.userId,
      name: result.name,
      associateNumber: result.associateNumber,
      signInTime: new Date().toLocaleTimeString() // This should come from backend ideally
    })

    // Reset fields
    associateNumber.value = ''
    passcode.value = ''
  } catch (err: any) {
    error.value = 'Invalid Associate Number or PIN' // Generic message for security
    if (import.meta.env.DEV) console.error(err)
    passcode.value = ''
    activeInput.value = 'passcode'
  } finally {
    isLoading.value = false
  }
}

const startSignOut = () => {
  showSignOutConfirm.value = true
  activeInput.value = 'signOutPasscode'
  signOutPasscode.value = ''
}

const cancelSignOut = () => {
  showSignOutConfirm.value = false
  signOutPasscode.value = ''
  // Use a temporary value, not strictly needed as view changes
  activeInput.value = 'associateNumber'
}

const confirmSignOut = async () => {
  if (signOutPasscode.value.length !== 4) return

  isLoading.value = true
  signOutError.value = ''

  try {
    await shiftStore.signOutAssociate(signOutPasscode.value)

    emit('sign-out', {
      name: props.signedInAssociate!.name,
      associateNumber: props.signedInAssociate!.associateNumber,
      signInTime: props.signedInAssociate!.signInTime
    })

    showSignOutConfirm.value = false
    signOutPasscode.value = ''
  } catch (err: any) {
    signOutError.value = 'Invalid PIN'
  } finally {
    isLoading.value = false
  }
}
</script>

<style scoped>
.keypad-btn {
  @apply h-[50px] text-xl font-bold rounded-xl transition-all;
  @apply bg-white border border-gray-200 shadow-sm text-gray-900;
  @apply hover:bg-gray-50 hover:border-gray-300;
  @apply active:scale-95 active:bg-gray-100;
  @apply flex items-center justify-center;
}

.security-disc {
  -webkit-text-security: disc;
  text-security: disc;
}
</style>

