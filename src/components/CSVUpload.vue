<template>
  <div class="csv-upload-container">
    <!-- Upload Area -->
    <div 
      class="upload-area"
      :class="{
        'drag-over': isDragOver,
        'uploading': isUploading,
        'error': hasError
      }"
      @dragover.prevent="handleDragOver"
      @dragleave.prevent="handleDragLeave"
      @drop.prevent="handleDrop"
      @click="triggerFileInput"
    >
      <input
        ref="fileInput"
        type="file"
        accept=".csv"
        @change="handleFileSelect"
        class="hidden"
      />
      
      <div class="upload-content">
        <svg v-if="!isUploading" class="upload-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
        </svg>
        
        <div v-if="isUploading" class="upload-spinner">
          <svg class="animate-spin" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
        </div>

        <div class="upload-text">
          <h3 class="upload-title">
            {{ isUploading ? 'Processing CSV...' : 'Upload CSV File' }}
          </h3>
          <p class="upload-description">
            {{ isUploading 
              ? 'Please wait while we process your inventory data' 
              : 'Drag and drop your CSV file here, or click to browse' 
            }}
          </p>
          <p v-if="!isUploading" class="upload-hint">
            Supported format: CSV files only
          </p>
        </div>
      </div>
    </div>

    <!-- Error Message -->
    <div v-if="errorMessage" class="error-message">
      <svg class="error-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
      <span>{{ errorMessage }}</span>
    </div>

    <!-- Success Message -->
    <div v-if="successMessage" class="success-message">
      <svg class="success-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
      </svg>
      <span>{{ successMessage }}</span>
    </div>

    <!-- Template Download -->
    <div v-if="showTemplate" class="template-section">
      <div class="template-header">
        <h4 class="template-title">Need a template?</h4>
        <p class="template-description">
          Download our CSV template to ensure your data is formatted correctly.
        </p>
      </div>
      <button 
        @click="downloadTemplate"
        class="template-button"
        :disabled="isUploading"
      >
        <svg class="template-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
        Download Template
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { CSVInventoryParser } from '../core/utils/csvParser'
import { INVENTORY_CSV_COLUMNS } from '../core/types/inventory'
import type { CSVParseResult } from '../core/types/inventory'

interface Props {
  showTemplate?: boolean
  maxFileSize?: number // in MB
}

interface Emits {
  (e: 'upload-success', data: any): void
  (e: 'upload-error', error: string): void
  (e: 'file-selected', file: File): void
}

const props = withDefaults(defineProps<Props>(), {
  showTemplate: true,
  maxFileSize: 10
})

const emit = defineEmits<Emits>()

// Reactive state
const fileInput = ref<HTMLInputElement>()
const isDragOver = ref(false)
const isUploading = ref(false)
const errorMessage = ref('')
const successMessage = ref('')

// Computed properties
const hasError = computed(() => !!errorMessage.value)

// CSV Parser instance
const csvParser = new CSVInventoryParser(INVENTORY_CSV_COLUMNS)

// Methods
const triggerFileInput = () => {
  if (!isUploading.value) {
    fileInput.value?.click()
  }
}

const handleFileSelect = (event: Event) => {
  const target = event.target as HTMLInputElement
  const file = target.files?.[0]
  
  if (file) {
    processFile(file)
  }
}

const handleDragOver = (event: DragEvent) => {
  event.preventDefault()
  isDragOver.value = true
}

const handleDragLeave = (event: DragEvent) => {
  event.preventDefault()
  isDragOver.value = false
}

const handleDrop = (event: DragEvent) => {
  event.preventDefault()
  isDragOver.value = false
  
  const files = event.dataTransfer?.files
  if (files && files.length > 0) {
    const file = files[0]
    if (file.type === 'text/csv' || file.name.endsWith('.csv')) {
      processFile(file)
    } else {
      showError('Please select a CSV file')
    }
  }
}

const processFile = async (file: File) => {
  // Clear previous messages
  clearMessages()
  
  // Validate file
  if (!validateFile(file)) {
    return
  }

  // Emit file selected event
  emit('file-selected', file)

  // Start upload process
  isUploading.value = true
  
  try {
    const result: CSVParseResult = await csvParser.parseCSVFile(file)
    
    if (result.success && result.data) {
      const { validRows, invalidRows, totalRows, errors } = result.data
      
      if (validRows > 0) {
        showSuccess(`Successfully processed ${validRows} items from ${totalRows} rows`)
        emit('upload-success', result.data)
      } else {
        showError('No valid data found in the CSV file')
        emit('upload-error', 'No valid data found')
      }
      
      if (invalidRows > 0) {
        console.warn(`${invalidRows} rows had validation errors:`, errors)
      }
    } else {
      showError(result.error || 'Failed to process CSV file')
      emit('upload-error', result.error || 'Unknown error')
    }
  } catch (error) {
    const errorMsg = error instanceof Error ? error.message : 'Unknown error occurred'
    showError(errorMsg)
    emit('upload-error', errorMsg)
  } finally {
    isUploading.value = false
  }
}

const validateFile = (file: File): boolean => {
  // Check file type
  if (!file.type.includes('csv') && !file.name.endsWith('.csv')) {
    showError('Please select a CSV file')
    return false
  }

  // Check file size
  const maxSizeBytes = props.maxFileSize * 1024 * 1024
  if (file.size > maxSizeBytes) {
    showError(`File size must be less than ${props.maxFileSize}MB`)
    return false
  }

  return true
}

const showError = (message: string) => {
  errorMessage.value = message
  successMessage.value = ''
}

const showSuccess = (message: string) => {
  successMessage.value = message
  errorMessage.value = ''
}

const clearMessages = () => {
  errorMessage.value = ''
  successMessage.value = ''
}

const downloadTemplate = () => {
  try {
    const template = csvParser.generateTemplate()
    const blob = new Blob([template], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    
    const link = document.createElement('a')
    link.href = url
    link.download = 'inventory_template.csv'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  } catch (error) {
    showError('Failed to download template')
  }
}
</script>

<style scoped>
.csv-upload-container {
  @apply space-y-4;
}

.upload-area {
  @apply border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-8 text-center cursor-pointer transition-all duration-200 hover:border-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20;
}

.upload-area.drag-over {
  @apply border-blue-500 bg-blue-50 dark:bg-blue-900/20;
}

.upload-area.uploading {
  @apply border-blue-400 bg-blue-50 dark:bg-blue-900/20 cursor-not-allowed;
}

.upload-area.error {
  @apply border-red-400 bg-red-50 dark:bg-red-900/20;
}

.upload-content {
  @apply flex flex-col items-center space-y-4;
}

.upload-icon {
  @apply w-12 h-12 text-gray-400;
}

.upload-spinner {
  @apply w-12 h-12 text-blue-500;
}

.upload-text {
  @apply space-y-2;
}

.upload-title {
  @apply text-lg font-medium text-gray-900 dark:text-white;
}

.upload-description {
  @apply text-sm text-gray-500 dark:text-gray-400;
}

.upload-hint {
  @apply text-xs text-gray-400 dark:text-gray-500;
}

.error-message {
  @apply flex items-center space-x-2 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md text-red-700 dark:text-red-300;
}

.error-icon {
  @apply w-5 h-5 flex-shrink-0;
}

.success-message {
  @apply flex items-center space-x-2 p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-md text-green-700 dark:text-green-300;
}

.success-icon {
  @apply w-5 h-5 flex-shrink-0;
}

.template-section {
  @apply bg-gray-50 dark:bg-gray-800 rounded-lg p-4 space-y-3;
}

.template-header {
  @apply space-y-1;
}

.template-title {
  @apply text-sm font-medium text-gray-900 dark:text-white;
}

.template-description {
  @apply text-xs text-gray-500 dark:text-gray-400;
}

.template-button {
  @apply inline-flex items-center space-x-2 px-3 py-2 text-sm font-medium text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-md hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed;
}

.template-icon {
  @apply w-4 h-4;
}

/* .hidden {
  @apply hidden;
} */
</style>
