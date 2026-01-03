<template>
  <div class="fixed inset-0 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center">
    <!-- Card expanded width for keypad -->
    <div class="bg-white/90 backdrop-blur-xl border border-white/50 rounded-3xl p-8 w-[420px] shadow-2xl flex flex-col max-h-[90vh] overflow-y-auto">
      <!-- Store Logo -->
      <div class="flex justify-center mb-6 shrink-0">
        <div class="w-16 h-16 bg-white rounded-2xl flex items-center justify-center shadow-md border border-gray-100">
          <img src="@/assets/images/logo-icon.png" alt="Allocat" class="w-full h-full object-contain" />
        </div>
      </div>
      
      <h2 class="text-xl font-bold text-gray-800 text-center mb-1 shrink-0">POS Terminal</h2>
      <p class="text-gray-500 text-center mb-4 text-sm shrink-0">Sign in to access the terminal</p>
      
      <div class="space-y-3 shrink-0">
        <!-- Associate Number Input -->
        <div>
          <label class="block text-gray-600 text-xs mb-1 font-medium">Associate Number</label>
          <input 
            ref="assocInputRef"
            v-model="associateNumber" 
            type="text" 
            name="allocat_kiosk_auth_id_v1"
            inputmode="numeric"
            maxlength="4"
            placeholder="0000"
            autocomplete="off"
            class="w-full bg-gray-50 border rounded-xl px-4 py-3 text-gray-900 text-center text-xl tracking-[0.5em] placeholder-gray-300 focus:outline-none focus:ring-2 transition-all shadow-inner font-mono"
            :class="activeInput === 'associateNumber' ? 'ring-2 ring-blue-500 bg-white border-blue-500' : 'border-gray-200'"
            @focus="activeInput = 'associateNumber'"
            @click="activeInput = 'associateNumber'"
            readonly
            onfocus="this.removeAttribute('readonly');"
          />
        </div>
        
        <!-- PIN Input -->
        <div>
          <label class="block text-gray-600 text-xs mb-1 font-medium">PIN</label>
          <input 
            ref="pinInputRef"
            v-model="pin" 
            type="text" 
            name="allocat_kiosk_auth_pin_v1"
            inputmode="numeric"
            maxlength="4"
            placeholder="••••"
            autocomplete="off"
            class="w-full bg-gray-50 border rounded-xl px-4 py-3 text-gray-900 text-center text-xl tracking-[0.5em] placeholder-gray-300 focus:outline-none focus:ring-2 transition-all shadow-inner font-mono security-disc"
            :class="activeInput === 'pin' ? 'ring-2 ring-blue-500 bg-white border-blue-500' : 'border-gray-200'"
            @focus="activeInput = 'pin'"
            @click="activeInput = 'pin'"
            readonly
            onfocus="this.removeAttribute('readonly');"
          />
        </div>
      </div>
      
      <!-- Keypad -->
      <div v-if="activeInput" class="grid grid-cols-3 gap-2 mt-4 flex-1">
        <button v-for="n in [1,2,3,4,5,6,7,8,9]" :key="n" @click="handleKeypadInput(String(n))" class="keypad-btn">
          {{ n }}
        </button>
        
        <!-- Red Backspace Button -->
        <button @click="handleBackspace" class="keypad-btn text-red-500 bg-red-50 hover:bg-red-100 border-red-100">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2M3 12l6.414 6.414a2 2 0 001.414.586H19a2 2 0 002-2V7a2 2 0 00-2-2h-8.172a2 2 0 00-1.414.586L3 12z" />
          </svg>
        </button>
        
        <button @click="handleKeypadInput('0')" class="keypad-btn">0</button>
        
        <!-- Green Confirm Button -->
        <button @click="handleConfirm" class="keypad-btn text-white bg-green-500 hover:bg-green-600 border-green-600 shadow-green-200">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
          </svg>
        </button>
      </div>
      
      <!-- Fallback Sign In Button (if keypad hidden or general use) -->
      <button 
        v-else
        @click="signIn" 
        :disabled="!isValid || isLoading"
        class="w-full bg-gradient-to-r from-blue-600 to-purple-700 text-white font-semibold py-3 px-4 rounded-xl hover:from-blue-600 hover:to-purple-800 transition-all disabled:opacity-50 disabled:cursor-not-allowed mt-6 shadow-lg shadow-blue-200 shrink-0"
      >
        <span v-if="isLoading">Signing In...</span>
        <span v-else>Sign In</span>
      </button>
      
      <!-- Error Message -->
      <p v-if="error" class="text-red-500 text-center text-sm mt-4 font-medium shrink-0">{{ error }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, nextTick } from 'vue'
import { useShiftStore } from '@/features/pos/stores/shiftStore'

const emit = defineEmits<{
  (e: 'sign-in-success', user: { id: number; name: string; associateNumber: string }): void
}>()

const shiftStore = useShiftStore()

const associateNumber = ref('')
const pin = ref('')
const isLoading = ref(false)
const error = ref('')
const activeInput = ref<'associateNumber' | 'pin'>('associateNumber') // Default to first input

const assocInputRef = ref<HTMLInputElement | null>(null)
const pinInputRef = ref<HTMLInputElement | null>(null)

// Focus first input on mount
onMounted(() => {
  nextTick(() => {
    assocInputRef.value?.focus()
  })
})

const isValid = computed(() => {
  return associateNumber.value.length === 4 && pin.value.length === 4
})

// Keypad Logic
const handleKeypadInput = (key: string) => {
  if (activeInput.value === 'associateNumber') {
    if (associateNumber.value.length < 4) {
      associateNumber.value += key
      // Auto-advance
      if (associateNumber.value.length === 4) {
        activeInput.value = 'pin'
        nextTick(() => pinInputRef.value?.focus())
      }
    }
  } else if (activeInput.value === 'pin') {
    if (pin.value.length < 4) {
      pin.value += key
      // Auto-submit logic could go here, but let's wait for confirm button
    }
  }
}

const handleBackspace = () => {
  if (activeInput.value === 'associateNumber') {
    associateNumber.value = associateNumber.value.slice(0, -1)
  } else if (activeInput.value === 'pin') {
    if (pin.value.length === 0) {
      // Go back to associate number if PIN is empty
      activeInput.value = 'associateNumber'
      nextTick(() => assocInputRef.value?.focus())
    } else {
      pin.value = pin.value.slice(0, -1)
    }
  }
}

const handleConfirm = () => {
  if (activeInput.value === 'associateNumber') {
    if (associateNumber.value.length === 4) {
      activeInput.value = 'pin'
      nextTick(() => pinInputRef.value?.focus())
    }
  } else {
    signIn()
  }
}

const signIn = async () => {
  if (!isValid.value) return
  
  isLoading.value = true
  error.value = ''
  
  try {
    const storeId = Number(sessionStorage.getItem('active_store_id') || localStorage.getItem('active_store_id') || 1)
    const result = await shiftStore.signInAssociate(storeId, associateNumber.value, pin.value)
    
    emit('sign-in-success', {
      id: result.userId,
      name: result.name,
      associateNumber: result.associateNumber
    })
    
    associateNumber.value = ''
    pin.value = ''
  } catch (err: any) {
    error.value = err.message || 'Invalid credentials'
    // Shake effect or clear pin could happen here
    pin.value = ''
    activeInput.value = 'pin' // Keep focus on PIN to retry
  } finally {
    isLoading.value = false
  }
}
</script>

<style scoped>
.keypad-btn {
  @apply h-14 text-xl font-bold rounded-xl transition-all;
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
