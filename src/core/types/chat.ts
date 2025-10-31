export interface ChatMessage {
  id: string
  role: 'user' | 'assistant' | 'system'
  content: string
  timestamp: Date
  isLoading?: boolean
}

export interface ChatRequest {
  message: string
  conversationId?: string
}

export interface ChatResponse {
  message: string
  conversationId?: string
  metadata?: {
    model?: string
    tools_used?: boolean
  }
}

export interface ChatApiResponse {
  success: boolean
  data: ChatResponse
  message?: string
}

