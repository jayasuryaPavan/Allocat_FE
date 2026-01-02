<script setup lang="ts">
import { ref } from 'vue'
import { usePosStore } from '../stores/posStore'

const props = defineProps<{
  isOpen: boolean
  cartId: string
}>()

const emit = defineEmits(['close'])

const posStore = usePosStore()
const discountCode = ref('')
const error = ref('')

const applyDiscount = async () => {
  if (!discountCode.value) return
  
  error.value = ''
  try {
    await posStore.applyDiscount(props.cartId, discountCode.value)
    discountCode.value = ''
    emit('close')
  } catch (err: any) {
    error.value = err.response?.data?.message || 'Failed to apply discount'
  }
}
</script>

<template>
  <div v-if="isOpen" class="fixed inset-0 z-50 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
    <div class="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
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
            Apply Discount
          </h3>
        </div>
        <div class="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
          <div class="sm:flex sm:items-start">
            <div class="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
              <div class="mt-2">
                <p class="text-sm text-gray-500 mb-4">
                  Enter a discount code to apply to the current cart.
                </p>
                <div class="mt-1">
                  <input
                    type="text"
                    v-model="discountCode"
                    class="touch-input shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full text-lg border-2 border-gray-300 rounded-xl p-3 font-medium"
                    placeholder="Enter code (e.g. SAVE10)"
                    @keydown.enter.prevent="applyDiscount"
                  />
                </div>
                <p v-if="error" class="mt-2 text-sm text-red-600">
                  {{ error }}
                </p>
              </div>
            </div>
          </div>
        </div>
        <div class="bg-gray-50 px-6 py-4 sm:px-6 sm:flex sm:flex-row-reverse gap-3">
          <button
            type="button"
            class="touch-button pos-touch-target w-full inline-flex justify-center items-center rounded-xl border border-transparent shadow-lg px-6 py-4 bg-blue-600 text-xl font-bold text-white hover:bg-blue-700 active:bg-blue-800 active:scale-95 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto disabled:opacity-50 transition-all touch-no-select"
            :disabled="!discountCode || posStore.isLoading"
            @click="applyDiscount"
          >
            <i v-if="posStore.isLoading" class="fas fa-spinner fa-spin mr-3 text-xl"></i>
            <span>Apply</span>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
