<script setup lang="ts">
import { ref, computed, watch } from 'vue'

const props = defineProps<{
  modelValue: string | number | null
  label?: string
  isPrice?: boolean
}>()

const emit = defineEmits(['update:modelValue', 'enter'])

const displayValue = ref('')

// Initialize display value
watch(() => props.modelValue, (val) => {
  if (val !== null && val !== undefined) {
    displayValue.value = String(val)
  } else {
    displayValue.value = ''
  }
}, { immediate: true })

const formattedDisplay = computed(() => {
  if (!displayValue.value) return props.isPrice ? '$0.00' : '0'
  if (props.isPrice) {
    const num = parseFloat(displayValue.value) || 0
    return '$' + num.toFixed(2)
  }
  return displayValue.value
})

const handleKey = (key: string) => {
  if (key === 'C') {
    displayValue.value = ''
  } else if (key === 'backspace') {
    displayValue.value = displayValue.value.slice(0, -1)
  } else if (key === '.') {
    if (!displayValue.value.includes('.')) {
      displayValue.value += key
    }
  } else if (key === 'enter') {
    emit('enter')
  } else {
    // Limit decimal places for price
    if (props.isPrice && displayValue.value.includes('.')) {
      const parts = displayValue.value.split('.')
      if (parts[1] && parts[1].length >= 2) return
    }
    displayValue.value += key
  }
  
  // Emit updated value
  const numValue = parseFloat(displayValue.value) || 0
  emit('update:modelValue', props.isPrice ? numValue : parseInt(displayValue.value) || 0)
}
</script>

<template>
  <div class="numeric-keypad">
    <!-- Display -->
    <div class="mb-4">
      <label v-if="label" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
        {{ label }}
      </label>
      <div class="w-full px-4 py-4 text-right text-3xl font-bold bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm border border-gray-200/50 dark:border-gray-600/50 rounded-xl text-gray-900 dark:text-white">
        {{ formattedDisplay }}
      </div>
    </div>
    
    <!-- Keypad Grid -->
    <div class="grid grid-cols-3 gap-2">
      <!-- Row 1 -->
      <button @click="handleKey('7')" class="keypad-btn">7</button>
      <button @click="handleKey('8')" class="keypad-btn">8</button>
      <button @click="handleKey('9')" class="keypad-btn">9</button>
      
      <!-- Row 2 -->
      <button @click="handleKey('4')" class="keypad-btn">4</button>
      <button @click="handleKey('5')" class="keypad-btn">5</button>
      <button @click="handleKey('6')" class="keypad-btn">6</button>
      
      <!-- Row 3 -->
      <button @click="handleKey('1')" class="keypad-btn">1</button>
      <button @click="handleKey('2')" class="keypad-btn">2</button>
      <button @click="handleKey('3')" class="keypad-btn">3</button>
      
      <!-- Row 4 -->
      <button v-if="isPrice" @click="handleKey('.')" class="keypad-btn">.</button>
      <button v-else @click="handleKey('C')" class="keypad-btn keypad-btn-danger">C</button>
      <button @click="handleKey('0')" class="keypad-btn">0</button>
      <button @click="handleKey('backspace')" class="keypad-btn keypad-btn-warning" style="color: #ea580c !important;">Del</button>
    </div>
    
    <!-- Clear button for price mode -->
    <button 
      v-if="isPrice" 
      @click="handleKey('C')" 
      class="w-full mt-2 keypad-btn keypad-btn-danger"
    >
      Clear
    </button>
  </div>
</template>

<style scoped>
.keypad-btn {
  @apply min-h-[60px] text-2xl font-bold rounded-xl transition-all;
  @apply bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm;
  @apply border border-gray-200/50 dark:border-gray-600/50;
  @apply text-gray-900 dark:text-white;
  @apply hover:bg-gray-100 dark:hover:bg-gray-700;
  @apply active:scale-95 active:bg-gray-200 dark:active:bg-gray-600;
}

.keypad-btn-danger {
  @apply bg-red-500/20 text-red-600 dark:text-red-400 border-red-300/50 dark:border-red-600/50;
  @apply hover:bg-red-500/30;
}

.keypad-btn-warning {
  @apply bg-orange-500/20 text-orange-600 dark:text-orange-400 border-orange-300/50 dark:border-orange-600/50;
  @apply hover:bg-orange-500/30;
}
</style>
