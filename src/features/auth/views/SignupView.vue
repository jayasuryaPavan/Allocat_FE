<template>
  <div>
    <form @submit.prevent="handleSubmit" class="space-y-6">
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label for="firstName" class="block text-sm font-medium text-gray-700 dark:text-gray-300">First name</label>
          <input id="firstName" v-model="form.firstName" type="text" required :disabled="isLoading" class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white" placeholder="John" />
        </div>
        <div>
          <label for="lastName" class="block text-sm font-medium text-gray-700 dark:text-gray-300">Last name</label>
          <input id="lastName" v-model="form.lastName" type="text" required :disabled="isLoading" class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white" placeholder="Doe" />
        </div>
      </div>

      <div>
        <label for="username" class="block text-sm font-medium text-gray-700 dark:text-gray-300">Username</label>
        <input id="username" v-model="form.username" type="text" required :disabled="isLoading" class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white" placeholder="john_doe" />
      </div>

      <div>
        <label for="email" class="block text-sm font-medium text-gray-700 dark:text-gray-300">Email address</label>
        <input id="email" v-model="form.email" type="email" required autocomplete="email" :disabled="isLoading" class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white" placeholder="john@example.com" />
      </div>

      <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label for="password" class="block text-sm font-medium text-gray-700 dark:text-gray-300">Password</label>
          <input id="password" v-model="form.password" type="password" required :disabled="isLoading" class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white" placeholder="••••••••" />
        </div>
        <div>
          <label for="confirmPassword" class="block text-sm font-medium text-gray-700 dark:text-gray-300">Confirm password</label>
          <input id="confirmPassword" v-model="form.confirmPassword" type="password" required :disabled="isLoading" class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white" placeholder="••••••••" />
        </div>
      </div>

      <div>
        <label for="phone" class="block text-sm font-medium text-gray-700 dark:text-gray-300">Phone (optional)</label>
        <input id="phone" v-model="form.phone" type="tel" :disabled="isLoading" class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white" placeholder="+1234567890" />
      </div>

      <div class="flex items-center">
        <input id="terms" v-model="form.acceptTerms" type="checkbox" required :disabled="isLoading" class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded" />
        <label for="terms" class="ml-2 block text-sm text-gray-700 dark:text-gray-300">I agree to the terms and privacy policy</label>
      </div>

      <div>
        <button type="submit" :disabled="isLoading" class="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed">
          <span v-if="isLoading" class="absolute left-0 inset-y-0 flex items-center pl-3">
            <svg class="animate-spin h-5 w-5 text-blue-500" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          </span>
          {{ isLoading ? 'Creating account...' : 'Create account' }}
        </button>
      </div>

      <div class="text-center">
        <p class="text-sm text-gray-600 dark:text-gray-400">
          Already have an account?
          <router-link to="/auth/login" class="font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300">Sign in</router-link>
        </p>
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
import { reactive, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useNotificationStore } from '@/core/stores/notification'
import { UsersApiService } from '@/core/services/usersApi'

const router = useRouter()
const notifications = useNotificationStore()

const form = reactive({
  firstName: '',
  lastName: '',
  username: '',
  email: '',
  password: '',
  confirmPassword: '',
  phone: '',
  acceptTerms: false
})

const isLoading = computed(() => false)

const handleSubmit = async () => {
  if (!form.acceptTerms) {
    notifications.error('Terms not accepted', 'Please accept the terms to continue')
    return
  }
  if (!form.password || form.password !== form.confirmPassword) {
    notifications.error('Password mismatch', 'Passwords do not match')
    return
  }
  try {
    const payload = {
      username: form.username,
      email: form.email,
      password: form.password,
      firstName: form.firstName,
      lastName: form.lastName,
      phone: form.phone || undefined
    }
    await UsersApiService.createUser(payload)
    notifications.success('Account created', 'You can now sign in')
    router.push('/auth/login')
  } catch (e: any) {
    const message = e?.response?.data?.message || 'Failed to create account'
    notifications.error('Signup failed', message)
  }
}
</script>


