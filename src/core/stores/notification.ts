import { defineStore } from 'pinia'
import { ref, computed, readonly } from 'vue'

export interface Notification {
  id: string
  type: 'success' | 'error' | 'warning' | 'info'
  title: string
  message?: string
  duration?: number
  persistent?: boolean
}

export const useNotificationStore = defineStore('notification', () => {
  // State
  const notifications = ref<Notification[]>([])

  // Getters
  const allNotifications = computed(() => notifications.value)
  const successNotifications = computed(() => 
    notifications.value.filter(n => n.type === 'success')
  )
  const errorNotifications = computed(() => 
    notifications.value.filter(n => n.type === 'error')
  )
  const warningNotifications = computed(() => 
    notifications.value.filter(n => n.type === 'warning')
  )
  const infoNotifications = computed(() => 
    notifications.value.filter(n => n.type === 'info')
  )

  // Actions
  const addNotification = (notification: Omit<Notification, 'id'>): string => {
    const id = generateId()
    const newNotification: Notification = {
      id,
      duration: 5000, // Default 5 seconds
      persistent: false,
      ...notification
    }

    notifications.value.push(newNotification)

    // Auto-remove notification after duration (unless persistent)
    if (!newNotification.persistent && newNotification.duration && newNotification.duration > 0) {
      setTimeout(() => {
        removeNotification(id)
      }, newNotification.duration)
    }

    return id
  }

  const removeNotification = (id: string) => {
    const index = notifications.value.findIndex(n => n.id === id)
    if (index > -1) {
      notifications.value.splice(index, 1)
    }
  }

  const clearNotifications = () => {
    notifications.value = []
  }

  const clearNotificationsByType = (type: Notification['type']) => {
    notifications.value = notifications.value.filter(n => n.type !== type)
  }

  // Convenience methods
  const success = (title: string, message?: string, options?: Partial<Notification>) => {
    return addNotification({
      type: 'success',
      title,
      message,
      ...options
    })
  }

  const error = (title: string, message?: string, options?: Partial<Notification>) => {
    return addNotification({
      type: 'error',
      title,
      message,
      persistent: true, // Errors are persistent by default
      ...options
    })
  }

  const warning = (title: string, message?: string, options?: Partial<Notification>) => {
    return addNotification({
      type: 'warning',
      title,
      message,
      ...options
    })
  }

  const info = (title: string, message?: string, options?: Partial<Notification>) => {
    return addNotification({
      type: 'info',
      title,
      message,
      ...options
    })
  }

  // Helper function to generate unique IDs
  const generateId = (): string => {
    return `notification_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
  }

  return {
    // State
    notifications: readonly(notifications),
    
    // Getters
    allNotifications,
    successNotifications,
    errorNotifications,
    warningNotifications,
    infoNotifications,
    
    // Actions
    addNotification,
    removeNotification,
    clearNotifications,
    clearNotificationsByType,
    success,
    error,
    warning,
    info
  }
})

