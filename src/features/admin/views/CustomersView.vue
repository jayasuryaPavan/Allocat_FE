<template>
  <div class="space-y-6">
    <!-- Header with Actions -->
    <div class="flex items-center justify-between">
      <div>
        <h3 class="text-lg font-medium text-gray-900 dark:text-white">Customer Management</h3>
        <p class="text-sm text-gray-500 dark:text-gray-400">View and manage customer records</p>
      </div>
      <button 
        @click="showAddCustomerModal = true"
        class="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors"
      >
        <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
        </svg>
        Add Customer
      </button>
    </div>

    <!-- Search and Filters -->
    <div class="flex items-center space-x-4">
      <div class="flex-1 relative">
        <svg class="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
        <input 
          v-model="searchQuery"
          type="text"
          placeholder="Search customers by name, email, or phone..."
          class="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
        />
      </div>
    </div>

    <!-- Customers Table -->
    <div class="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
      <div class="overflow-x-auto">
        <table class="w-full">
          <thead class="bg-gray-50 dark:bg-gray-900">
            <tr>
              <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Customer</th>
              <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Email</th>
              <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Phone</th>
              <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Total Orders</th>
              <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Total Spent</th>
              <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Last Order</th>
              <th class="px-4 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-200 dark:divide-gray-700">
            <tr v-for="customer in filteredCustomers" :key="customer.id" class="hover:bg-gray-50 dark:hover:bg-gray-900/50">
              <td class="px-4 py-3">
                <div class="flex items-center">
                  <div class="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-medium">
                    {{ customer.name.charAt(0) }}
                  </div>
                  <div class="ml-3">
                    <p class="text-sm font-medium text-gray-900 dark:text-white">{{ customer.name }}</p>
                    <p class="text-xs text-gray-500 dark:text-gray-400">ID: {{ customer.id }}</p>
                  </div>
                </div>
              </td>
              <td class="px-4 py-3 text-sm text-gray-500 dark:text-gray-400">{{ customer.email || '-' }}</td>
              <td class="px-4 py-3 text-sm text-gray-500 dark:text-gray-400">{{ customer.phone || '-' }}</td>
              <td class="px-4 py-3 text-sm text-gray-900 dark:text-white">{{ customer.totalOrders }}</td>
              <td class="px-4 py-3 text-sm font-medium text-gray-900 dark:text-white">{{ formatCurrency(customer.totalSpent) }}</td>
              <td class="px-4 py-3 text-sm text-gray-500 dark:text-gray-400">{{ customer.lastOrderDate ? formatDate(customer.lastOrderDate) : 'Never' }}</td>
              <td class="px-4 py-3 text-right">
                <button @click="viewCustomer(customer)" class="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 text-sm mr-3">View</button>
                <button @click="editCustomer(customer)" class="text-gray-600 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-300 text-sm">Edit</button>
              </td>
            </tr>
            <tr v-if="filteredCustomers.length === 0">
              <td colspan="7" class="px-4 py-8 text-center text-gray-500 dark:text-gray-400">
                {{ searchQuery ? 'No customers match your search.' : 'No customers found. Add one to get started.' }}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Add Customer Modal -->
    <Teleport to="body">
      <div v-if="showAddCustomerModal" class="fixed inset-0 z-50 flex items-center justify-center">
        <div class="absolute inset-0 bg-black/50" @click="showAddCustomerModal = false"></div>
        <div class="relative bg-white dark:bg-gray-800 rounded-xl p-6 w-full max-w-md shadow-xl">
          <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-4">Add Customer</h3>
          <form @submit.prevent="addCustomer" class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Name *</label>
              <input v-model="newCustomer.name" type="text" required 
                     class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white" />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Email</label>
              <input v-model="newCustomer.email" type="email"
                     class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white" />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Phone</label>
              <input v-model="newCustomer.phone" type="tel"
                     class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white" />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Address</label>
              <textarea v-model="newCustomer.address" rows="2"
                        class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"></textarea>
            </div>
            <div class="flex justify-end space-x-3 pt-4">
              <button type="button" @click="showAddCustomerModal = false" class="px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200">Cancel</button>
              <button type="submit" class="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg">Add Customer</button>
            </div>
          </form>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'

interface Customer {
  id: number
  name: string
  email?: string
  phone?: string
  address?: string
  totalOrders: number
  totalSpent: number
  lastOrderDate?: string
}

const customers = ref<Customer[]>([])
const searchQuery = ref('')
const showAddCustomerModal = ref(false)
const newCustomer = ref({
  name: '',
  email: '',
  phone: '',
  address: ''
})

const filteredCustomers = computed(() => {
  if (!searchQuery.value) return customers.value
  const query = searchQuery.value.toLowerCase()
  return customers.value.filter(c => 
    c.name.toLowerCase().includes(query) ||
    c.email?.toLowerCase().includes(query) ||
    c.phone?.includes(query)
  )
})

const formatDate = (dateStr: string) => {
  return new Date(dateStr).toLocaleDateString()
}

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(amount)
}

const addCustomer = () => {
  // TODO: API call to create customer
  console.log('Adding customer:', newCustomer.value)
  showAddCustomerModal.value = false
  newCustomer.value = { name: '', email: '', phone: '', address: '' }
}

const viewCustomer = (customer: Customer) => {
  console.log('View customer:', customer)
}

const editCustomer = (customer: Customer) => {
  console.log('Edit customer:', customer)
}

onMounted(() => {
  // TODO: Load customers from API
  // Placeholder data for now
  customers.value = [
    {
      id: 1,
      name: 'Rahul Sharma',
      email: 'rahul@example.com',
      phone: '+91 98765 43210',
      totalOrders: 12,
      totalSpent: 45600,
      lastOrderDate: '2026-01-02'
    },
    {
      id: 2,
      name: 'Priya Patel',
      email: 'priya@example.com',
      phone: '+91 87654 32109',
      totalOrders: 8,
      totalSpent: 23400,
      lastOrderDate: '2025-12-28'
    },
    {
      id: 3,
      name: 'Amit Kumar',
      phone: '+91 76543 21098',
      totalOrders: 3,
      totalSpent: 8900,
      lastOrderDate: '2025-11-15'
    }
  ]
})
</script>
