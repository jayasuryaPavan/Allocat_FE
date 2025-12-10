import { useApiService } from './api'
import type { ApiResponse } from '@/core/types/api'
import type { Shift, ShiftSwap, SalesPersonLogin } from '@/features/pos/types'

class ShiftApiService {
  private readonly baseUrl = '/shifts'
  private apiService = useApiService()

  async getActiveShift(storeId: number, userId: number): Promise<ApiResponse<Shift>> {
    const response = await this.apiService.get<ApiResponse<Shift>>(
      `${this.baseUrl}/active?storeId=${storeId}&userId=${userId}`
    )
    return response.data
  }

  async startShift(userId: number, request: {
    storeId: number
    startingCashAmount?: number
    expectedStartTime?: string
    expectedEndTime?: string
    notes?: string
  }): Promise<ApiResponse<Shift>> {
    const response = await this.apiService.post<ApiResponse<Shift>>(
      `${this.baseUrl}/start?userId=${userId}`,
      request
    )
    return response.data
  }

  async endShift(shiftId: number, endedByUserId: number, request: {
    endingCashAmount: number
    expectedCashAmount?: number
    notes?: string
  }): Promise<ApiResponse<Shift>> {
    const response = await this.apiService.post<ApiResponse<Shift>>(
      `${this.baseUrl}/${shiftId}/end?endedByUserId=${endedByUserId}`,
      request
    )
    return response.data
  }

  async startDay(request: { storeId: number; date?: string; initialCashAmount?: number }): Promise<ApiResponse<void>> {
    const response = await this.apiService.post<ApiResponse<void>>(`${this.baseUrl}/day/start`, request)
    return response.data
  }

  async endDay(request: { storeId?: number; date?: string; notes?: string }): Promise<ApiResponse<void>> {
    const response = await this.apiService.post<ApiResponse<void>>(`${this.baseUrl}/day/end`, request)
    return response.data
  }

  async createSwap(requestedByUserId: number, payload: {
    originalShiftId: number
    requestedToUserId: number
    originalShiftDate: string
    swapShiftDate: string
    reason?: string
  }): Promise<ApiResponse<ShiftSwap>> {
    const response = await this.apiService.post<ApiResponse<ShiftSwap>>(
      `${this.baseUrl}/swaps?requestedByUserId=${requestedByUserId}`,
      payload
    )
    return response.data
  }

  async approveSwapByEmployee(swapId: number, userId: number): Promise<ApiResponse<ShiftSwap>> {
    const response = await this.apiService.post<ApiResponse<ShiftSwap>>(
      `${this.baseUrl}/swaps/${swapId}/approve?userId=${userId}`
    )
    return response.data
  }

  async approveSwapByManager(swapId: number, managerId: number, managerNotes?: string): Promise<ApiResponse<ShiftSwap>> {
    const url = `${this.baseUrl}/swaps/${swapId}/manager-approve?managerId=${managerId}${managerNotes ? `&managerNotes=${encodeURIComponent(managerNotes)}` : ''}`
    const response = await this.apiService.post<ApiResponse<ShiftSwap>>(url)
    return response.data
  }

  async rejectSwap(swapId: number, rejectedByUserId: number, reason?: string): Promise<ApiResponse<ShiftSwap>> {
    const url = `${this.baseUrl}/swaps/${swapId}/reject?rejectedByUserId=${rejectedByUserId}${reason ? `&reason=${encodeURIComponent(reason)}` : ''}`
    const response = await this.apiService.post<ApiResponse<ShiftSwap>>(url)
    return response.data
  }

  async cancelSwap(swapId: number, userId: number): Promise<ApiResponse<ShiftSwap>> {
    const response = await this.apiService.post<ApiResponse<ShiftSwap>>(
      `${this.baseUrl}/swaps/${swapId}/cancel?userId=${userId}`
    )
    return response.data
  }

  async getPendingSwaps(userId: number): Promise<ApiResponse<ShiftSwap[]>> {
    const response = await this.apiService.get<ApiResponse<ShiftSwap[]>>(
      `${this.baseUrl}/swaps/pending?userId=${userId}`
    )
    return response.data
  }

  async getSwapsByUser(userId: number): Promise<ApiResponse<ShiftSwap[]>> {
    const response = await this.apiService.get<ApiResponse<ShiftSwap[]>>(
      `${this.baseUrl}/swaps/user?userId=${userId}`
    )
    return response.data
  }

  async getSwapsByStore(storeId: number): Promise<ApiResponse<ShiftSwap[]>> {
    const response = await this.apiService.get<ApiResponse<ShiftSwap[]>>(
      `${this.baseUrl}/swaps/store?storeId=${storeId}`
    )
    return response.data
  }

  async recordLogin(userId: number, payload: {
    storeId: number
    shiftId?: number
    loginType?: string
    deviceInfo?: string
    ipAddress?: string
    location?: string
  }): Promise<ApiResponse<SalesPersonLogin>> {
    const response = await this.apiService.post<ApiResponse<SalesPersonLogin>>(
      `${this.baseUrl}/login?userId=${userId}`,
      payload
    )
    return response.data
  }

  async recordLogout(userId: number): Promise<ApiResponse<SalesPersonLogin>> {
    const response = await this.apiService.post<ApiResponse<SalesPersonLogin>>(
      `${this.baseUrl}/logout?userId=${userId}`
    )
    return response.data
  }

  async getLoginHistory(userId: number, date?: string): Promise<ApiResponse<SalesPersonLogin[]>> {
    const url = `${this.baseUrl}/logins/user?userId=${userId}${date ? `&date=${date}` : ''}`
    const response = await this.apiService.get<ApiResponse<SalesPersonLogin[]>>(url)
    return response.data
  }

  async getLoginHistoryByStore(storeId: number, date?: string): Promise<ApiResponse<SalesPersonLogin[]>> {
    const url = `${this.baseUrl}/logins/store?storeId=${storeId}${date ? `&date=${date}` : ''}`
    const response = await this.apiService.get<ApiResponse<SalesPersonLogin[]>>(url)
    return response.data
  }
}

export const shiftApiService = new ShiftApiService()
