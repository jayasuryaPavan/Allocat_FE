/**
 * Mock Data and Functions
 * Centralized mocks for testing
 */

import { vi } from 'vitest'

// Mock API Service
export const mockApiService = {
  get: vi.fn(),
  post: vi.fn(),
  put: vi.fn(),
  patch: vi.fn(),
  delete: vi.fn(),
  uploadFile: vi.fn(),
  downloadFile: vi.fn(),
}

// Mock Auth Store
export const mockAuthStore = {
  isAuthenticated: false,
  currentUser: null,
  token: null,
  login: vi.fn(),
  logout: vi.fn(),
  refreshToken: vi.fn(),
  getToken: vi.fn(() => 'mock-token'),
  setUser: vi.fn(),
}

// Mock Notification Store
export const mockNotificationStore = {
  success: vi.fn(),
  error: vi.fn(),
  warning: vi.fn(),
  info: vi.fn(),
  clear: vi.fn(),
}

// Mock Loading Store
export const mockLoadingStore = {
  isLoading: false,
  startLoading: vi.fn(),
  stopLoading: vi.fn(),
}

// Mock POS Store
export const mockPosStore = {
  currentCart: null,
  isLoading: false,
  isProcessingPayment: false,
  cartTotal: 0,
  cartItemCount: 0,
  hasItems: false,
  createCart: vi.fn(),
  getCart: vi.fn(),
  addItem: vi.fn(),
  updateItemQuantity: vi.fn(),
  removeItem: vi.fn(),
  applyDiscount: vi.fn(),
  removeDiscount: vi.fn(),
  clearCart: vi.fn(),
  checkout: vi.fn(),
  holdOrder: vi.fn(),
  getHeldOrders: vi.fn(),
  resumeOrder: vi.fn(),
  processReturn: vi.fn(),
}

// Mock Router
export const mockRouter = {
  push: vi.fn(),
  replace: vi.fn(),
  go: vi.fn(),
  back: vi.fn(),
  forward: vi.fn(),
  currentRoute: {
    value: {
      path: '/',
      name: 'Home',
      params: {},
      query: {},
      meta: {}
    }
  }
}

// Mock Data
export const mockProducts = [
  {
    id: 1,
    productCode: 'PROD001',
    name: 'Test Product 1',
    category: 'Electronics',
    unitPrice: 99.99,
    unitOfMeasure: 'pcs',
    minimumStockLevel: 10,
    maximumStockLevel: 100,
    isActive: true,
    barcode: '1234567890123'
  },
  {
    id: 2,
    productCode: 'PROD002',
    name: 'Test Product 2',
    category: 'Clothing',
    unitPrice: 49.99,
    unitOfMeasure: 'pcs',
    minimumStockLevel: 5,
    maximumStockLevel: 50,
    isActive: true,
    barcode: '1234567890124'
  }
]

export const mockCustomers = [
  {
    id: 1,
    customerCode: 'CUST001',
    name: 'John Doe',
    email: 'john@example.com',
    phone: '+1234567890',
    isActive: true
  },
  {
    id: 2,
    customerCode: 'CUST002',
    name: 'Jane Smith',
    email: 'jane@example.com',
    phone: '+1234567891',
    isActive: true
  }
]

export const mockCart = {
  cartId: 'cart-123',
  storeId: 1,
  cashierId: 1,
  items: [
    {
      id: 'item-1',
      product: mockProducts[0],
      quantity: 2,
      unitPrice: 99.99,
      subtotal: 199.98
    }
  ],
  subtotal: 199.98,
  taxAmount: 0,
  discountAmount: 0,
  total: 199.98
}

export const mockSalesOrder = {
  id: 1,
  orderNo: 'ORD-001',
  store: { id: 1, name: 'Main Store' },
  customer: mockCustomers[0],
  cashier: { id: 1, firstName: 'Cashier', lastName: 'User' },
  orderDate: '2024-01-01T10:00:00Z',
  subtotal: 199.98,
  taxAmount: 0,
  discountAmount: 0,
  total: 199.98,
  status: 'COMPLETED',
  paymentStatus: 'PAID',
  items: mockCart.items,
  payments: []
}

// Helper to reset all mocks
export function resetAllMocks() {
  Object.values(mockApiService).forEach(mock => {
    if (typeof mock === 'function' && 'mockClear' in mock) {
      mock.mockClear()
    }
  })
  Object.values(mockAuthStore).forEach(mock => {
    if (typeof mock === 'function' && 'mockClear' in mock) {
      mock.mockClear()
    }
  })
  Object.values(mockNotificationStore).forEach(mock => {
    if (typeof mock === 'function' && 'mockClear' in mock) {
      mock.mockClear()
    }
  })
  Object.values(mockLoadingStore).forEach(mock => {
    if (typeof mock === 'function' && 'mockClear' in mock) {
      mock.mockClear()
    }
  })
  Object.values(mockPosStore).forEach(mock => {
    if (typeof mock === 'function' && 'mockClear' in mock) {
      mock.mockClear()
    }
  })
  Object.values(mockRouter).forEach(mock => {
    if (typeof mock === 'function' && 'mockClear' in mock) {
      mock.mockClear()
    }
  })
}

