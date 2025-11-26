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
  <div class="flex items-center justify-between p-3 border-b border-gray-100 hover:bg-gray-50 transition-colors">
    <div class="flex-1 min-w-0">
      <h4 class="text-sm font-medium text-gray-900 truncate">{{ item.productName }}</h4>
      <p class="text-xs text-gray-500">{{ item.sku }}</p>
      <div class="mt-1 text-xs text-gray-500">
        {{ formattedPrice }} x {{ item.quantity }}
      </div>
    </div>
    
    <div class="flex items-center space-x-3">
      <!-- Quantity Controls -->
      <div class="flex items-center border border-gray-300 rounded-md">
        <button 
          class="px-2 py-1 text-gray-600 hover:bg-gray-100 rounded-l-md focus:outline-none"
          @click="decreaseQuantity"
        >
          <i class="fas fa-minus text-xs"></i>
        </button>
        <input 
          type="number" 
          class="w-10 text-center text-sm border-none focus:ring-0 p-1 appearance-none"
          :value="item.quantity"
          @change="updateQuantity"
        />
        <button 
          class="px-2 py-1 text-gray-600 hover:bg-gray-100 rounded-r-md focus:outline-none"
          @click="increaseQuantity"
        >
          <i class="fas fa-plus text-xs"></i>
        </button>
      </div>
      
      <!-- Total -->
      <div class="text-right min-w-[80px]">
        <div class="text-sm font-bold text-gray-900">{{ formattedTotal }}</div>
        <div v-if="item.discount > 0" class="text-xs text-green-600">
          -{{ item.discount.toFixed(2) }}
        </div>
      </div>
      
      <!-- Remove Button -->
      <button 
        class="text-gray-400 hover:text-red-500 focus:outline-none ml-2"
        @click="$emit('remove', item.itemId)"
      >
        <i class="fas fa-trash-alt"></i>
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
