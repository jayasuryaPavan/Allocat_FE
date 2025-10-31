import axios, { type AxiosInstance } from 'axios'
import type { ChatRequest, ChatApiResponse } from '../types/chat'
import { useNotificationStore } from '@/core/stores/notification'
import { environment } from '@/environments'

// InvenGadu chat API URL - defaults to Spring Boot backend on port 8080
const CHAT_API_URL = import.meta.env.VITE_INVEN_GADU_API_URL || environment.apiUrl

export class InvenGaduApiService {
  private axiosInstance: AxiosInstance
  private conversationId: string | null = null

  constructor() {
    this.axiosInstance = axios.create({
      baseURL: CHAT_API_URL,
      timeout: 60000, // 60 seconds timeout for AI responses
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      }
    })

    this.setupInterceptors()
  }

  private setupInterceptors() {
    // Response interceptor for error handling
    this.axiosInstance.interceptors.response.use(
      (response) => response,
      (error) => {
        const notificationStore = useNotificationStore()

        if (error.response?.status >= 500) {
          notificationStore.error(
            'InvenGadu Error',
            'The AI assistant is temporarily unavailable. Please try again later.'
          )
        } else if (error.response?.status === 404) {
          notificationStore.warning(
            'InvenGadu Not Found',
            'The AI assistant service is not running. Please ensure the Spring Boot backend is started on port 8080.'
          )
        } else if (error.code === 'ECONNREFUSED') {
          notificationStore.warning(
            'Connection Failed',
            'Cannot connect to InvenGadu. Please ensure the Spring Boot backend is running on http://localhost:8080'
          )
        }

        return Promise.reject(error)
      }
    )
  }

  /**
   * Send a message to InvenGadu chat agent
   */
  async sendMessage(request: ChatRequest): Promise<ChatApiResponse> {
    try {
      const payload = {
        message: request.message,
        conversationId: request.conversationId || 'default'
      }

      const response = await this.axiosInstance.post<ChatApiResponse>('/chat', payload)
      
      // Store conversation ID if provided
      if (response.data.data?.conversationId) {
        this.conversationId = response.data.data.conversationId
      }

      return response.data
    } catch (error: any) {
      // Return a user-friendly error response
      return {
        success: false,
        data: {
          message: error.response?.data?.message || 'Failed to get response from InvenGadu. Please try again.',
          conversationId: this.conversationId || request.conversationId || 'default'
        },
        message: 'Error communicating with InvenGadu'
      }
    }
  }

  /**
   * Start a new conversation
   */
  async startNewConversation(conversationId: string = 'default'): Promise<boolean> {
    try {
      const response = await this.axiosInstance.post<ChatApiResponse>(`/chat/new?conversationId=${conversationId}`)
      
      if (response.data.success) {
        this.conversationId = conversationId
        return true
      }
      
      return false
    } catch (error) {
      console.error('Failed to start new conversation:', error)
      return false
    }
  }

  /**
   * Get current conversation ID
   */
  getConversationId(): string | null {
    return this.conversationId
  }

  /**
   * Set conversation ID
   */
  setConversationId(conversationId: string) {
    this.conversationId = conversationId
  }

  /**
   * Check if InvenGadu service is available
   */
  async checkHealth(): Promise<boolean> {
    try {
      // Check if the backend is responding
      const response = await this.axiosInstance.get('/health')
      return response.status === 200
    } catch {
      return false
    }
  }
}

// Create singleton instance
export const invenGaduApi = new InvenGaduApiService()

