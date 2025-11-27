/**
 * API Service Tests
 * Example test for API services
 */

import { describe, it, expect, vi, beforeEach } from 'vitest'
import { useApiService } from '@/core/services/api'
import { mockApiService } from '../../utils/mocks'

// Mock the API service
vi.mock('@/core/services/api', () => ({
  useApiService: () => mockApiService
}))

describe('ApiService', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('GET requests', () => {
    it('should make GET request successfully', async () => {
      const mockResponse = {
        data: { success: true, data: { id: 1, name: 'Test' } },
        status: 200,
        statusText: 'OK',
        headers: {},
        config: {} as any
      }

      mockApiService.get.mockResolvedValue(mockResponse)

      const apiService = useApiService()
      const response = await apiService.get('/test')

      expect(mockApiService.get).toHaveBeenCalledWith('/test')
      expect(response.data.success).toBe(true)
      expect(response.data.data.name).toBe('Test')
    })

    it('should handle GET request errors', async () => {
      const mockError = {
        response: {
          status: 404,
          data: { message: 'Not found' }
        }
      }

      mockApiService.get.mockRejectedValue(mockError)

      const apiService = useApiService()

      await expect(apiService.get('/test')).rejects.toEqual(mockError)
      expect(mockApiService.get).toHaveBeenCalledWith('/test')
    })
  })

  describe('POST requests', () => {
    it('should make POST request successfully', async () => {
      const mockData = { name: 'New Item' }
      const mockResponse = {
        data: { success: true, data: { id: 1, ...mockData } },
        status: 201,
        statusText: 'Created',
        headers: {},
        config: {} as any
      }

      mockApiService.post.mockResolvedValue(mockResponse)

      const apiService = useApiService()
      const response = await apiService.post('/test', mockData)

      expect(mockApiService.post).toHaveBeenCalledWith('/test', mockData)
      expect(response.data.success).toBe(true)
      expect(response.data.data.name).toBe('New Item')
    })
  })

  describe('PUT requests', () => {
    it('should make PUT request successfully', async () => {
      const mockData = { id: 1, name: 'Updated Item' }
      const mockResponse = {
        data: { success: true, data: mockData },
        status: 200,
        statusText: 'OK',
        headers: {},
        config: {} as any
      }

      mockApiService.put.mockResolvedValue(mockResponse)

      const apiService = useApiService()
      const response = await apiService.put('/test/1', mockData)

      expect(mockApiService.put).toHaveBeenCalledWith('/test/1', mockData)
      expect(response.data.success).toBe(true)
    })
  })

  describe('DELETE requests', () => {
    it('should make DELETE request successfully', async () => {
      const mockResponse = {
        data: { success: true, data: null },
        status: 200,
        statusText: 'OK',
        headers: {},
        config: {} as any
      }

      mockApiService.delete.mockResolvedValue(mockResponse)

      const apiService = useApiService()
      const response = await apiService.delete('/test/1')

      expect(mockApiService.delete).toHaveBeenCalledWith('/test/1')
      expect(response.data.success).toBe(true)
    })
  })
})

