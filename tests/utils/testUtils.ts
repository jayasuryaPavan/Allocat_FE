/**
 * Test Utilities
 * Common helper functions for writing tests
 */

import { mount, VueWrapper } from '@vue/test-utils'
import { Component } from 'vue'
import { createRouter, createWebHistory, Router } from 'vue-router'
import { createPinia, Pinia, setActivePinia } from 'pinia'
import { vi, beforeEach, afterEach } from 'vitest'

/**
 * Create a test router instance
 */
export function createTestRouter(routes: any[] = []): Router {
  return createRouter({
    history: createWebHistory(),
    routes: routes.length > 0 ? routes : [
      { path: '/', component: { template: '<div>Home</div>' } },
      { path: '/test', component: { template: '<div>Test</div>' } }
    ]
  })
}

/**
 * Create a test Pinia instance
 */
export function createTestPinia(): Pinia {
  const pinia = createPinia()
  setActivePinia(pinia)
  return pinia
}

/**
 * Mount a component with common test utilities
 */
export function mountComponent(
  component: Component,
  options: {
    props?: Record<string, any>
    slots?: Record<string, any>
    global?: {
      plugins?: any[]
      mocks?: Record<string, any>
      stubs?: Record<string, any>
    }
    router?: Router
    pinia?: Pinia
  } = {}
) {
  const { props, slots, global = {}, router, pinia } = options

  const plugins = []
  if (pinia) plugins.push(pinia)
  if (router) plugins.push(router)

  return mount(component, {
    props: props || {},
    slots: slots || {},
    global: {
      plugins,
      ...global
    }
  })
}

/**
 * Wait for next tick
 */
export async function waitForNextTick() {
  return new Promise(resolve => setTimeout(resolve, 0))
}

/**
 * Wait for a specific condition
 */
export async function waitFor(
  condition: () => boolean,
  timeout: number = 5000,
  interval: number = 100
): Promise<void> {
  const startTime = Date.now()
  
  while (Date.now() - startTime < timeout) {
    if (condition()) {
      return
    }
    await new Promise(resolve => setTimeout(resolve, interval))
  }
  
  throw new Error(`Condition not met within ${timeout}ms`)
}

/**
 * Create a mock API response
 */
export function createMockApiResponse<T>(data: T, success: boolean = true) {
  return {
    success,
    data,
    message: success ? 'Success' : 'Error',
    errors: undefined
  }
}

/**
 * Create a mock Axios response
 */
export function createMockAxiosResponse<T>(data: T, status: number = 200) {
  return {
    data: {
      success: status >= 200 && status < 300,
      data,
      message: 'Success'
    },
    status,
    statusText: 'OK',
    headers: {},
    config: {} as any
  }
}

/**
 * Mock console methods to avoid noise in tests
 */
export function mockConsole() {
  const originalError = console.error
  const originalWarn = console.warn
  
  beforeEach(() => {
    console.error = vi.fn()
    console.warn = vi.fn()
  })
  
  afterEach(() => {
    console.error = originalError
    console.warn = originalWarn
  })
}

/**
 * Helper to find element by test ID
 */
export function findByTestId(wrapper: VueWrapper<any>, testId: string) {
  return wrapper.find(`[data-testid="${testId}"]`)
}

/**
 * Helper to find all elements by test ID
 */
export function findAllByTestId(wrapper: VueWrapper<any>, testId: string) {
  return wrapper.findAll(`[data-testid="${testId}"]`)
}

/**
 * Helper to trigger user events
 */
export const userEvent = {
  click: async (element: any) => {
    await element.trigger('click')
  },
  type: async (element: any, text: string) => {
    await element.setValue(text)
    await element.trigger('input')
  },
  clear: async (element: any) => {
    await element.setValue('')
    await element.trigger('input')
  }
}

