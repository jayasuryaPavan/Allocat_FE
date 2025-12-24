<script setup lang="ts">
import { computed } from 'vue'
import type { CartItem } from '../types'

const props = defineProps<{
  item: CartItem
}>()

const emit = defineEmits(['update-quantity', 'remove'])

const formattedPrice = computed(() => {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(props.item.unitPrice)
})

const formattedTotal = computed(() => {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(props.item.total)
})

const increaseQuantity = () => {
  emit('update-quantity', props.item.itemId, props.item.quantity + 1)
}

const decreaseQuantity = () => {
  if (props.item.quantity > 1) {
    emit('update-quantity', props.item.itemId, props.item.quantity - 1)
  } else {
    emit('remove', props.item.itemId)
  }
}

const updateQuantity = (event: Event) => {
  const input = event.target as HTMLInputElement
  const value = parseInt(input.value)
  if (!isNaN(value) && value > 0) {
    emit('update-quantity', props.item.itemId, value)
  } else {
    // Reset to current value if invalid
    input.value = props.item.quantity.toString()
  }
}
</script>

<template>
  <div class="flex items-center justify-between p-4 border-b-2 border-gray-200 hover:bg-gray-50 active:bg-gray-100 transition-colors touch-no-select">
    <div class="flex-1 min-w-0 pr-4">
      <h4 class="text-lg font-semibold text-gray-900 truncate">{{ item.productName }}</h4>
      <p class="text-sm text-gray-500 mt-1">{{ item.sku }}</p>
      <div class="mt-2 text-sm text-gray-600 font-medium">
        {{ formattedPrice }} x {{ item.quantity }}
      </div>
    </div>
    
    <div class="flex items-center gap-4">
      <!-- Quantity Controls - Touch Optimized -->
      <div class="flex items-center border-2 border-gray-300 rounded-xl overflow-hidden shadow-sm">
        <button 
          class="touch-button min-w-[56px] min-h-[56px] bg-gray-100 active:bg-gray-200 text-gray-700 hover:bg-gray-150 focus:outline-none flex items-center justify-center transition-all"
          @click="decreaseQuantity"
        >
          <i class="fas fa-minus text-lg font-bold"></i>
        </button>
        <input 
          type="number" 
          class="touch-input w-16 text-center text-lg font-semibold border-none focus:ring-2 focus:ring-blue-500 appearance-none bg-white"
          :value="item.quantity"
          @change="updateQuantity"
        />
        <button 
          class="touch-button min-w-[56px] min-h-[56px] bg-gray-100 active:bg-gray-200 text-gray-700 hover:bg-gray-150 focus:outline-none flex items-center justify-center transition-all"
          @click="increaseQuantity"
        >
          <i class="fas fa-plus text-lg font-bold"></i>
        </button>
      </div>
      
      <!-- Total -->
      <div class="text-right min-w-[100px]">
        <div class="text-lg font-bold text-gray-900">{{ formattedTotal }}</div>
        <div v-if="item.discount > 0" class="text-sm text-green-600 font-medium">
          -{{ item.discount.toFixed(2) }}
        </div>
      </div>
      
      <!-- Remove Button - Touch Optimized -->
      <button 
        class="touch-button min-w-[56px] min-h-[56px] text-red-400 hover:text-red-600 active:text-red-700 active:bg-red-50 focus:outline-none rounded-lg transition-all flex items-center justify-center"
        @click="$emit('remove', item.itemId)"
      >
        <i class="fas fa-trash-alt text-xl"></i>
      </button>
    </div>
  </div>
</template>

<style scoped>
/* Hide spinner for number input */
input[type=number]::-webkit-inner-spin-button, 
input[type=number]::-webkit-outer-spin-button { 
  -webkit-appearance: none; 
  margin: 0; 
}
</style>
