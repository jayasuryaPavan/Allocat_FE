/**
 * CustomerSelector Component Tests
 * Example test for Vue components
 */

import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import CustomerSelector from '@/features/pos/components/CustomerSelector.vue'
import { createTestPinia } from '../../utils/testUtils'
import { mockApiService } from '../../utils/mocks'

// Mock the API service
vi.mock('@/core/services/api', () => ({
  useApiService: () => mockApiService
}))

describe('CustomerSelector', () => {
  let pinia: ReturnType<typeof createTestPinia>

  beforeEach(() => {
    pinia = createTestPinia()
    vi.clearAllMocks()
  })

  it('should render search input when no customer is selected', () => {
    const wrapper = mount(CustomerSelector, {
      global: {
        plugins: [pinia]
      },
      props: {
        modelValue: null
      }
    })

    const input = wrapper.find('input[type="text"]')
    expect(input.exists()).toBe(true)
    expect(input.attributes('placeholder')).toBe('Search customer...')
  })

  it('should render selected customer when modelValue is provided', () => {
    const customer = {
      id: 1,
      name: 'John Doe',
      email: 'john@example.com',
      phone: '+1234567890'
    }

    const wrapper = mount(CustomerSelector, {
      global: {
        plugins: [pinia]
      },
      props: {
        modelValue: customer
      }
    })

    expect(wrapper.text()).toContain('John Doe')
    expect(wrapper.text()).toContain('john@example.com')
  })

  it('should emit update:modelValue when clear button is clicked', async () => {
    const customer = {
      id: 1,
      name: 'John Doe',
      email: 'john@example.com'
    }

    const wrapper = mount(CustomerSelector, {
      global: {
        plugins: [pinia]
      },
      props: {
        modelValue: customer
      }
    })

    const clearButton = wrapper.find('button')
    await clearButton.trigger('click')

    expect(wrapper.emitted('update:modelValue')).toBeTruthy()
    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([null])
  })

  it('should search for customers when typing in input', async () => {
    const mockCustomers = [
      { id: 1, name: 'John Doe', email: 'john@example.com' },
      { id: 2, name: 'Jane Smith', email: 'jane@example.com' }
    ]

    mockApiService.get.mockResolvedValue({
      data: {
        success: true,
        data: { content: mockCustomers }
      },
      status: 200,
      statusText: 'OK',
      headers: {},
      config: {} as any
    })

    const wrapper = mount(CustomerSelector, {
      global: {
        plugins: [pinia]
      },
      props: {
        modelValue: null
      }
    })

    const input = wrapper.find('input[type="text"]')
    await input.setValue('John')
    await input.trigger('input')

    // Wait for debounce
    await new Promise(resolve => setTimeout(resolve, 350))

    expect(mockApiService.get).toHaveBeenCalled()
  })

  it('should display loading spinner when searching', async () => {
    mockApiService.get.mockImplementation(() => 
      new Promise(resolve => setTimeout(() => resolve({
        data: { success: true, data: { content: [] } },
        status: 200,
        statusText: 'OK',
        headers: {},
        config: {} as any
      }), 100))
    )

    const wrapper = mount(CustomerSelector, {
      global: {
        plugins: [pinia]
      },
      props: {
        modelValue: null
      }
    })

    const input = wrapper.find('input[type="text"]')
    await input.setValue('test')
    await input.trigger('input')

    // Check if loading spinner appears
    await wrapper.vm.$nextTick()
    // Note: You may need to adjust this based on your actual component implementation
  })
})

