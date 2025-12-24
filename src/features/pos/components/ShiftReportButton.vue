<script setup lang="ts">
import { ref } from 'vue'
import { reportsApiService } from '@/core/services/reportsApi'
import { useNotificationStore } from '@/core/stores/notification'

const props = defineProps<{
  shiftId: number
  label?: string
  variant?: 'primary' | 'secondary'
}>()

const notificationStore = useNotificationStore()
const isGenerating = ref(false)

const handlePrintReport = async () => {
  isGenerating.value = true
  
  try {
    notificationStore.info('Generating report...', 'Please wait')
    const reportResponse = await reportsApiService.getShiftReport(props.shiftId)
    
    if (reportResponse.success && reportResponse.data) {
      reportsApiService.printShiftReport(reportResponse.data)
      notificationStore.success('Report generated', 'Shift report is ready to print')
    } else {
      notificationStore.error('Failed to generate report', reportResponse.message || 'Unknown error')
    }
  } catch (error) {
    console.error('Failed to generate shift report:', error)
    notificationStore.error('Report generation failed', 'Please try again')
  } finally {
    isGenerating.value = false
  }
}
</script>

<template>
  <button
    @click="handlePrintReport"
    :disabled="isGenerating"
    :class="[
      'px-4 py-2 rounded-lg font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed',
      variant === 'primary' ? 'bg-blue-600 text-white hover:bg-blue-700' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
    ]"
  >
    <i v-if="isGenerating" class="fas fa-spinner fa-spin mr-2"></i>
    <i v-else class="fas fa-print mr-2"></i>
    {{ isGenerating ? 'Generating...' : (label || 'Print Report') }}
  </button>
</template>





