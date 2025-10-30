<template>
  <div>
    <form @submit.prevent="handleSubmit" class="space-y-6">
      <!-- Password -->
      <div>
        <label for="password" class="block text-sm font-medium text-gray-700 dark:text-gray-300">
          New password
        </label>
        <div class="mt-1">
          <input
            id="password"
            v-model="form.password"
            type="password"
            autocomplete="new-password"
            required
            :disabled="isLoading"
            class="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            placeholder="Enter your new password"
          />
        </div>
        <p v-if="errors.password" class="mt-1 text-sm text-red-600 dark:text-red-400">
          {{ errors.password }}
        </p>
      </div>

      <!-- Confirm password -->
      <div>
        <label for="confirmPassword" class="block text-sm font-medium text-gray-700 dark:text-gray-300">
          Confirm new password
        </label>
        <div class="mt-1">
          <input
            id="confirmPassword"
            v-model="form.confirmPassword"
            type="password"
            autocomplete="new-password"
            required
            :disabled="isLoading"
            class="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            placeholder="Confirm your new password"
          />
        </div>
        <p v-if="errors.confirmPassword" class="mt-1 text-sm text-red-600 dark:text-red-400">
          {{ errors.confirmPassword }}
        </p>
      </div>

      <!-- Submit button -->
      <div>
        <button
          type="submit"
          :disabled="isLoading"
          class="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <span v-if="isLoading" class="absolute left-0 inset-y-0 flex items-center pl-3">
            <svg class="animate-spin h-5 w-5 text-blue-500" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          </span>
          {{ isLoading ? 'Resetting...' : 'Reset password' }}
        </button>
      </div>

      <!-- Back to login -->
      <div class="text-center">
        <router-link
          to="/auth/login"
          class="font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300"
        >
          ← Back to login
        </router-link>
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed } from 'vue'
import { useRoute } from 'vue-router'
import { useAuthStore } from '@/core/stores/auth'

const route = useRoute()
const authStore = useAuthStore()

// Form state
const form = reactive({
  password: '',
  confirmPassword: ''
})

const errors = ref<Record<string, string>>({})

// Computed
const isLoading = computed(() => authStore.isLoading)

// Methods
const validateForm = (): boolean => {
  errors.value = {}

  if (!form.password) {
    errors.value.password = 'Password is required'
  } else if (form.password.length < 8) {
    errors.value.password = 'Password must be at least 8 characters long'
  }

  if (!form.confirmPassword) {
    errors.value.confirmPassword = 'Please confirm your password'
  } else if (form.password !== form.confirmPassword) {
    errors.value.confirmPassword = 'Passwords do not match'
  }

  return Object.keys(errors.value).length === 0
}

const handleSubmit = async () => {
  if (!validateForm()) {
    return
  }

  try {
    const token = route.query.token as string
    if (!token) {
      errors.value.token = 'Reset token is required'
      return
    }

    await authStore.resetPassword({
      token,
      password: form.password,
      confirmPassword: form.confirmPassword
    })
  } catch (error) {
    // Error handling is done in the auth store
  }
}
</script>

