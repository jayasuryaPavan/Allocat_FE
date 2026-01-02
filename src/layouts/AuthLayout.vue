<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
    <!-- Header -->
    <div class="sm:mx-auto sm:w-full sm:max-w-md">
      <div class="flex justify-center">
        <div class="w-16 h-16 bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl flex items-center justify-center shadow-lg">
          <svg class="w-10 h-10 text-white" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2L3 7v3l9 5 9-5V7L12 2zm0 2.18L18.09 7 12 10.82 5.91 7 12 4.18zM5 9.37l7 3.89v7.56l-7-3.89V9.37zm9 11.45v-7.56l7-3.89v7.56l-7 3.89z"/>
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
      <div class="card py-8 px-4 sm:px-10">
        <router-view />
      </div>
    </div>

    <!-- Footer -->
    <!-- <div class="mt-8 text-center">
      <p class="text-xs text-gray-500 dark:text-gray-400">
        © {{ currentYear }} Allocat mERP. All rights reserved.
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

