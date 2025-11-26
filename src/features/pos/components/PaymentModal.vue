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
      <div class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" aria-hidden="true" @click="$emit('close')"></div>

      <span class="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

      <div class="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
        <div class="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
          <div class="sm:flex sm:items-start">
            <div class="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
              <h3 class="text-lg leading-6 font-medium text-gray-900" id="modal-title">
                Complete Payment
              </h3>
              
              <div class="mt-4">
                <div class="text-3xl font-bold text-center text-gray-900 mb-6">
                  {{ new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(totalAmount) }}
                </div>

                <!-- Payment Methods -->
                <div class="grid grid-cols-2 gap-3 mb-6">
                  <button
                    v-for="method in paymentMethods"
                    :key="method.id"
                    class="flex items-center justify-center p-3 border rounded-md transition-colors"
                    :class="paymentMethod === method.id ? 'bg-blue-50 border-blue-500 text-blue-700' : 'border-gray-300 hover:bg-gray-50'"
                    @click="paymentMethod = method.id"
                  >
                    <i class="fas mr-2" :class="method.icon"></i>
                    {{ method.label }}
                  </button>
                </div>

                <!-- Cash Payment Details -->
                <div v-if="paymentMethod === PaymentType.CASH" class="space-y-4">
                  <div>
                    <label class="block text-sm font-medium text-gray-700">Amount Tendered</label>
                    <div class="mt-1 relative rounded-md shadow-sm">
                      <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <span class="text-gray-500 sm:text-sm">$</span>
                      </div>
                      <input
                        type="number"
                        v-model="amountTendered"
                        class="focus:ring-blue-500 focus:border-blue-500 block w-full pl-7 pr-12 sm:text-lg border-gray-300 rounded-md py-2"
                        placeholder="0.00"
                      />
                    </div>
                  </div>

                  <!-- Quick Cash Buttons -->
                  <div class="flex space-x-2">
                    <button @click="setExactAmount" class="px-3 py-1 text-xs bg-gray-100 hover:bg-gray-200 rounded">Exact</button>
                    <button @click="addAmount(10)" class="px-3 py-1 text-xs bg-gray-100 hover:bg-gray-200 rounded">+$10</button>
                    <button @click="addAmount(20)" class="px-3 py-1 text-xs bg-gray-100 hover:bg-gray-200 rounded">+$20</button>
                    <button @click="addAmount(50)" class="px-3 py-1 text-xs bg-gray-100 hover:bg-gray-200 rounded">+$50</button>
                  </div>

                  <div class="bg-gray-50 p-3 rounded-md">
                    <div class="flex justify-between text-sm">
                      <span class="font-medium text-gray-700">Change Due:</span>
                      <span class="font-bold text-gray-900" :class="{'text-red-600': changeDue < 0}">
                        {{ new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(changeDue) }}
                      </span>
                    </div>
                  </div>
                </div>

                <!-- Notes -->
                <div class="mt-4">
                  <label class="block text-sm font-medium text-gray-700">Notes (Optional)</label>
                  <textarea
                    v-model="notes"
                    rows="2"
                    class="shadow-sm focus:ring-blue-500 focus:border-blue-500 mt-1 block w-full sm:text-sm border border-gray-300 rounded-md"
                  ></textarea>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
          <button
            type="button"
            class="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm disabled:opacity-50 disabled:cursor-not-allowed"
            :disabled="!isValid || posStore.isProcessingPayment"
            @click="handlePayment"
          >
            <i v-if="posStore.isProcessingPayment" class="fas fa-spinner fa-spin mr-2"></i>
            {{ posStore.isProcessingPayment ? 'Processing...' : 'Complete Payment' }}
          </button>
          <button
            type="button"
            class="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
            @click="$emit('close')"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
