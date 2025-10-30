<template>
  <div>
    <form @submit.prevent="handleSubmit" class="space-y-6">
      <!-- Email -->
      <div>
        <label for="email" class="block text-sm font-medium text-gray-700 dark:text-gray-300">
          Email address
        </label>
        <div class="mt-1">
          <input
            id="email"
            v-model="form.email"
            type="email"
            autocomplete="email"
            required
            :disabled="isLoading"
            class="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            placeholder="Enter your email address"
          />
        </div>
        <p v-if="errors.email" class="mt-1 text-sm text-red-600 dark:text-red-400">
          {{ errors.email }}
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
          {{ isLoading ? 'Sending...' : 'Send reset link' }}
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
import { useAuthStore } from '@/core/stores/auth'

const authStore = useAuthStore()

// Form state
const form = reactive({
  email: ''
})

const errors = ref<Record<string, string>>({})

// Computed
const isLoading = computed(() => authStore.isLoading)

// Methods
const validateForm = (): boolean => {
  errors.value = {}

  if (!form.email) {
    errors.value.email = 'Email is required'
  } else if (!/\S+@\S+\.\S+/.test(form.email)) {
    errors.value.email = 'Email is invalid'
  }

  return Object.keys(errors.value).length === 0
}

const handleSubmit = async () => {
  if (!validateForm()) {
    return
  }

  try {
    await authStore.forgotPassword({
      email: form.email
    })
  } catch (error) {
    // Error handling is done in the auth store
  }
}
</script>

