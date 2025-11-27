# API Services Implementation Summary

This document summarizes all the API services implemented to connect the frontend with the backend APIs.

## Overview

All backend API endpoints have been mapped to frontend API services. The services follow a consistent pattern and use the centralized `ApiService` for HTTP requests with automatic authentication token injection.

## Implemented API Services

### 1. **productsApi.ts** ✅
**Base URL:** `/api/products`

**Endpoints:**
- `getAllProducts()` - Get products with pagination, sorting, and filtering
- `getProductById(id)` - Get product by ID
- `getProductByCode(code)` - Get product by product code
- `searchProducts(searchTerm)` - Search products by name, code, or barcode
- `createProduct(product)` - Create a new product
- `updateProduct(id, product)` - Update an existing product
- `deleteProduct(id)` - Soft delete a product
- `getCategories()` - Get all product categories

**Usage:**
```typescript
import { productsApiService } from '@/core/services/productsApi'

const response = await productsApiService.getAllProducts({
  page: 0,
  size: 20,
  search: 'laptop',
  category: 'Electronics'
})
```

---

### 2. **salesApi.ts** ✅
**Base URL:** `/api/sales`

**Endpoints:**
- `getSalesOrders(params)` - Get sales orders with pagination and filtering
- `getOrderById(id)` - Get order by ID
- `getOrderByOrderNo(orderNo)` - Get order by order number
- `getCustomerOrders(customerId)` - Get all orders for a customer
- `cancelOrder(id, reason)` - Cancel an order
- `getSalesMetrics(params)` - Get sales metrics (total sales, order count, average order value)

**Usage:**
```typescript
import { salesApiService } from '@/core/services/salesApi'

const response = await salesApiService.getSalesOrders({
  storeId: 1,
  startDate: '2024-01-01T00:00:00',
  endDate: '2024-01-31T23:59:59',
  page: 0,
  size: 20
})
```

---

### 3. **discountsApi.ts** ✅
**Base URL:** `/api/discounts`

**Endpoints:**
- `getAllDiscounts(activeOnly?)` - Get all discounts (optionally only active)
- `getDiscountByCode(code)` - Get discount by code
- `createDiscount(discount)` - Create a new discount
- `updateDiscount(id, discount)` - Update an existing discount
- `deactivateDiscount(id)` - Deactivate a discount

**Usage:**
```typescript
import { discountsApiService } from '@/core/services/discountsApi'

const response = await discountsApiService.getAllDiscounts(true) // Only active discounts
```

---

### 4. **analyticsApi.ts** ✅
**Base URL:** `/api/analytics`

**Endpoints:**
- `getSalesSummary(params)` - Get sales summary for a date range
- `getSalesTrends(params)` - Get sales trends (daily/weekly/monthly)
- `getCashierPerformance(params)` - Get cashier performance metrics
- `getTopSellingProducts(params)` - Get top selling products
- `getLowStockAlerts(params)` - Get low stock alerts

**Usage:**
```typescript
import { analyticsApiService } from '@/core/services/analyticsApi'

const response = await analyticsApiService.getSalesSummary({
  storeId: 1,
  startDate: '2024-01-01',
  endDate: '2024-01-31'
})
```

---

### 5. **posApi.ts** ✅
**Base URL:** `/api/pos`

**Endpoints:**
- `createCart(storeId, cashierId)` - Create a new cart
- `getCart(cartId)` - Get cart by ID
- `addItemToCart(cartId, request)` - Add item to cart (by productId or barcode)
- `updateCartItem(cartId, itemId, quantity)` - Update cart item quantity
- `removeItemFromCart(cartId, itemId)` - Remove item from cart
- `applyDiscount(cartId, code)` - Apply discount to cart
- `removeDiscount(cartId)` - Remove discount from cart
- `clearCart(cartId)` - Clear all items from cart
- `checkout(cartId, checkoutRequest)` - Complete checkout
- `holdOrder(cartId, request?)` - Hold/park an order
- `getHeldOrders(storeId)` - Get all held orders for a store
- `resumeOrder(orderId)` - Resume a held order
- `searchOrder(query)` - Search order by order number
- `processReturn(returnRequest)` - Process a return

**Usage:**
```typescript
import { posApiService } from '@/core/services/posApi'

const response = await posApiService.createCart(1, 1)
const cart = response.data
```

---

### 6. **inventoryApi.ts** ✅ (Updated)
**Base URL:** `/api/inventory`

**Endpoints:**
- `uploadReceivedStockJson(data)` - Upload received stock via JSON
- `getAllReceivedStock()` - Get all received stock records
- `getPendingReceivedStock()` - Get pending received stock
- `verifyReceivedStock(id, quantity, verifiedBy)` - Verify and add to inventory
- `getCurrentInventory(params?)` - Get current inventory with pagination
- `getInventoryByProduct(productId)` - Get inventory for a specific product
- `getLowStockItems(params?)` - Get low stock items with pagination
- `getOutOfStockItems(params?)` - Get out of stock items with pagination
- `reserveInventory(productId, quantity, reservedBy)` - Reserve inventory
- `releaseReservation(productId, quantity, releasedBy)` - Release reservation
- `getStockDiscrepancies()` - Get stock discrepancies

**Note:** Product management methods have been moved to `productsApi.ts`

---

### 7. **customersApi.ts** ✅ (Already existed)
**Base URL:** `/api/customers`

**Endpoints:**
- `getAllCustomers(filters?)` - Get all customers with optional filters
- `getCustomerById(id)` - Get customer by ID
- `getCustomerByCode(code)` - Get customer by code
- `getCustomersByInvoice(invoiceNumber, storeId?)` - Get customers by invoice number
- `createCustomer(data)` - Create a new customer
- `updateCustomer(id, data)` - Update customer
- `deleteCustomer(id)` - Soft delete customer

---

### 8. **storesApi.ts** ✅ (Enhanced)
**Base URL:** `/api/stores`

**Endpoints:**
- `list(params?)` - Get all stores (SUPER_ADMIN only)
- `getById(storeId)` - Get store by ID
- `getByCode(storeCode)` - Get store by code
- `create(store)` - Create a new store (SUPER_ADMIN only)
- `update(storeId, store)` - Update store (SUPER_ADMIN only, requires access code)
- `delete(storeId, accessCode)` - Delete store (SUPER_ADMIN only, requires access code)
- `validateAccess(payload)` - Validate store access code

---

### 9. **usersApi.ts** ✅ (Enhanced)
**Base URL:** `/api/users`

**Endpoints:**
- `getAllUsers()` - Get all users (SUPER_ADMIN or ADMIN)
- `createUser(data)` - Create a new user
- `getAllRoles()` - Get all available roles

---

## Central Export

All services are exported from `Frontend/src/core/services/index.ts` for convenient imports:

```typescript
import {
  productsApiService,
  salesApiService,
  discountsApiService,
  analyticsApiService,
  posApiService,
  InventoryApiService,
  CustomersApiService,
  StoresApiService,
  UsersApiService
} from '@/core/services'
```

## Response Format

All API services return responses in the following format:

```typescript
interface ApiResponse<T> {
  success: boolean
  data: T
  message?: string
  errors?: Record<string, string[]>
  meta?: {
    total?: number
    page?: number
    limit?: number
    totalPages?: number
  }
}
```

## Error Handling

All services handle errors gracefully and return an `ApiResponse` with `success: false` and an appropriate error message. The centralized `ApiService` handles:
- Authentication token injection
- Token refresh on 401 errors
- Loading state management
- Error notifications
- Request/response interceptors

## Backend API Mapping

| Frontend Service | Backend Controller | Status |
|-----------------|-------------------|--------|
| productsApi.ts | ProductController | ✅ Complete |
| salesApi.ts | SalesOrderController | ✅ Complete |
| discountsApi.ts | DiscountController | ✅ Complete |
| analyticsApi.ts | AnalyticsController | ✅ Complete |
| posApi.ts | POSController | ✅ Complete |
| inventoryApi.ts | InventoryController | ✅ Complete |
| customersApi.ts | CustomerController | ✅ Complete |
| storesApi.ts | StoreController | ✅ Complete |
| usersApi.ts | UserController | ✅ Complete |

## Next Steps

1. ✅ All API services implemented
2. ✅ ProductsView.vue updated to use productsApiService
3. ⏳ Update other components to use new API services where applicable
4. ⏳ Add TypeScript types for all API responses
5. ⏳ Add unit tests for API services
6. ⏳ Update posStore.ts to use posApiService (optional refactoring)

## Notes

- All services use the centralized `ApiService` which handles authentication automatically
- Pagination parameters follow Spring Boot conventions (0-based page numbers)
- Date parameters use ISO format strings
- Query parameters are properly URL-encoded
- Error responses are consistent across all services

