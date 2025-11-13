import type { RouteRecordRaw } from 'vue-router'

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    redirect: '/dashboard'
  },
  {
    path: '/auth',
    component: () => import('@/layouts/AuthLayout.vue'),
    children: [
      {
        path: 'login',
        name: 'Login',
        component: () => import('@/features/auth/views/LoginView.vue'),
        meta: { requiresAuth: false }
      },
      {
        path: 'signup',
        name: 'Signup',
        component: () => import('@/features/auth/views/SignupView.vue'),
        meta: { requiresAuth: false }
      },
      {
        path: 'forgot-password',
        name: 'ForgotPassword',
        component: () => import('@/features/auth/views/ForgotPasswordView.vue'),
        meta: { requiresAuth: false }
      },
      {
        path: 'reset-password',
        name: 'ResetPassword',
        component: () => import('@/features/auth/views/ResetPasswordView.vue'),
        meta: { requiresAuth: false }
      }
    ]
  },
  {
    path: '/dashboard',
    component: () => import('@/layouts/MainLayout.vue'),
    children: [
      {
        path: '',
        name: 'Dashboard',
        component: () => import('@/features/dashboard/views/DashboardView.vue'),
        meta: { requiresAuth: true }
      }
    ]
  },
  {
    path: '/pos',
    component: () => import('@/layouts/MainLayout.vue'),
    children: [
      {
        path: '',
        name: 'POS',
        component: () => import('@/features/pos/views/PosView.vue'),
        meta: { 
          requiresAuth: true,
          roles: ['SALES_STAFF', 'STORE_MANAGER', 'ADMIN', 'SUPER_ADMIN'],
          permissions: ['orders:create']
        }
      }
    ]
  },
  {
    path: '/products',
    component: () => import('@/layouts/MainLayout.vue'),
    children: [
      {
        path: '',
        name: 'Products',
        component: () => import('@/features/products/views/ProductsView.vue'),
        meta: { 
          requiresAuth: true,
          roles: ['INVENTORY_MANAGER', 'STORE_MANAGER', 'ADMIN', 'SUPER_ADMIN'],
          permissions: ['products:read']
        }
      }
    ]
  },
  {
    path: '/inventory',
    component: () => import('@/layouts/MainLayout.vue'),
    children: [
      {
        path: '',
        name: 'Inventory',
        component: () => import('@/features/inventory/views/InventoryView.vue'),
        meta: { 
          requiresAuth: true,
          roles: ['INVENTORY_MANAGER', 'STORE_MANAGER', 'ADMIN', 'SUPER_ADMIN', 'WAREHOUSE_STAFF'],
          permissions: ['inventory:read']
        }
      }
    ]
  },
  {
    path: '/purchases',
    component: () => import('@/layouts/MainLayout.vue'),
    children: [
      {
        path: '',
        name: 'Purchases',
        component: () => import('@/features/purchases/views/PurchasesView.vue'),
        meta: { 
          requiresAuth: true,
          roles: ['STORE_MANAGER', 'ADMIN', 'SUPER_ADMIN'],
          permissions: ['orders:read']
        }
      }
    ]
  },
  {
    path: '/customers',
    component: () => import('@/layouts/MainLayout.vue'),
    children: [
      {
        path: '',
        name: 'Customers',
        component: () => import('@/features/customers/views/CustomersView.vue'),
        meta: { 
          requiresAuth: true,
          roles: ['SALES_STAFF', 'STORE_MANAGER', 'ADMIN', 'SUPER_ADMIN', 'VIEWER'],
          permissions: ['customers:read']
        }
      }
    ]
  },
  {
    path: '/reports',
    component: () => import('@/layouts/MainLayout.vue'),
    children: [
      {
        path: '',
        name: 'Reports',
        component: () => import('@/features/reports/views/ReportsView.vue'),
        meta: { 
          requiresAuth: true,
          roles: ['STORE_MANAGER', 'ACCOUNTANT', 'ADMIN', 'SUPER_ADMIN'],
          permissions: ['reports:view']
        }
      }
    ]
  },
  {
    path: '/admin',
    component: () => import('@/layouts/MainLayout.vue'),
    children: [
      {
        path: '',
        name: 'Admin',
        component: () => import('@/features/admin/views/AdminView.vue'),
        meta: { 
          requiresAuth: true,
          roles: ['ADMIN', 'SUPER_ADMIN'],
          permissions: ['users:read']
        }
      },
      {
        path: 'users',
        name: 'Users',
        component: () => import('@/features/admin/views/UsersView.vue'),
        meta: {
          requiresAuth: true,
          roles: ['ADMIN', 'SUPER_ADMIN'],
          permissions: ['users:read']
        }
      }
    ]
  },
  {
    path: '/stores',
    component: () => import('@/layouts/MainLayout.vue'),
    children: [
      {
        path: '',
        name: 'Stores',
        component: () => import('@features/admin/views/StoresView.vue'),
        meta: {
          requiresAuth: true,
          roles: ['SUPER_ADMIN']
        }
      }
    ]
  },
  {
    path: '/:pathMatch(.*)*',
    redirect: '/dashboard'
  }
]

export default routes

