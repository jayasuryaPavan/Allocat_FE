import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { shiftApiService } from '@/core/services/shiftApi'
import { useNotificationStore } from '@/core/stores/notification'
import type { Shift, ShiftSwap, SalesPersonLogin } from '../types'

// Associate state interface for POS Kiosk mode
interface SignedInAssociate {
  id: number
  associateNumber: string
  name: string
  signInTime: string
  shiftId?: number
}

export const useShiftStore = defineStore('shift', () => {
  const activeShift = ref<Shift | null>(null)
  const swaps = ref<ShiftSwap[]>([])
  const pendingSwaps = ref<ShiftSwap[]>([])
  const loginHistory = ref<SalesPersonLogin[]>([])
  const isLoading = ref(false)

  // Associate state for POS Kiosk mode (Tier 2)
  const signedInAssociate = ref<SignedInAssociate | null>(null)

  const notificationStore = useNotificationStore()

  const hasActiveShift = computed(() => !!activeShift.value && activeShift.value.status === 'ACTIVE')

  const loadActiveShift = async (storeId: number, userId: number) => {
    isLoading.value = true
    try {
      const resp = await shiftApiService.getActiveShift(storeId, userId)
      if (resp.success) {
        activeShift.value = resp.data
      } else {
        activeShift.value = null
      }
    } catch (error) {
      activeShift.value = null
    } finally {
      isLoading.value = false
    }
  }

  const startShift = async (userId: number, params: { storeId: number; startingCashAmount?: number; expectedEndTime?: string; notes?: string }) => {
    isLoading.value = true
    try {
      const resp = await shiftApiService.startShift(userId, {
        storeId: params.storeId,
        startingCashAmount: params.startingCashAmount,
        expectedEndTime: params.expectedEndTime,
        notes: params.notes
      })
      if (!resp.success) throw new Error(resp.message || 'Failed to start shift')
      activeShift.value = resp.data
      notificationStore.success('Shift started', 'Your shift is now active')
      return resp.data
    } catch (error: any) {
      notificationStore.error('Failed to start shift', error.message || 'Unknown error')
      throw error
    } finally {
      isLoading.value = false
    }
  }

  const endShift = async (shiftId: number, endedByUserId: number, params: { endingCashAmount: number; expectedCashAmount?: number; notes?: string }) => {
    isLoading.value = true
    try {
      const resp = await shiftApiService.endShift(shiftId, endedByUserId, params)
      if (!resp.success) throw new Error(resp.message || 'Failed to end shift')
      activeShift.value = resp.data
      notificationStore.success('Shift ended', 'Shift closed successfully')
      return resp.data
    } catch (error: any) {
      notificationStore.error('Failed to end shift', error.message || 'Unknown error')
      throw error
    } finally {
      isLoading.value = false
    }
  }

  const startDay = async (storeId: number, date?: string, initialCashAmount?: number) => {
    isLoading.value = true
    try {
      const resp = await shiftApiService.startDay({ storeId, date, initialCashAmount })
      if (!resp.success) throw new Error(resp.message || 'Failed to start day')
      notificationStore.success('New day started', 'Day initialized')
    } catch (error: any) {
      notificationStore.error('Failed to start day', error.message || 'Unknown error')
      throw error
    } finally {
      isLoading.value = false
    }
  }

  const endDay = async (storeId: number, date?: string, notes?: string) => {
    isLoading.value = true
    try {
      const resp = await shiftApiService.endDay({ storeId, date, notes })
      if (!resp.success) throw new Error(resp.message || 'Failed to end day')
      notificationStore.success('Day ended', 'All shifts closed')
    } catch (error: any) {
      notificationStore.error('Failed to end day', error.message || 'Unknown error')
      throw error
    } finally {
      isLoading.value = false
    }
  }

  const createSwap = async (requestedByUserId: number, payload: { originalShiftId: number; requestedToUserId: number; originalShiftDate: string; swapShiftDate: string; reason?: string }) => {
    isLoading.value = true
    try {
      const resp = await shiftApiService.createSwap(requestedByUserId, payload)
      if (!resp.success) throw new Error(resp.message || 'Failed to create swap')
      notificationStore.success('Swap requested', 'Shift swap request submitted')
      return resp.data
    } catch (error: any) {
      notificationStore.error('Swap request failed', error.message || 'Unknown error')
      throw error
    } finally {
      isLoading.value = false
    }
  }

  const approveSwapByEmployee = async (swapId: number, userId: number) => {
    const resp = await shiftApiService.approveSwapByEmployee(swapId, userId)
    if (!resp.success) throw new Error(resp.message || 'Failed to approve swap')
    notificationStore.success('Swap approved', 'You approved the swap request')
    return resp.data
  }

  const approveSwapByManager = async (swapId: number, managerId: number, notes?: string) => {
    const resp = await shiftApiService.approveSwapByManager(swapId, managerId, notes)
    if (!resp.success) throw new Error(resp.message || 'Failed to approve swap')
    notificationStore.success('Swap approved', 'Manager approved swap')
    return resp.data
  }

  const rejectSwap = async (swapId: number, rejectedByUserId: number, reason?: string) => {
    const resp = await shiftApiService.rejectSwap(swapId, rejectedByUserId, reason)
    if (!resp.success) throw new Error(resp.message || 'Failed to reject swap')
    notificationStore.info('Swap rejected', 'Swap request rejected')
    return resp.data
  }

  const cancelSwap = async (swapId: number, userId: number) => {
    const resp = await shiftApiService.cancelSwap(swapId, userId)
    if (!resp.success) throw new Error(resp.message || 'Failed to cancel swap')
    notificationStore.info('Swap cancelled', 'Swap request cancelled')
    return resp.data
  }

  const loadPendingSwaps = async (userId: number) => {
    const resp = await shiftApiService.getPendingSwaps(userId)
    if (resp.success) pendingSwaps.value = resp.data
  }

  const loadSwapsByUser = async (userId: number) => {
    const resp = await shiftApiService.getSwapsByUser(userId)
    if (resp.success) swaps.value = resp.data
  }

  const recordLogin = async (userId: number, payload: { storeId: number; shiftId?: number; loginType?: string; deviceInfo?: string; ipAddress?: string; location?: string }) => {
    const resp = await shiftApiService.recordLogin(userId, payload)
    if (!resp.success) throw new Error(resp.message || 'Failed to record login')
    return resp.data
  }

  const recordLogout = async (userId: number) => {
    const resp = await shiftApiService.recordLogout(userId)
    if (!resp.success) throw new Error(resp.message || 'Failed to record logout')
    return resp.data
  }

  const loadLoginHistory = async (userId: number, date?: string) => {
    const resp = await shiftApiService.getLoginHistory(userId, date)
    if (resp.success) loginHistory.value = resp.data
  }

  // ========= Associate Sign-In/Sign-Out for POS Kiosk Mode (Tier 2) =========

  const signInAssociate = async (storeId: number, associateNumber: string, passcode: string) => {
    isLoading.value = true
    try {
      const resp = await shiftApiService.authenticateAssociate(storeId, associateNumber, passcode)
      if (!resp.success) throw new Error(resp.message || 'Invalid credentials')

      signedInAssociate.value = {
        id: resp.data.userId,
        associateNumber: resp.data.associateNumber,
        name: resp.data.name,
        signInTime: new Date().toLocaleTimeString(),
        shiftId: resp.data.shiftId
      }

      // Record the login
      await recordLogin(resp.data.userId, {
        storeId,
        shiftId: resp.data.shiftId,
        loginType: 'SHIFT_START'
      })

      notificationStore.success('Signed In', `Welcome, ${resp.data.name}!`)
      return resp.data
    } catch (error: any) {
      notificationStore.error('Sign In Failed', error.message || 'Invalid credentials')
      throw error
    } finally {
      isLoading.value = false
    }
  }

  const signOutAssociate = async (passcode: string) => {
    if (!signedInAssociate.value) throw new Error('No associate signed in')

    isLoading.value = true
    try {
      // Verify passcode before sign out
      const resp = await shiftApiService.verifyAssociatePasscode(signedInAssociate.value.id, passcode)
      if (!resp.success) throw new Error('Invalid PIN')

      // Record logout
      await recordLogout(signedInAssociate.value.id)

      const name = signedInAssociate.value.name
      signedInAssociate.value = null

      notificationStore.success('Signed Out', `Goodbye, ${name}!`)
    } catch (error: any) {
      notificationStore.error('Sign Out Failed', error.message || 'Invalid PIN')
      throw error
    } finally {
      isLoading.value = false
    }
  }

  return {
    activeShift,
    swaps,
    pendingSwaps,
    loginHistory,
    isLoading,
    hasActiveShift,
    signedInAssociate,
    loadActiveShift,
    startShift,
    endShift,
    startDay,
    endDay,
    createSwap,
    approveSwapByEmployee,
    approveSwapByManager,
    rejectSwap,
    cancelSwap,
    loadPendingSwaps,
    loadSwapsByUser,
    recordLogin,
    recordLogout,
    loadLoginHistory,
    signInAssociate,
    signOutAssociate
  }
})

