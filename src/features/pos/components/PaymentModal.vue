<script setup lang="ts">
import { ref, computed } from 'vue'
import { usePosStore } from '../stores/posStore'
import { PaymentType } from '../types'

const props = defineProps<{
  isOpen: boolean
  totalAmount: number
}>()

const emit = defineEmits(['close', 'complete'])

const posStore = usePosStore()

const paymentMethod = ref<PaymentType>(PaymentType.CASH)
const amountTendered = ref<number>(props.totalAmount)
const notes = ref('')

const changeDue = computed(() => {
  return Math.max(0, amountTendered.value - props.totalAmount)
})

const isValid = computed(() => {
  return amountTendered.value >= props.totalAmount
})

const paymentMethods = [
  { id: PaymentType.CASH, label: 'Cash', icon: 'fa-money-bill-wave' },
  { id: PaymentType.CARD, label: 'Card', icon: 'fa-credit-card' },
  { id: PaymentType.MOBILE_MONEY, label: 'Mobile Money', icon: 'fa-mobile-alt' },
  { id: PaymentType.BANK_TRANSFER, label: 'Bank Transfer', icon: 'fa-university' }
]

const handlePayment = async () => {
  if (!isValid.value) return

  const paymentData = {
    payments: [
      {
        paymentType: paymentMethod.value,
        amount: props.totalAmount, // We charge the exact amount, change is handled physically
        transactionId: paymentMethod.value !== PaymentType.CASH ? `TXN-${Date.now()}` : undefined
      }
    ],
    notes: notes.value
  }

  emit('complete', paymentData)
}

const setExactAmount = () => {
  amountTendered.value = props.totalAmount
}

const addAmount = (amount: number) => {
  amountTendered.value = (amountTendered.value || 0) + amount
}
</script>

<template>
  <div v-if="isOpen" class="fixed inset-0 z-50 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
    <div class="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
      <!-- Background overlay -->
      <div class="fixed inset-0 bg-gray-500/60 backdrop-blur-md transition-opacity" aria-hidden="true" @click="$emit('close')"></div>

      <span class="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

      <div class="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
        <!-- Header with Back Button -->
        <div class="bg-white px-4 pt-4 pb-2 border-b border-gray-200 flex items-center">
          <button
            @click="$emit('close')"
            class="touch-button min-w-[56px] min-h-[56px] mr-3 flex items-center justify-center text-gray-600 hover:text-gray-900 active:text-gray-700 active:bg-gray-100 rounded-lg transition-all touch-no-select"
          >
            <i class="fas fa-arrow-left text-2xl"></i>
          </button>
          <h3 class="text-xl font-semibold text-gray-900 flex-1" id="modal-title">
            Complete Payment
          </h3>
        </div>
        <div class="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
          <div class="sm:flex sm:items-start">
            <div class="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
              
              <div class="mt-4">
                <div class="text-5xl font-bold text-center text-gray-900 mb-8">
                  {{ new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(totalAmount) }}
                </div>

                <!-- Payment Methods - Touch Optimized -->
                <div class="grid grid-cols-2 gap-4 mb-6">
                  <button
                    v-for="method in paymentMethods"
                    :key="method.id"
                    class="touch-button pos-touch-target flex flex-col items-center justify-center p-4 border-2 rounded-xl transition-all active:scale-95 touch-no-select"
                    :class="paymentMethod === method.id ? 'bg-blue-50 border-blue-500 text-blue-700 shadow-md' : 'border-gray-300 hover:bg-gray-50 active:bg-gray-100'"
                    @click="paymentMethod = method.id"
                  >
                    <i class="fas mb-2 text-2xl" :class="method.icon"></i>
                    <span class="text-base font-semibold">{{ method.label }}</span>
                  </button>
                </div>

                <!-- Cash Payment Details -->
                <div v-if="paymentMethod === PaymentType.CASH" class="space-y-4">
                  <div>
                    <label class="block text-lg font-semibold text-gray-700 mb-2">Amount Tendered</label>
                    <div class="mt-2 relative rounded-xl shadow-md">
                      <div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <span class="text-gray-500 text-xl font-semibold">$</span>
                      </div>
                      <input
                        type="number"
                        v-model="amountTendered"
                        class="touch-input focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 pr-4 text-2xl font-bold border-2 border-gray-300 rounded-xl py-3"
                        placeholder="0.00"
                      />
                    </div>
                  </div>

                  <!-- Quick Cash Buttons - Touch Optimized -->
                  <div class="grid grid-cols-4 gap-3 mt-4">
                    <button @click="setExactAmount" class="touch-button min-h-[56px] bg-gray-100 hover:bg-gray-200 active:bg-gray-300 active:scale-95 text-base font-semibold rounded-xl transition-all touch-no-select">Exact</button>
                    <button @click="addAmount(10)" class="touch-button min-h-[56px] bg-gray-100 hover:bg-gray-200 active:bg-gray-300 active:scale-95 text-base font-semibold rounded-xl transition-all touch-no-select">+$10</button>
                    <button @click="addAmount(20)" class="touch-button min-h-[56px] bg-gray-100 hover:bg-gray-200 active:bg-gray-300 active:scale-95 text-base font-semibold rounded-xl transition-all touch-no-select">+$20</button>
                    <button @click="addAmount(50)" class="touch-button min-h-[56px] bg-gray-100 hover:bg-gray-200 active:bg-gray-300 active:scale-95 text-base font-semibold rounded-xl transition-all touch-no-select">+$50</button>
                  </div>

                  <div class="bg-gray-50 p-4 rounded-xl border-2 border-gray-200 mt-4">
                    <div class="flex justify-between items-center">
                      <span class="text-lg font-semibold text-gray-700">Change Due:</span>
                      <span class="text-2xl font-bold" :class="changeDue < 0 ? 'text-red-600' : 'text-gray-900'">
                        {{ new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(changeDue) }}
                      </span>
                    </div>
                  </div>
                </div>

                <!-- Notes -->
                <div class="mt-6">
                  <label class="block text-lg font-semibold text-gray-700 mb-2">Notes (Optional)</label>
                  <textarea
                    v-model="notes"
                    rows="3"
                    class="touch-input shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full text-base border-2 border-gray-300 rounded-xl p-3"
                  ></textarea>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="bg-gray-50 px-6 py-4 sm:px-6 sm:flex sm:flex-row-reverse gap-3">
          <button
            type="button"
            class="touch-button pos-touch-target w-full inline-flex justify-center items-center rounded-xl border border-transparent shadow-lg px-6 py-4 bg-blue-600 text-xl font-bold text-white hover:bg-blue-700 active:bg-blue-800 active:scale-95 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto disabled:opacity-50 disabled:cursor-not-allowed transition-all touch-no-select"
            :disabled="!isValid || posStore.isProcessingPayment"
            @click="handlePayment"
          >
            <i v-if="posStore.isProcessingPayment" class="fas fa-spinner fa-spin mr-3 text-xl"></i>
            <span>{{ posStore.isProcessingPayment ? 'Processing...' : 'Complete Payment' }}</span>
          </button>
          <button
            type="button"
            class="touch-button pos-touch-target mt-3 w-full inline-flex justify-center items-center rounded-xl border-2 border-gray-300 shadow-md px-6 py-4 bg-white text-xl font-semibold text-gray-700 hover:bg-gray-50 active:bg-gray-100 active:scale-95 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:mt-0 sm:ml-3 sm:w-auto transition-all touch-no-select"
            @click="$emit('close')"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
