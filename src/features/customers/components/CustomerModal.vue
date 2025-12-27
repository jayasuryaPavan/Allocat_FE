<template>
  <div class="fixed inset-0 z-50 overflow-y-auto">
    <div class="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
      <div class="fixed inset-0 transition-opacity" @click="$emit('close')">
        <div class="absolute inset-0 bg-gray-500/60 dark:bg-gray-900/60 backdrop-blur-md"></div>
      </div>

      <div class="inline-block align-bottom card text-left overflow-hidden transform transition-all sm:my-8 sm:align-middle sm:max-w-4xl sm:w-full">
        <div class="px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
          <div class="sm:flex sm:items-start">
            <div class="w-full">
              <div class="flex items-center justify-between mb-4">
                <h3 class="text-lg font-medium text-gray-900 dark:text-white">
                  {{ isEditMode ? 'Edit Customer' : 'Add New Customer' }}
                </h3>
                <button
                  @click="$emit('close')"
                  class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                >
                  <svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <!-- Form -->
              <form @submit.prevent="handleSubmit" class="space-y-6">
                <!-- Basic Information -->
                <div>
                  <h4 class="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">Basic Information</h4>
                  <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Customer Code <span class="text-red-500">*</span>
                      </label>
                      <input
                        v-model="form.customerCode"
                        type="text"
                        required
                        maxlength="50"
                        class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 dark:text-white"
                        placeholder="CUST001"
                      />
                    </div>
                    <div>
                      <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Name <span class="text-red-500">*</span>
                      </label>
                      <input
                        v-model="form.name"
                        type="text"
                        required
                        maxlength="100"
                        class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 dark:text-white"
                        placeholder="John Doe"
                      />
                    </div>
                    <div>
                      <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Email
                      </label>
                      <input
                        v-model="form.email"
                        type="email"
                        maxlength="100"
                        class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 dark:text-white"
                        placeholder="john.doe@example.com"
                      />
                    </div>
                    <div>
                      <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Phone
                      </label>
                      <input
                        v-model="form.phone"
                        type="tel"
                        maxlength="20"
                        class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 dark:text-white"
                        placeholder="+1234567890"
                      />
                    </div>
                  </div>
                </div>

                <!-- Company Information -->
                <div>
                  <h4 class="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">Company Information</h4>
                  <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Company Name
                      </label>
                      <input
                        v-model="form.companyName"
                        type="text"
                        maxlength="200"
                        class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 dark:text-white"
                        placeholder="ABC Corporation"
                      />
                    </div>
                    <div>
                      <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Contact Person
                      </label>
                      <input
                        v-model="form.contactPerson"
                        type="text"
                        maxlength="100"
                        class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 dark:text-white"
                        placeholder="Jane Smith"
                      />
                    </div>
                    <div>
                      <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Tax ID
                      </label>
                      <input
                        v-model="form.taxId"
                        type="text"
                        maxlength="50"
                        class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 dark:text-white"
                        placeholder="TAX-123456"
                      />
                    </div>
                    <div>
                      <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Invoice Number
                      </label>
                      <input
                        v-model="form.invoiceNumber"
                        type="text"
                        maxlength="100"
                        class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 dark:text-white"
                        placeholder="INV-2024-001"
                      />
                    </div>
                  </div>
                </div>

                <!-- Address Information -->
                <div>
                  <h4 class="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">Address</h4>
                  <div class="grid grid-cols-1 gap-4">
                    <div>
                      <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Street Address
                      </label>
                      <textarea
                        v-model="form.address"
                        rows="2"
                        class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 dark:text-white"
                        placeholder="123 Main Street"
                      ></textarea>
                    </div>
                    <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
                      <div>
                        <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          City
                        </label>
                        <input
                          v-model="form.city"
                          type="text"
                          maxlength="100"
                          class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 dark:text-white"
                          placeholder="New York"
                        />
                      </div>
                      <div>
                        <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          State
                        </label>
                        <input
                          v-model="form.state"
                          type="text"
                          maxlength="100"
                          class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 dark:text-white"
                          placeholder="NY"
                        />
                      </div>
                      <div>
                        <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          Country
                        </label>
                        <input
                          v-model="form.country"
                          type="text"
                          maxlength="100"
                          class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 dark:text-white"
                          placeholder="USA"
                        />
                      </div>
                      <div>
                        <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          Postal Code
                        </label>
                        <input
                          v-model="form.postalCode"
                          type="text"
                          maxlength="20"
                          class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 dark:text-white"
                          placeholder="10001"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <!-- Notes -->
                <div>
                  <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Notes
                  </label>
                  <textarea
                    v-model="form.notes"
                    rows="3"
                    class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 dark:text-white"
                    placeholder="Additional notes about this customer..."
                  ></textarea>
                </div>

                <!-- Active Status (Edit mode only) -->
                <div v-if="isEditMode" class="flex items-center">
                  <input
                    v-model="form.isActive"
                    type="checkbox"
                    id="isActive"
                    class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label for="isActive" class="ml-2 block text-sm text-gray-700 dark:text-gray-300">
                    Customer is active
                  </label>
                </div>

                <!-- Form Actions -->
                <div class="flex justify-end space-x-3 pt-4 border-t border-gray-200 dark:border-gray-700">
                  <button
                    type="button"
                    @click="$emit('close')"
                    class="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    :disabled="saving"
                    class="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {{ saving ? 'Saving...' : (isEditMode ? 'Update' : 'Create') }}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { CustomersApiService } from '@/core/services/customersApi'
import type { Customer, CreateCustomerRequest, UpdateCustomerRequest } from '@/core/types/customer'

interface Props {
  customer: Customer | null
  isEditMode: boolean
}

const props = defineProps<Props>()
const emit = defineEmits<{
  close: []
  save: []
}>()

// Form state
const saving = ref(false)
const form = ref({
  customerCode: '',
  name: '',
  email: '',
  phone: '',
  address: '',
  city: '',
  state: '',
  country: '',
  postalCode: '',
  invoiceNumber: '',
  taxId: '',
  companyName: '',
  contactPerson: '',
  notes: '',
  isActive: true
})

// Populate form when editing
watch(() => props.customer, (customer) => {
  if (customer && props.isEditMode) {
    form.value = {
      customerCode: customer.customerCode,
      name: customer.name,
      email: customer.email || '',
      phone: customer.phone || '',
      address: customer.address || '',
      city: customer.city || '',
      state: customer.state || '',
      country: customer.country || '',
      postalCode: customer.postalCode || '',
      invoiceNumber: customer.invoiceNumber || '',
      taxId: customer.taxId || '',
      companyName: customer.companyName || '',
      contactPerson: customer.contactPerson || '',
      notes: customer.notes || '',
      isActive: customer.isActive
    }
  }
}, { immediate: true })

// Handle form submission
const handleSubmit = async () => {
  saving.value = true
  
  try {
    if (props.isEditMode && props.customer) {
      // Update existing customer
      const updateData: UpdateCustomerRequest = {
        ...form.value
      }
      
      const response = await CustomersApiService.updateCustomer(props.customer.id, updateData)
      
      if (response.success) {
        emit('save')
      } else {
        alert(`Failed to update customer: ${response.message}`)
      }
    } else {
      // Create new customer
      // Get store ID from session/local storage
      const storeCode = sessionStorage.getItem('active_store_code') || localStorage.getItem('active_store_code')
      if (!storeCode) {
        alert('Store code not found. Please ensure you are logged in with a valid store.')
        saving.value = false
        return
      }
      
      // In a real scenario, you'd need to fetch the store ID from the store code
      // For now, we'll use a placeholder. Adjust based on your store management
      const storeId = 1 // TODO: Get actual store ID from store code
      
      const createData: CreateCustomerRequest = {
        ...form.value,
        storeId
      }
      
      const response = await CustomersApiService.createCustomer(createData)
      
      if (response.success) {
        emit('save')
      } else {
        alert(`Failed to create customer: ${response.message}`)
      }
    }
  } catch (error) {
    console.error('Error saving customer:', error)
    alert('An error occurred while saving the customer. Please try again.')
  } finally {
    saving.value = false
  }
}
</script>



