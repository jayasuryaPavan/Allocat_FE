<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRoute } from 'vue-router'
import { usePosStore } from '../stores/posStore'
import { useShiftStore } from '../stores/shiftStore'
import { useAuthStore } from '@/core/stores/auth'
import { useNotificationStore } from '@/core/stores/notification'
import ProductSearch from '../components/ProductSearch.vue'
import CartSummary from '../components/CartSummary.vue'
import PaymentModal from '../components/PaymentModal.vue'
import DiscountDialog from '../components/DiscountDialog.vue'
import HeldOrdersModal from '../components/HeldOrdersModal.vue'
import ReturnOrderModal from '../components/ReturnOrderModal.vue'
import QuickAddItemModal from '../components/QuickAddItemModal.vue'
import ProductGrid from '../components/ProductGrid.vue'
import type { CheckoutRequest } from '../types'

const route = useRoute()
const posStore = usePosStore()
const shiftStore = useShiftStore()
const authStore = useAuthStore()
const notificationStore = useNotificationStore()

// Check if we're in kiosk mode (fullScreen route meta or /pos-kiosk path)
const isKioskMode = computed(() => route.meta?.fullScreen === true || route.path.includes('pos-kiosk'))

const showPaymentModal = ref(false)
const showDiscountDialog = ref(false)
const showHeldOrdersModal = ref(false)
const showReturnModal = ref(false)
const showQuickAddModal = ref(false)
const isQuickAddTaxExempt = ref(false)

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
  } else {
    // If cart creation failed or is seemingly missing, try to recreate it first
    try {
      if (import.meta.env.DEV) console.warn('Cart missing, attempting to recreate...')
      await posStore.createCart(getStoreId(), getUserId())
      if (cart.value?.cartId) {
         await posStore.addItem(cart.value.cartId, product.id, undefined, 1)
      } else {
         notificationStore.error('Cart Error', 'Unable to initialize cart. Please refresh the page.')
      }
    } catch (e) {
      notificationStore.error('Cart Error', 'Failed to add item to cart')
    }
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
    await posStore.holdOrder(cart.value.cartId, undefined, 'Suspended by cashier')
    // Create new cart immediately
    const storeId = getStoreId()
    const cashierId = getUserId()
    await posStore.createCart(storeId, cashierId)
  } catch (error) {
    // Error handled in store
  }
}

const handleOpenQuickAdd = (taxExempt: boolean) => {
  isQuickAddTaxExempt.value = taxExempt
  showQuickAddModal.value = true
}

const handlePaymentComplete = async (paymentData: any) => {
  if (!cart.value?.cartId) return

  const checkoutRequest: CheckoutRequest = {
    cartId: cart.value.cartId,
    customerId: undefined,
    payments: paymentData.payments,
    notes: paymentData.notes,
    emailReceipt: false
  }

  try {
    await posStore.checkout(checkoutRequest)
    showPaymentModal.value = false
    // Start a new cart
    const storeId = getStoreId()
    const cashierId = getUserId()
    await posStore.createCart(storeId, cashierId)
  } catch (error) {
    // Error handled in store
  }
}
</script>

<template>
  <div :class="[isKioskMode ? 'h-screen pt-20' : 'h-[calc(100vh-6rem)]', 'flex flex-col md:flex-row gap-4 p-4']">
    <!-- Left Panel: Product Search & Actions -->
    <div class="w-full md:w-2/3 flex flex-col gap-4">
      <!-- Top Bar: Product Search (Full Width) -->
      <div class="card p-4">
        <ProductSearch @product-selected="handleProductSelected" />
      </div>

      <!-- Quick Add Buttons - Tax Exempt and Taxable -->
      <div class="grid grid-cols-2 gap-4">
        <button 
          class="pos-action-btn !min-h-[100px] border-2 border-green-400/30 hover:border-green-500/50"
          @click="handleOpenQuickAdd(true)"
        >
          <i class="fas fa-receipt text-green-500 text-3xl"></i>
          <span class="text-lg font-bold text-gray-900 dark:text-white">Tax Exempt</span>
          <span class="text-xs text-gray-500 dark:text-gray-400">Lottery, Gift Cards</span>
        </button>
        <button 
          class="pos-action-btn !min-h-[100px] border-2 border-blue-400/30 hover:border-blue-500/50"
          @click="handleOpenQuickAdd(false)"
        >
          <i class="fas fa-dollar-sign text-blue-500 text-3xl"></i>
          <span class="text-lg font-bold text-gray-900 dark:text-white">Taxable Item</span>
          <span class="text-xs text-gray-500 dark:text-gray-400">Manual Price Entry</span>
        </button>
      </div>

      <!-- Main Content Area (Product Grid) -->
      <div class="flex-1 card p-2 overflow-hidden bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm border-0">
        <ProductGrid @product-selected="handleProductSelected" />
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
      @resume="() => { 
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

    <QuickAddItemModal
      :is-open="showQuickAddModal"
      :is-tax-exempt="isQuickAddTaxExempt"
      @close="showQuickAddModal = false"
    />
  </div>
</template>
