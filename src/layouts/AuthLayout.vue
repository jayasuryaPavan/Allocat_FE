<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
    <!-- Header -->
    <div class="sm:mx-auto sm:w-full sm:max-w-md">
      <div class="flex justify-center">
        <div class="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center">
          <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          </svg>
        </div>
      </div>
      <h2 class="mt-6 text-center text-3xl font-extrabold text-gray-900 dark:text-white">
        {{ pageTitle }}
      </h2>
      <p v-if="pageSubtitle" class="mt-2 text-center text-sm text-gray-600 dark:text-gray-400">
        {{ pageSubtitle }}
      </p>
    </div>

    <!-- Main content -->
    <div class="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
      <div class="bg-white dark:bg-gray-800 py-8 px-4 shadow sm:rounded-lg sm:px-10">
        <router-view />
      </div>
    </div>

    <!-- Footer -->
    <!-- <div class="mt-8 text-center">
      <p class="text-xs text-gray-500 dark:text-gray-400">
        © {{ currentYear }} Allocat. All rights reserved.
      </p>
    </div> -->
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()

// Computed properties

const pageTitle = computed(() => {
  switch (route.name) {
    case 'Login':
      return 'Sign in to your account'
    case 'Signup':
      return 'Create your account'
    case 'ForgotPassword':
      return 'Reset your password'
    case 'ResetPassword':
      return 'Set new password'
    default:
      return 'Welcome'
  }
})

const pageSubtitle = computed(() => {
  switch (route.name) {
    case 'Login':
      return 'Enter your credentials to access your account'
    case 'Signup':
      return 'Fill in the details below to get started'
    case 'ForgotPassword':
      return 'Enter your email address and we\'ll send you a reset link'
    case 'ResetPassword':
      return 'Enter your new password below'
    default:
      return ''
  }
})
</script>

