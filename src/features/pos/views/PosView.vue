<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { usePosStore } from '../stores/posStore'
import { useAuthStore } from '@/core/stores/auth'
import { useNotificationStore } from '@/core/stores/notification'
import ProductSearch from '../components/ProductSearch.vue'
import CartSummary from '../components/CartSummary.vue'
import PaymentModal from '../components/PaymentModal.vue'
import DiscountDialog from '../components/DiscountDialog.vue'
import CustomerSelector from '../components/CustomerSelector.vue'
import HeldOrdersModal from '../components/HeldOrdersModal.vue'
import ReturnOrderModal from '../components/ReturnOrderModal.vue'
import type { CheckoutRequest } from '../types'

const posStore = usePosStore()
const authStore = useAuthStore()
const notificationStore = useNotificationStore()

const showPaymentModal = ref(false)
const showDiscountDialog = ref(false)
const showHeldOrdersModal = ref(false)
const showReturnModal = ref(false)
const selectedCustomer = ref<any>(null)

const cart = computed(() => posStore.currentCart)

onMounted(async () => {
  // Initialize cart if not exists
  if (!posStore.currentCart) {
    const storeId = 1 // Default store ID for now
    const cashierId = Number(authStore.currentUser?.id) || 1
    
    // Run diagnostics if in development mode
    if (import.meta.env.DEV) {
      try {
        const { runApiDiagnostics, printDiagnostics } = await import('@/utils/apiDiagnostics')
        const diagnostics = await runApiDiagnostics()
        printDiagnostics(diagnostics)
      } catch (error) {
        console.warn('Failed to run diagnostics:', error)
      }
    }
    
    try {
      await posStore.createCart(storeId, cashierId)
    } catch (error: any) {
      // Error is already handled in posStore with notification
      console.error('Failed to create cart on mount:', error)
    }
  }
})

const handleProductSelected = async (product: any) => {
  if (cart.value?.cartId) {
    await posStore.addItem(cart.value.cartId, product.id, undefined, 1)
  }
}

const handleCheckout = () => {
  if (!posStore.hasItems) {
    notificationStore.warning('Cart is empty', 'Add items to cart before checkout')
    return
  }
  showPaymentModal.value = true
}

const handleSuspend = async () => {
  if (!cart.value?.cartId || !posStore.hasItems) {
    notificationStore.warning('Cart is empty', 'Cannot suspend an empty cart')
    return
  }
  
  try {
    await posStore.holdOrder(cart.value.cartId, selectedCustomer.value?.id, 'Suspended by cashier')
    selectedCustomer.value = null
    // Create new cart immediately
    const storeId = 1
    const cashierId = Number(authStore.currentUser?.id) || 1
    await posStore.createCart(storeId, cashierId)
  } catch (error) {
    // Error handled in store
  }
}

const handlePaymentComplete = async (paymentData: any) => {
  if (!cart.value?.cartId) return

  const checkoutRequest: CheckoutRequest = {
    cartId: cart.value.cartId,
    customerId: selectedCustomer.value?.id,
    payments: paymentData.payments,
    notes: paymentData.notes,
    emailReceipt: !!selectedCustomer.value?.email
  }

  try {
    const order = await posStore.checkout(checkoutRequest)
    showPaymentModal.value = false
    selectedCustomer.value = null
    // Optionally show receipt or success message with order details
    // For now, we just start a new cart
    const storeId = 1
    const cashierId = Number(authStore.currentUser?.id) || 1
    await posStore.createCart(storeId, cashierId)
  } catch (error) {
    // Error handled in store
  }
}
</script>

<template>
  <div class="h-[calc(100vh-6rem)] flex flex-col md:flex-row gap-4 p-4 bg-gray-100">
    <!-- Left Panel: Product Search & Actions -->
    <div class="w-full md:w-2/3 flex flex-col gap-4">
      <!-- Top Bar: Customer & Search -->
      <div class="bg-white p-4 rounded-lg shadow-sm flex flex-col md:flex-row gap-4 items-center">
        <div class="w-full md:w-1/3">
          <CustomerSelector v-model="selectedCustomer" />
        </div>
        <div class="w-full md:w-2/3">
          <ProductSearch @product-selected="handleProductSelected" />
        </div>
      </div>

      <!-- Main Content Area (Placeholder for Grid/Quick Keys) -->
      <div class="flex-1 bg-white rounded-lg shadow-sm p-4 flex items-center justify-center text-gray-400 border-2 border-dashed border-gray-200">
        <div class="text-center">
          <i class="fas fa-th text-4xl mb-2"></i>
          <p>Quick Keys / Product Grid</p>
          <p class="text-sm">(Coming Soon)</p>
        </div>
      </div>

      <!-- Action Buttons -->
      <div class="grid grid-cols-4 gap-2">
        <button 
          class="p-3 bg-white border border-gray-300 rounded-lg shadow-sm hover:bg-gray-50 text-gray-700 font-medium flex flex-col items-center justify-center gap-1"
          @click="showDiscountDialog = true"
          :disabled="!posStore.hasItems"
        >
          <i class="fas fa-percent text-blue-500"></i>
          <span>Discount</span>
        </button>
        <button 
          class="p-3 bg-white border border-gray-300 rounded-lg shadow-sm hover:bg-gray-50 text-gray-700 font-medium flex flex-col items-center justify-center gap-1"
          @click="handleSuspend"
          :disabled="!posStore.hasItems"
        >
          <i class="fas fa-pause text-orange-500"></i>
          <span>Suspend</span>
        </button>
        <button 
          class="p-3 bg-white border border-gray-300 rounded-lg shadow-sm hover:bg-gray-50 text-gray-700 font-medium flex flex-col items-center justify-center gap-1"
          @click="showHeldOrdersModal = true"
        >
          <i class="fas fa-undo text-green-500"></i>
          <span>Recall</span>
        </button>
        <button 
          class="p-3 bg-white border border-gray-300 rounded-lg shadow-sm hover:bg-gray-50 text-gray-700 font-medium flex flex-col items-center justify-center gap-1"
          @click="showReturnModal = true"
        >
          <i class="fas fa-undo text-orange-500"></i>
          <span>Return</span>
        </button>
        <button 
          class="p-3 bg-white border border-gray-300 rounded-lg shadow-sm hover:bg-gray-50 text-gray-700 font-medium flex flex-col items-center justify-center gap-1"
          @click="$router.push('/pos/sales')"
        >
          <i class="fas fa-history text-purple-500"></i>
          <span>History</span>
        </button>
      </div>
    </div>

    <!-- Right Panel: Cart Summary -->
    <div class="w-full md:w-1/3 flex flex-col">
      <CartSummary class="h-full">
        <template #actions>
          <button
            class="w-full py-4 bg-blue-600 hover:bg-blue-700 text-white text-xl font-bold rounded-lg shadow-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex justify-center items-center"
            :disabled="!posStore.hasItems"
            @click="handleCheckout"
          >
            <span>Checkout</span>
            <i class="fas fa-chevron-right ml-2"></i>
          </button>
        </template>
      </CartSummary>
    </div>

    <!-- Modals -->
    <PaymentModal
      :is-open="showPaymentModal"
      :total-amount="cart?.total || 0"
      @close="showPaymentModal = false"
      @complete="handlePaymentComplete"
    />

    <DiscountDialog
      :is-open="showDiscountDialog"
      :cart-id="cart?.cartId || ''"
      @close="showDiscountDialog = false"
    />

    <HeldOrdersModal
      :is-open="showHeldOrdersModal"
      @close="showHeldOrdersModal = false"
      @resume="(order) => { 
        selectedCustomer = order.customer 
        // Cart is already updated by store action
      }"
    />

    <ReturnOrderModal
      :is-open="showReturnModal"
      @close="showReturnModal = false"
      @return-processed="() => {
        // Optional: Refresh or reload if needed
      }"
    />
  </div>
</template>
