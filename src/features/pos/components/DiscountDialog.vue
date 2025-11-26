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
      <div class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" aria-hidden="true" @click="$emit('close')"></div>

      <span class="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

      <div class="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
        <div class="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
          <div class="sm:flex sm:items-start">
            <div class="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
              <h3 class="text-lg leading-6 font-medium text-gray-900" id="modal-title">
                Apply Discount
              </h3>
              <div class="mt-2">
                <p class="text-sm text-gray-500 mb-4">
                  Enter a discount code to apply to the current cart.
                </p>
                <div class="mt-1">
                  <input
                    type="text"
                    v-model="discountCode"
                    class="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md p-2 border"
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
        <div class="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
          <button
            type="button"
            class="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm disabled:opacity-50"
            :disabled="!discountCode || posStore.isLoading"
            @click="applyDiscount"
          >
            <i v-if="posStore.isLoading" class="fas fa-spinner fa-spin mr-2"></i>
            Apply
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
