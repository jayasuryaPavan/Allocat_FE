<template>
  <div class="fixed inset-0 z-50 overflow-y-auto">
    <div class="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
      <div class="fixed inset-0 transition-opacity" @click="handleClose">
        <div class="absolute inset-0 bg-gray-500/40 backdrop-blur-sm"></div>
      </div>

      <div class="chat-glass inline-block align-bottom text-left overflow-hidden transform transition-all sm:my-8 sm:align-middle sm:max-w-7xl sm:w-full rounded-2xl shadow-glass shadow-glass-glow">
        <div class="px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
          <div class="sm:flex sm:items-start">
            <div class="w-full">
              <div class="flex items-center justify-between mb-4">
                <h3 class="text-lg font-medium text-gray-900 dark:text-white">
                  PDF Table Extractor
                </h3>
                <button
                  @click="handleClose"
                  class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                >
                  <svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <!-- Upload Section -->
              <div v-if="!extractionResult" class="space-y-4">
                <!-- Service Status -->
                <div v-if="serviceStatus" class="bg-blue-500/10 border border-blue-400/30 rounded-xl p-3">
                  <div class="flex items-center space-x-2">
                    <div class="w-2 h-2 rounded-full" :class="serviceStatus.success ? 'bg-green-500' : 'bg-red-500'"></div>
                    <span class="text-sm text-blue-900 dark:text-blue-300">
                      {{ serviceStatus.success ? 'Xtractor service is online' : 'Xtractor service unavailable' }}
                      {{ serviceStatus.data?.gemini_available ? '(Gemini AI enabled)' : '(Using fallback)' }}
                    </span>
                  </div>
                </div>

                <!-- Upload Area -->
                <div 
                  class="border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-all"
                  :class="[
                    isDragOver ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' : 'border-gray-300 dark:border-gray-600',
                    isExtracting ? 'opacity-50 cursor-not-allowed' : 'hover:border-blue-400'
                  ]"
                  @dragover.prevent="handleDragOver"
                  @dragleave.prevent="handleDragLeave"
                  @drop.prevent="handleDrop"
                  @click="triggerFileInput"
                >
                  <input
                    ref="fileInput"
                    type="file"
                    accept=".pdf"
                    @change="handleFileSelect"
                    class="hidden"
                  />
                  
                  <div v-if="!isExtracting">
                    <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                    </svg>
                    <p class="mt-2 text-sm text-gray-600 dark:text-gray-400">
                      Drag and drop your PDF file here, or click to browse
                    </p>
                    <p class="mt-1 text-xs text-gray-500 dark:text-gray-500">
                      Supports PDF files up to 50MB
                    </p>
                  </div>

                  <div v-else class="space-y-3">
                    <svg class="animate-spin h-12 w-12 text-blue-600 mx-auto" fill="none" viewBox="0 0 24 24">
                      <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                      <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <div>
                      <p class="text-sm font-medium text-blue-900 dark:text-blue-300">Extracting tables from PDF...</p>
                      <p class="text-xs text-blue-700 dark:text-blue-400 mt-1">{{ selectedFile?.name }}</p>
                      <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">This may take a minute for large files</p>
                    </div>
                  </div>
                </div>

                <!-- Error Message -->
                <div v-if="errorMessage" class="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-3">
                  <div class="flex items-start space-x-2">
                    <svg class="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <p class="text-sm text-red-800 dark:text-red-300">{{ errorMessage }}</p>
                  </div>
                </div>
              </div>

              <!-- Extraction Results -->
              <div v-else class="space-y-4">
                <!-- Results Header -->
                <div class="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
                  <div class="flex items-center justify-between">
                    <div>
                      <h4 class="text-sm font-semibold text-green-900 dark:text-green-300">
                        ✅ Extraction Complete
                      </h4>
                      <p class="text-xs text-green-700 dark:text-green-400 mt-1">
                        Found {{ extractionResult.total_tables }} table(s) across {{ extractionResult.pages_processed }} page(s)
                      </p>
                    </div>
                    <button
                      @click="resetExtraction"
                      class="text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400"
                    >
                      Upload Another
                    </button>
                  </div>
                </div>

                <!-- Tables Preview -->
                <div class="space-y-4">
                  <div 
                    v-for="(table, tableIndex) in extractionResult.tables" 
                    :key="tableIndex"
                    class="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden"
                  >
                    <div class="bg-gray-50 dark:bg-gray-700 px-4 py-2 flex items-center justify-between">
                      <div>
                        <span class="text-sm font-medium text-gray-900 dark:text-white">
                          Table {{ tableIndex + 1 }} (Page {{ table.page_number }})
                        </span>
                        <span class="ml-2 text-xs text-gray-500 dark:text-gray-400">
                          {{ getVisibleRowCount(tableIndex) }} of {{ table.row_count }} rows × {{ table.column_count }} columns
                        </span>
                      </div>
                      <div class="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          :checked="selectedTables.has(tableIndex)"
                          @change="toggleTableSelection(tableIndex)"
                          class="h-4 w-4 text-blue-600 rounded"
                        />
                        <label class="text-sm text-gray-700 dark:text-gray-300">Select</label>
                      </div>
                    </div>

                    <div class="overflow-x-auto max-h-[60vh] overflow-y-auto">
                      <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                        <thead class="bg-gray-100 dark:bg-gray-800 sticky top-0 z-10">
                          <tr>
                            <th class="px-3 py-2 text-left text-xs font-medium text-gray-700 dark:text-gray-300 uppercase w-20">
                              Actions
                            </th>
                            <th 
                              v-for="(header, headerIndex) in table.headers" 
                              :key="headerIndex"
                              class="px-3 py-2 text-left text-xs font-medium text-gray-700 dark:text-gray-300 uppercase"
                            >
                              {{ header }}
                            </th>
                          </tr>
                        </thead>
                        <tbody class="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
                          <tr 
                            v-for="(rowData, displayIndex) in getTableRows(tableIndex)" 
                            :key="`${tableIndex}-${rowData.originalIndex}`"
                            :class="[
                              'hover:bg-gray-50 dark:hover:bg-gray-800',
                              isRowEditing(tableIndex, rowData.originalIndex) ? 'bg-blue-50 dark:bg-blue-900/20' : ''
                            ]"
                          >
                            <!-- Actions Column -->
                            <td class="px-3 py-2 whitespace-nowrap">
                              <div class="flex items-center space-x-1">
                                <button
                                  v-if="!isRowEditing(tableIndex, rowData.originalIndex)"
                                  @click="startEditRow(tableIndex, rowData.originalIndex)"
                                  class="p-1 text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
                                  title="Edit row"
                                >
                                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                  </svg>
                                </button>
                                <button
                                  v-if="isRowEditing(tableIndex, rowData.originalIndex)"
                                  @click="saveEditRow(tableIndex, rowData.originalIndex)"
                                  class="p-1 text-green-600 hover:text-green-700 dark:text-green-400 dark:hover:text-green-300"
                                  title="Save changes"
                                >
                                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                                  </svg>
                                </button>
                                <button
                                  v-if="isRowEditing(tableIndex, rowData.originalIndex)"
                                  @click="cancelEditRow(tableIndex, rowData.originalIndex)"
                                  class="p-1 text-gray-600 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
                                  title="Cancel editing"
                                >
                                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                                  </svg>
                                </button>
                                <button
                                  @click="deleteRow(tableIndex, rowData.originalIndex)"
                                  class="p-1 text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
                                  title="Delete row"
                                >
                                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                  </svg>
                                </button>
                              </div>
                            </td>
                            
                            <!-- Data Cells -->
                            <td 
                              v-for="(cell, cellIndex) in rowData.row" 
                              :key="cellIndex"
                              class="px-3 py-2 text-sm whitespace-nowrap"
                            >
                              <input
                                v-if="isRowEditing(tableIndex, rowData.originalIndex)"
                                v-model="editingRows[`${tableIndex}-${rowData.originalIndex}`][cellIndex]"
                                class="w-full px-2 py-1 text-sm border border-blue-300 dark:border-blue-600 rounded dark:bg-gray-800 dark:text-white focus:ring-2 focus:ring-blue-500"
                              />
                              <span v-else class="text-gray-900 dark:text-white">
                                {{ cell }}
                              </span>
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>

                <!-- Action Buttons -->
                <div class="flex justify-between items-center pt-4 border-t border-gray-200 dark:border-gray-700">
                  <div class="space-y-1">
                    <div class="text-sm text-gray-600 dark:text-gray-400">
                      {{ selectedTables.size }} of {{ extractionResult.total_tables }} table(s) selected
                    </div>
                    <div v-if="getTotalDeletedRows() > 0" class="text-xs text-orange-600 dark:text-orange-400">
                      ⚠️ {{ getTotalDeletedRows() }} row(s) will be excluded from import
                    </div>
                  </div>
                  <div class="flex space-x-3">
                    <button
                      @click="handleClose"
                      class="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
                    >
                      Cancel
                    </button>
                    <button
                      @click="handleImportSelected"
                      :disabled="selectedTables.size === 0"
                      class="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Import Selected Tables
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { xtractorApi } from '@/core/services/xtractorApi'
import type { XtractorResponse, XtractorHealthResponse } from '@/core/services/xtractorApi'

const emit = defineEmits<{
  close: []
  extract: [tables: XtractorResponse]
}>()

// State
const fileInput = ref<HTMLInputElement>()
const selectedFile = ref<File | null>(null)
const isDragOver = ref(false)
const isExtracting = ref(false)
const errorMessage = ref('')
const extractionResult = ref<XtractorResponse | null>(null)
const selectedTables = ref<Set<number>>(new Set())
const serviceStatus = ref<{ success: boolean; data?: XtractorHealthResponse } | null>(null)

// Edit/Delete state
const editingRows = ref<Record<string, string[]>>({}) // Key: "tableIndex-rowIndex", Value: edited row data
const deletedRows = ref<Set<string>>(new Set()) // Set of "tableIndex-rowIndex" strings
const originalRows = ref<Record<string, string[]>>({}) // Store original row data for cancel

// Check service status on mount
onMounted(async () => {
  serviceStatus.value = await xtractorApi.healthCheck()
})

// File handling
const triggerFileInput = () => {
  if (!isExtracting.value) {
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

const handleDragOver = () => {
  if (!isExtracting.value) {
    isDragOver.value = true
  }
}

const handleDragLeave = () => {
  isDragOver.value = false
}

const handleDrop = (event: DragEvent) => {
  isDragOver.value = false
  if (isExtracting.value) return

  const file = event.dataTransfer?.files[0]
  if (file && file.type === 'application/pdf') {
    processFile(file)
  } else {
    errorMessage.value = 'Please upload a PDF file'
  }
}

const processFile = async (file: File) => {
  errorMessage.value = ''
  selectedFile.value = file
  isExtracting.value = true

  try {
    const result = await xtractorApi.extractTables(file)

    if (result.success && result.data) {
      extractionResult.value = result.data
      // Auto-select all tables
      result.data.tables.forEach((_, index) => {
        selectedTables.value.add(index)
      })
    } else {
      errorMessage.value = result.message || 'Failed to extract tables from PDF'
    }
  } catch (error: any) {
    errorMessage.value = error.message || 'An error occurred during extraction'
  } finally {
    isExtracting.value = false
  }
}

const toggleTableSelection = (tableIndex: number) => {
  if (selectedTables.value.has(tableIndex)) {
    selectedTables.value.delete(tableIndex)
  } else {
    selectedTables.value.add(tableIndex)
  }
}

const resetExtraction = () => {
  extractionResult.value = null
  selectedFile.value = null
  selectedTables.value.clear()
  errorMessage.value = ''
  editingRows.value = {}
  deletedRows.value.clear()
  originalRows.value = {}
}

// Get table rows (excluding deleted ones, with edits applied)
const getTableRows = (tableIndex: number): Array<{ row: string[], originalIndex: number }> => {
  if (!extractionResult.value) return []
  const table = extractionResult.value.tables[tableIndex]
  if (!table) return []
  
  return table.rows
    .map((row, originalIndex) => {
      const key = `${tableIndex}-${originalIndex}`
      // Skip deleted rows
      if (deletedRows.value.has(key)) {
        return null
      }
      // Return edited row if exists, otherwise original row
      const displayRow = editingRows.value[key] || row
      return { row: displayRow, originalIndex }
    })
    .filter((item): item is { row: string[], originalIndex: number } => item !== null)
}

// Get visible row count (excluding deleted)
const getVisibleRowCount = (tableIndex: number): number => {
  if (!extractionResult.value) return 0
  const table = extractionResult.value.tables[tableIndex]
  if (!table) return 0
  
  return table.rows.filter((_, rowIndex) => {
    const key = `${tableIndex}-${rowIndex}`
    return !deletedRows.value.has(key)
  }).length
}

// Check if row is being edited
const isRowEditing = (tableIndex: number, rowIndex: number): boolean => {
  const key = `${tableIndex}-${rowIndex}`
  return key in editingRows.value
}

// Check if row is deleted
const isRowDeleted = (tableIndex: number, rowIndex: number): boolean => {
  const key = `${tableIndex}-${rowIndex}`
  return deletedRows.value.has(key)
}

// Start editing a row
const startEditRow = (tableIndex: number, rowIndex: number) => {
  if (!extractionResult.value) return
  
  const table = extractionResult.value.tables[tableIndex]
  const row = table.rows[rowIndex]
  const key = `${tableIndex}-${rowIndex}`
  
  // Store original for cancel
  originalRows.value[key] = [...row]
  // Start editing with current row data
  editingRows.value[key] = [...row]
}

// Save edited row
const saveEditRow = (tableIndex: number, rowIndex: number) => {
  const key = `${tableIndex}-${rowIndex}`
  
  if (!extractionResult.value) return
  
  // Update the actual row in the table
  const table = extractionResult.value.tables[tableIndex]
  if (editingRows.value[key]) {
    table.rows[rowIndex] = [...editingRows.value[key]]
  }
  
  // Clear editing state
  delete editingRows.value[key]
  delete originalRows.value[key]
}

// Cancel editing
const cancelEditRow = (tableIndex: number, rowIndex: number) => {
  const key = `${tableIndex}-${rowIndex}`
  
  // Restore original data
  if (originalRows.value[key] && extractionResult.value) {
    const table = extractionResult.value.tables[tableIndex]
    table.rows[rowIndex] = [...originalRows.value[key]]
  }
  
  // Clear editing state
  delete editingRows.value[key]
  delete originalRows.value[key]
}

// Delete a row
const deleteRow = (tableIndex: number, rowIndex: number) => {
  if (!extractionResult.value) return
  
  const table = extractionResult.value.tables[tableIndex]
  const row = table.rows[rowIndex]
  
  // Show confirmation
  if (confirm(`Are you sure you want to delete this row?\n\n${row.join(' | ')}`)) {
    const key = `${tableIndex}-${rowIndex}`
    deletedRows.value.add(key)
    
    // Cancel any ongoing edit
    if (key in editingRows.value) {
      delete editingRows.value[key]
      delete originalRows.value[key]
    }
  }
}

// Restore a deleted row
const restoreRow = (tableIndex: number, rowIndex: number) => {
  const key = `${tableIndex}-${rowIndex}`
  deletedRows.value.delete(key)
}

// Get total deleted rows count
const getTotalDeletedRows = (): number => {
  return deletedRows.value.size
}

const handleImportSelected = () => {
  if (extractionResult.value && selectedTables.value.size > 0) {
    // Create modified tables with edits applied and deleted rows removed
    const modifiedTables = extractionResult.value.tables
      .filter((_, index) => selectedTables.value.has(index))
      .map((table, tableIndex) => {
        // Get original table index
        const originalTableIndex = extractionResult.value!.tables.findIndex((t, idx) => 
          selectedTables.value.has(idx) && extractionResult.value!.tables.indexOf(t) === tableIndex
        )
        
        // Filter out deleted rows and apply edits
        const modifiedRows = table.rows
          .map((row, rowIndex) => {
            const key = `${originalTableIndex}-${rowIndex}`
            // Return edited version if exists, otherwise original
            return editingRows.value[key] || row
          })
          .filter((_, rowIndex) => {
            const key = `${originalTableIndex}-${rowIndex}`
            return !deletedRows.value.has(key)
          })
        
        return {
          ...table,
          rows: modifiedRows,
          row_count: modifiedRows.length
        }
      })
    
    const selectedTablesData: XtractorResponse = {
      ...extractionResult.value,
      tables: modifiedTables,
      total_tables: selectedTables.value.size
    }
    
    emit('extract', selectedTablesData)
  }
}

const handleClose = () => {
  if (!isExtracting.value) {
    emit('close')
  }
}
</script>

