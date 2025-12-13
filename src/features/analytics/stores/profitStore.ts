import { defineStore } from 'pinia'
import { ref } from 'vue'
import { useNotificationStore } from '@/core/stores/notification'
import { profitApiService } from '@/core/services/profitApi'
import type { ProfitabilityResponse } from '@/core/services/profitApi'

export const useProfitStore = defineStore('profit', () => {
  const isLoading = ref(false)
  const error = ref<string | null>(null)
  const data = ref<ProfitabilityResponse | null>(null)

  const notificationStore = useNotificationStore()

  const loadProfitability = async (storeId: number, startDate: string, endDate: string) => {
    isLoading.value = true
    error.value = null

    try {
      const resp = await profitApiService.getProfitability({ storeId, startDate, endDate })
      if (resp.success) {
        data.value = resp.data
      } else {
        error.value = resp.message || 'Failed to load profitability data'
        notificationStore.error('Failed to load data', error.value)
      }
    } catch (err: any) {
      error.value = err.message || 'Failed to load profitability data'
      notificationStore.error('Failed to load data', error.value)
      throw err
    } finally {
      isLoading.value = false
    }
  }

  return {
    isLoading,
    error,
    data,
    loadProfitability
  }
})





