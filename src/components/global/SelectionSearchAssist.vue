<template>
  <div v-if="visible && selectedText" :style="popoverStyle" class="fixed z-50">
    <button
      @click="handleSearch"
      class="px-2 py-1 text-xs rounded shadow bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center space-x-1"
    >
      <span class="inline-flex w-4 h-4 bg-gradient-to-br from-blue-600 to-blue-700 rounded-sm items-center justify-center">
        <svg class="w-3 h-3 text-white" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 2L3 7v3l9 5 9-5V7L12 2zm0 2.18L18.09 7 12 10.82 5.91 7 12 4.18zM5 9.37l7 3.89v7.56l-7-3.89V9.37zm9 11.45v-7.56l7-3.89v7.56l-7 3.89z"/>
        </svg>
      </span>
      <span>{{ buttonLabel }}</span>
    </button>
  </div>
  
  <!-- Hidden element; no UI when not visible -->
</template>

<script setup lang="ts">
import { onMounted, onBeforeUnmount, ref, computed } from 'vue'
import { environment } from '@/environments'

const isEnabled = environment.integrations?.enableInvenGaduAssist === true
const searchUrl = environment.integrations?.invenGaduSearchUrl || ''

const visible = ref(false)
const selectedText = ref('')
const posX = ref(0)
const posY = ref(0)
const lastMouseX = ref(0)
const lastMouseY = ref(0)

const buttonLabel = computed(() => 'InvenGadu')

const popoverStyle = computed(() => ({
  left: `${posX.value}px`,
  top: `${posY.value}px`
}))

function isEditableElement(target: EventTarget | null): boolean {
  const el = target as HTMLElement | null
  if (!el) return false
  const tag = el.tagName
  if (tag === 'INPUT' || tag === 'TEXTAREA' || el.isContentEditable) return true
  return false
}

function updateFromSelection(evt?: MouseEvent) {
  if (!isEnabled) return
  const selection = window.getSelection()
  const text = (selection?.toString() || '').trim()
  if (!text || text.length < 2) {
    visible.value = false
    selectedText.value = ''
    return
  }

  // Avoid showing for editable inputs
  if (evt && isEditableElement(evt.target)) {
    visible.value = false
    selectedText.value = ''
    return
  }

  selectedText.value = text

  // Position near selection range if possible, otherwise near last mouse position
  let x = lastMouseX.value
  let y = lastMouseY.value
  try {
    const range = selection?.rangeCount ? selection.getRangeAt(0) : null
    if (range) {
      const rect = range.getBoundingClientRect()
      if (rect && rect.x && rect.y) {
        x = rect.left + window.scrollX
        y = rect.top + window.scrollY - 28 // a bit above selection
      }
    }
  } catch {
    // ignore
  }

  posX.value = Math.max(8, x)
  posY.value = Math.max(8, y)
  visible.value = true
}

function handleMouseUp(evt: MouseEvent) {
  lastMouseX.value = evt.clientX + window.scrollX
  lastMouseY.value = evt.clientY + window.scrollY
  updateFromSelection(evt)
}

function handleSelectionChange() {
  updateFromSelection()
}

function handleClickOutside(evt: MouseEvent) {
  const el = evt.target as HTMLElement
  if (!el) return
  // Hide when clicking elsewhere
  if (!el.closest) {
    visible.value = false
    return
  }
}

function handleSearch() {
  const query = selectedText.value
  if (!query) return
  const prompt = `help me with ${query}`

  // Prefer opening the embedded InvenGadu chat with prefilled prompt
  try {
    window.dispatchEvent(new CustomEvent('inven-gadu:open', { detail: { prompt } }))
  } catch {
    // Fallback to opening external URL if configured, else web search
    if (searchUrl) {
      window.open(`${searchUrl}?q=${encodeURIComponent(prompt)}`, '_blank', 'noopener,noreferrer')
    } else {
      window.open(`https://www.google.com/search?q=${encodeURIComponent(prompt)}`, '_blank', 'noopener,noreferrer')
    }
  }

  visible.value = false
}

onMounted(() => {
  window.addEventListener('mouseup', handleMouseUp, true)
  document.addEventListener('selectionchange', handleSelectionChange, true)
  window.addEventListener('scroll', () => { if (visible.value) visible.value = false }, true)
  window.addEventListener('resize', () => { if (visible.value) visible.value = false }, true)
  window.addEventListener('click', handleClickOutside, true)
})

onBeforeUnmount(() => {
  window.removeEventListener('mouseup', handleMouseUp, true)
  document.removeEventListener('selectionchange', handleSelectionChange, true)
  window.removeEventListener('click', handleClickOutside, true)
})
</script>

<style scoped>
/* no additional styles */
</style>


