<template>
  <div class="settings-page">
    <div class="settings-header">
      <h1>Account Settings</h1>
      <p class="subtitle">Manage your account preferences and API configuration</p>
    </div>

    <div class="settings-content">
      <!-- Gemini API Key Section -->
      <div class="settings-card">
        <div class="card-header">
          <h2>Gemini API Key</h2>
          <p class="description">
            Configure your personal Gemini API key for AI features. 
            <a href="https://aistudio.google.com/app/apikey" target="_blank" rel="noopener">
              Get your API key →
            </a>
          </p>
        </div>

        <div class="card-body">
          <div v-if="loading" class="loading-state">
            <div class="spinner"></div>
            <span>Loading settings...</span>
          </div>

          <div v-else>
            <!-- Key Configured State -->
            <div v-if="hasKey" class="key-status-card success">
              <div class="status-icon">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <div class="status-content">
                <h3>API Key Configured</h3>
                <p class="masked-key">{{ maskedKey }}</p>
                <button @click="deleteKey" class="btn btn-danger">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                  Remove Key
                </button>
              </div>
            </div>

            <!-- No Key State -->
            <form v-else @submit.prevent="saveKey" class="key-form">
              <div class="form-group">
                <label for="apiKey">API Key</label>
                <input 
                  id="apiKey"
                  v-model="apiKey" 
                  type="password" 
                  placeholder="Enter your Gemini API key (e.g., AIza...)" 
                  class="form-input"
                  required
                  :disabled="saving"
                />
                <small class="form-hint">
                  Your API key is encrypted and stored securely. It will never be shared.
                </small>
              </div>
              
              <button type="submit" class="btn btn-primary" :disabled="saving">
                <svg v-if="!saving" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                </svg>
                <div v-else class="spinner-small"></div>
                {{ saving ? 'Saving...' : 'Save API Key' }}
              </button>
            </form>
          </div>
        </div>
      </div>

      <!-- Info Card -->
      <div class="settings-card info">
        <div class="card-header">
          <h2>Why Configure Your Own API Key?</h2>
        </div>
        <div class="card-body">
          <ul class="info-list">
            <li>✓ Unlimited AI requests without rate limits</li>
            <li>✓ Direct billing to your Google Cloud account</li>
            <li>✓ Full control over your API usage</li>
            <li>✓ Enhanced privacy and security</li>
          </ul>
          <p class="pricing-note">
            Gemini API pricing starts at $0.002 per 1,000 tokens. 
            <a href="https://ai.google.dev/pricing" target="_blank" rel="noopener">View pricing →</a>
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useApiService } from '@/core/services/api'
import { useNotificationStore } from '@/core/stores/notification'

const api = useApiService()
const notification = useNotificationStore()

const loading = ref(true)
const saving = ref(false)
const hasKey = ref(false)
const maskedKey = ref('')
const apiKey = ref('')

onMounted(async () => {
  await loadKeyStatus()
})

async function loadKeyStatus() {
  try {
    loading.value = true
    const response = await api.get('/settings/gemini-key')
    const data = response.data.data
    hasKey.value = data.hasKey
    maskedKey.value = data.maskedKey || ''
  } catch (error: any) {
    // Check if this is a 404 (no key configured yet) - this is expected for new users
    if (error.response?.status === 404) {
      hasKey.value = false
      maskedKey.value = ''
      // Show a friendly info message instead of an error
      notification.info('No Gemini API Key', 'Add your Gemini API key below to enable AI features like InvenGadu.')
    } else {
      notification.error('Failed to load settings', error.response?.data?.message)
    }
  } finally {
    loading.value = false
  }
}

async function saveKey() {
  if (!apiKey.value.trim()) {
    notification.error('Please enter a valid API key')
    return
  }

  try {
    saving.value = true
    await api.post('/settings/gemini-key', { apiKey: apiKey.value })
    notification.success('API key saved successfully!', 'You can now use AI features with your own key.')
    apiKey.value = ''
    await loadKeyStatus()
  } catch (error: any) {
    notification.error('Failed to save API key', error.response?.data?.message || 'Please try again.')
  } finally {
    saving.value = false
  }
}

async function deleteKey() {
  if (!confirm('Are you sure you want to remove your Gemini API key?')) {
    return
  }

  try {
    await api.delete('/settings/gemini-key')
    notification.success('API key removed', 'Falling back to system API key (limited usage).')
    hasKey.value = false
    maskedKey.value = ''
  } catch (error: any) {
    notification.error('Failed to remove API key', error.response?.data?.message)
  }
}
</script>

<style scoped>
.settings-page {
  max-width: 1000px;
  margin: 0 auto;
  padding: 2rem;
}

.settings-header {
  margin-bottom: 2rem;
}

.settings-header h1 {
  font-size: 2rem;
  font-weight: 700;
  color: var(--color-text-primary);
  margin-bottom: 0.5rem;
}

.subtitle {
  color: var(--color-text-secondary);
  font-size: 0.95rem;
}

.settings-content {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.settings-card {
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
}

.settings-card.info {
  background: linear-gradient(135deg, #667eea15 0%, #764ba215 100%);
  border-color: #667eea30;
}

.card-header h2 {
  font-size: 1.25rem;
  font-weight: 600;
  color: var(--color-text-primary);
  margin-bottom: 0.5rem;
}

.description {
  color: var(--color-text-secondary);
  font-size: 0.9rem;
  line-height: 1.6;
}

.description a {
  color: var(--color-primary);
  text-decoration: none;
  font-weight: 500;
}

.description a:hover {
  text-decoration: underline;
}

.card-body {
  margin-top: 1.5rem;
}

/* Loading State */
.loading-state {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 2rem;
  justify-content: center;
  color: var(--color-text-secondary);
}

.spinner {
  width: 24px;
  height: 24px;
  border: 3px solid rgba(0, 0, 0, 0.1);
  border-top-color: var(--color-primary);
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

.spinner-small {
  width: 16px;
  height: 16px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-top-color: white;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

/* Key Status Card */
.key-status-card {
  display: flex;
  align-items: center;
  gap: 1.5rem;
  padding: 1.5rem;
  background: linear-gradient(135deg, #10b98115 0%, #0ea5e915 100%);
  border: 1px solid #10b98140;
  border-radius: 8px;
}

.key-status-card.success .status-icon {
  width: 48px;
  height: 48px;
  background: #10b981;
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.key-status-card.success .status-icon svg {
  width: 24px;
  height: 24px;
}

.status-content {
  flex: 1;
}

.status-content h3 {
  font-size: 1.1rem;
  font-weight: 600;
  color: var(--color-text-primary);
  margin-bottom: 0.25rem;
}

.masked-key {
  font-family: 'Courier New', monospace;
  color: var(--color-text-secondary);
  font-size: 0.9rem;
}

/* Form */
.key-form {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.form-group label {
  font-weight: 500;
  color: var(--color-text-primary);
  font-size: 0.95rem;
}

.form-input {
  padding: 0.75rem 1rem;
  border: 1px solid var(--color-border);
  border-radius: 8px;
  font-size: 0.95rem;
  transition: all 0.2s;
  font-family: 'Courier New', monospace;
}

.form-input:focus {
  outline: none;
  border-color: var(--color-primary);
  box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.1);
}

.form-hint {
  color: var(--color-text-secondary);
  font-size: 0.85rem;
}

/* Buttons */
.btn {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 8px;
  font-size: 0.95rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
}

.btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.btn svg {
  width: 18px;
  height: 18px;
}

.btn-primary {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

.btn-primary:hover:not(:disabled) {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
}

.btn-danger {
  background: #ef4444;
  color: white;
}

.btn-danger:hover:not(:disabled) {
  background: #dc2626;
}

/* Info List */
.info-list {
  list-style: none;
  padding: 0;
  margin: 0 0 1.5rem 0;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.info-list li {
  color: var(--color-text-secondary);
  font-size: 0.95rem;
}

.pricing-note {
  color: var(--color-text-secondary);
  font-size: 0.9rem;
  margin-top: 1rem;
  padding-top: 1rem;
  border-top: 1px solid var(--color-border);
}

.pricing-note a {
  color: var(--color-primary);
  text-decoration: none;
  font-weight: 500;
}

.pricing-note a:hover {
  text-decoration: underline;
}
</style>
