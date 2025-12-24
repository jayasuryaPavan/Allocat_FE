<template>
  <!-- Floating Chat Button -->
  <button
    v-if="!isOpen"
    @click="openChat"
    class="fixed bottom-6 right-6 z-50 bg-white dark:bg-gray-900 rounded-full p-3 shadow-lg border border-gray-200 dark:border-gray-700 transition-all duration-300 hover:scale-110 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
    aria-label="Open InvenGadu Chat"
  >
    <div v-if="!isTyping" class="w-8 h-8 bg-gradient-to-br from-blue-600 to-blue-700 rounded-lg flex items-center justify-center">
      <svg class="w-5 h-5 text-white" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 2L3 7v3l9 5 9-5V7L12 2zm0 2.18L18.09 7 12 10.82 5.91 7 12 4.18zM5 9.37l7 3.89v7.56l-7-3.89V9.37zm9 11.45v-7.56l7-3.89v7.56l-7 3.89z"/>
      </svg>
    </div>
    <div v-else class="w-6 h-6 flex items-center justify-center">
      <div class="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
    </div>
  </button>

  <!-- Chat Window -->
  <transition
    enter-active-class="transition-all duration-300 ease-out"
    enter-from-class="opacity-0 scale-95 translate-y-4"
    enter-to-class="opacity-100 scale-100 translate-y-0"
    leave-active-class="transition-all duration-200 ease-in"
    leave-from-class="opacity-100 scale-100 translate-y-0"
    leave-to-class="opacity-0 scale-95 translate-y-4"
  >
    <div
      v-if="isOpen"
      class="fixed bottom-6 right-6 z-50 w-96 h-[600px] bg-white dark:bg-gray-800 rounded-lg shadow-2xl flex flex-col border border-gray-200 dark:border-gray-700"
    >
      <!-- Chat Header -->
      <div class="bg-blue-600 text-white p-4 rounded-t-lg flex items-center justify-between">
        <div class="flex items-center space-x-2">
          <div class="w-8 h-8 bg-gradient-to-br from-blue-600 to-blue-700 rounded-lg flex items-center justify-center">
            <svg class="w-5 h-5 text-white" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2L3 7v3l9 5 9-5V7L12 2zm0 2.18L18.09 7 12 10.82 5.91 7 12 4.18zM5 9.37l7 3.89v7.56l-7-3.89V9.37zm9 11.45v-7.56l7-3.89v7.56l-7 3.89z"/>
            </svg>
          </div>
          <div>
            <h3 class="font-semibold">InvenGadu</h3>
            <p class="text-xs text-blue-100">Your AI Inventory Assistant</p>
          </div>
        </div>
        <button
          @click="closeChat"
          class="text-white hover:text-blue-200 focus:outline-none"
          aria-label="Close Chat"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      </div>

      <!-- Messages Area -->
      <div
        ref="messagesContainer"
        class="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50 dark:bg-gray-900"
      >
        <!-- Welcome Message -->
        <div v-if="messages.length === 0" class="text-center py-8">
          <div class="w-16 h-16 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg class="w-8 h-8 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
              />
            </svg>
          </div>
          <h4 class="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-2">
            Hello! I'm InvenGadu 👋
          </h4>
          <p class="text-sm text-gray-600 dark:text-gray-400 mb-4">
            Your AI assistant for inventory management. Ask me anything about stock levels, products, or inventory reports!
          </p>
          <div class="flex flex-wrap gap-2 justify-center">
            <button
              v-for="suggestion in quickSuggestions"
              :key="suggestion"
              @click="sendQuickMessage(suggestion)"
              class="px-3 py-1 text-xs bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 rounded-full hover:bg-blue-200 dark:hover:bg-blue-800 transition-colors"
            >
              {{ suggestion }}
            </button>
          </div>
        </div>

        <!-- Messages -->
        <div
          v-for="message in messages"
          :key="message.id"
          :class="[
            'flex',
            message.role === 'user' ? 'justify-end' : 'justify-start'
          ]"
        >
          <div
            :class="[
              'max-w-[80%] rounded-lg px-4 py-2',
              message.role === 'user'
                ? 'bg-blue-600 text-white'
                : 'bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 border border-gray-200 dark:border-gray-600'
            ]"
          >
            <p class="text-sm whitespace-pre-wrap">{{ message.content }}</p>
            <p
              :class="[
                'text-xs mt-1',
                message.role === 'user' ? 'text-blue-100' : 'text-gray-500 dark:text-gray-400'
              ]"
            >
              {{ formatTime(message.timestamp) }}
            </p>
          </div>
        </div>

        <!-- Typing Indicator -->
        <div v-if="isTyping" class="flex justify-start">
          <div class="bg-white dark:bg-gray-700 rounded-lg px-4 py-2 border border-gray-200 dark:border-gray-600">
            <div class="flex space-x-1">
              <div class="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style="animation-delay: 0s"></div>
              <div class="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style="animation-delay: 0.2s"></div>
              <div class="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style="animation-delay: 0.4s"></div>
            </div>
          </div>
        </div>
      </div>

      <!-- Input Area -->
      <div class="border-t border-gray-200 dark:border-gray-700 p-4 bg-white dark:bg-gray-800">
        <form @submit.prevent="sendMessage" class="flex space-x-2">
          <input
            v-model="inputMessage"
            type="text"
            placeholder="Ask about inventory..."
            class="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
            :disabled="isTyping"
          />
          <button
            type="submit"
            :disabled="!inputMessage.trim() || isTyping"
            class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
              />
            </svg>
          </button>
        </form>
      </div>
    </div>
  </transition>
</template>

<script setup lang="ts">
import { ref, computed, nextTick, onMounted, onUnmounted } from 'vue'
import { invenGaduApi } from '@/core/services/invenGaduApi'
import type { ChatMessage } from '@/core/types/chat'
import { useNotificationStore } from '@/core/stores/notification'

const notificationStore = useNotificationStore()

// State
const isOpen = ref(false)
const messages = ref<ChatMessage[]>([])
const inputMessage = ref('')
const isTyping = ref(false)
const messagesContainer = ref<HTMLElement>()

// Quick suggestions
const quickSuggestions = [
  'Show low stock items',
  'What products need restocking?',
  'Inventory summary',
  'Sales trends'
]

// Computed
const hasUnreadMessages = computed(() => {
  // Could implement unread message tracking
  return false
})

// Methods
const openChat = () => {
  isOpen.value = true
  nextTick(() => {
    scrollToBottom()
    focusInput()
  })
}

const closeChat = () => {
  isOpen.value = false
}

const sendQuickMessage = (message: string) => {
  inputMessage.value = message
  sendMessage()
}

const sendMessage = async () => {
  if (!inputMessage.value.trim() || isTyping.value) return

  const userMessage: ChatMessage = {
    id: Date.now().toString(),
    role: 'user',
    content: inputMessage.value.trim(),
    timestamp: new Date()
  }

  messages.value.push(userMessage)
  const messageToSend = inputMessage.value.trim()
  inputMessage.value = ''
  isTyping.value = true

  scrollToBottom()

  try {
    const response = await invenGaduApi.sendMessage({
      message: messageToSend,
      conversationId: invenGaduApi.getConversationId() || undefined
    })

    if (response.success && response.data) {
      const assistantMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: response.data.message,
        timestamp: new Date()
      }
      messages.value.push(assistantMessage)
    } else {
      throw new Error(response.message || 'Failed to get response')
    }
  } catch (error: any) {
    const errorMessage: ChatMessage = {
      id: (Date.now() + 1).toString(),
      role: 'assistant',
      content: error.message || 'Sorry, I encountered an error. Please try again.',
      timestamp: new Date()
    }
    messages.value.push(errorMessage)
  } finally {
    isTyping.value = false
    scrollToBottom()
  }
}

const scrollToBottom = () => {
  nextTick(() => {
    if (messagesContainer.value) {
      messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight
    }
  })
}

const focusInput = () => {
  const input = document.querySelector<HTMLInputElement>('input[placeholder="Ask about inventory..."]')
  if (input) input.focus()
}

const formatTime = (date: Date): string => {
  return new Intl.DateTimeFormat('en-US', {
    hour: '2-digit',
    minute: '2-digit'
  }).format(date)
}

// Keyboard shortcuts
const handleKeyDown = (event: KeyboardEvent) => {
  // Cmd/Ctrl + K to toggle chat
  if ((event.metaKey || event.ctrlKey) && event.key === 'k') {
    event.preventDefault()
    isOpen.value ? closeChat() : openChat()
  }

  // Escape to close chat
  if (event.key === 'Escape' && isOpen.value) {
    closeChat()
  }
}

// Lifecycle
onMounted(() => {
  window.addEventListener('keydown', handleKeyDown)

  // Listen for selection assist opening requests
  window.addEventListener('inven-gadu:open', (e: Event) => {
    const detail = (e as CustomEvent).detail as { prompt?: string }
    const prefill = (detail?.prompt || '').trim()
    openChat()
    if (prefill) {
      inputMessage.value = prefill
      nextTick(() => focusInput())
    }
  })
})

onUnmounted(() => {
  window.removeEventListener('keydown', handleKeyDown)
})
</script>

<style scoped>
/* Custom scrollbar */
.overflow-y-auto::-webkit-scrollbar {
  width: 6px;
}

.overflow-y-auto::-webkit-scrollbar-track {
  background: transparent;
}

.overflow-y-auto::-webkit-scrollbar-thumb {
  background: #cbd5e0;
  border-radius: 3px;
}

.dark .overflow-y-auto::-webkit-scrollbar-thumb {
  background: #4b5563;
}
</style>

