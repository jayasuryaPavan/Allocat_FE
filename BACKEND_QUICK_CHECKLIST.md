# Backend API Checklist - Quick Reference

## 🎯 **What Backend Needs to Do**

### **✅ Phase 1: New Endpoints (REQUIRED)**

#### **1. Shift Report**
```
GET /api/reports/shift/{shiftId}
```
**Returns:** Complete sales data for a single shift
- Employee name, shift times, duration
- Cash reconciliation (starting, ending, difference)
- All orders processed during shift
- Payment method breakdown
- Top products sold

**Estimated Time:** 4-6 hours

---

#### **2. Day Report**
```
GET /api/reports/day?storeId={id}&date={yyyy-mm-dd}
```
**Returns:** Aggregated data for entire business day
- All shifts summary
- Total daily sales & orders
- Hourly sales breakdown
- Employee performance rankings
- Payment method totals

**Estimated Time:** 6-8 hours

---

### **⚠️ Phase 2: Verify Existing (SHOULD WORK)**

These endpoints should already exist for the analytics system. Please verify they work correctly:

#### **3. Sales Summary**
```
GET /api/analytics/sales/summary?storeId={id}&startDate={date}&endDate={date}
```

#### **4. Cashier Performance**
```
GET /api/analytics/cashier/performance?storeId={id}&startDate={date}&endDate={date}
```

#### **5. Top Products**
```
GET /api/analytics/products/top-selling?storeId={id}&startDate={date}&endDate={date}&sortBy=revenue&limit=10
```

#### **6. Sales Trends**
```
GET /api/analytics/sales/trends?storeId={id}&startDate={date}&endDate={date}&periodType=daily
```

#### **7. Low Stock Alerts**
```
GET /api/analytics/products/low-stock?storeId={id}&threshold=10
```

---

## 📋 **Quick Implementation Guide**

### **Shift Report Logic:**
```sql
-- 1. Get shift details
SELECT * FROM shifts WHERE id = {shiftId};

-- 2. Get all orders for this shift
SELECT * FROM sales_orders 
WHERE cashier_id = {shift.user_id}
  AND order_date BETWEEN {shift.started_at} AND {shift.ended_at}
  AND status = 'COMPLETED';

-- 3. Calculate payment breakdown
SELECT 
  payment_type,
  SUM(amount) as total
FROM payments p
JOIN sales_orders o ON p.order_id = o.id
WHERE o.cashier_id = {shift.user_id}
  AND o.order_date BETWEEN {shift.started_at} AND {shift.ended_at}
GROUP BY payment_type;

-- 4. Top products during shift
SELECT 
  p.name,
  SUM(oi.quantity) as qty_sold,
  SUM(oi.total) as revenue
FROM order_items oi
JOIN products p ON oi.product_id = p.id
JOIN sales_orders o ON oi.order_id = o.id
WHERE o.cashier_id = {shift.user_id}
  AND o.order_date BETWEEN {shift.started_at} AND {shift.ended_at}
GROUP BY p.id
ORDER BY revenue DESC
LIMIT 10;
```

### **Day Report Logic:**
```sql
-- 1. Get all shifts for the day
SELECT * FROM shifts 
WHERE store_id = {storeId}
  AND DATE(shift_date) = {date};

-- 2. Get all orders for the day
SELECT * FROM sales_orders
WHERE store_id = {storeId}
  AND DATE(order_date) = {date}
  AND status = 'COMPLETED';

-- 3. Hourly breakdown
SELECT 
  HOUR(order_date) as hour,
  SUM(total) as sales,
  COUNT(*) as orders
FROM sales_orders
WHERE store_id = {storeId}
  AND DATE(order_date) = {date}
GROUP BY HOUR(order_date)
ORDER BY hour;

-- 4. Employee performance
SELECT 
  u.first_name || ' ' || u.last_name as name,
  SUM(o.total) as sales,
  COUNT(*) as orders,
  AVG(o.total) as avg_ticket
FROM sales_orders o
JOIN users u ON o.cashier_id = u.id
WHERE o.store_id = {storeId}
  AND DATE(o.order_date) = {date}
GROUP BY u.id
ORDER BY sales DESC;
```

---

## 🔒 **Security Checklist**

- [ ] Verify JWT token on all endpoints
- [ ] Check user has permission for the resource
- [ ] Managers can only see their store's data
- [ ] Employees can only see their own shift reports
- [ ] Return 403 if unauthorized
- [ ] Return 404 if resource not found

---

## 🧪 **Testing Checklist**

**Shift Report:**
- [ ] Test with active shift
- [ ] Test with completed shift
- [ ] Test with shift that has 0 orders
- [ ] Test cash difference calculation (positive/negative)
- [ ] Test unauthorized access (different employee)

**Day Report:**
- [ ] Test with multiple shifts
- [ ] Test with single shift
- [ ] Test with 0 shifts (should return empty)
- [ ] Test hourly breakdown
- [ ] Test employee rankings

**Analytics:**
- [ ] Test with different date ranges (1 day, 7 days, 30 days, 1 year)
- [ ] Test with empty date range (no sales)
- [ ] Test performance with large datasets

---

## 📊 **Sample Responses**

### **Shift Report (Simplified):**
```json
{
  "success": true,
  "data": {
    "shiftId": 123,
    "employeeName": "John Doe",
    "startTime": "09:00 AM",
    "endTime": "05:00 PM",
    "startingCash": 500.00,
    "endingCash": 2350.00,
    "expectedCash": 2350.00,
    "cashDifference": 0.00,
    "totalSales": 1850.00,
    "totalOrders": 45,
    "cashPayments": 1200.00,
    "cardPayments": 650.00,
    "orderItems": [ /* ... */ ],
    "topProducts": [ /* ... */ ]
  }
}
```

### **Day Report (Simplified):**
```json
{
  "success": true,
  "data": {
    "date": "2025-01-15",
    "storeName": "Main Store",
    "totalShifts": 3,
    "totalSales": 5230.00,
    "totalOrders": 125,
    "shifts": [ /* ... */ ],
    "hourlyBreakdown": [ /* ... */ ],
    "topProducts": [ /* ... */ ],
    "topEmployees": [ /* ... */ ]
  }
}
```

---

## ⏱️ **Estimated Timeline**

| Task | Time | Priority |
|------|------|----------|
| Implement Shift Report endpoint | 4-6 hours | HIGH |
| Implement Day Report endpoint | 6-8 hours | HIGH |
| Add database indexes | 1 hour | MEDIUM |
| Write tests | 4 hours | HIGH |
| Verify analytics endpoints | 2 hours | MEDIUM |
| Documentation | 1 hour | LOW |
| **TOTAL** | **~2 days** | |

---

## 🚀 **Next Steps**

1. **Backend Team:** Implement the 2 new endpoints
2. **Backend Team:** Verify the 5 analytics endpoints work
3. **Testing:** Run the test checklist
4. **Frontend Team:** Test integration once endpoints are ready
5. **Deploy:** Push to staging for testing
6. **Go Live:** Deploy to production

---

## 📞 **Need Help?**

For questions about:
- **Data structures:** See `BACKEND_API_REQUIREMENTS.md` (detailed specs)
- **Business logic:** See calculation examples above
- **Security:** Follow existing auth patterns
- **Performance:** Add indexes, consider caching

---

## ✅ **Summary**

**To Implement:** 2 new endpoints  
**To Verify:** 5 existing endpoints  
**Time Required:** ~2 days  
**Full Documentation:** See `BACKEND_API_REQUIREMENTS.md`

**That's it!** 🎉

