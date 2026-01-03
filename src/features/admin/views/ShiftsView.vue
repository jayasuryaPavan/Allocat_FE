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

    <!-- Active Shifts Section -->
    <div class="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
      <div class="px-4 py-3 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
        <h4 class="font-medium text-gray-900 dark:text-white flex items-center gap-2">
          <svg class="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          Active Shifts (Live)
        </h4>
        <button @click="loadActiveShifts" class="text-sm text-blue-600 hover:text-blue-800 dark:text-blue-400 flex items-center gap-1">
          <svg class="w-4 h-4" :class="{ 'animate-spin': isLoadingShifts }" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          Refresh
        </button>
      </div>
      <div class="overflow-x-auto">
        <table class="w-full">
          <thead class="bg-gray-50 dark:bg-gray-900">
            <tr>
              <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Associate</th>
              <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Store</th>
              <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Sign-In Time</th>
              <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Duration</th>
              <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Status</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-200 dark:divide-gray-700">
            <tr v-for="shift in activeShifts" :key="shift.id" class="hover:bg-gray-50 dark:hover:bg-gray-900/50">
              <td class="px-4 py-3">
                <div class="flex items-center gap-3">
                  <div class="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white text-sm font-medium">
                    {{ (shift.userName || 'U').charAt(0).toUpperCase() }}
                  </div>
                  <span class="text-sm font-medium text-gray-900 dark:text-white">{{ shift.userName || `User #${shift.userId}` }}</span>
                </div>
              </td>
              <td class="px-4 py-3 text-sm text-gray-500 dark:text-gray-400">{{ shift.storeName || `Store #${shift.storeId}` }}</td>
              <td class="px-4 py-3 text-sm text-gray-900 dark:text-white">{{ formatTime(shift.startedAt) }}</td>
              <td class="px-4 py-3 text-sm font-mono text-gray-700 dark:text-gray-300">{{ formatDuration(shift.startedAt) }}</td>
              <td class="px-4 py-3">
                <span class="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300">
                  Active
                </span>
              </td>
            </tr>
            <tr v-if="activeShifts.length === 0">
              <td colspan="5" class="px-4 py-8 text-center text-gray-500 dark:text-gray-400">
                No active shifts at the moment
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Shift History Section -->
    <div class="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
      <div class="px-4 py-3 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
        <h4 class="font-medium text-gray-900 dark:text-white flex items-center gap-2">
          <svg class="w-5 h-5 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
          Shift History (Today)
        </h4>
        <button @click="loadShiftHistory" class="text-sm text-blue-600 hover:text-blue-800 dark:text-blue-400 flex items-center gap-1">
          <svg class="w-4 h-4" :class="{ 'animate-spin': isLoadingHistory }" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          Refresh
        </button>
      </div>
      <div class="overflow-x-auto">
        <table class="w-full">
          <thead class="bg-gray-50 dark:bg-gray-900">
            <tr>
              <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Associate</th>
              <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Store</th>
              <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Sign-In Time</th>
              <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Sign-Out Time</th>
              <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Duration</th>
              <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Status</th>
              <th class="px-4 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-200 dark:divide-gray-700">
            <tr v-for="shift in shiftHistory" :key="shift.id" class="hover:bg-gray-50 dark:hover:bg-gray-900/50">
              <td class="px-4 py-3">
                <div class="flex items-center gap-3">
                  <div class="w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-medium"
                    :class="shift.endedAt ? 'bg-gray-400' : 'bg-green-500'">
                    {{ (shift.userName || 'U').charAt(0).toUpperCase() }}
                  </div>
                  <span class="text-sm font-medium text-gray-900 dark:text-white">{{ shift.userName || `User #${shift.userId}` }}</span>
                </div>
              </td>
              <td class="px-4 py-3 text-sm text-gray-500 dark:text-gray-400">{{ shift.storeName || `Store #${shift.storeId}` }}</td>
              <td class="px-4 py-3 text-sm text-gray-900 dark:text-white font-mono">{{ formatDateTime(shift.startedAt) }}</td>
              <td class="px-4 py-3 text-sm font-mono" :class="shift.endedAt ? 'text-gray-900 dark:text-white' : 'text-orange-500'">
                {{ shift.endedAt ? formatDateTime(shift.endedAt) : 'Still Active' }}
              </td>
              <td class="px-4 py-3 text-sm font-mono text-gray-700 dark:text-gray-300">
                {{ calculateDuration(shift.startedAt, shift.endedAt) }}
              </td>
              <td class="px-4 py-3">
                <span class="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium"
                  :class="shift.endedAt ? 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300' : 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'">
                  {{ shift.endedAt ? 'Completed' : 'Active' }}
                </span>
              </td>
              <td class="px-4 py-3 text-right">
                <button @click="openEditShiftModal(shift)" class="text-blue-600 hover:text-blue-800 dark:text-blue-400 text-sm">
                  Edit
                </button>
              </td>
            </tr>
            <tr v-if="shiftHistory.length === 0">
              <td colspan="7" class="px-4 py-8 text-center text-gray-500 dark:text-gray-400">
                No shift history for today
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Edit Shift Modal -->
    <Teleport to="body">
      <div v-if="showEditShiftModal" class="fixed inset-0 z-50 flex items-center justify-center">
        <div class="absolute inset-0 bg-black/50" @click="showEditShiftModal = false"></div>
        <div class="relative bg-white dark:bg-gray-800 rounded-xl p-6 w-full max-w-md shadow-xl">
          <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-4">Edit Shift Record</h3>
          <form @submit.prevent="saveShiftEdit" class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Associate</label>
              <input type="text" :value="editingShift?.userName || `User #${editingShift?.userId}`" disabled
                class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white" />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Sign-In Time</label>
              <input v-model="editShiftForm.startTime" type="datetime-local" required
                class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white" />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Sign-Out Time</label>
              <input v-model="editShiftForm.endTime" type="datetime-local"
                class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white" />
              <p class="text-xs text-gray-500 mt-1">Leave empty if still active</p>
            </div>
            <div class="flex justify-end space-x-3 pt-4">
              <button type="button" @click="showEditShiftModal = false" class="px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200">Cancel</button>
              <button type="submit" :disabled="isSavingShift" class="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg disabled:opacity-50">
                {{ isSavingShift ? 'Saving...' : 'Save Changes' }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </Teleport>

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

    <!-- Footer -->
    <div class="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
      <p class="text-center text-sm text-gray-400 dark:text-gray-500">
        © {{ new Date().getFullYear() }} Allocat mERP. All rights reserved.
      </p>
    </div>
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
const isLoadingShifts = ref(false)
const isLoadingHistory = ref(false)
const isSavingShift = ref(false)
const activeShifts = ref<any[]>([])
const shiftHistory = ref<any[]>([])
const newCredential = ref({
  userId: '',
  associateNumber: '',
  passcode: ''
})

// Edit shift modal state
const showEditShiftModal = ref(false)
const editingShift = ref<any>(null)
const editShiftForm = ref({
  startTime: '',
  endTime: ''
})

const formatDate = (dateStr: string) => {
  return new Date(dateStr).toLocaleDateString()
}

const formatTime = (dateStr: string) => {
  if (!dateStr) return '-'
  return new Date(dateStr).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
}

const formatDateTime = (dateStr: string) => {
  if (!dateStr) return '-'
  const d = new Date(dateStr)
  return `${d.toLocaleDateString()} ${d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`
}

const formatDuration = (startTime: string) => {
  if (!startTime) return '-'
  const start = new Date(startTime)
  const now = new Date()
  const diff = Math.floor((now.getTime() - start.getTime()) / 1000 / 60)
  const hours = Math.floor(diff / 60)
  const mins = diff % 60
  return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`
}

const calculateDuration = (startTime: string, endTime: string | null) => {
  if (!startTime) return '-'
  const start = new Date(startTime)
  const end = endTime ? new Date(endTime) : new Date()
  const diff = Math.floor((end.getTime() - start.getTime()) / 1000 / 60)
  const hours = Math.floor(diff / 60)
  const mins = diff % 60
  return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`
}

const toDateTimeLocal = (dateStr: string) => {
  if (!dateStr) return ''
  const d = new Date(dateStr)
  return d.toISOString().slice(0, 16)
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

const loadActiveShifts = async () => {
  isLoadingShifts.value = true
  try {
    // Use storeId 1 as default for now - in production, get from user context
    const response = await apiService.get('/shifts/active/list', {
      params: { storeId: 1 }
    })
    if (response.data?.success) {
      activeShifts.value = response.data.data || []
      stats.value.activeShifts = activeShifts.value.length
    }
  } catch (error) {
    console.error('Failed to load active shifts:', error)
  } finally {
    isLoadingShifts.value = false
  }
}

const loadShiftHistory = async () => {
  isLoadingHistory.value = true
  try {
    const today = new Date().toISOString().split('T')[0]
    const response = await apiService.get('/shifts/by-date', {
      params: { storeId: 1, date: today }
    })
    if (response.data?.success) {
      shiftHistory.value = response.data.data || []
      stats.value.todayLogins = shiftHistory.value.length
    }
  } catch (error) {
    console.error('Failed to load shift history:', error)
  } finally {
    isLoadingHistory.value = false
  }
}

const openEditShiftModal = (shift: any) => {
  editingShift.value = shift
  editShiftForm.value = {
    startTime: toDateTimeLocal(shift.startedAt),
    endTime: shift.endedAt ? toDateTimeLocal(shift.endedAt) : ''
  }
  showEditShiftModal.value = true
}

const saveShiftEdit = async () => {
  if (!editingShift.value) return
  
  isSavingShift.value = true
  try {
    // Convert datetime-local values back to ISO strings
    const updateData = {
      startedAt: new Date(editShiftForm.value.startTime).toISOString(),
      endedAt: editShiftForm.value.endTime ? new Date(editShiftForm.value.endTime).toISOString() : null
    }
    
    const response = await apiService.put(`/shifts/${editingShift.value.id}`, updateData)
    
    if (response.data?.success) {
      // Refresh data
      await Promise.all([loadActiveShifts(), loadShiftHistory()])
      showEditShiftModal.value = false
      editingShift.value = null
    } else {
      alert(response.data?.error || 'Failed to update shift')
    }
  } catch (error: any) {
    console.error('Failed to save shift:', error)
    alert(error.response?.data?.error || 'Failed to update shift')
  } finally {
    isSavingShift.value = false
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
  
  // Load active shifts from API
  await loadActiveShifts()
  
  // Load shift history
  await loadShiftHistory()
  
  // Update stats
  stats.value = {
    activeShifts: activeShifts.value.length,
    totalAssociates: credentials.value.length || users.value.length,
    todayLogins: shiftHistory.value.length
  }
})
</script>

