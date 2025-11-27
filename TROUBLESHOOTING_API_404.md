# Troubleshooting API 404 Errors

## Error: `POST http://localhost:8080/api/pos/cart 404 (Not Found)`

### Possible Causes:

1. **Backend Server Not Running**
   - Check if the backend Spring Boot application is running on port 8080
   - Verify by visiting: `http://localhost:8080/api/health`
   - Or check Swagger UI: `http://localhost:8080/swagger-ui.html`

2. **Backend Running on Different Port**
   - Check `Backend/allocat-erp-backend/allocat-api/src/main/resources/application.yml`
   - Default port should be 8080
   - Update `Frontend/src/environments/environment.ts` if port differs

3. **Authentication Token Missing**
   - POS endpoints require authentication (not in permitAll list)
   - Check browser DevTools → Network tab → Request Headers
   - Should see: `Authorization: Bearer <token>`
   - If missing, login again to get a fresh token

4. **CORS Issues**
   - Backend CORS is disabled (handled by gateway)
   - If using gateway, ensure it's running
   - Check browser console for CORS errors

5. **Endpoint Path Mismatch**
   - Frontend calls: `/pos/cart` (relative to baseURL)
   - BaseURL: `http://localhost:8080/api`
   - Full URL: `http://localhost:8080/api/pos/cart`
   - Backend expects: `/api/pos/cart` ✓ (matches)

### Quick Fixes:

1. **Start Backend Server:**
   ```bash
   cd Backend/allocat-erp-backend
   ./mvnw spring-boot:run
   # Or on Windows:
   mvnw.cmd spring-boot:run
   ```

2. **Verify Backend is Running:**
   ```bash
   # PowerShell
   Invoke-WebRequest -Uri "http://localhost:8080/api/health" -Method GET
   
   # Should return 200 OK
   ```

3. **Check Authentication:**
   - Open browser DevTools → Application → Local Storage
   - Look for `access_token` or `allocat_access_token`
   - If missing, login again

4. **Check Network Tab:**
   - Open DevTools → Network tab
   - Look at the failed request
   - Check:
     - Request URL (should be `http://localhost:8080/api/pos/cart`)
     - Request Headers (should have `Authorization: Bearer ...`)
     - Response Status (404 means endpoint not found)

### Debug Steps:

1. **Test Health Endpoint:**
   ```javascript
   // In browser console
   fetch('http://localhost:8080/api/health')
     .then(r => r.json())
     .then(console.log)
   ```

2. **Test with Authentication:**
   ```javascript
   // In browser console (after login)
   const token = localStorage.getItem('access_token') || localStorage.getItem('allocat_access_token')
   fetch('http://localhost:8080/api/pos/cart', {
     method: 'POST',
     headers: {
       'Content-Type': 'application/json',
       'Authorization': `Bearer ${token}`
     },
     body: JSON.stringify({ storeId: 1, cashierId: 1 })
   })
     .then(r => r.json())
     .then(console.log)
     .catch(console.error)
   ```

3. **Check Backend Logs:**
   - Look for startup messages
   - Check for controller registration: "Mapped {[/api/pos/cart]}"
   - Look for errors or exceptions

### Most Likely Issue:

Based on the error, the **backend server is probably not running** or **not accessible on port 8080**.

**Solution:** Start the backend server first, then try the frontend again.

