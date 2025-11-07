<template>
  <div class="space-y-4">
    <!-- AI Analysis Header -->
    <div class="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
      <div class="flex items-start space-x-3">
        <div class="w-8 h-8 bg-gradient-to-br from-blue-600 to-blue-700 rounded-lg flex items-center justify-center flex-shrink-0">
          <svg class="w-5 h-5 text-white" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2L3 7v3l9 5 9-5V7L12 2zm0 2.18L18.09 7 12 10.82 5.91 7 12 4.18zM5 9.37l7 3.89v7.56l-7-3.89V9.37zm9 11.45v-7.56l7-3.89v7.56l-7 3.89z"/>
          </svg>
        </div>
        <div class="flex-1">
          <h4 class="text-sm font-semibold text-blue-900 dark:text-blue-300">
            InvenGadu analyzed your CSV
          </h4>
          <p class="text-xs text-blue-700 dark:text-blue-400 mt-1">
            {{ mappingResult.mappings.length }} column(s) mapped automatically. Review and adjust below.
          </p>
          <div v-if="mappingResult.suggestions.length > 0" class="mt-2 space-y-1">
            <p v-for="(suggestion, idx) in mappingResult.suggestions" :key="idx" 
               class="text-xs text-blue-600 dark:text-blue-400">
              {{ suggestion }}
            </p>
          </div>
        </div>
      </div>
    </div>

    <!-- Mapping Table -->
    <div class="overflow-hidden border border-gray-200 dark:border-gray-700 rounded-lg">
      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead class="bg-gray-50 dark:bg-gray-800">
            <tr>
              <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">
                Your CSV Column
              </th>
              <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">
                Maps To
              </th>
              <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">
                Confidence
              </th>
              <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">
                Sample Data
              </th>
            </tr>
          </thead>
          <tbody class="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
            <tr v-for="(mapping, idx) in editableMappings" :key="idx" class="hover:bg-gray-50 dark:hover:bg-gray-800">
              <td class="px-4 py-3 text-sm font-medium text-gray-900 dark:text-white">
                {{ mapping.csvColumn }}
              </td>
              <td class="px-4 py-3">
                <select 
                  v-model="mapping.mappedField"
                  @change="handleMappingChange"
                  class="text-sm border border-gray-300 dark:border-gray-600 rounded px-2 py-1 dark:bg-gray-800 dark:text-white focus:ring-2 focus:ring-blue-500"
                >
                  <option value="unmapped">-- Skip this column --</option>
                  <option v-for="field in availableFields" :key="field" :value="field">
                    {{ formatFieldName(field) }}
                  </option>
                </select>
              </td>
              <td class="px-4 py-3">
                <span 
                  :class="getConfidenceClass(mapping.confidence)" 
                  class="inline-flex items-center px-2 py-1 text-xs font-medium rounded-full"
                >
                  {{ Math.round(mapping.confidence * 100) }}%
                </span>
                <span v-if="mapping.reasoning" 
                      class="ml-2 text-xs text-gray-500 dark:text-gray-400"
                      :title="mapping.reasoning">
                  ℹ️
                </span>
              </td>
              <td class="px-4 py-3 text-sm text-gray-600 dark:text-gray-400">
                <span class="truncate block max-w-xs" :title="getSampleValue(mapping.csvColumn)">
                  {{ getSampleValue(mapping.csvColumn) }}
                </span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Unmapped Columns Warning -->
    <div v-if="unmappedColumnsCount > 0" 
         class="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-3">
      <div class="flex items-start space-x-2">
        <svg class="w-5 h-5 text-yellow-600 dark:text-yellow-400 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
        </svg>
        <p class="text-sm text-yellow-800 dark:text-yellow-300">
          <strong>{{ unmappedColumnsCount }} column(s) will be skipped:</strong>
          {{ getUnmappedColumns().join(', ') }}
        </p>
      </div>
    </div>

    <!-- Validation Errors -->
    <div v-if="!isValid" 
         class="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-3">
      <div class="flex items-start space-x-2">
        <svg class="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <div class="text-sm text-red-800 dark:text-red-300">
          <strong>Missing required fields:</strong> {{ missingRequiredFields.join(', ') }}
          <p class="mt-1 text-xs">Please map these columns before proceeding.</p>
        </div>
      </div>
    </div>

    <!-- Actions -->
    <div class="flex justify-between items-center pt-4 border-t border-gray-200 dark:border-gray-700">
      <button 
        @click="$emit('cancel')" 
        class="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
      >
        Cancel
      </button>
      <div class="flex space-x-2">
        <button 
          @click="askAIForHelp" 
          class="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          Ask InvenGadu
        </button>
        <button 
          @click="confirmMapping" 
          :disabled="!isValid"
          class="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-md hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors focus:outline-none focus:ring-2 focus:ring-green-500"
        >
          <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
          </svg>
          Confirm & Import
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import type { AIMappingResult, ColumnMapping } from '@/core/services/aiCsvMappingService'

interface Props {
  mappingResult: AIMappingResult
  sampleData: Record<string, any>[]
  availableFields: string[]
}

const props = defineProps<Props>()

const emit = defineEmits<{
  confirm: [mappings: ColumnMapping[]]
  cancel: []
  askAI: [unmappedColumns: string[]]
}>()

// State
const editableMappings = ref<ColumnMapping[]>([...props.mappingResult.mappings])

// Required fields for validation
const REQUIRED_FIELDS = ['productCode', 'productName', 'expectedQuantity', 'unitPrice']

// Computed
const isValid = computed(() => {
  const mapped = new Set(
    editableMappings.value
      .filter(m => m.mappedField !== 'unmapped')
      .map(m => m.mappedField)
  )
  return REQUIRED_FIELDS.every(f => mapped.has(f))
})

const missingRequiredFields = computed(() => {
  const mapped = new Set(
    editableMappings.value
      .filter(m => m.mappedField !== 'unmapped')
      .map(m => m.mappedField)
  )
  return REQUIRED_FIELDS.filter(f => !mapped.has(f)).map(formatFieldName)
})

const unmappedColumnsCount = computed(() => {
  return editableMappings.value.filter(m => m.mappedField === 'unmapped').length
})

// Methods
function getConfidenceClass(confidence: number): string {
  if (confidence >= 0.8) return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300'
  if (confidence >= 0.6) return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300'
  return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300'
}

function getSampleValue(csvColumn: string): string {
  const value = props.sampleData[0]?.[csvColumn]
  if (value === null || value === undefined) return 'N/A'
  return String(value).substring(0, 50) + (String(value).length > 50 ? '...' : '')
}

function formatFieldName(field: string): string {
  // Convert camelCase to Title Case
  return field
    .replace(/([A-Z])/g, ' $1')
    .replace(/^./, str => str.toUpperCase())
    .trim()
}

function getUnmappedColumns(): string[] {
  return editableMappings.value
    .filter(m => m.mappedField === 'unmapped')
    .map(m => m.csvColumn)
}

function handleMappingChange() {
  // Check for duplicate mappings
  const mappedFields = new Map<string, string>()
  editableMappings.value.forEach(m => {
    if (m.mappedField !== 'unmapped') {
      if (mappedFields.has(m.mappedField)) {
        // Duplicate detected, revert or handle
        console.warn(`Duplicate mapping detected for field: ${m.mappedField}`)
      }
      mappedFields.set(m.mappedField, m.csvColumn)
    }
  })
}

function confirmMapping() {
  const validMappings = editableMappings.value.filter(m => m.mappedField !== 'unmapped')
  emit('confirm', validMappings)
}

function askAIForHelp() {
  const unmapped = getUnmappedColumns()
  emit('askAI', unmapped)
}
</script>

<style scoped>
/* Additional styles if needed */
</style>

