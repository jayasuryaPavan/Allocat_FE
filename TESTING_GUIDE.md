# Frontend Unit Testing Guide

Complete walkthrough of the testing setup and how to write tests for the Allocat ERP Frontend.

## Table of Contents

1. [Testing Stack](#testing-stack)
2. [Project Structure](#project-structure)
3. [Configuration](#configuration)
4. [Writing Tests](#writing-tests)
5. [Running Tests](#running-tests)
6. [Best Practices](#best-practices)
7. [Examples](#examples)

---

## Testing Stack

### Core Technologies

- **Vitest** (v1.0.4) - Fast unit test framework, Vite-native
- **@vue/test-utils** (v2.4.3) - Official Vue 3 testing utilities
- **jsdom** (v23.0.1) - DOM simulation for browser-like environment
- **@testing-library/user-event** (optional) - User interaction simulation

### Why Vitest?

- ✅ Native Vite integration (no separate build step)
- ✅ Fast execution with ESM support
- ✅ Jest-compatible API (easy migration)
- ✅ Built-in coverage support
- ✅ TypeScript support out of the box
- ✅ Watch mode for TDD

---

## Project Structure

```
Frontend/
├── tests/
│   ├── setup.ts                 # Global test setup
│   ├── utils/
│   │   ├── testUtils.ts        # Test helper functions
│   │   └── mocks.ts            # Mock data and functions
│   ├── unit/
│   │   ├── components/         # Component tests
│   │   ├── services/           # Service/API tests
│   │   ├── stores/             # Pinia store tests
│   │   └── utils/              # Utility function tests
│   ├── integration/            # Integration tests
│   └── e2e/                    # E2E tests (Cypress)
├── vitest.config.ts            # Vitest configuration
└── package.json
```

---

## Configuration

### Vitest Config (`vitest.config.ts`)

```typescript
export default defineConfig({
  test: {
    environment: 'jsdom',        // Browser-like environment
    setupFiles: ['./tests/setup.ts'],
    include: ['**/*.{test,spec}.{ts,js}'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'html', 'lcov'],
      thresholds: {
        lines: 70,
        functions: 70,
        branches: 70,
        statements: 70
      }
    }
  }
})
```

### Test Setup (`tests/setup.ts`)

- Configures Pinia for state management
- Sets up global mocks (localStorage, window APIs)
- Configures Vue Test Utils
- Cleans up after each test

---

## Writing Tests

### Test File Naming

- `*.test.ts` or `*.spec.ts` - Unit tests
- Place tests next to source files or in `tests/unit/` directory

### Basic Test Structure

```typescript
import { describe, it, expect, beforeEach, vi } from 'vitest'

describe('Component/Service/Store Name', () => {
  beforeEach(() => {
    // Setup before each test
  })

  it('should do something', () => {
    // Test implementation
    expect(true).toBe(true)
  })
})
```

### Testing Components

```typescript
import { mount } from '@vue/test-utils'
import MyComponent from '@/components/MyComponent.vue'

describe('MyComponent', () => {
  it('should render correctly', () => {
    const wrapper = mount(MyComponent, {
      props: { title: 'Test' }
    })
    
    expect(wrapper.text()).toContain('Test')
  })
})
```

### Testing Services

```typescript
import { describe, it, expect, vi } from 'vitest'
import { myService } from '@/services/myService'

describe('MyService', () => {
  it('should fetch data', async () => {
    const mockData = { id: 1, name: 'Test' }
    vi.spyOn(myService, 'fetch').mockResolvedValue(mockData)
    
    const result = await myService.fetch()
    expect(result).toEqual(mockData)
  })
})
```

### Testing Stores (Pinia)

```typescript
import { setActivePinia, createPinia } from 'pinia'
import { useMyStore } from '@/stores/myStore'

describe('MyStore', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  it('should update state', () => {
    const store = useMyStore()
    store.setValue('test')
    expect(store.value).toBe('test')
  })
})
```

---

## Running Tests

### Commands

```bash
# Run all tests
npm run test

# Run tests in watch mode (TDD)
npm run test -- --watch

# Run tests with coverage
npm run test:coverage

# Run specific test file
npm run test -- CustomerSelector.test.ts

# Run tests matching pattern
npm run test -- --grep "createCart"

# Run tests in UI mode
npm run test -- --ui
```

### Watch Mode

```bash
npm run test -- --watch
```

Options:
- `a` - Run all tests
- `f` - Run only failed tests
- `p` - Filter by filename pattern
- `t` - Filter by test name pattern
- `q` - Quit watch mode

---

## Best Practices

### 1. Test Organization

- **Arrange-Act-Assert (AAA)** pattern
- One assertion per test (when possible)
- Descriptive test names
- Group related tests with `describe` blocks

```typescript
describe('UserService', () => {
  describe('login', () => {
    it('should authenticate user with valid credentials', () => {
      // Arrange
      const credentials = { username: 'user', password: 'pass' }
      
      // Act
      const result = userService.login(credentials)
      
      // Assert
      expect(result.success).toBe(true)
    })
  })
})
```

### 2. Mocking

- Mock external dependencies (API calls, localStorage, etc.)
- Use `vi.mock()` for module mocking
- Use `vi.spyOn()` for function spying
- Reset mocks in `beforeEach`

```typescript
vi.mock('@/services/api', () => ({
  useApiService: () => mockApiService
}))
```

### 3. Async Testing

- Always `await` async operations
- Use `waitFor` for DOM updates
- Handle promises correctly

```typescript
it('should load data asynchronously', async () => {
  const wrapper = mount(MyComponent)
  await wrapper.vm.$nextTick()
  
  expect(wrapper.find('.data').exists()).toBe(true)
})
```

### 4. Component Testing

- Test user interactions, not implementation
- Use `data-testid` attributes for stable selectors
- Test props, events, and slots
- Avoid testing internal state

```typescript
it('should emit event on button click', async () => {
  const wrapper = mount(MyComponent)
  await wrapper.find('[data-testid="submit"]').trigger('click')
  
  expect(wrapper.emitted('submit')).toBeTruthy()
})
```

### 5. Coverage Goals

- **Lines**: 70%+
- **Functions**: 70%+
- **Branches**: 70%+
- **Statements**: 70%+

Focus on:
- ✅ Critical business logic
- ✅ User-facing features
- ✅ Error handling
- ❌ Don't test third-party libraries
- ❌ Don't test implementation details

---

## Examples

### Example 1: Component Test

```typescript
// tests/unit/components/Button.test.ts
import { mount } from '@vue/test-utils'
import Button from '@/components/Button.vue'

describe('Button', () => {
  it('should render with label', () => {
    const wrapper = mount(Button, {
      props: { label: 'Click me' }
    })
    expect(wrapper.text()).toBe('Click me')
  })

  it('should emit click event', async () => {
    const wrapper = mount(Button)
    await wrapper.trigger('click')
    expect(wrapper.emitted('click')).toBeTruthy()
  })
})
```

### Example 2: Service Test

```typescript
// tests/unit/services/productsApi.test.ts
import { describe, it, expect, vi } from 'vitest'
import { productsApiService } from '@/core/services/productsApi'

vi.mock('@/core/services/api')

describe('ProductsApiService', () => {
  it('should fetch products', async () => {
    const mockProducts = [{ id: 1, name: 'Product 1' }]
    // Mock implementation
    const result = await productsApiService.getAllProducts()
    expect(result.success).toBe(true)
  })
})
```

### Example 3: Store Test

```typescript
// tests/unit/stores/authStore.test.ts
import { setActivePinia, createPinia } from 'pinia'
import { useAuthStore } from '@/core/stores/auth'

describe('AuthStore', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  it('should login user', async () => {
    const store = useAuthStore()
    await store.login({ username: 'user', password: 'pass' })
    expect(store.isAuthenticated).toBe(true)
  })
})
```

---

## Common Patterns

### Testing API Calls

```typescript
it('should handle API errors', async () => {
  mockApiService.get.mockRejectedValue({
    response: { status: 500, data: { message: 'Error' } }
  })
  
  await expect(service.fetchData()).rejects.toThrow()
})
```

### Testing Form Submissions

```typescript
it('should submit form', async () => {
  const wrapper = mount(MyForm)
  const input = wrapper.find('input')
  const form = wrapper.find('form')
  
  await input.setValue('test')
  await form.trigger('submit')
  
  expect(wrapper.emitted('submit')).toBeTruthy()
})
```

### Testing Computed Properties

```typescript
it('should compute total correctly', () => {
  const store = useCartStore()
  store.items = [
    { price: 10, quantity: 2 },
    { price: 5, quantity: 3 }
  ]
  
  expect(store.total).toBe(35) // (10*2) + (5*3)
})
```

---

## Debugging Tests

### Using `console.log`

```typescript
it('should debug', () => {
  const wrapper = mount(MyComponent)
  console.log(wrapper.html())
  console.log(wrapper.vm.$data)
})
```

### Using Vitest UI

```bash
npm run test -- --ui
```

### Using VS Code Debugger

Create `.vscode/launch.json`:

```json
{
  "version": "0.2.0",
  "configurations": [
    {
      "type": "node",
      "request": "launch",
      "name": "Debug Tests",
      "runtimeExecutable": "npm",
      "runtimeArgs": ["run", "test"],
      "skipFiles": ["<node_internals>/**"]
    }
  ]
}
```

---

## CI/CD Integration

### GitHub Actions Example

```yaml
name: Tests
on: [push, pull_request]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
      - run: npm ci
      - run: npm run test:coverage
```

---

## Resources

- [Vitest Documentation](https://vitest.dev/)
- [Vue Test Utils](https://test-utils.vuejs.org/)
- [Testing Vue 3 Components](https://vuejs.org/guide/scaling-up/testing.html)
- [Pinia Testing](https://pinia.vuejs.org/cookbook/testing.html)

---

## Quick Reference

```typescript
// Import test utilities
import { describe, it, expect, beforeEach, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { createTestPinia, createMockApiResponse } from '@/tests/utils/testUtils'

// Mock modules
vi.mock('@/services/api')

// Create component wrapper
const wrapper = mount(Component, { props: { ... } })

// Assertions
expect(wrapper.text()).toContain('text')
expect(wrapper.find('.class').exists()).toBe(true)
expect(wrapper.emitted('event')).toBeTruthy()

// Async operations
await wrapper.vm.$nextTick()
await wrapper.trigger('click')
```

---

## Next Steps

1. ✅ Setup complete - Start writing tests!
2. Add tests for critical components
3. Add tests for API services
4. Add tests for Pinia stores
5. Set up coverage reporting
6. Integrate with CI/CD

Happy Testing! 🧪

