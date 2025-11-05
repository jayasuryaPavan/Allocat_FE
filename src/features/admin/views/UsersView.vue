<template>
  <div class="space-y-6">
    <div class="flex items-center justify-between">
      <h3 class="text-lg font-semibold text-gray-900 dark:text-white">Users</h3>
      <div class="space-x-2">
        <button @click="fetchUsers" class="px-3 py-1 text-sm bg-gray-600 text-white rounded-md hover:bg-gray-700">Refresh</button>
        <button @click="showCreate = true" class="px-3 py-1 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700">Add User</button>
      </div>
    </div>

    <div class="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
      <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
        <thead class="bg-gray-50 dark:bg-gray-700">
          <tr>
            <th class="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Name</th>
            <th class="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Email</th>
            <th class="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Role</th>
            <th class="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Status</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-gray-200 dark:divide-gray-700">
          <tr v-for="u in users" :key="u.id">
            <td class="px-4 py-2 text-sm text-gray-900 dark:text-white">{{ u.fullName || (u.firstName + ' ' + u.lastName) }}</td>
            <td class="px-4 py-2 text-sm text-gray-900 dark:text-white">{{ u.email }}</td>
            <td class="px-4 py-2 text-sm text-gray-900 dark:text-white">{{ u.role?.name }}</td>
            <td class="px-4 py-2 text-sm">
              <span :class="u.isActive ? 'text-green-600' : 'text-gray-500'">{{ u.isActive ? 'Active' : 'Inactive' }}</span>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>

  <!-- Create User Modal -->
  <div v-if="showCreate" class="fixed inset-0 z-50 flex items-center justify-center">
    <div class="absolute inset-0 bg-black opacity-50" @click="closeCreate"></div>
    <div class="relative bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-lg space-y-4">
      <h4 class="text-md font-semibold text-gray-900 dark:text-white">Create User</h4>
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <input v-model="form.firstName" placeholder="First name" class="px-3 py-2 text-sm border rounded-md dark:bg-gray-700 dark:border-gray-600" />
        <input v-model="form.lastName" placeholder="Last name" class="px-3 py-2 text-sm border rounded-md dark:bg-gray-700 dark:border-gray-600" />
        <input v-model="form.username" placeholder="Username" class="px-3 py-2 text-sm border rounded-md dark:bg-gray-700 dark:border-gray-600" />
        <input v-model="form.email" type="email" placeholder="Email" class="px-3 py-2 text-sm border rounded-md dark:bg-gray-700 dark:border-gray-600" />
        <input v-model="form.password" type="password" placeholder="Password" class="px-3 py-2 text-sm border rounded-md dark:bg-gray-700 dark:border-gray-600" />
        <input v-model="form.phone" placeholder="Phone *" required class="px-3 py-2 text-sm border rounded-md dark:bg-gray-700 dark:border-gray-600" />
        <select v-model="form.roleName" required class="px-3 py-2 text-sm border rounded-md dark:bg-gray-700 dark:border-gray-600">
          <option disabled value="">Select role *</option>
          <option v-for="r in availableRoles" :key="r" :value="r">{{ r }}</option>
        </select>
      </div>
      <div class="flex items-center justify-end space-x-2">
        <button @click="closeCreate" class="px-3 py-1 text-sm bg-gray-200 dark:bg-gray-700 rounded-md">Cancel</button>
        <button @click="createUser" class="px-3 py-1 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700">Create</button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { UsersApiService } from '@/core/services/usersApi'
import type { User } from '@/core/types/user'
import { useAuthStore } from '@/core/stores/auth'

const users = ref<User[]>([])
const showCreate = ref(false)
const auth = useAuthStore()

const form = ref({
  firstName: '',
  lastName: '',
  username: '',
  email: '',
  password: '',
  phone: '',
  roleName: '' as string,
  storeCode: '' as string
})

const availableRoles = computed(() => {
  const role = (auth.currentUser?.role?.name || '').toUpperCase()
  if (role === 'SUPER_ADMIN') {
    return ['ADMIN', 'STORE_MANAGER', 'SALES_STAFF', 'INVENTORY_MANAGER', 'WAREHOUSE_STAFF', 'ACCOUNTANT', 'VIEWER']
  }
  if (role === 'ADMIN') {
    return ['STORE_MANAGER', 'SALES_STAFF', 'INVENTORY_MANAGER', 'WAREHOUSE_STAFF', 'ACCOUNTANT', 'VIEWER']
  }
  return []
})

const fetchUsers = async () => {
  const resp = await UsersApiService.getAllUsers()
  if (resp.success) users.value = resp.data
}

onMounted(() => {
  fetchUsers()
})

const closeCreate = () => {
  showCreate.value = false
}

const createUser = async () => {
  // Validate all required fields
  if (!form.value.firstName || !form.value.lastName || !form.value.username || 
      !form.value.email || !form.value.password || !form.value.phone || 
      !form.value.roleName) {
    alert('Please fill in all required fields')
    return
  }
  
  // Get store code from session/local storage
  const storeCode = sessionStorage.getItem('active_store_code') || localStorage.getItem('active_store_code')
  if (!storeCode) {
    alert('Store code not found. Please ensure you are logged in with a valid store.')
    return
  }
  
  // Enforce ADMIN cannot create ADMIN
  const currentRole = (auth.currentUser?.role?.name || '').toUpperCase()
  if (currentRole === 'ADMIN' && form.value.roleName === 'ADMIN') {
    alert('ADMIN users cannot create other ADMIN users')
    return
  }
  
  try {
    const payload = {
      username: form.value.username,
      email: form.value.email,
      password: form.value.password,
      firstName: form.value.firstName,
      lastName: form.value.lastName,
      phone: form.value.phone,
      roleName: form.value.roleName,
      storeCode: storeCode // Automatically from session storage
    }
    
    const resp = await UsersApiService.createUser(payload)
    if (resp.success) {
      await fetchUsers()
      showCreate.value = false
      
      // Reset form
      form.value = {
        firstName: '',
        lastName: '',
        username: '',
        email: '',
        password: '',
        phone: '',
        roleName: '',
        storeCode: ''
      }
    }
  } catch (error: any) {
    alert(error.response?.data?.message || 'Failed to create user')
  }
}
</script>


