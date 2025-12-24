/**
 * API Diagnostics Utility
 * Helps diagnose API connectivity issues
 */

import { useApiService } from '@/core/services/api'
import { environment } from '@/environments'

export interface DiagnosticResult {
  test: string
  success: boolean
  message: string
  details?: any
}

export async function runApiDiagnostics(): Promise<DiagnosticResult[]> {
  const results: DiagnosticResult[] = []
  const apiService = useApiService()

  // Test 1: Check environment configuration
  results.push({
    test: 'Environment Configuration',
    success: !!environment.apiUrl,
    message: environment.apiUrl 
      ? `API URL configured: ${environment.apiUrl}`
      : 'API URL not configured',
    details: { apiUrl: environment.apiUrl }
  })

  // Test 2: Check backend health endpoint
  try {
    const healthResponse = await fetch(`${environment.apiUrl.replace('/api', '')}/api/health`)
    results.push({
      test: 'Backend Health Check',
      success: healthResponse.ok,
      message: healthResponse.ok 
        ? `Backend is running (Status: ${healthResponse.status})`
        : `Backend returned status: ${healthResponse.status}`,
      details: { status: healthResponse.status, statusText: healthResponse.statusText }
    })
  } catch (error: any) {
    results.push({
      test: 'Backend Health Check',
      success: false,
      message: `Cannot reach backend: ${error.message}`,
      details: { error: error.message, url: `${environment.apiUrl.replace('/api', '')}/api/health` }
    })
  }

  // Test 3: Check authentication token
  try {
    const authStore = (await import('@/core/stores/auth')).useAuthStore()
    const token = authStore.getToken()
    results.push({
      test: 'Authentication Token',
      success: !!token,
      message: token 
        ? `Token present (length: ${token.length})`
        : 'No authentication token found',
      details: { hasToken: !!token, tokenLength: token?.length }
    })
  } catch (error: any) {
    results.push({
      test: 'Authentication Token',
      success: false,
      message: `Error checking token: ${error.message}`,
      details: { error: error.message }
    })
  }

  // Test 4: Test POS endpoint with direct fetch
  try {
    const authStore = (await import('@/core/stores/auth')).useAuthStore()
    const token = authStore.getToken()
    
    const response = await fetch(`${environment.apiUrl}/pos/cart`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { 'Authorization': `Bearer ${token}` } : {})
      },
      body: JSON.stringify({ storeId: 1, cashierId: 1 })
    })

    results.push({
      test: 'POS Cart Endpoint (Direct Fetch)',
      success: response.ok,
      message: response.ok 
        ? `Endpoint accessible (Status: ${response.status})`
        : `Endpoint returned: ${response.status} ${response.statusText}`,
      details: { 
        status: response.status, 
        statusText: response.statusText,
        url: `${environment.apiUrl}/pos/cart`,
        hasAuth: !!token
      }
    })
  } catch (error: any) {
    results.push({
      test: 'POS Cart Endpoint (Direct Fetch)',
      success: false,
      message: `Cannot reach endpoint: ${error.message}`,
      details: { error: error.message, url: `${environment.apiUrl}/pos/cart` }
    })
  }

  // Test 5: Test with Axios service
  try {
    const response = await apiService.post('/pos/cart', { storeId: 1, cashierId: 1 })
    results.push({
      test: 'POS Cart Endpoint (Axios Service)',
      success: response.status === 200 || response.status === 201,
      message: `Request completed (Status: ${response.status})`,
      details: { status: response.status, data: response.data }
    })
  } catch (error: any) {
    results.push({
      test: 'POS Cart Endpoint (Axios Service)',
      success: false,
      message: `Request failed: ${error.response?.status || error.message}`,
      details: { 
        status: error.response?.status,
        statusText: error.response?.statusText,
        message: error.response?.data?.message || error.message,
        url: error.config?.url,
        baseURL: error.config?.baseURL
      }
    })
  }

  return results
}

export function printDiagnostics(results: DiagnosticResult[]) {
  console.group('🔍 API Diagnostics Results')
  results.forEach(result => {
    const icon = result.success ? '✅' : '❌'
    console.log(`${icon} ${result.test}: ${result.message}`)
    if (result.details) {
      console.log('   Details:', result.details)
    }
  })
  console.groupEnd()
}

