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
  <div class="flex flex-col h-full bg-white shadow-sm rounded-lg border border-gray-200">
    <!-- Header -->
    <div class="p-4 border-b border-gray-200 flex justify-between items-center bg-gray-50 rounded-t-lg">
      <h3 class="text-lg font-semibold text-gray-800">
        <i class="fas fa-shopping-cart mr-2 text-blue-500"></i>Current Order
      </h3>
      <button 
        v-if="items.length > 0"
        class="text-sm text-red-500 hover:text-red-700 font-medium"
        @click="handleClearCart"
      >
        Clear All
      </button>
    </div>

    <!-- Cart Items List -->
    <div class="flex-1 overflow-y-auto min-h-0">
      <div v-if="items.length === 0" class="h-full flex flex-col items-center justify-center text-gray-400 p-8">
        <i class="fas fa-shopping-basket text-6xl mb-4 opacity-20"></i>
        <p class="text-lg">Cart is empty</p>
        <p class="text-sm">Scan a product or search to add items</p>
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
    <div class="p-4 border-t border-gray-200 bg-gray-50 rounded-b-lg">
      <div class="space-y-2 mb-4">
        <div class="flex justify-between text-sm text-gray-600">
          <span>Subtotal</span>
          <span>{{ formatCurrency(subtotal) }}</span>
        </div>
        <div class="flex justify-between text-sm text-gray-600">
          <span>Tax</span>
          <span>{{ formatCurrency(tax) }}</span>
        </div>
        <div v-if="discount > 0" class="flex justify-between text-sm text-green-600 font-medium">
          <span>Discount</span>
          <span>-{{ formatCurrency(discount) }}</span>
        </div>
        <div class="flex justify-between text-xl font-bold text-gray-900 pt-2 border-t border-gray-200">
          <span>Total</span>
          <span>{{ formatCurrency(total) }}</span>
        </div>
      </div>

      <slot name="actions"></slot>
    </div>
  </div>
</template>
