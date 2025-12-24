/*
 * Copyright (c) 2024 Allocat. All rights reserved.
 * 
 * This software and associated documentation files (the "Software") are the
 * proprietary and confidential information of Allocat. Unauthorized copying,
 * modification, distribution, or use of this Software, via any medium, is
 * strictly prohibited without the express written permission of Allocat.
 */

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { createRouter, createWebHistory } from 'vue-router'
import { createHead } from '@vueuse/head'
import { createI18n } from 'vue-i18n'

import App from './App.vue'
import routes from './router'
import { useAuthStore } from '@/core/stores/auth'
import { useThemeStore } from '@/core/stores/theme'

// Import global styles
import '@/assets/styles/main.css'

// Create app instance
const app = createApp(App)

// Create stores
const pinia = createPinia()
app.use(pinia)

// Create router
const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    } else {
      return { top: 0 }
    }
  }
})

// Create head manager
const head = createHead()
app.use(head)

// Create i18n
const i18n = createI18n({
  legacy: false,
  locale: 'en',
  fallbackLocale: 'en',
  messages: {
    en: {},
    es: {}
  }
})
app.use(i18n)

// Setup router
app.use(router)

// Initialize stores
const authStore = useAuthStore()
const themeStore = useThemeStore()

// Initialize theme
themeStore.initializeTheme()

// Setup router guards
router.beforeEach(async (to, from, next) => {
  const isAuthenticated = authStore.isAuthenticated
  const requiresAuth = to.matched.some(record => record.meta.requiresAuth)
  const requiredRoles = to.meta.roles as string[] | undefined
  const requiredPerms = to.meta.permissions as string[] | undefined

  if (requiresAuth && !isAuthenticated) {
    // Store the attempted URL for redirect after login
    authStore.setRedirectUrl(to.fullPath)
    next('/auth/login')
    return
  }

  if (requiresAuth && isAuthenticated) {
    const user = authStore.currentUser
    const roleOk = !requiredRoles || (user && authStore.hasAnyRole(requiredRoles))
    const permOk = !requiredPerms || (user && authStore.hasAnyPermissions(requiredPerms))
    // Allow if either roles or permissions condition passes when both provided
    const passes = requiredRoles && requiredPerms ? (roleOk || permOk) : (roleOk && permOk)
    if (!passes) {
      next('/dashboard')
      return
    }
  }

  next()
})

// Mount the app
app.mount('#app')