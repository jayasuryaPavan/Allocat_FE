<script setup lang="ts">
import { computed } from 'vue'
import { usePosStore } from '../stores/posStore'
import CartItem from './CartItem.vue'

const posStore = usePosStore()

const cart = computed(() => posStore.currentCart)
const items = computed(() => posStore.currentCart?.items || [])

const subtotal = computed(() => cart.value?.subtotal || 0)
const tax = computed(() => cart.value?.taxAmount || 0)
const discount = computed(() => cart.value?.discountAmount || 0)
const total = computed(() => cart.value?.total || 0)

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(value)
}

const handleUpdateQuantity = (itemId: string, quantity: number) => {
  if (cart.value?.cartId) {
    posStore.updateItemQuantity(cart.value.cartId, itemId, quantity)
  }
}

const handleRemoveItem = (itemId: string) => {
  if (cart.value?.cartId) {
    posStore.removeItem(cart.value.cartId, itemId)
  }
}

const handleClearCart = () => {
  if (cart.value?.cartId) {
    if (confirm('Are you sure you want to clear the cart?')) {
      posStore.clearCart(cart.value.cartId)
    }
  }
}
</script>

<template>
  <div class="flex flex-col h-full card">
    <!-- Header -->
    <div class="p-4 border-b border-gray-200/50 dark:border-gray-700/50 flex justify-between items-center">
      <h3 class="text-lg font-semibold text-gray-800 dark:text-gray-100">
        <i class="fas fa-shopping-cart mr-2 text-blue-500"></i>Current Order
      </h3>
      <button 
        v-if="items.length > 0"
        class="touch-button min-h-[48px] px-4 py-2 text-base text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 active:text-red-800 active:bg-red-50 dark:active:bg-red-900/20 font-semibold rounded-lg transition-all touch-no-select"
        @click="handleClearCart"
      >
        Clear All
      </button>
    </div>

    <!-- Cart Items List -->
    <div class="flex-1 overflow-y-auto min-h-0">
      <div v-if="items.length === 0" class="h-full flex flex-col items-center justify-center text-gray-400 p-8">
        <i class="fas fa-shopping-basket text-8xl mb-6 opacity-20"></i>
        <p class="text-2xl font-semibold mb-2">Cart is empty</p>
        <p class="text-lg">Scan a product or search to add items</p>
      </div>
      <div v-else>
        <CartItem 
          v-for="item in items" 
          :key="item.itemId" 
          :item="item"
          @update-quantity="handleUpdateQuantity"
          @remove="handleRemoveItem"
        />
      </div>
    </div>

    <!-- Footer / Totals -->
    <div class="p-4 border-t border-gray-200/50 dark:border-gray-700/50">
      <div class="space-y-3 mb-6">
        <div class="flex justify-between text-lg text-gray-600 dark:text-gray-300">
          <span class="font-medium">Subtotal</span>
          <span class="font-semibold">{{ formatCurrency(subtotal) }}</span>
        </div>
        <div class="flex justify-between text-lg text-gray-600 dark:text-gray-300">
          <span class="font-medium">Tax</span>
          <span class="font-semibold">{{ formatCurrency(tax) }}</span>
        </div>
        <div v-if="discount > 0" class="flex justify-between text-lg text-green-600 dark:text-green-400 font-semibold">
          <span>Discount</span>
          <span>-{{ formatCurrency(discount) }}</span>
        </div>
        <div class="flex justify-between text-3xl font-bold text-gray-900 dark:text-white pt-3 border-t-2 border-gray-300/50 dark:border-gray-600/50">
          <span>Total</span>
          <span>{{ formatCurrency(total) }}</span>
        </div>
      </div>

      <slot name="actions"></slot>
    </div>
  </div>
</template>
