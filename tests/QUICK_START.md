# Testing Quick Start Guide

## 🚀 Getting Started

### 1. Install Dependencies (Already Done ✅)

```bash
npm install
```

### 2. Run Your First Test

```bash
# Run all tests
npm run test

# Run in watch mode (recommended for development)
npm run test -- --watch

# Run with coverage report
npm run test:coverage

# Run specific test file
npm run test -- CustomerSelector.test.ts
```

### 3. Open Test UI (Visual Test Runner)

```bash
npm run test -- --ui
```

This opens a browser-based UI where you can:
- See all tests
- Run individual tests
- Debug tests
- View coverage

---

## 📝 Writing Your First Test

### Component Test Example

Create `src/components/Button.test.ts`:

```typescript
import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import Button from './Button.vue'

describe('Button', () => {
  it('renders correctly', () => {
    const wrapper = mount(Button, {
      props: { label: 'Click me' }
    })
    expect(wrapper.text()).toContain('Click me')
  })

  it('emits click event', async () => {
    const wrapper = mount(Button)
    await wrapper.trigger('click')
    expect(wrapper.emitted('click')).toBeTruthy()
  })
})
```

### Service Test Example

Create `src/core/services/myService.test.ts`:

```typescript
import { describe, it, expect, vi } from 'vitest'
import { myService } from './myService'

describe('MyService', () => {
  it('fetches data', async () => {
    const mockData = { id: 1, name: 'Test' }
    vi.spyOn(myService, 'fetch').mockResolvedValue(mockData)
    
    const result = await myService.fetch()
    expect(result).toEqual(mockData)
  })
})
```

### Store Test Example

Create `src/stores/myStore.test.ts`:

```typescript
import { describe, it, expect, beforeEach } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useMyStore } from './myStore'

describe('MyStore', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  it('updates state', () => {
    const store = useMyStore()
    store.setValue('test')
    expect(store.value).toBe('test')
  })
})
```

---

## 🎯 Common Test Patterns

### Testing User Interactions

```typescript
it('handles user input', async () => {
  const wrapper = mount(MyComponent)
  const input = wrapper.find('input')
  
  await input.setValue('test value')
  await input.trigger('input')
  
  expect(wrapper.vm.inputValue).toBe('test value')
})
```

### Testing API Calls

```typescript
import { mockApiService } from '@/tests/utils/mocks'

it('calls API', async () => {
  mockApiService.get.mockResolvedValue({
    data: { success: true, data: [] }
  })
  
  await component.fetchData()
  expect(mockApiService.get).toHaveBeenCalled()
})
```

### Testing Events

```typescript
it('emits event with data', async () => {
  const wrapper = mount(MyComponent)
  await wrapper.find('button').trigger('click')
  
  expect(wrapper.emitted('submit')).toBeTruthy()
  expect(wrapper.emitted('submit')[0]).toEqual([{ id: 1 }])
})
```

### Testing Async Operations

```typescript
it('handles async data loading', async () => {
  const wrapper = mount(MyComponent)
  
  // Wait for async operation
  await wrapper.vm.$nextTick()
  await new Promise(resolve => setTimeout(resolve, 100))
  
  expect(wrapper.find('.loaded').exists()).toBe(true)
})
```

---

## 🛠️ Available Test Utilities

Import from `@/tests/utils/testUtils`:

```typescript
import {
  mountComponent,      // Mount with common setup
  createTestRouter,    // Create test router
  createTestPinia,    // Create test Pinia instance
  waitFor,            // Wait for condition
  findByTestId,       // Find by data-testid
  userEvent           // User interaction helpers
} from '@/tests/utils/testUtils'
```

---

## 📊 Coverage Goals

- **Lines**: 70%+
- **Functions**: 70%+
- **Branches**: 70%+
- **Statements**: 70%+

View coverage report:
```bash
npm run test:coverage
# Open tests/results/index.html in browser
```

---

## 🐛 Debugging Tests

### VS Code Debugger

1. Set breakpoint in test file
2. Press F5
3. Select "Debug Current Test File"

### Console Logging

```typescript
it('debugs component', () => {
  const wrapper = mount(MyComponent)
  console.log('HTML:', wrapper.html())
  console.log('Props:', wrapper.props())
  console.log('Data:', wrapper.vm.$data)
})
```

### Test UI

```bash
npm run test -- --ui
```

---

## 📚 Next Steps

1. Read [TESTING_GUIDE.md](../TESTING_GUIDE.md) for complete documentation
2. Check example tests in `tests/unit/`
3. Start writing tests for your components
4. Aim for 70%+ coverage on critical paths

---

## 💡 Tips

- ✅ Test behavior, not implementation
- ✅ Use `data-testid` for stable selectors
- ✅ Mock external dependencies
- ✅ Keep tests simple and focused
- ✅ Use descriptive test names
- ❌ Don't test third-party libraries
- ❌ Don't test implementation details

---

Happy Testing! 🧪

