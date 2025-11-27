# Testing Directory

This directory contains all test files for the Allocat ERP Frontend.

## Structure

```
tests/
├── setup.ts              # Global test setup and configuration
├── utils/                # Test utilities and helpers
│   ├── testUtils.ts     # Common test helper functions
│   └── mocks.ts         # Mock data and functions
├── unit/                # Unit tests
│   ├── components/     # Component tests
│   ├── services/       # Service/API tests
│   ├── stores/         # Pinia store tests
│   └── utils/          # Utility function tests
├── integration/         # Integration tests
└── e2e/                # End-to-end tests (Cypress)
```

## Quick Start

```bash
# Run all tests
npm run test

# Run tests in watch mode
npm run test -- --watch

# Run tests with coverage
npm run test:coverage

# Run specific test file
npm run test -- CustomerSelector.test.ts
```

## Writing Tests

See [TESTING_GUIDE.md](../TESTING_GUIDE.md) for complete documentation.

### Example Test

```typescript
import { describe, it, expect } from 'vitest'
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

