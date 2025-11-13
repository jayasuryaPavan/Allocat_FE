<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="md:flex md:items-center md:justify-between">
      <div class="flex-1 min-w-0">
        <h2 class="text-2xl font-bold leading-7 text-gray-900 dark:text-white sm:text-3xl sm:truncate">
          Customers
        </h2>
        <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Manage customer information, invoices, and contact details.
        </p>
      </div>
      <div class="mt-4 flex space-x-2 md:ml-4 md:mt-0">
        <button
          @click="fetchCustomers"
          class="inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600"
        >
          <svg class="-ml-1 mr-2 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          Refresh
        </button>
        <button
          @click="openCreateModal"
          class="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
        >
          <svg class="-ml-1 mr-2 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
          </svg>
          Add Customer
        </button>
      </div>
    </div>

    <!-- Search and Filters -->
    <div class="bg-white dark:bg-gray-800 shadow rounded-lg p-4">
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <input
          v-model="searchTerm"
          @input="debouncedSearch"
          type="text"
          placeholder="Search by name, code, email, or invoice..."
          class="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 dark:text-white"
        />
        <select
          v-model="activeFilter"
          @change="fetchCustomers"
          class="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 dark:text-white"
        >
          <option value="">All Status</option>
          <option value="true">Active Only</option>
          <option value="false">Inactive Only</option>
        </select>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="text-center py-12">
      <svg class="animate-spin h-8 w-8 text-blue-600 mx-auto" fill="none" viewBox="0 0 24 24">
        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
      </svg>
      <p class="mt-2 text-sm text-gray-500 dark:text-gray-400">Loading customers...</p>
    </div>

    <!-- Customers Table -->
    <div v-else class="bg-white dark:bg-gray-800 shadow rounded-lg overflow-hidden">
      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead class="bg-gray-50 dark:bg-gray-700">
            <tr>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Code
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Name
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Contact
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Invoice #
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Company
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Status
              </th>
              <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody class="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
            <tr v-if="customers.length === 0">
              <td colspan="7" class="px-6 py-12 text-center text-sm text-gray-500 dark:text-gray-400">
                No customers found. Add your first customer to get started.
              </td>
            </tr>
            <tr v-for="customer in customers" :key="customer.id" class="hover:bg-gray-50 dark:hover:bg-gray-700">
              <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                {{ customer.customerCode }}
              </td>
              <td class="px-6 py-4 text-sm text-gray-900 dark:text-white">
                <div class="font-medium">{{ customer.name }}</div>
                <div v-if="customer.contactPerson" class="text-gray-500 dark:text-gray-400 text-xs">
                  Contact: {{ customer.contactPerson }}
                </div>
              </td>
              <td class="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">
                <div v-if="customer.email">📧 {{ customer.email }}</div>
                <div v-if="customer.phone">📞 {{ customer.phone }}</div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                {{ customer.invoiceNumber || '-' }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                {{ customer.companyName || '-' }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span 
                  :class="customer.isActive ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'"
                  class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full"
                >
                  {{ customer.isActive ? 'Active' : 'Inactive' }}
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <button
                  @click="openEditModal(customer)"
                  class="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300 mr-3"
                >
                  Edit
                </button>
                <button
                  @click="confirmDelete(customer)"
                  class="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
                >
                  Delete
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Create/Edit Modal -->
    <CustomerModal
      v-if="showModal"
      :customer="selectedCustomer"
      :is-edit-mode="isEditMode"
      @close="closeModal"
      @save="handleSave"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { CustomersApiService } from '@/core/services/customersApi'
import type { Customer } from '@/core/types/customer'
import CustomerModal from '../components/CustomerModal.vue'

// State
const customers = ref<Customer[]>([])
const loading = ref(false)
const searchTerm = ref('')
const activeFilter = ref('')
const showModal = ref(false)
const isEditMode = ref(false)
const selectedCustomer = ref<Customer | null>(null)

// Debounce timer
let searchTimeout: NodeJS.Timeout

// Fetch customers
const fetchCustomers = async () => {
  loading.value = true
  try {
    const filters: any = {}
    
    if (searchTerm.value) {
      filters.search = searchTerm.value
    }
    if (activeFilter.value !== '') {
      filters.active = activeFilter.value === 'true'
    }

    const response = await CustomersApiService.getAllCustomers(filters)
    
    if (response.success && response.data) {
      customers.value = response.data
    } else {
      customers.value = []
      console.error('Failed to load customers:', response.message)
    }
  } catch (error) {
    console.error('Error loading customers:', error)
    customers.value = []
  } finally {
    loading.value = false
  }
}

// Debounced search
const debouncedSearch = () => {
  clearTimeout(searchTimeout)
  searchTimeout = setTimeout(() => {
    fetchCustomers()
  }, 500)
}

// Modal operations
const openCreateModal = () => {
  selectedCustomer.value = null
  isEditMode.value = false
  showModal.value = true
}

const openEditModal = (customer: Customer) => {
  selectedCustomer.value = customer
  isEditMode.value = true
  showModal.value = true
}

const closeModal = () => {
  showModal.value = false
  selectedCustomer.value = null
}

const handleSave = async () => {
  closeModal()
  await fetchCustomers()
}

// Delete customer
const confirmDelete = async (customer: Customer) => {
  if (confirm(`Are you sure you want to delete customer "${customer.name}"? This action cannot be undone.`)) {
    try {
      const response = await CustomersApiService.deleteCustomer(customer.id)
      
      if (response.success) {
        await fetchCustomers()
      } else {
        alert(`Failed to delete customer: ${response.message}`)
      }
    } catch (error) {
      console.error('Error deleting customer:', error)
      alert('Failed to delete customer. Please try again.')
    }
  }
}

// Load data on mount
onMounted(() => {
  fetchCustomers()
})
</script>
