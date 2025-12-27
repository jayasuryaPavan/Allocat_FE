<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { usePosStore } from '../stores/posStore'
import { useShiftStore } from '../stores/shiftStore'
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
const shiftStore = useShiftStore()
const authStore = useAuthStore()
const notificationStore = useNotificationStore()

const showPaymentModal = ref(false)
const showDiscountDialog = ref(false)
const showHeldOrdersModal = ref(false)
const showReturnModal = ref(false)
const selectedCustomer = ref<any>(null)

const cart = computed(() => posStore.currentCart)
const activeShift = computed(() => shiftStore.activeShift)

const getStoreId = () => Number((authStore.currentUser as any)?.storeId ?? 1)
const getUserId = () => Number(authStore.currentUser?.id ?? 1)

onMounted(async () => {
  // Initialize cart if not exists
  if (!posStore.currentCart) {
    const storeId = getStoreId() // Default store ID for now
    const cashierId = getUserId()
    
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

  try {
    await shiftStore.loadActiveShift(getStoreId(), getUserId())
  } catch (error) {
    // ignore
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
  <div class="h-[calc(100vh-6rem)] flex flex-col md:flex-row gap-4 p-4">
    <!-- Left Panel: Product Search & Actions -->
    <div class="w-full md:w-2/3 flex flex-col gap-4">
      <!-- Top Bar: Customer & Search -->
      <div class="card p-4 flex flex-col md:flex-row gap-4 items-center">
        <div class="w-full md:w-1/3">
          <CustomerSelector v-model="selectedCustomer" />
        </div>
        <div class="w-full md:w-2/3">
          <ProductSearch @product-selected="handleProductSelected" />
        </div>
      </div>

      <!-- Main Content Area (Placeholder for Grid/Quick Keys) -->
      <div class="flex-1 card p-4 flex items-center justify-center text-gray-400 border-2 border-dashed border-primary-200 dark:border-primary-800">
        <div class="text-center">
          <i class="fas fa-th text-4xl mb-2"></i>
          <p>Quick Keys / Product Grid</p>
          <p class="text-sm">(Coming Soon)</p>
        </div>
      </div>

      <!-- Action Buttons - Touch Optimized with Glass Effect -->
      <div class="grid grid-cols-2 md:grid-cols-4 gap-3 touch-grid">
        <button 
          class="pos-action-btn"
          :class="{'opacity-50 cursor-not-allowed': !posStore.hasItems}"
          @click="showDiscountDialog = true"
          :disabled="!posStore.hasItems"
        >
          <i class="fas fa-percent text-blue-500 text-2xl"></i>
          <span class="text-base font-semibold">Discount</span>
        </button>
        <button 
          class="pos-action-btn"
          :class="{'opacity-50 cursor-not-allowed': !posStore.hasItems}"
          @click="handleSuspend"
          :disabled="!posStore.hasItems"
        >
          <i class="fas fa-pause text-orange-500 text-2xl"></i>
          <span class="text-base font-semibold">Suspend</span>
        </button>
        <button 
          class="pos-action-btn"
          @click="showHeldOrdersModal = true"
        >
          <i class="fas fa-undo text-green-500 text-2xl"></i>
          <span class="text-base font-semibold">Recall</span>
        </button>
        <button 
          class="pos-action-btn"
          @click="showReturnModal = true"
        >
          <i class="fas fa-undo text-orange-500 text-2xl"></i>
          <span class="text-base font-semibold">Return</span>
        </button>
        <button 
          class="pos-action-btn md:col-span-2"
          @click="$router.push('/pos/sales')"
        >
          <i class="fas fa-history text-purple-500 text-2xl"></i>
          <span class="text-base font-semibold">History</span>
        </button>
      </div>
    </div>

    <!-- Right Panel: Cart Summary -->
    <div class="w-full md:w-1/3 flex flex-col">
      <CartSummary class="h-full">
        <template #actions>
          <button
            class="w-full btn-glass-blue text-white text-xl font-bold rounded-xl py-4 shadow-lg active:shadow-md active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex justify-center items-center gap-3"
            :disabled="!posStore.hasItems"
            @click="handleCheckout"
          >
            <span>Checkout</span>
            <i class="fas fa-chevron-right text-lg"></i>
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
