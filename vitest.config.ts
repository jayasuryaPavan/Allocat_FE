import { defineConfig } from 'vitest/config'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'path'

export default defineConfig({
  plugins: [vue()],
  test: {
    // Test environment
    environment: 'jsdom',
    
    // Global test setup file
    setupFiles: ['./tests/setup.ts'],
    
    // Include test files
    include: [
      '**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}',
      '**/tests/unit/**/*.{js,ts}',
      '**/__tests__/**/*.{js,ts}'
    ],
    
    // Exclude files
    exclude: [
      '**/node_modules/**',
      '**/dist/**',
      '**/cypress/**',
      '**/.{idea,git,cache,output,temp}/**',
      '**/{karma,rollup,webpack,vite,vitest,jest,ava,babel,nyc,cypress,tsup,build,eslint,prettier}.config.*'
    ],
    
    // Coverage configuration
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html', 'lcov'],
      exclude: [
        'node_modules/',
        'tests/',
        '**/*.d.ts',
        '**/*.config.*',
        '**/mockData/**',
        '**/types/**',
        '**/router/**',
        '**/main.ts',
        '**/vite-env.d.ts'
      ],
      include: ['src/**/*.{ts,vue}'],
      thresholds: {
        lines: 70,
        functions: 70,
        branches: 70,
        statements: 70
      }
    },
    
    // Globals (vitest globals API)
    globals: true,
    
    // Test timeout
    testTimeout: 10000,
    
    // Mock reset between tests
    mockReset: true,
    restoreMocks: true,
    
    // Reporter configuration
    reporters: ['verbose', 'json', 'html'],
    outputFile: {
      json: './tests/results/test-results.json',
      html: './tests/results/index.html'
    }
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
      '@environments': resolve(__dirname, 'src/environments'),
      '@core': resolve(__dirname, 'src/core'),
      '@shared': resolve(__dirname, 'src/shared'),
      '@features': resolve(__dirname, 'src/features'),
      '@layouts': resolve(__dirname, 'src/layouts'),
      '@assets': resolve(__dirname, 'src/assets')
    }
  }
})

