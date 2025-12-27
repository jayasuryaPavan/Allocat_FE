<template>
  <!-- Floating Chat Button -->
  <button
    v-if="!isOpen"
    @click="openChat"
    class="fixed bottom-6 right-6 z-50 bg-white/40 dark:bg-gray-900/40 backdrop-blur-glass rounded-full p-3 shadow-glass shadow-glass-glow transition-all duration-300 hover:scale-110 hover:shadow-glow focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
    aria-label="Open InvenGadu Chat"
  >
    <div v-if="!isTyping" class="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center shadow-glow-sm">
      <svg class="w-5 h-5 text-white" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 2L3 7v3l9 5 9-5V7L12 2zm0 2.18L18.09 7 12 10.82 5.91 7 12 4.18zM5 9.37l7 3.89v7.56l-7-3.89V9.37zm9 11.45v-7.56l7-3.89v7.56l-7 3.89z"/>
      </svg>
    </div>
    <div v-else class="w-8 h-8 flex items-center justify-center">
      <div class="animate-spin rounded-full h-5 w-5 border-2 border-primary-500 border-t-transparent"></div>
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
      class="chat-glass fixed bottom-6 right-6 z-50 w-96 max-w-[calc(100vw-3rem)] h-[600px] max-h-[calc(100vh-6rem)] rounded-2xl shadow-glass shadow-glass-glow flex flex-col overflow-hidden"
    >
      <!-- Chat Header -->
      <div 
        @click="closeChat"
        class="bg-primary-600/10 backdrop-blur-md text-white py-2 px-3 flex items-center justify-between shadow-glow-sm relative cursor-pointer hover:bg-primary-600/15 transition-colors"
      >
        <div class="absolute inset-x-0 bottom-0 h-[1px] bg-white/20"></div>
        <div class="flex items-center space-x-2">
          <div class="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center shadow-glow-sm">
            <svg class="w-4 h-4 text-white" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2L3 7v3l9 5 9-5V7L12 2zm0 2.18L18.09 7 12 10.82 5.91 7 12 4.18zM5 9.37l7 3.89v7.56l-7-3.89V9.37zm9 11.45v-7.56l7-3.89v7.56l-7 3.89z"/>
            </svg>
          </div>
          <div>
            <h3 class="font-bold text-sm leading-tight text-primary-600 dark:text-primary-400">InvenGadu</h3>
            <p class="text-[10px] text-primary-500/80 dark:text-primary-400/70 font-semibold uppercase tracking-wide">AI Agent</p>
          </div>
        </div>
        <button
          @click="closeChat"
          class="text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 focus:outline-none"
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
        class="flex-1 overflow-y-auto p-4 space-y-4 bg-transparent"
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
              'max-w-[85%] rounded-2xl px-4 py-3 shadow-sm transition-all duration-300',
              message.role === 'user'
                ? 'bg-primary-600 text-white shadow-glow-sm ml-auto rounded-tr-none'
                : 'bg-white/40 dark:bg-gray-800/40 backdrop-blur-md text-gray-800 dark:text-white border border-white/20 dark:border-white/10 rounded-tl-none'
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
      <div class="p-4 bg-white/10 backdrop-blur-glass-lg border-t border-white/10">
        <form @submit.prevent="sendMessage" class="flex space-x-2">
          <input
            v-model="inputMessage"
            type="text"
            placeholder="Ask about inventory..."
            class="flex-1 px-4 py-3 bg-white/5 dark:bg-black/20 border-white/20 dark:border-white/10 rounded-xl focus:ring-primary-500 focus:border-primary-500 dark:text-white placeholder-gray-400 text-sm transition-all"
            :disabled="isTyping"
          />
          <button
            type="submit"
            :disabled="!inputMessage.trim() || isTyping"
            class="px-4 py-2 bg-primary-600 text-white rounded-xl hover:bg-primary-700 hover:shadow-glow-sm disabled:opacity-50 disabled:cursor-not-allowed transition-all focus:outline-none focus:ring-2 focus:ring-primary-500 shadow-glow-sm"
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
import { ref, nextTick, onMounted, onUnmounted } from 'vue'
import type { ChatMessage } from '@/core/types/chat'
import { invenGaduApi } from '@/core/services/invenGaduApi'

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
// hasUnreadMessages removed as it was unused

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

