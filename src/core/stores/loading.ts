import { defineStore } from 'pinia'
import { ref, computed, readonly } from 'vue'

export const useLoadingStore = defineStore('loading', () => {
  // State
  const loading = ref(false)
  const loadingMessage = ref('')
  const loadingProgress = ref(0)

  // Getters
  const isLoading = computed(() => loading.value)
  const message = computed(() => loadingMessage.value)
  const progress = computed(() => loadingProgress.value)

  // Actions
  const setLoading = (isLoading: boolean, message?: string) => {
    loading.value = isLoading
    if (message !== undefined) {
      loadingMessage.value = message
    }
    if (!isLoading) {
      loadingMessage.value = ''
      loadingProgress.value = 0
    }
  }

  const setMessage = (message: string) => {
    loadingMessage.value = message
  }

  const setProgress = (progress: number) => {
    loadingProgress.value = Math.max(0, Math.min(100, progress))
  }

  const startLoading = (message?: string) => {
    setLoading(true, message)
  }

  const stopLoading = () => {
    setLoading(false)
  }

  const withLoading = async <T>(
    asyncFn: () => Promise<T>,
    message?: string
  ): Promise<T> => {
    try {
      startLoading(message)
      return await asyncFn()
    } finally {
      stopLoading()
    }
  }

  return {
    // State
    loading: readonly(loading),
    loadingMessage: readonly(loadingMessage),
    loadingProgress: readonly(loadingProgress),
    
    // Getters
    isLoading,
    message,
    progress,
    
    // Actions
    setLoading,
    setMessage,
    setProgress,
    startLoading,
    stopLoading,
    withLoading
  }
})

