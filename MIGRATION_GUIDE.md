# Angular to Vue 3 Migration Guide

This document outlines the migration from Angular to Vue 3 for the Allocat ERP Frontend application.

## 🔄 Migration Overview

The application has been completely migrated from Angular 18 to Vue 3 with the following key changes:

### Architecture Changes

| Angular | Vue 3 | Description |
|---------|-------|-------------|
| Angular CLI | Vite | Build tool and development server |
| Angular Modules | Vue Components | Component-based architecture |
| Angular Services | Pinia Stores | State management |
| Angular Router | Vue Router 4 | Client-side routing |
| RxJS | Vue Reactivity | Reactive state management |
| Angular Forms | Vue Form Handling | Form management |
| Angular Guards | Vue Router Guards | Route protection |

### Technology Stack

| Category | Angular | Vue 3 |
|----------|---------|-------|
| Framework | Angular 18 | Vue 3.4 |
| State Management | RxJS + Services | Pinia |
| Routing | Angular Router | Vue Router 4 |
| Styling | Angular Material + SCSS | Tailwind CSS |
| Build Tool | Angular CLI | Vite |
| Testing | Jasmine + Karma | Vitest + Cypress |
| TypeScript | ✅ | ✅ |

## 📁 File Structure Changes

### Before (Angular)
```
src/
├── app/
│   ├── core/
│   │   ├── services/
│   │   ├── guards/
│   │   └── interceptors/
│   ├── features/
│   ├── layouts/
│   └── shared/
├── assets/
└── environments/
```

### After (Vue 3)
```
src/
├── core/
│   ├── stores/        # Pinia stores (replaces services)
│   ├── services/      # API services
│   └── types/         # TypeScript types
├── features/          # Feature modules (Vue components)
├── layouts/           # Layout components
├── router/            # Vue Router configuration
├── assets/
└── environments/
```

## 🔧 Configuration Changes

### Package.json
- **Removed**: Angular dependencies (`@angular/*`, `rxjs`, `zone.js`)
- **Added**: Vue 3 dependencies (`vue`, `vue-router`, `pinia`, `vite`)

### Build Configuration
- **Removed**: `angular.json`, `karma.conf.js`
- **Added**: `vite.config.ts`, `tailwind.config.js`

### TypeScript Configuration
- **Updated**: `tsconfig.json` for Vue 3 and Vite
- **Removed**: `tsconfig.app.json`, `tsconfig.spec.json`

## 🏗️ Component Migration

### Angular Components → Vue 3 Components

#### Before (Angular)
```typescript
@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  @Input() data: any;
  @Output() event = new EventEmitter();
  
  ngOnInit() {
    // Component logic
  }
}
```

#### After (Vue 3)
```vue
<template>
  <div>
    <!-- Template content -->
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'

interface Props {
  data: any
}

defineProps<Props>()
defineEmits<{
  event: []
}>()

onMounted(() => {
  // Component logic
})
</script>
```

## 🔄 Service Migration

### Angular Services → Pinia Stores

#### Before (Angular Service)
```typescript
@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();
  
  login(credentials: LoginCredentials): Observable<User> {
    // Login logic
  }
}
```

#### After (Pinia Store)
```typescript
export const useAuthStore = defineStore('auth', () => {
  const currentUser = ref<User | null>(null)
  
  const login = async (credentials: LoginCredentials): Promise<User> => {
    // Login logic
  }
  
  return {
    currentUser: readonly(currentUser),
    login
  }
})
```

## 🛣️ Routing Migration

### Angular Router → Vue Router

#### Before (Angular)
```typescript
const routes: Routes = [
  {
    path: 'dashboard',
    component: DashboardComponent,
    canActivate: [AuthGuard]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
```

#### After (Vue Router)
```typescript
const routes: RouteRecordRaw[] = [
  {
    path: '/dashboard',
    component: () => import('@/features/dashboard/views/DashboardView.vue'),
    meta: { requiresAuth: true }
  }
]

export default routes
```

## 🎨 Styling Migration

### Angular Material + SCSS → Tailwind CSS

#### Before (Angular Material)
```html
<mat-card>
  <mat-card-header>
    <mat-card-title>Dashboard</mat-card-title>
  </mat-card-header>
  <mat-card-content>
    Content here
  </mat-card-content>
</mat-card>
```

#### After (Tailwind CSS)
```html
<div class="bg-white shadow rounded-lg">
  <div class="px-4 py-5 sm:p-6">
    <h3 class="text-lg font-medium text-gray-900">Dashboard</h3>
    <div class="mt-2">
      Content here
    </div>
  </div>
</div>
```

## 🔐 Authentication Migration

### Angular Guards → Vue Router Guards

#### Before (Angular Guard)
```typescript
@Injectable()
export class AuthGuard implements CanActivate {
  canActivate(route: ActivatedRouteSnapshot): boolean {
    return this.authService.isAuthenticated();
  }
}
```

#### After (Vue Router Guard)
```typescript
router.beforeEach((to, from, next) => {
  const requiresAuth = to.matched.some(record => record.meta.requiresAuth)
  
  if (requiresAuth && !authStore.isAuthenticated) {
    next('/auth/login')
  } else {
    next()
  }
})
```

## 📊 State Management Migration

### RxJS → Vue Reactivity

#### Before (RxJS)
```typescript
// Service
private dataSubject = new BehaviorSubject<any[]>([]);
public data$ = this.dataSubject.asObservable();

// Component
ngOnInit() {
  this.dataService.data$.subscribe(data => {
    this.data = data;
  });
}
```

#### After (Vue Reactivity)
```typescript
// Store
const data = ref<any[]>([])

// Component
const dataStore = useDataStore()
const data = computed(() => dataStore.data)
```

## 🧪 Testing Migration

### Jasmine + Karma → Vitest + Cypress

#### Before (Jasmine)
```typescript
describe('DashboardComponent', () => {
  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
```

#### After (Vitest)
```typescript
import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import DashboardView from '@/features/dashboard/views/DashboardView.vue'

describe('DashboardView', () => {
  it('should render', () => {
    const wrapper = mount(DashboardView)
    expect(wrapper.exists()).toBe(true)
  })
})
```

## 🚀 Development Workflow Changes

### Scripts

| Angular | Vue 3 | Description |
|---------|-------|-------------|
| `ng serve` | `npm run dev` | Development server |
| `ng build` | `npm run build` | Production build |
| `ng test` | `npm run test` | Unit tests |
| `ng e2e` | `npm run test:e2e` | E2E tests |

### Development Server
- **Angular**: `http://localhost:4200` (Angular CLI)
- **Vue 3**: `http://localhost:4200` (Vite)

## 📦 Dependencies Migration

### Removed Dependencies
```json
{
  "@angular/animations": "^18.2.14",
  "@angular/common": "^18.2.14",
  "@angular/compiler": "^18.2.14",
  "@angular/core": "^18.2.14",
  "@angular/forms": "^18.2.14",
  "@angular/platform-browser": "^18.2.14",
  "@angular/platform-browser-dynamic": "^18.2.14",
  "@angular/router": "^18.2.14",
  "@angular/service-worker": "^18.2.14",
  "@angular-devkit/build-angular": "^18.2.14",
  "@angular/cli": "^18.2.14",
  "@angular/compiler-cli": "^18.2.14",
  "rxjs": "~7.8.1",
  "zone.js": "~0.14.10"
}
```

### Added Dependencies
```json
{
  "vue": "^3.4.0",
  "vue-router": "^4.2.5",
  "pinia": "^2.1.7",
  "axios": "^1.6.2",
  "jwt-decode": "^4.0.0",
  "@vueuse/core": "^10.5.0",
  "@vueuse/head": "^2.0.0",
  "vue-i18n": "^9.8.0",
  "tailwindcss": "^3.4.0",
  "@vitejs/plugin-vue": "^4.5.2",
  "vite": "^5.0.8"
}
```

## 🔧 Configuration Files

### Removed Files
- `angular.json`
- `karma.conf.js`
- `cypress.config.ts` (old)
- `tsconfig.app.json`
- `tsconfig.spec.json`

### Added Files
- `vite.config.ts`
- `tailwind.config.js`
- `cypress.config.ts` (new)
- `vitest.config.ts`

## 🎯 Benefits of Migration

### Performance
- **Faster build times** with Vite
- **Smaller bundle size** with tree-shaking
- **Better development experience** with HMR

### Developer Experience
- **Simpler syntax** with Composition API
- **Better TypeScript support**
- **Modern tooling** with Vite

### Maintainability
- **Cleaner code structure**
- **Better separation of concerns**
- **Easier testing** with Vitest

## 🚨 Breaking Changes

### Component API
- **No more Angular decorators** (`@Component`, `@Input`, `@Output`)
- **No more lifecycle hooks** (`ngOnInit`, `ngOnDestroy`)
- **No more dependency injection** (constructor injection)

### State Management
- **No more RxJS observables**
- **No more Angular services**
- **No more zone.js**

### Styling
- **No more Angular Material**
- **No more SCSS modules**
- **No more CSS encapsulation**

## 📚 Learning Resources

### Vue 3
- [Vue 3 Documentation](https://vuejs.org/)
- [Composition API Guide](https://vuejs.org/guide/extras/composition-api-faq.html)
- [Vue Router 4](https://router.vuejs.org/)

### Pinia
- [Pinia Documentation](https://pinia.vuejs.org/)
- [State Management Guide](https://pinia.vuejs.org/introduction.html)

### Vite
- [Vite Documentation](https://vitejs.dev/)
- [Vue Plugin](https://github.com/vitejs/vite/tree/main/packages/plugin-vue)

### Tailwind CSS
- [Tailwind CSS Documentation](https://tailwindcss.com/)
- [Vue Integration](https://tailwindcss.com/docs/guides/vite)

## 🎉 Migration Complete!

The Angular to Vue 3 migration is now complete. The application maintains all the original functionality while benefiting from:

- **Modern Vue 3 architecture**
- **Better performance**
- **Improved developer experience**
- **Future-proof technology stack**

For any questions or issues, please refer to the documentation or contact the development team.