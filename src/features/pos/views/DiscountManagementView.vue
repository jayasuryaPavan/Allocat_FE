<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useDiscountStore } from '../stores/discountStore'
import { DiscountType } from '../types'

const discountStore = useDiscountStore()
const showCreateModal = ref(false)

// Form data
const formData = ref({
  code: '',
  name: '',
  type: DiscountType.PERCENTAGE,
  value: 0,
  minPurchaseAmount: 0,
  maxDiscountAmount: 0,
  validFrom: '',
  validTo: '',
  maxUsageCount: 0,
  isActive: true
})

onMounted(() => {
  discountStore.fetchDiscounts()
})

const resetForm = () => {
  formData.value = {
    code: '',
    name: '',
    type: DiscountType.PERCENTAGE,
    value: 0,
    minPurchaseAmount: 0,
    maxDiscountAmount: 0,
    validFrom: '',
    validTo: '',
    maxUsageCount: 0,
    isActive: true
  }
}

const handleCreate = async () => {
  try {
    await discountStore.createDiscount(formData.value)
    showCreateModal.value = false
    resetForm()
  } catch (error) {
    // Error handled in store
  }
}

const handleDeactivate = async (id: number) => {
  if (confirm('Are you sure you want to deactivate this discount?')) {
    await discountStore.deactivateDiscount(id)
  }
}
</script>

<template>
  <div class="space-y-6">
    <div class="md:flex md:items-center md:justify-between">
      <div class="flex-1 min-w-0">
        <h2 class="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate">
          Discount Management
        </h2>
      </div>
      <div class="mt-4 flex md:mt-0 md:ml-4">
        <button
          @click="showCreateModal = true"
          class="ml-3 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          <i class="fas fa-plus mr-2"></i>
          Create Discount
        </button>
      </div>
    </div>

    <!-- Discounts List -->
    <div class="bg-white shadow overflow-hidden sm:rounded-md">
      <ul role="list" class="divide-y divide-gray-200">
        <li v-if="discountStore.isLoading" class="px-4 py-4 sm:px-6 text-center text-gray-500">
          <i class="fas fa-spinner fa-spin mr-2"></i> Loading...
        </li>
        <li v-else-if="discountStore.discounts.length === 0" class="px-4 py-4 sm:px-6 text-center text-gray-500">
          No discounts found.
        </li>
        <li v-for="discount in discountStore.discounts" :key="discount.id">
          <div class="px-4 py-4 sm:px-6 hover:bg-gray-50">
            <div class="flex items-center justify-between">
              <div class="flex flex-col">
                <p class="text-sm font-medium text-blue-600 truncate">
                  {{ discount.code }}
                  <span class="ml-2 px-2 inline-flex text-xs leading-5 font-semibold rounded-full" :class="discount.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'">
                    {{ discount.isActive ? 'Active' : 'Inactive' }}
                  </span>
                </p>
                <p class="mt-1 text-sm text-gray-500">{{ discount.name }}</p>
              </div>
              <div class="flex flex-col text-right">
                <p class="text-sm font-bold text-gray-900">
                  {{ discount.type === DiscountType.PERCENTAGE ? `${discount.value}%` : `$${discount.value}` }}
                </p>
                <p class="text-xs text-gray-500">
                  {{ discount.type }}
                </p>
              </div>
            </div>
            <div class="mt-2 sm:flex sm:justify-between">
              <div class="sm:flex">
                <p class="flex items-center text-sm text-gray-500">
                  <i class="fas fa-calendar-alt flex-shrink-0 mr-1.5 text-gray-400"></i>
                  {{ discount.validTo ? `Expires: ${new Date(discount.validTo).toLocaleDateString()}` : 'No Expiry' }}
                </p>
                <p class="mt-2 flex items-center text-sm text-gray-500 sm:mt-0 sm:ml-6">
                  <i class="fas fa-chart-bar flex-shrink-0 mr-1.5 text-gray-400"></i>
                  Used: {{ discount.currentUsageCount || 0 }} times
                </p>
              </div>
              <div class="mt-2 flex items-center text-sm text-gray-500 sm:mt-0">
                <button 
                  v-if="discount.isActive"
                  @click="handleDeactivate(discount.id)"
                  class="text-red-600 hover:text-red-900 font-medium text-xs"
                >
                  Deactivate
                </button>
              </div>
            </div>
          </div>
        </li>
      </ul>
    </div>

    <!-- Create Modal (Simplified) -->
    <div v-if="showCreateModal" class="fixed inset-0 z-50 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
      <div class="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div class="fixed inset-0 bg-gray-500/60 backdrop-blur-md transition-opacity" aria-hidden="true" @click="showCreateModal = false"></div>
        <span class="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
        <div class="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
          <div class="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <h3 class="text-lg leading-6 font-medium text-gray-900 mb-4">Create New Discount</h3>
            <div class="space-y-4">
              <div>
                <label class="block text-sm font-medium text-gray-700">Code</label>
                <input type="text" v-model="formData.code" class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm">
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700">Name</label>
                <input type="text" v-model="formData.name" class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm">
              </div>
              <div class="grid grid-cols-2 gap-4">
                <div>
                  <label class="block text-sm font-medium text-gray-700">Type</label>
                  <select v-model="formData.type" class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm">
                    <option :value="DiscountType.PERCENTAGE">Percentage</option>
                    <option :value="DiscountType.FIXED_AMOUNT">Fixed Amount</option>
                  </select>
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700">Value</label>
                  <input type="number" v-model="formData.value" class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm">
                </div>
              </div>
            </div>
          </div>
          <div class="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
            <button @click="handleCreate" type="button" class="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm">
              Create
            </button>
            <button @click="showCreateModal = false" type="button" class="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm">
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
