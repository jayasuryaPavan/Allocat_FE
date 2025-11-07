# Allocat Frontend - Comprehensive Features Documentation

## Table of Contents
1. [Project Overview](#project-overview)
2. [Technology Stack](#technology-stack)
3. [Core Architecture](#core-architecture)
4. [Feature Modules](#feature-modules)
5. [Authentication & Authorization](#authentication--authorization)
6. [Inventory Management](#inventory-management)
7. [User Management](#user-management)
8. [AI Assistant - InvenGadu](#ai-assistant---invengadu)
9. [Global Features](#global-features)
10. [Development Features](#development-features)

---

## Project Overview

**Allocat ERP Frontend** is a modern, enterprise-grade ERP (Enterprise Resource Planning) system built with Vue 3, TypeScript, and Tailwind CSS. It provides comprehensive business management capabilities including inventory management, point of sale (POS), user administration, reporting, and AI-powered inventory assistance.

### Key Characteristics
- **Modern Stack**: Vue 3 Composition API with TypeScript for type safety
- **Responsive Design**: Built with Tailwind CSS for mobile-first responsive layouts
- **Dark Mode Support**: Full dark mode implementation across all components
- **Role-Based Access Control (RBAC)**: Granular permission system with multiple user roles
- **Real-time Updates**: Live notifications and loading states
- **Internationalization Ready**: Multi-language support (English, Spanish)

---

## Technology Stack

### Core Technologies
- **Frontend Framework**: Vue 3 (Composition API)
- **Language**: TypeScript 5.2+
- **Styling**: Tailwind CSS 3.4
- **State Management**: Pinia 2.1
- **Routing**: Vue Router 4.2
- **HTTP Client**: Axios 1.6
- **Build Tool**: Vite 5.0

### Key Libraries
- **@heroicons/vue**: Icon library for UI components
- **@vueuse/core**: Utility composition functions
- **jwt-decode**: JWT token decoding
- **papaparse**: CSV file parsing
- **vue-i18n**: Internationalization

### Development Tools
- **Testing**: Vitest, Cypress
- **Linting**: ESLint with Vue and TypeScript plugins
- **Type Checking**: Vue TSC

---

## Core Architecture

### Project Structure

```
src/
├── assets/               # Static assets (images, icons, styles)
│   ├── i18n/            # Language translation files
│   ├── icons/           # Custom icon assets
│   ├── images/          # Image assets
│   └── styles/          # Global styles and SCSS variables
├── components/          # Reusable Vue components
├── core/                # Core application logic
│   ├── composables/     # Reusable composition functions
│   ├── services/        # API service layer
│   ├── stores/          # Pinia state management
│   ├── types/           # TypeScript type definitions
│   └── utils/           # Utility functions
├── environments/        # Environment configurations
├── features/            # Feature modules (domain-driven)
│   ├── admin/          # Administration features
│   ├── auth/           # Authentication features
│   ├── customers/      # Customer management
│   ├── dashboard/      # Dashboard and analytics
│   ├── inventory/      # Inventory management
│   ├── pos/            # Point of Sale
│   ├── products/       # Product management
│   ├── purchases/      # Purchase orders
│   └── reports/        # Business reports
├── layouts/             # Layout components
├── router/              # Vue Router configuration
└── main.ts             # Application entry point
```

### Architecture Patterns

1. **Feature-Based Organization**: Code organized by business domain rather than technical layer
2. **Composition API**: Leverages Vue 3's Composition API for better code reusability
3. **Service Layer Pattern**: Dedicated API services for clean separation of concerns
4. **Store Pattern**: Centralized state management with Pinia
5. **Type Safety**: Strong TypeScript typing throughout the application

---

## Feature Modules

### 1. Authentication & Authorization

#### Login System
- **Location**: `src/features/auth/views/LoginView.vue`
- **Features**:
  - Email/password authentication
  - JWT token-based authentication
  - Automatic token refresh mechanism
  - Remember me functionality
  - Development bypass mode for testing
  - Store code management

#### User Registration
- **Location**: `src/features/auth/views/SignupView.vue`
- **Features**:
  - New user registration
  - Email verification workflow
  - Form validation
  - Role assignment during registration

#### Password Management
- **Forgot Password**: `src/features/auth/views/ForgotPasswordView.vue`
  - Email-based password reset request
  - Password reset link generation
  
- **Reset Password**: `src/features/auth/views/ResetPasswordView.vue`
  - Secure password reset with token
  - Password strength validation
  - Confirmation matching

#### Authorization Features
- **Role-Based Access Control (RBAC)**:
  ```typescript
  - SUPER_ADMIN: Full system access
  - ADMIN: Store-level administration
  - STORE_MANAGER: Store operations management
  - INVENTORY_MANAGER: Inventory oversight
  - WAREHOUSE_STAFF: Stock handling
  - SALES_STAFF: POS and customer management
  - ACCOUNTANT: Financial reports and data
  - VIEWER: Read-only access
  ```

- **Permission System**:
  - Granular permissions (create, read, update, delete, export, import)
  - Resource-based permissions (users, products, inventory, etc.)
  - Route-level permission guards
  - Component-level permission checks

#### Token Management
- **Location**: `src/core/stores/auth.ts`
- **Features**:
  - Access token and refresh token management
  - Automatic token refresh 5 minutes before expiry
  - Secure token storage (localStorage)
  - Token expiration detection
  - Automatic logout on token expiry

#### Development Bypass
- **Feature**: Quick development mode login
- **Implementation**: 
  ```typescript
  environment.features.enableDevBypass = true
  ```
- **Benefits**: Skip authentication during development
- **Auto-login**: Creates mock super admin user

---

## User Management

### User Administration
- **Location**: `src/features/admin/views/UsersView.vue`

#### Features
1. **User Listing**
   - Display all users in the system
   - Sortable columns (name, email, role, status)
   - Status indicators (Active/Inactive)
   - Real-time data refresh

2. **User Creation**
   - Modal-based user creation form
   - Required fields:
     - First Name, Last Name
     - Username (unique)
     - Email (unique)
     - Password
     - Phone number
     - Role assignment
   - Automatic store code assignment from session
   - Role-based creation restrictions (ADMIN cannot create ADMIN users)

3. **Role Assignment**
   - Dynamic role dropdown based on current user's role
   - SUPER_ADMIN can create: All roles except SUPER_ADMIN
   - ADMIN can create: STORE_MANAGER, SALES_STAFF, INVENTORY_MANAGER, WAREHOUSE_STAFF, ACCOUNTANT, VIEWER

4. **User Details**
   - Full name display
   - Email address
   - Role information
   - Active status
   - Last login timestamp

### User Profile Management
- **Store Integration**: `src/core/stores/auth.ts`
- **Features**:
  - Profile updates
  - Password changes
  - User preferences management
  - Avatar generation (UI Avatars API)

---

## Inventory Management

### Overview
**Location**: `src/features/inventory/views/InventoryView.vue`

The inventory management system is the core feature of Allocat ERP, providing comprehensive stock tracking, CSV import capabilities, and real-time inventory monitoring.

### 1. Current Inventory Tracking

#### Dashboard Statistics
- **Total Items**: Overall inventory count
- **In Stock**: Items with available quantity
- **Low Stock**: Items below minimum threshold
- **Out of Stock**: Items with zero quantity

#### Inventory Table Features
- **Columns**:
  - Product name and description
  - SKU/Product code
  - Category
  - Current quantity
  - Unit price
  - Total value
  - Stock status badge

- **Search & Filter**:
  - Real-time search across products
  - Filter by name, SKU, category, location
  - Pagination (configurable items per page)

- **Status Indicators**:
  - 🟢 **In Stock**: Adequate quantity available
  - 🟡 **Low Stock**: Below minimum threshold
  - 🔴 **Out of Stock**: Zero quantity

### 2. CSV Import System

#### Components
- **CSVUpload**: `src/components/CSVUpload.vue`
  - Drag-and-drop file upload
  - File validation (CSV only)
  - File size checks
  - Parse preview

- **CSVDataPreview**: `src/components/CSVDataPreview.vue`
  - Table preview of CSV data
  - Column mapping
  - Data validation before import
  - Bulk import confirmation

#### CSV Import Flow
1. **Upload CSV File**
   - Click "Import CSV" button
   - Select or drag CSV file
   - File is parsed using PapaParse

2. **Preview Data**
   - Review parsed data in table format
   - Verify column mappings
   - Check for data errors

3. **Import Process**
   - Data converted to JSON format
   - Sent to backend API
   - Creates "Received Stock" entries
   - Automatic tab switch to Received Stock view

#### CSV Format Requirements
```csv
product_code,product_name,expected_quantity,unit_price,supplier_name,supplier_invoice,batch_number,notes
SKU001,Product Name,100,25.50,Supplier Inc,INV-123,BATCH-001,Optional notes
```

### 3. Received Stock Management

#### Component
**Location**: `src/components/ReceivedStockManager.vue`

#### Features
1. **Stock Verification Workflow**
   - List all pending received stock items
   - Display expected vs. received quantities
   - Verification form for each item
   - Accept/Reject actions

2. **Status Management**
   - **PENDING**: Awaiting verification
   - **VERIFIED**: Accepted and added to inventory
   - **REJECTED**: Not accepted
   - **PARTIAL**: Partially received
   - **DISCREPANCY**: Quantity mismatch detected

3. **Verification Process**
   - Input actual received quantity
   - Compare with expected quantity
   - Automatic discrepancy detection
   - Verify button to accept stock
   - Reject button for damaged/incorrect stock

4. **Stock Details**
   - Product information (code, name)
   - Quantity tracking (expected, received, verified)
   - Price information (unit price, total value)
   - Supplier details (name, invoice, batch number)
   - Verification metadata (verified by, date)

5. **Filters & Search**
   - Filter by status (All, Pending, Verified, Rejected, Partial, Discrepancy)
   - Search by product name, code, or supplier
   - Pagination support

### 4. Stock Discrepancies Manager

#### Component
**Location**: `src/components/StockDiscrepanciesManager.vue`

#### Features
1. **Discrepancy Detection**
   - Automatic detection when verified ≠ expected
   - Shortage quantity calculation
   - Value impact calculation

2. **Discrepancy Display**
   - Product identification
   - Quantity comparison table:
     - Expected quantity
     - Received quantity
     - Verified quantity
     - Shortage quantity
   - Notes section for investigation details

3. **Resolution Actions**
   - **Mark as Resolved**: Close discrepancy
   - **Investigate**: Open investigation workflow
   - Status tracking throughout resolution

4. **Summary Statistics**
   - Total number of discrepancies
   - Total shortage quantity
   - Total value impact (monetary)

### 5. Inventory API Services

#### Service Layer
**Location**: `src/core/services/inventoryApi.ts`

#### Available Methods
```typescript
// Current Inventory
- getCurrentInventory(): Get all inventory items
- getInventoryItem(id): Get single inventory item
- updateInventory(id, data): Update inventory quantities

// Received Stock
- getAllReceivedStock(): Get all received stock items
- getReceivedStockById(id): Get single received stock item
- uploadReceivedStockJson(data): Upload received stock via JSON
- verifyReceivedStock(id, verifiedQty, verifiedBy): Verify received stock

// Discrepancies
- getStockDiscrepancies(): Get all stock discrepancies
- resolveDiscrepancy(id): Mark discrepancy as resolved
```

### 6. Inventory Types

#### Type Definitions
**Location**: `src/core/types/inventory.ts`

```typescript
interface Inventory {
  id: number
  product?: Product
  currentQuantity: number
  minimumStockLevel?: number
  maximumStockLevel?: number
  unitCost: number
  totalValue: number
  location?: string
  lastStockCheck?: string
  createdAt: string
  updatedAt: string
}

interface ReceivedStock {
  id: number
  productCode: string
  productName: string
  expectedQuantity: number
  receivedQuantity: number
  verifiedQuantity: number
  unitPrice: number
  totalValue: number
  supplierName?: string
  supplierInvoice?: string
  batchNumber?: string
  status: string
  verifiedBy?: string
  verifiedDate?: string
  notes?: string
  createdAt: string
}

interface StockDiscrepancy {
  id: number
  productCode: string
  productName: string
  expectedQuantity: number
  receivedQuantity: number
  verifiedQuantity: number
  shortageQuantity?: number
  status: string
  notes?: string
  createdAt: string
}
```

---

## AI Assistant - InvenGadu

### Overview
**Location**: `src/components/InvenGaduChat.vue`

InvenGadu is an AI-powered inventory assistant that helps users manage and understand their inventory through natural language conversations.

### Features

#### 1. Chat Interface
- **Floating Chat Button**: Always accessible from any page
- **Chat Window**: Elegant sliding panel interface
- **Message History**: Conversation persistence
- **Typing Indicators**: Real-time response indicators
- **Auto-scroll**: Automatic scroll to latest messages

#### 2. AI Capabilities
- **Natural Language Queries**: Ask questions in plain English
- **Inventory Insights**: Get stock level information
- **Product Recommendations**: Restocking suggestions
- **Sales Trends**: Analyze sales patterns
- **Low Stock Alerts**: Proactive stock warnings

#### 3. Quick Suggestions
Pre-configured queries for common tasks:
- "Show low stock items"
- "What products need restocking?"
- "Inventory summary"
- "Sales trends"

#### 4. User Experience
- **Keyboard Shortcuts**:
  - `Cmd/Ctrl + K`: Toggle chat window
  - `Escape`: Close chat window
- **Message Formatting**:
  - User messages (blue, right-aligned)
  - Assistant messages (white/gray, left-aligned)
  - Timestamps on all messages
- **Error Handling**: Graceful error messages for API failures

#### 5. Integration
**Service Layer**: `src/core/services/invenGaduApi.ts`

```typescript
interface ChatMessage {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
}

interface ChatRequest {
  message: string
  conversationId?: string
}

interface ChatResponse {
  message: string
  conversationId: string
}
```

### Use Cases
1. **Stock Inquiry**: "How many units of Product X do we have?"
2. **Restock Suggestions**: "Which products should I reorder?"
3. **Sales Analysis**: "What were our top-selling items last month?"
4. **Inventory Reports**: "Generate a summary of low-stock items"
5. **Product Search**: "Find all products in Electronics category"

---

## Global Features

### 1. Dashboard
**Location**: `src/features/dashboard/views/DashboardView.vue`

#### Components
- **Statistics Cards**:
  - Total Sales ($45,231.89)
  - Orders (2,350)
  - Customers (1,234)
  - Products (567)

- **Sales Overview Chart**: Visual sales trend representation
- **Recent Activity Feed**: Real-time activity log
- **Quick Actions**: Fast navigation to common tasks

#### Quick Actions
1. **New Sale**: Navigate to POS
2. **Add Product**: Go to Products page
3. **Manage Inventory**: Open Inventory management
4. **View Reports**: Access business reports

### 2. Notification System

#### Component
**Location**: `src/core/stores/notification.ts`

#### Features
- **Notification Types**:
  - Success (green)
  - Error (red)
  - Warning (yellow)
  - Info (blue)

- **Display**:
  - Toast-style notifications
  - Top-right corner positioning
  - Auto-dismiss after 5 seconds
  - Manual dismiss option
  - Animated transitions

- **Usage**:
```typescript
const notificationStore = useNotificationStore()

notificationStore.success('Title', 'Message')
notificationStore.error('Error Title', 'Error Message')
notificationStore.warning('Warning', 'Warning message')
notificationStore.info('Info', 'Information')
```

### 3. Loading States

#### Global Loading Overlay
**Location**: `src/core/stores/loading.ts`

- Full-screen loading overlay
- Spinner animation
- Blocks user interaction during async operations
- Centralized loading state management

### 4. Theme System

#### Dark Mode Support
**Location**: `src/core/stores/theme.ts`

#### Features
- **Theme Modes**:
  - Light mode
  - Dark mode
  - Auto (system preference)

- **Implementation**:
  - Tailwind CSS dark mode classes
  - Persistent theme selection (localStorage)
  - Smooth theme transitions
  - System preference detection

### 5. Internationalization (i18n)

#### Language Support
**Location**: `src/assets/i18n/`

#### Supported Languages
- English (`en.json`)
- Spanish (`es.json`)

#### Features
- Dynamic language switching
- Translation key management
- Pluralization support
- Date/time localization
- Number formatting

### 6. Responsive Layout System

#### Main Layout
**Location**: `src/layouts/MainLayout.vue`

#### Components
- **Sidebar**: `src/layouts/components/Sidebar.vue`
  - Collapsible navigation
  - Role-based menu items
  - Active route highlighting
  - Mobile-friendly drawer

- **Header**: `src/layouts/components/Header.vue`
  - User profile dropdown
  - Notifications icon
  - Theme switcher
  - Breadcrumbs navigation

#### Auth Layout
**Location**: `src/layouts/AuthLayout.vue`
- Centered authentication forms
- Responsive design
- Background styling
- Logo placement

---

## Development Features

### 1. Development Bypass Mode

#### Configuration
**Location**: `src/environments/environment.dev.ts`

```typescript
export const environment = {
  production: false,
  development: true,
  apiUrl: 'http://localhost:8080/api/v1',
  features: {
    enableDevBypass: true,  // Set to true to enable
    enableMockData: false
  }
}
```

#### Benefits
- Skip login during development
- Auto-login as super admin
- Full system access
- Faster development iteration
- No backend dependency for frontend testing

#### Auto-login User Details
```typescript
{
  id: 'dev-user-001',
  email: 'surya@allocat.com',
  firstName: 'Surya',
  lastName: 'Akula',
  role: 'admin',
  permissions: ['*:*']  // All permissions
}
```

### 2. Environment Configuration

#### Multiple Environments
- **Development**: `environment.dev.ts`
- **Staging**: `environment.staging.ts`
- **Production**: `environment.prod.ts`

#### Configuration Options
```typescript
interface Environment {
  production: boolean
  development: boolean
  apiUrl: string
  features: {
    enableDevBypass: boolean
    enableMockData: boolean
    enableAnalytics: boolean
    enableErrorReporting: boolean
  }
}
```

### 3. API Service Layer

#### Base API Service
**Location**: `src/core/services/api.ts`

#### Features
- Axios instance configuration
- Request/response interceptors
- Automatic token injection
- Error handling
- Response transformation
- API response wrapper:
  ```typescript
  interface ApiResponse<T> {
    success: boolean
    data: T
    message?: string
    error?: string
  }
  ```

### 4. Composables (Reusable Logic)

#### Available Composables
**Location**: `src/core/composables/`

1. **useCurrency.ts**
   - Currency formatting
   - Multi-currency support
   - Locale-aware formatting

2. **useDate.ts**
   - Date formatting
   - Relative time display
   - Timezone handling

3. **useString.ts**
   - String manipulation utilities
   - Truncation
   - Sanitization
   - Case conversion

### 5. Utility Functions

#### CSV Parser
**Location**: `src/core/utils/csvParser.ts`
- CSV to JSON conversion
- Header validation
- Data type inference
- Error handling

#### Date Utilities
**Location**: `src/core/utils/date.ts`
- Format dates consistently
- Parse various date formats
- Date range calculations

#### String Utilities
**Location**: `src/core/utils/string.ts`
- Slug generation
- Email validation
- Phone number formatting
- String sanitization

---

## Routing & Navigation

### Route Configuration
**Location**: `src/router/index.ts`

### Route Guards

#### Authentication Guard
```typescript
router.beforeEach((to, from, next) => {
  const authStore = useAuthStore()
  
  if (to.meta.requiresAuth && !authStore.isLoggedIn) {
    next('/auth/login')
  } else {
    next()
  }
})
```

#### Permission Guard
```typescript
// Check roles
if (to.meta.roles && !authStore.hasAnyRole(to.meta.roles)) {
  next('/dashboard')
  return
}

// Check permissions
if (to.meta.permissions && !authStore.hasAnyPermissions(to.meta.permissions)) {
  next('/dashboard')
  return
}
```

### Available Routes

#### Public Routes
- `/auth/login` - Login page
- `/auth/signup` - Registration page
- `/auth/forgot-password` - Password recovery
- `/auth/reset-password` - Password reset

#### Protected Routes
- `/dashboard` - Main dashboard
- `/pos` - Point of Sale (SALES_STAFF+)
- `/products` - Product management (INVENTORY_MANAGER+)
- `/inventory` - Inventory management (INVENTORY_MANAGER+)
- `/purchases` - Purchase orders (STORE_MANAGER+)
- `/customers` - Customer management (SALES_STAFF+)
- `/reports` - Business reports (ACCOUNTANT+)
- `/admin` - Admin panel (ADMIN+)
- `/admin/users` - User management (ADMIN+)
- `/stores` - Store management (SUPER_ADMIN only)

---

## TypeScript Type System

### Type Organization
**Location**: `src/core/types/`

### Key Type Definitions

#### User Types
**File**: `user.ts`
```typescript
interface User {
  id: string
  email: string
  firstName: string
  lastName: string
  fullName: string
  avatar?: string
  phone?: string
  role?: Role
  permissions: Permission[]
  isActive: boolean
  isEmailVerified: boolean
  lastLoginAt?: string
  createdAt: string
  updatedAt: string
}

interface Role {
  id: string
  name: string
  displayName: string
  permissions: Permission[]
}

interface Permission {
  id: string
  resource: string
  action: string
}
```

#### API Types
**File**: `api.ts`
```typescript
interface ApiResponse<T = any> {
  success: boolean
  data: T
  message?: string
  error?: string
  timestamp?: string
}

interface PaginatedResponse<T> {
  content: T[]
  page: number
  size: number
  totalElements: number
  totalPages: number
}
```

#### Inventory Types
**File**: `inventory.ts`
- `Inventory`: Current stock items
- `ReceivedStock`: Incoming stock items
- `StockDiscrepancy`: Stock mismatches
- `Product`: Product information
- `CSVInventoryData`: CSV import data structure

#### Enum Types
**File**: `enums.ts`
- 50+ enums for type safety
- User statuses, roles, permissions
- Product and inventory statuses
- Payment methods and transaction types
- Report types and formats
- System-wide constants

---

## Styling & UI Components

### Design System

#### Tailwind Configuration
**Location**: `tailwind.config.js`

#### Plugins
- `@tailwindcss/forms` - Form styling
- `@tailwindcss/typography` - Rich text formatting
- `@tailwindcss/aspect-ratio` - Aspect ratio utilities

#### Color Palette
- **Primary**: Blue (blue-600)
- **Success**: Green (green-600)
- **Warning**: Yellow (yellow-600)
- **Error**: Red (red-600)
- **Info**: Blue (blue-400)

#### Dark Mode Colors
- Automatic color adaptation
- Dark backgrounds (gray-800, gray-900)
- Lighter text in dark mode
- Border color adjustments

### Component Library

#### Reusable Components
1. **CSVUpload**: File upload with drag-and-drop
2. **CSVDataPreview**: Data table with preview
3. **InvenGaduChat**: AI chat interface
4. **ReceivedStockManager**: Stock verification UI
5. **StockDiscrepanciesManager**: Discrepancy resolution

#### Icon System
- **Heroicons**: Primary icon library
- **SVG Icons**: Custom icons where needed
- **Consistent sizing**: 5 predefined sizes (xs, sm, md, lg, xl)

---

## State Management

### Pinia Stores
**Location**: `src/core/stores/`

### Available Stores

#### 1. Auth Store
**File**: `auth.ts`
- User authentication state
- Token management
- User profile
- Permission checking
- Role validation

#### 2. Notification Store
**File**: `notification.ts`
- Notification queue
- Display duration management
- Notification removal
- Type-specific notifications

#### 3. Loading Store
**File**: `loading.ts`
- Global loading state
- Loading counter (for nested loading states)
- Start/stop loading

#### 4. Theme Store
**File**: `theme.ts`
- Current theme mode
- Theme persistence
- System preference detection
- Theme toggle

---

## API Integration

### API Service Architecture

#### Base Configuration
- **Base URL**: Configurable per environment
- **Timeout**: 30 seconds
- **Headers**: JSON content type, Authorization bearer token

#### Interceptors

##### Request Interceptor
- Inject authentication token
- Add custom headers
- Log requests (dev mode)

##### Response Interceptor
- Handle 401 (unauthorized) - auto logout
- Handle 403 (forbidden) - redirect to dashboard
- Handle 500 (server error) - show error notification
- Transform response data

#### Available Services

1. **API Service** (`api.ts`): Base HTTP client
2. **Inventory API** (`inventoryApi.ts`): Inventory operations
3. **Users API** (`usersApi.ts`): User management
4. **Stores API** (`storesApi.ts`): Store management
5. **InvenGadu API** (`invenGaduApi.ts`): AI chat service

---

## Testing Strategy

### Test Structure
**Location**: `tests/`

### Test Types

#### 1. Unit Tests
**Location**: `tests/unit/`
- Component logic testing
- Utility function testing
- Store action testing
- Composable testing

#### 2. Integration Tests
**Location**: `tests/integration/`
- API service integration
- Component integration
- Store integration with API

#### 3. E2E Tests
**Location**: `tests/e2e/`
- Full user workflows
- Critical path testing
- Cross-browser testing

### Testing Tools
- **Vitest**: Unit and integration testing
- **Cypress**: End-to-end testing
- **@vue/test-utils**: Vue component testing

---

## Build & Deployment

### Build Scripts

```json
{
  "dev": "vite",                           // Development server
  "build": "vite build",                   // Production build
  "build:staging": "vite build --mode staging",  // Staging build
  "build:prod": "vite build --mode production",  // Production build
  "preview": "vite preview",               // Preview production build
  "test": "vitest",                        // Run unit tests
  "test:coverage": "vitest --coverage",    // Test coverage report
  "test:e2e": "cypress run",              // Run E2E tests
  "lint": "eslint . --ext .vue,.js,.ts",  // Lint code
  "type-check": "vue-tsc --noEmit"        // Type checking
}
```

### Build Optimization

#### Production Build Features
- Tree-shaking for smaller bundle size
- Code splitting by route
- Minification and compression
- Asset optimization
- Source maps generation

#### Performance
- Lazy loading for routes
- Component lazy loading
- Image optimization
- CSS purging with Tailwind

---

## Security Features

### 1. Authentication Security
- JWT token-based authentication
- Secure token storage
- Automatic token refresh
- Token expiration handling
- HTTPS enforcement (production)

### 2. Authorization Security
- Role-based access control (RBAC)
- Permission-based access control
- Route guards
- Component-level permission checks
- API endpoint authorization

### 3. Data Security
- Input validation
- XSS prevention
- CSRF token support (API level)
- Secure password handling
- Sensitive data encryption (API level)

### 4. API Security
- Request rate limiting (API level)
- API key authentication
- CORS configuration
- Request validation
- Response sanitization

---

## Best Practices Implemented

### Code Quality
1. **TypeScript**: Full type safety across the application
2. **ESLint**: Consistent code style enforcement
3. **Component Composition**: Reusable, modular components
4. **Single Responsibility**: Each component/service has one clear purpose
5. **DRY Principle**: Avoid code duplication with composables and utilities

### Performance
1. **Lazy Loading**: Route and component lazy loading
2. **Virtual Scrolling**: For large lists (planned)
3. **Debouncing**: Search inputs and API calls
4. **Caching**: API response caching where appropriate
5. **Code Splitting**: Optimize bundle size

### User Experience
1. **Responsive Design**: Mobile-first approach
2. **Loading States**: Clear feedback for async operations
3. **Error Handling**: User-friendly error messages
4. **Keyboard Shortcuts**: Power user features
5. **Accessibility**: ARIA labels and semantic HTML

### Maintainability
1. **Feature Organization**: Domain-driven file structure
2. **Documentation**: Inline comments and type documentation
3. **Consistent Naming**: Clear, descriptive variable/function names
4. **Version Control**: Git with meaningful commit messages
5. **Code Reviews**: Pull request workflow

---

## Future Enhancements

### Planned Features
1. **Advanced Reporting**: Custom report builder
2. **Data Visualization**: Charts and graphs for analytics
3. **Offline Support**: Progressive Web App (PWA) capabilities
4. **Real-time Updates**: WebSocket integration
5. **Bulk Operations**: Multi-item actions
6. **Export Functionality**: PDF, Excel exports for reports
7. **Mobile App**: React Native mobile application
8. **Advanced Search**: Elasticsearch integration
9. **Audit Logging**: Comprehensive audit trail
10. **Two-Factor Authentication**: Enhanced security

### Technical Improvements
1. **Performance Monitoring**: Integrate Sentry or similar
2. **Analytics**: Google Analytics integration
3. **A/B Testing**: Feature flag system
4. **Automated Testing**: Increase test coverage
5. **CI/CD Pipeline**: Automated deployment pipeline
6. **Documentation**: Comprehensive user and developer docs
7. **Storybook**: Component documentation
8. **Performance Optimization**: Bundle size reduction
9. **Accessibility Audit**: WCAG 2.1 AA compliance
10. **Internationalization**: Support for more languages

---

## Getting Started

### Prerequisites
- Node.js 18.0.0 or higher
- npm 8.0.0 or higher
- Backend API running (or use dev bypass mode)

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd Frontend

# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

### Environment Setup

Create `.env` files for each environment:

```env
# .env.development
VITE_API_URL=http://localhost:8080/api/v1
VITE_ENABLE_DEV_BYPASS=true

# .env.production
VITE_API_URL=https://api.allocat.com/api/v1
VITE_ENABLE_DEV_BYPASS=false
```

### Development Mode

Enable development bypass for faster development:

1. Open `src/environments/environment.dev.ts`
2. Set `enableDevBypass: true`
3. Restart development server
4. Application will auto-login with mock admin user

---

## Support & Documentation

### Resources
- **Project Repository**: [GitHub Repository URL]
- **API Documentation**: [Backend API Docs URL]
- **Design System**: [Figma/Design URL]
- **Issue Tracker**: [GitHub Issues URL]

### Contact
- **Developer**: Surya Akula (surya@allocat.com)
- **Team**: Allocat Development Team
- **Support**: support@allocat.com

---

## License

[Specify License Here]

---

## Changelog

### Version 1.0.0 (Current)
- Initial release
- Complete authentication system
- Inventory management with CSV import
- User administration
- AI-powered inventory assistant (InvenGadu)
- Dashboard and analytics
- Dark mode support
- Multi-language support (EN, ES)
- Responsive design
- Role-based access control

---

**Document Version**: 1.0  
**Last Updated**: November 5, 2025  
**Author**: Surya Akula Jaya


