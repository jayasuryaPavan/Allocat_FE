import { defineStore } from 'pinia'
import { ref, computed, readonly } from 'vue'

export const useThemeStore = defineStore('theme', () => {
  // State
  const theme = ref<'light' | 'dark'>('light')
  const systemTheme = ref<'light' | 'dark'>('light')

  // Getters
  const isDarkMode = computed(() => theme.value === 'dark')
  const isLightMode = computed(() => theme.value === 'light')
  const currentTheme = computed(() => theme.value)

  // Actions
  const setTheme = (newTheme: 'light' | 'dark') => {
    theme.value = newTheme
    updateDocumentTheme()
    saveThemePreference()
  }

  const toggleTheme = () => {
    setTheme(theme.value === 'light' ? 'dark' : 'light')
  }

  const setSystemTheme = (newSystemTheme: 'light' | 'dark') => {
    systemTheme.value = newSystemTheme
  }

  const useSystemTheme = () => {
    setTheme(systemTheme.value)
  }

  const initializeTheme = () => {
    // Check for saved theme preference
    const savedTheme = localStorage.getItem('theme') as 'light' | 'dark' | null
    
    if (savedTheme) {
      setTheme(savedTheme)
    } else {
      // Use system preference
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
      setTheme(prefersDark ? 'dark' : 'light')
    }

    // Listen for system theme changes
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
    mediaQuery.addEventListener('change', (e) => {
      systemTheme.value = e.matches ? 'dark' : 'light'
    })
  }

  const updateDocumentTheme = () => {
    const root = document.documentElement
    root.classList.remove('light', 'dark')
    root.classList.add(theme.value)
    
    // Update meta theme-color
    const metaThemeColor = document.querySelector('meta[name="theme-color"]')
    if (metaThemeColor) {
      metaThemeColor.setAttribute('content', theme.value === 'dark' ? '#1f2937' : '#ffffff')
    }
  }

  const saveThemePreference = () => {
    localStorage.setItem('theme', theme.value)
  }

  return {
    // State
    theme: readonly(theme),
    systemTheme: readonly(systemTheme),
    
    // Getters
    isDarkMode,
    isLightMode,
    currentTheme,
    
    // Actions
    setTheme,
    toggleTheme,
    setSystemTheme,
    useSystemTheme,
    initializeTheme
  }
})

