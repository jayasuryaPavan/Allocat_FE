# Backend API Requirements - Shift Reports & Analytics

## 📋 **Overview**

This document outlines the backend API endpoints required to support:
1. **Shift Report Generation** - Detailed sales report for individual shifts
2. **Day Report Generation** - Aggregated report for entire business day
3. **Enhanced Analytics** - Time-period filtered analytics data

---

## 🆕 **New Endpoints Required**

### **1. Get Shift Report**

**Endpoint:** `GET /api/reports/shift/{shiftId}`

**Description:** Generate a comprehensive sales report for a specific shift.

**Path Parameters:**
- `shiftId` (integer, required) - The ID of the shift

**Response Format:**
```json
{
  "success": true,
  "data": {
    "shiftId": 123,
    "shiftDate": "2025-01-15",
    "employeeName": "John Doe",
    "startTime": "09:00 AM",
    "endTime": "05:00 PM",
    "duration": "8h 0m",
    
    "startingCash": 500.00,
    "endingCash": 2350.00,
    "expectedCash": 2350.00,
    "cashDifference": 0.00,
    
    "totalSales": 1850.00,
    "totalOrders": 45,
    "averageTicket": 41.11,
    "totalTax": 185.00,
    "totalDiscounts": 50.00,
    
    "cashPayments": 1200.00,
    "cardPayments": 450.00,
    "mobileMoneyPayments": 150.00,
    "bankTransferPayments": 50.00,
    
    "orderItems": [
      {
        "orderNo": "ORD-2025-001",
        "time": "09:15 AM",
        "customer": "Walk-in",
        "items": 3,
        "subtotal": 85.00,
        "tax": 8.50,
        "discount": 0.00,
        "total": 93.50,
        "paymentMethod": "CASH"
      }
      // ... more orders
    ],
    
    "topProducts": [
      {
        "productName": "Premium Widget",
        "quantitySold": 15,
        "revenue": 750.00
      }
      // ... more products (top 10)
    ]
  },
  "message": "Shift report generated successfully"
}
```

**Business Logic:**
1. Fetch shift details from `shifts` table
2. Query all `sales_orders` where:
   - `cashier_id` = shift's user ID
   - `order_date` BETWEEN shift start and end time
   - `status` = 'COMPLETED'
3. Calculate totals, averages, and payment breakdowns
4. Aggregate top-selling products during shift
5. Calculate expected cash: `startingCash + cashPayments - cashReturns`
6. Calculate cash difference: `endingCash - expectedCash`

**Error Responses:**
```json
{
  "success": false,
  "data": null,
  "message": "Shift not found",
  "error": "SHIFT_NOT_FOUND"
}
```

---

### **2. Get Day Report**

**Endpoint:** `GET /api/reports/day`

**Description:** Generate a comprehensive report for an entire business day.

**Query Parameters:**
- `storeId` (integer, required) - The store ID
- `date` (string, required) - Date in format YYYY-MM-DD

**Response Format:**
```json
{
  "success": true,
  "data": {
    "date": "2025-01-15",
    "storeName": "Main Store",
    
    "totalShifts": 3,
    "shifts": [
      {
        "shiftId": 123,
        "employeeName": "John Doe",
        "startTime": "09:00 AM",
        "endTime": "05:00 PM",
        "duration": "8h 0m",
        "sales": 1850.00,
        "orders": 45
      }
      // ... more shifts
    ],
    
    "totalSales": 5230.00,
    "totalOrders": 125,
    "averageTicket": 41.84,
    "totalTax": 523.00,
    "totalDiscounts": 150.00,
    "netSales": 4707.00,
    
    "cashPayments": 3200.00,
    "cardPayments": 1500.00,
    "mobileMoneyPayments": 400.00,
    "bankTransferPayments": 130.00,
    
    "hourlyBreakdown": [
      {
        "hour": "09:00",
        "sales": 350.00,
        "orders": 8
      },
      {
        "hour": "10:00",
        "sales": 520.00,
        "orders": 12
      }
      // ... hourly data for business hours
    ],
    
    "topProducts": [
      {
        "productName": "Premium Widget",
        "quantitySold": 45,
        "revenue": 2250.00
      }
      // ... top 10 products
    ],
    
    "topEmployees": [
      {
        "employeeName": "John Doe",
        "sales": 1850.00,
        "orders": 45,
        "averageTicket": 41.11
      }
      // ... all employees who worked
    ]
  },
  "message": "Day report generated successfully"
}
```

**Business Logic:**
1. Query all shifts for the store on given date
2. Aggregate all `sales_orders` for that store and date
3. Group orders by hour for hourly breakdown
4. Calculate totals across all shifts
5. Rank products by quantity/revenue
6. Rank employees by sales performance
7. Calculate payment method totals

**Error Responses:**
```json
{
  "success": false,
  "data": null,
  "message": "No shifts found for this date",
  "error": "NO_DATA"
}
```

---

## ✅ **Existing Endpoints (Verify These Work)**

The enhanced analytics dashboard uses existing endpoints. Please verify these are implemented and working:

### **3. Sales Summary**

**Endpoint:** `GET /api/analytics/sales/summary`

**Query Parameters:**
- `storeId` (integer, required)
- `startDate` (string, required) - Format: YYYY-MM-DD
- `endDate` (string, required) - Format: YYYY-MM-DD

**Expected Response:**
```json
{
  "success": true,
  "data": {
    "totalSales": 15230.50,
    "transactionCount": 345,
    "averageTicket": 44.14,
    "taxCollected": 1523.05,
    "discountsGiven": 450.00
  }
}
```

---

### **4. Cashier Performance**

**Endpoint:** `GET /api/analytics/cashier/performance`

**Query Parameters:**
- `storeId` (integer, required)
- `startDate` (string, required)
- `endDate` (string, required)

**Expected Response:**
```json
{
  "success": true,
  "data": [
    {
      "cashierId": 5,
      "cashierName": "John Doe",
      "totalSales": 5230.00,
      "transactionCount": 125,
      "averageTicket": 41.84,
      "averageTransactionTime": "3m 25s"
    }
    // ... more cashiers
  ]
}
```

---

### **5. Top Selling Products**

**Endpoint:** `GET /api/analytics/products/top-selling`

**Query Parameters:**
- `storeId` (integer, required)
- `startDate` (string, required)
- `endDate` (string, required)
- `sortBy` (string, optional) - "quantity" or "revenue" (default: "revenue")
- `limit` (integer, optional) - Default: 10

**Expected Response:**
```json
{
  "success": true,
  "data": {
    "products": [
      {
        "productId": 42,
        "productName": "Premium Widget",
        "productCode": "WID-001",
        "quantitySold": 145,
        "revenue": 7250.00
      }
      // ... more products
    ],
    "sortBy": "revenue"
  }
}
```

---

### **6. Sales Trends**

**Endpoint:** `GET /api/analytics/sales/trends`

**Query Parameters:**
- `storeId` (integer, required)
- `startDate` (string, required)
- `endDate` (string, required)
- `periodType` (string, optional) - "daily", "weekly", "monthly" (default: "daily")

**Expected Response:**
```json
{
  "success": true,
  "data": {
    "trends": [
      {
        "period": "2025-01-15",
        "sales": 5230.00,
        "transactions": 125
      },
      {
        "period": "2025-01-16",
        "sales": 4850.00,
        "transactions": 118
      }
      // ... more periods
    ],
    "periodType": "daily"
  }
}
```

---

### **7. Low Stock Alerts**

**Endpoint:** `GET /api/analytics/products/low-stock`

**Query Parameters:**
- `storeId` (integer, required)
- `threshold` (integer, optional) - Minimum stock level (default: 10)

**Expected Response:**
```json
{
  "success": true,
  "data": [
    {
      "productId": 15,
      "productName": "Widget Pro",
      "sku": "WID-PRO-001",
      "currentStock": 5,
      "reorderLevel": 20
    }
    // ... more products below threshold
  ]
}
```

---

## 🔄 **Integration with Existing Shift Endpoints**

The shift management system already has these endpoints (verify they're working):

### **Shift Start**
`POST /api/shifts/start?userId={userId}`
```json
{
  "storeId": 1,
  "startingCashAmount": 500.00,
  "notes": "Morning shift"
}
```

### **Shift End**
`POST /api/shifts/{shiftId}/end?endedByUserId={userId}`
```json
{
  "endingCashAmount": 2350.00,
  "expectedCashAmount": 2350.00,
  "notes": "All reconciled"
}
```

### **Day Start**
`POST /api/shifts/day/start`
```json
{
  "storeId": 1,
  "date": "2025-01-15",
  "initialCashAmount": 500.00
}
```

### **Day End**
`POST /api/shifts/day/end`
```json
{
  "storeId": 1,
  "date": "2025-01-15",
  "notes": "Day closed successfully"
}
```

---

## 📊 **Database Schema Requirements**

### **Tables Needed:**

**1. shifts** (already exists)
```sql
- id (PK)
- store_id (FK)
- user_id (FK)
- shift_date
- started_at
- ended_at
- starting_cash_amount
- ending_cash_amount
- expected_cash_amount
- cash_difference
- status (PENDING, ACTIVE, COMPLETED, CANCELLED)
- notes
- ended_by (FK to users)
- created_at
- updated_at
```

**2. sales_orders** (already exists)
```sql
- id (PK)
- order_no
- store_id (FK)
- cashier_id (FK to users)
- customer_id (FK, nullable)
- order_date
- subtotal
- tax_amount
- discount_amount
- total
- status
- payment_status
- notes
- created_at
- updated_at
```

**3. order_items** (already exists)
```sql
- id (PK)
- order_id (FK)
- product_id (FK)
- quantity
- unit_price
- discount
- tax_rate
- tax_amount
- total
```

**4. payments** (already exists)
```sql
- id (PK)
- order_id (FK)
- payment_type (CASH, CARD, MOBILE_MONEY, BANK_TRANSFER)
- amount
- transaction_id
- status
- processed_at
- notes
```

---

## 🎯 **Key Business Logic**

### **For Shift Reports:**

1. **Cash Reconciliation:**
   ```
   Expected Cash = Starting Cash + Cash Payments - Cash Refunds
   Cash Difference = Ending Cash - Expected Cash
   ```

2. **Order Filtering:**
   - Only include orders with `status = 'COMPLETED'`
   - Only include orders where `cashier_id` matches shift's user
   - Only include orders within shift time range

3. **Payment Breakdown:**
   - Sum payments grouped by `payment_type`
   - Join with `sales_orders` to filter by shift

### **For Day Reports:**

1. **Shift Aggregation:**
   - Get all shifts for store on given date
   - Sum sales across all shifts
   - Calculate individual shift performance

2. **Hourly Breakdown:**
   - Group orders by HOUR(order_date)
   - Sum sales and count orders per hour
   - Only include business hours (e.g., 8 AM - 10 PM)

3. **Employee Ranking:**
   - Group by cashier_id
   - Order by total_sales DESC
   - Calculate averages per employee

---

## 🔒 **Security & Permissions**

### **Authorization Requirements:**

**Shift Reports:**
- Employee can view their OWN shift reports
- Managers can view ALL shift reports for their store
- Admins can view ANY shift report

**Day Reports:**
- ONLY managers, admins, super_admins can access
- Must belong to the store being queried

**Analytics:**
- Managers can view their store analytics
- Admins can view any store analytics
- Sales staff CANNOT access analytics

### **Validation:**

1. Verify user has permission for the resource
2. Verify shift belongs to user's store (for managers)
3. Validate date formats (YYYY-MM-DD)
4. Validate date ranges (startDate <= endDate)
5. Return 403 Forbidden if unauthorized
6. Return 404 Not Found if resource doesn't exist

---

## ⚡ **Performance Considerations**

### **Optimization Tips:**

1. **Add Database Indexes:**
   ```sql
   CREATE INDEX idx_sales_orders_cashier_date ON sales_orders(cashier_id, order_date);
   CREATE INDEX idx_sales_orders_store_date ON sales_orders(store_id, order_date);
   CREATE INDEX idx_shifts_store_date ON shifts(store_id, shift_date);
   CREATE INDEX idx_payments_order_type ON payments(order_id, payment_type);
   ```

2. **Cache Analytics Data:**
   - Cache daily summaries (invalidate at midnight)
   - Cache top products for 1 hour
   - Cache low stock alerts for 30 minutes

3. **Pagination:**
   - If order lists are long, consider pagination
   - Limit top products/employees to 10-20 items

4. **Async Processing:**
   - For large date ranges (6 months, 1 year), consider background jobs
   - Return 202 Accepted with job ID, poll for results

---

## 🧪 **Testing Checklist**

### **For Backend Team:**

**Shift Report Endpoint:**
- [ ] Returns correct data for active shift
- [ ] Returns correct data for completed shift
- [ ] Calculates cash difference correctly (positive and negative)
- [ ] Groups payments by type correctly
- [ ] Filters orders by shift timeframe
- [ ] Returns 404 for non-existent shift
- [ ] Returns 403 for unauthorized access
- [ ] Handles shifts with no orders (empty arrays)

**Day Report Endpoint:**
- [ ] Aggregates multiple shifts correctly
- [ ] Calculates hourly breakdown accurately
- [ ] Ranks employees correctly
- [ ] Returns all payment method totals
- [ ] Returns 404 for date with no shifts
- [ ] Handles stores with single shift
- [ ] Performance test with 100+ orders

**Analytics Endpoints:**
- [ ] Date range filtering works correctly
- [ ] Period type (daily/weekly/monthly) works
- [ ] Returns correct KPIs
- [ ] Low stock threshold filtering works
- [ ] Handles empty result sets gracefully

---

## 📞 **API Response Standards**

### **Success Response:**
```json
{
  "success": true,
  "data": { /* ... data object ... */ },
  "message": "Operation completed successfully"
}
```

### **Error Response:**
```json
{
  "success": false,
  "data": null,
  "message": "Human-readable error message",
  "error": "ERROR_CODE",
  "details": { /* optional additional context */ }
}
```

### **Common Error Codes:**
- `SHIFT_NOT_FOUND` - Shift ID doesn't exist
- `UNAUTHORIZED` - User doesn't have permission
- `INVALID_DATE` - Date format is invalid
- `INVALID_DATE_RANGE` - startDate > endDate
- `NO_DATA` - No data found for date range
- `VALIDATION_ERROR` - Request parameters invalid

---

## 🚀 **Implementation Priority**

### **Phase 1 (Critical):**
1. ✅ `GET /api/reports/shift/{shiftId}` - Shift reports
2. ✅ `GET /api/reports/day` - Day reports

### **Phase 2 (Verify Existing):**
3. ⚠️ Verify all analytics endpoints work correctly
4. ⚠️ Test with different date ranges
5. ⚠️ Verify permissions are enforced

### **Phase 3 (Optional Enhancements):**
6. 🔄 Add email delivery of reports
7. 🔄 Add CSV/Excel export endpoints
8. 🔄 Add real-time dashboard updates (WebSocket)

---

## 📖 **Example API Calls**

### **Get Shift Report:**
```bash
GET /api/reports/shift/123
Authorization: Bearer {token}

Response: 200 OK
{
  "success": true,
  "data": { /* shift report data */ }
}
```

### **Get Day Report:**
```bash
GET /api/reports/day?storeId=1&date=2025-01-15
Authorization: Bearer {token}

Response: 200 OK
{
  "success": true,
  "data": { /* day report data */ }
}
```

### **Get Analytics Summary:**
```bash
GET /api/analytics/sales/summary?storeId=1&startDate=2025-01-01&endDate=2025-01-31
Authorization: Bearer {token}

Response: 200 OK
{
  "success": true,
  "data": {
    "totalSales": 150000.00,
    "transactionCount": 3500,
    "averageTicket": 42.86
  }
}
```

---

## ✅ **Summary**

**New Endpoints to Implement:** 2
- `GET /api/reports/shift/{shiftId}`
- `GET /api/reports/day`

**Existing Endpoints to Verify:** 5
- Sales summary ✓
- Cashier performance ✓
- Top products ✓
- Sales trends ✓
- Low stock alerts ✓

**Estimated Development Time:**
- Shift report endpoint: 4-6 hours
- Day report endpoint: 6-8 hours
- Testing & optimization: 4 hours
- **Total: ~2 days**

---

## 📬 **Questions?**

If the backend team has questions about:
- Data structures
- Business logic
- Performance requirements
- Security concerns

Please reach out with specific questions and we can clarify!

---

**Document Version:** 1.0  
**Last Updated:** 2025-01-15  
**Contact:** Frontend Team





