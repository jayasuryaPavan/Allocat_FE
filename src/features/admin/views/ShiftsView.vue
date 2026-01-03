<template>
  <div class="space-y-6">
    <!-- Header with Actions -->
    <div class="flex items-center justify-between">
      <div>
        <h3 class="text-lg font-medium text-gray-900 dark:text-white">Shift Management</h3>
        <p class="text-sm text-gray-500 dark:text-gray-400">View and manage associate shifts and credentials</p>
      </div>
      <button 
        @click="showAddCredentialModal = true"
        class="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors"
      >
        <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
        </svg>
        Add Associate Credential
      </button>
    </div>

    <!-- Stats Cards -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
      <div class="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700">
        <div class="flex items-center">
          <div class="p-3 bg-green-100 dark:bg-green-900 rounded-lg">
            <svg class="w-6 h-6 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <div class="ml-4">
            <p class="text-sm text-gray-500 dark:text-gray-400">Active Shifts</p>
            <p class="text-2xl font-bold text-gray-900 dark:text-white">{{ stats.activeShifts }}</p>
          </div>
        </div>
      </div>
      
      <div class="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700">
        <div class="flex items-center">
          <div class="p-3 bg-blue-100 dark:bg-blue-900 rounded-lg">
            <svg class="w-6 h-6 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </div>
          <div class="ml-4">
            <p class="text-sm text-gray-500 dark:text-gray-400">Total Associates</p>
            <p class="text-2xl font-bold text-gray-900 dark:text-white">{{ stats.totalAssociates }}</p>
          </div>
        </div>
      </div>
      
      <div class="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700">
        <div class="flex items-center">
          <div class="p-3 bg-purple-100 dark:bg-purple-900 rounded-lg">
            <svg class="w-6 h-6 text-purple-600 dark:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div class="ml-4">
            <p class="text-sm text-gray-500 dark:text-gray-400">Today's Logins</p>
            <p class="text-2xl font-bold text-gray-900 dark:text-white">{{ stats.todayLogins }}</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Associate Credentials Table -->
    <div class="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
      <div class="px-4 py-3 border-b border-gray-200 dark:border-gray-700">
        <h4 class="font-medium text-gray-900 dark:text-white">Associate Credentials</h4>
      </div>
      <div class="overflow-x-auto">
        <table class="w-full">
          <thead class="bg-gray-50 dark:bg-gray-900">
            <tr>
              <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Associate #</th>
              <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">User</th>
              <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Store</th>
              <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Status</th>
              <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Created</th>
              <th class="px-4 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-200 dark:divide-gray-700">
            <tr v-for="credential in credentials" :key="credential.id" class="hover:bg-gray-50 dark:hover:bg-gray-900/50">
              <td class="px-4 py-3 text-sm font-mono font-medium text-gray-900 dark:text-white">{{ credential.associateNumber }}</td>
              <td class="px-4 py-3 text-sm text-gray-900 dark:text-white">{{ credential.userName }}</td>
              <td class="px-4 py-3 text-sm text-gray-500 dark:text-gray-400">{{ credential.storeName }}</td>
              <td class="px-4 py-3">
                <span :class="credential.isActive ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300' : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'"
                      class="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium">
                  {{ credential.isActive ? 'Active' : 'Inactive' }}
                </span>
              </td>
              <td class="px-4 py-3 text-sm text-gray-500 dark:text-gray-400">{{ formatDate(credential.createdAt) }}</td>
              <td class="px-4 py-3 text-right">
                <button @click="editCredential(credential)" class="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 text-sm mr-3">Edit</button>
                <button @click="resetPasscode(credential)" class="text-orange-600 hover:text-orange-800 dark:text-orange-400 dark:hover:text-orange-300 text-sm mr-3">Reset PIN</button>
                <button @click="toggleActive(credential)" class="text-gray-600 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-300 text-sm">
                  {{ credential.isActive ? 'Deactivate' : 'Activate' }}
                </button>
              </td>
            </tr>
            <tr v-if="credentials.length === 0">
              <td colspan="6" class="px-4 py-8 text-center text-gray-500 dark:text-gray-400">
                No associate credentials found. Add one to get started.
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Add Credential Modal -->
    <Teleport to="body">
      <div v-if="showAddCredentialModal" class="fixed inset-0 z-50 flex items-center justify-center">
        <div class="absolute inset-0 bg-black/50" @click="showAddCredentialModal = false"></div>
        <div class="relative bg-white dark:bg-gray-800 rounded-xl p-6 w-full max-w-md shadow-xl">
          <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-4">Add Associate Credential</h3>
          <form @submit.prevent="addCredential" class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">User</label>
              <select v-model="newCredential.userId" required class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white">
                <option value="">Select a user</option>
                <option v-for="user in users" :key="user.id" :value="user.id">{{ user.firstName }} {{ user.lastName }}</option>
              </select>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Associate Number (4 digits)</label>
              <input v-model="newCredential.associateNumber" type="text" maxlength="4" pattern="\d{4}" required 
                     class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-center text-xl tracking-widest" />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Initial PIN (4 digits)</label>
              <input v-model="newCredential.passcode" type="password" maxlength="4" pattern="\d{4}" required 
                     class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-center text-xl tracking-widest" />
            </div>
            <div class="flex justify-end space-x-3 pt-4">
              <button type="button" @click="showAddCredentialModal = false" class="px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200">Cancel</button>
              <button type="submit" class="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg">Add Credential</button>
            </div>
          </form>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useApiService } from '@/core/services/api'

interface Credential {
  id: number
  associateNumber: string
  userId: number
  userName: string
  storeId: number
  storeName: string
  isActive: boolean
  createdAt: string
}

interface User {
  id: number
  firstName: string
  lastName: string
  email: string
}

const apiService = useApiService()

const stats = ref({
  activeShifts: 0,
  totalAssociates: 0,
  todayLogins: 0
})

const credentials = ref<Credential[]>([])
const users = ref<User[]>([])
const showAddCredentialModal = ref(false)
const isLoading = ref(false)
const newCredential = ref({
  userId: '',
  associateNumber: '',
  passcode: ''
})

const formatDate = (dateStr: string) => {
  return new Date(dateStr).toLocaleDateString()
}

const loadUsers = async () => {
  try {
    const response = await apiService.get('/users')
    const apiResp = response.data
    if (apiResp.success && apiResp.data) {
      users.value = apiResp.data.map((u: any) => ({
        id: u.id,
        firstName: u.firstName || 'Unknown',
        lastName: u.lastName || '',
        email: u.email || ''
      }))
    }
  } catch (error) {
    console.error('Failed to load users:', error)
  }
}

const addCredential = async () => {
  isLoading.value = true
  try {
    const response = await apiService.post('/shifts/associate/credentials', {
      userId: Number(newCredential.value.userId),
      associateNumber: newCredential.value.associateNumber,
      passcode: newCredential.value.passcode
    })
    
    if (response.data?.success) {
      // Refresh the credentials list
      await loadCredentials()
      showAddCredentialModal.value = false
      newCredential.value = { userId: '', associateNumber: '', passcode: '' }
    } else {
      alert(response.data?.message || 'Failed to add credential')
    }
  } catch (error: any) {
    console.error('Failed to add credential:', error)
    alert(error.response?.data?.message || 'Failed to add credential')
  } finally {
    isLoading.value = false
  }
}

const loadCredentials = async () => {
  try {
    const response = await apiService.get('/shifts/associate/credentials')
    if (response.data?.success && response.data?.data) {
      credentials.value = response.data.data
    }
  } catch (error) {
    console.error('Failed to load credentials:', error)
  }
}

const editCredential = (credential: Credential) => {
  console.log('Edit credential:', credential)
}

const resetPasscode = (credential: Credential) => {
  console.log('Reset passcode for:', credential)
}

const toggleActive = (credential: Credential) => {
  console.log('Toggle active:', credential)
}

onMounted(async () => {
  // Load users for the dropdown
  await loadUsers()
  
  // Try to load existing credentials
  await loadCredentials()
  
  // Placeholder stats for now
  stats.value = {
    activeShifts: 3,
    totalAssociates: users.value.length,
    todayLogins: 8
  }
})
</script>

