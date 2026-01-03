<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { usePosStore } from '../stores/posStore'
import { useNotificationStore } from '@/core/stores/notification'

const props = defineProps<{
  isOpen: boolean
  isTaxExempt: boolean
}>()

const emit = defineEmits(['close'])

const posStore = usePosStore()
const notificationStore = useNotificationStore()

// Step-based flow: 1 = Description, 2 = Tax Type (for taxable), 3 = Price, 4 = Quantity
const currentStep = ref(1)
const itemDescription = ref('')
const priceInput = ref('')
const quantityInput = ref('1')
const selectedTaxType = ref('HST') // Default to HST
const isAdding = ref(false)

// Tax types with rates
const taxTypes = [
  { code: 'GST', name: 'GST Only', rate: 5, description: '5% Federal Tax' },
  { code: 'HST', name: 'HST (Ontario)', rate: 13, description: '13% Combined Tax' },
  { code: 'HST_NS', name: 'HST (NS/NB/NL)', rate: 15, description: '15% Combined Tax' },
  { code: 'GST_PST_BC', name: 'GST + PST (BC)', rate: 12, description: '5% + 7% = 12%' },
  { code: 'GST_PST_SK', name: 'GST + PST (SK)', rate: 11, description: '5% + 6% = 11%' },
  { code: 'GST_QST', name: 'GST + QST (QC)', rate: 14.975, description: '5% + 9.975%' },
]

const selectedTaxRate = computed(() => {
  const tax = taxTypes.find(t => t.code === selectedTaxType.value)
  return tax?.rate || 13
})

// Quick description options
const quickDescriptions = computed(() => props.isTaxExempt 
  ? ['Lottery Ticket', 'Gift Card', 'Money Order', 'Postage', 'Custom']
  : ['Misc Item', 'Service', 'Deposit', 'Custom']
)

const cart = computed(() => posStore.currentCart)

const title = computed(() => props.isTaxExempt ? 'Add Tax Exempt Item' : 'Add Taxable Item')

const totalSteps = computed(() => props.isTaxExempt ? 3 : 4)
const priceStep = computed(() => props.isTaxExempt ? 2 : 3)
const quantityStep = computed(() => props.isTaxExempt ? 3 : 4)

const unitPrice = computed(() => parseFloat(priceInput.value) || 0)
const quantity = computed(() => parseInt(quantityInput.value) || 1)
const subtotal = computed(() => unitPrice.value * quantity.value)
const taxAmount = computed(() => props.isTaxExempt ? 0 : (subtotal.value * selectedTaxRate.value / 100))
const totalAmount = computed(() => subtotal.value + taxAmount.value)

// Reset form when modal opens
watch(() => props.isOpen, (open) => {
  if (open) {
    currentStep.value = 1
    itemDescription.value = ''
    priceInput.value = ''
    quantityInput.value = '1'
    selectedTaxType.value = 'HST'
  }
})

const selectDescription = (desc: string) => {
  if (desc === 'Custom') {
    itemDescription.value = ''
  } else {
    itemDescription.value = desc
  }
  // Go to tax type step for taxable, or price step for tax exempt
  currentStep.value = props.isTaxExempt ? 2 : 2
}

const selectTaxType = (taxCode: string) => {
  selectedTaxType.value = taxCode
  currentStep.value = 3 // Move to price step
}

const handleKeyPress = (key: string) => {
  // Price step: 2 for TaxExempt, 3 for Taxable
  // Quantity step: 3 for TaxExempt, 4 for Taxable
  const priceStep = props.isTaxExempt ? 2 : 3
  const quantityStep = props.isTaxExempt ? 3 : 4
  const isPrice = currentStep.value === priceStep
  const inputRef = isPrice ? priceInput : quantityInput
  
  if (key === 'C') {
    if (isPrice) priceInput.value = ''
    else quantityInput.value = ''
  } else if (key === 'backspace') {
    if (isPrice) priceInput.value = priceInput.value.slice(0, -1)
    else quantityInput.value = quantityInput.value.slice(0, -1)
  } else if (key === '.') {
    if (isPrice && !priceInput.value.includes('.')) {
      priceInput.value += key
    }
  } else if (key === 'enter') {
    if (currentStep.value === priceStep && unitPrice.value > 0) {
      currentStep.value = quantityStep
    } else if (currentStep.value === quantityStep && quantity.value > 0) {
      handleAddItem()
    }
  } else {
    // Limit decimal places for price
    if (isPrice && priceInput.value.includes('.')) {
      const parts = priceInput.value.split('.')
      if (parts[1] && parts[1].length >= 2) return
    }
    if (isPrice) priceInput.value += key
    else quantityInput.value += key
  }
}

const canProceed = computed(() => {
  const priceStep = props.isTaxExempt ? 2 : 3
  const quantityStep = props.isTaxExempt ? 3 : 4
  if (currentStep.value === priceStep) return unitPrice.value > 0
  if (currentStep.value === quantityStep) return quantity.value > 0
  return false
})

const canAdd = computed(() => {
  return itemDescription.value.trim() && unitPrice.value > 0 && quantity.value > 0
})

const handleAddItem = async () => {
  if (!canAdd.value) {
    console.log('Cannot add - canAdd is false:', { description: itemDescription.value, price: unitPrice.value, qty: quantity.value })
    return
  }
  
  isAdding.value = true
  try {
    // Use cart ID if available, otherwise use 'local' as fallback
    const cartId = cart.value?.cartId || 'local'
    
    await posStore.addCustomItem(cartId, {
      description: itemDescription.value.trim(),
      unitPrice: unitPrice.value,
      quantity: quantity.value,
      taxExempt: props.isTaxExempt
    })
    
    // notificationStore.success('Item Added', `${itemDescription.value} added to cart`)
    emit('close')
  } catch (error: any) {
    console.error('Add item failed:', error)
    notificationStore.error('Failed to add item', error.message || 'Please try again')
  } finally {
    isAdding.value = false
  }
}

const goBack = () => {
  if (currentStep.value > 1) {
    currentStep.value--
  }
}
</script>

<template>
  <Teleport to="body">
    <div 
      v-if="isOpen" 
      class="fixed inset-0 z-50 flex items-center justify-center p-4"
    >
      <!-- Overlay -->
      <div 
        class="absolute inset-0 bg-gray-500/40 dark:bg-gray-900/60 backdrop-blur-sm"
        @click="emit('close')"
      ></div>
      
      <!-- Modal -->
      <div class="relative w-full max-w-md chat-glass rounded-2xl shadow-glass shadow-glass-glow overflow-hidden">
        <!-- Header -->
        <div 
          class="p-4 border-b border-gray-200/50 dark:border-gray-700/50"
          :class="isTaxExempt ? 'bg-green-500/10' : 'bg-blue-500/10'"
        >
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-3">
              <button 
                v-if="currentStep > 1"
                @click="goBack"
                class="w-10 h-10 flex items-center justify-center rounded-lg text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100/50 dark:hover:bg-gray-800/50 transition-all"
              >
                <i class="fas fa-arrow-left text-lg"></i>
              </button>
              <div>
                <h3 class="text-lg font-semibold text-gray-900 dark:text-white">{{ title }}</h3>
                <p class="text-sm text-gray-500 dark:text-gray-400">
                  Step {{ currentStep }} of {{ isTaxExempt ? 3 : 4 }}
                </p>
              </div>
            </div>
            <button 
              @click="emit('close')"
              class="w-10 h-10 flex items-center justify-center rounded-lg text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100/50 dark:hover:bg-gray-800/50 transition-all"
            >
              <i class="fas fa-times text-xl"></i>
            </button>
          </div>
        </div>
        
        <!-- Body -->
        <div class="p-4">
          <!-- Step 1: Select Description -->
          <div v-if="currentStep === 1" class="space-y-3">
            <p class="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
              Select item type:
            </p>
            <div class="grid grid-cols-2 gap-3">
              <button
                v-for="desc in quickDescriptions"
                :key="desc"
                @click="selectDescription(desc)"
                class="py-4 px-3 rounded-xl font-semibold transition-all text-center"
                :class="[
                  'bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm',
                  'border border-gray-200/50 dark:border-gray-600/50',
                  'text-gray-900 dark:text-white',
                  'hover:bg-gray-100 dark:hover:bg-gray-700',
                  'active:scale-95'
                ]"
              >
                {{ desc }}
              </button>
            </div>
          </div>

          <!-- Step 2: Select Tax Type (Only for taxable items) -->
          <div v-else-if="currentStep === 2 && !isTaxExempt" class="space-y-3">
            <div class="flex items-center justify-between p-3 rounded-xl bg-gray-100/50 dark:bg-gray-800/50 mb-3">
              <span class="text-gray-600 dark:text-gray-400">Item:</span>
              <span class="font-semibold text-gray-900 dark:text-white">{{ itemDescription }}</span>
            </div>
            <p class="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
              Select tax type:
            </p>
            <div class="space-y-2">
              <button
                v-for="tax in taxTypes"
                :key="tax.code"
                @click="selectTaxType(tax.code)"
                class="w-full py-3 px-4 rounded-xl font-semibold transition-all text-left flex items-center justify-between"
                :class="[
                  'bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm',
                  'border border-gray-200/50 dark:border-gray-600/50',
                  'text-gray-900 dark:text-white',
                  'hover:bg-blue-50 dark:hover:bg-blue-900/20 hover:border-blue-300',
                  'active:scale-[0.98]'
                ]"
              >
                <div>
                  <div class="font-bold">{{ tax.name }}</div>
                  <div class="text-xs text-gray-500 dark:text-gray-400">{{ tax.description }}</div>
                </div>
                <div class="text-lg font-bold text-primary-600">{{ tax.rate }}%</div>
              </button>
            </div>
          </div>

          <!-- Step 2/3: Enter Price -->
          <div v-else-if="(isTaxExempt && currentStep === 2) || (!isTaxExempt && currentStep === 3)" class="space-y-4">
            <!-- Selected item display -->
            <div class="flex items-center justify-between p-3 rounded-xl bg-gray-100/50 dark:bg-gray-800/50">
              <span class="text-gray-600 dark:text-gray-400">Item:</span>
              <div class="text-right">
                <span class="font-semibold text-gray-900 dark:text-white">{{ itemDescription }}</span>
                <div v-if="!isTaxExempt" class="text-xs text-primary-600">{{ selectedTaxRate }}% tax</div>
              </div>
            </div>
            
            <!-- Price Display -->
            <div class="text-center py-4">
              <p class="text-sm text-gray-500 dark:text-gray-400 mb-2">Enter Unit Price</p>
              <div class="text-4xl font-bold text-gray-900 dark:text-white">
                ${{ priceInput || '0.00' }}
              </div>
            </div>
            
            <!-- Numeric Keypad -->
            <div class="grid grid-cols-3 gap-2">
              <button v-for="n in ['7','8','9','4','5','6','1','2','3']" :key="n" @click="handleKeyPress(n)" class="keypad-btn">{{ n }}</button>
              <button @click="handleKeyPress('.')" class="keypad-btn">.</button>
              <button @click="handleKeyPress('0')" class="keypad-btn">0</button>
              <button @click="handleKeyPress('backspace')" class="keypad-btn keypad-btn-warning">
                <i class="fas fa-backspace">Del</i>
              </button>
            </div>
            
            <div class="grid grid-cols-2 gap-2">
              <button @click="handleKeyPress('C')" class="keypad-btn keypad-btn-danger">Clear</button>
              <button 
                @click="currentStep = isTaxExempt ? 3 : 4" 
                :disabled="!canProceed"
                class="keypad-btn !bg-primary-500 !text-white disabled:opacity-50"
              >
                Next <i class="fas fa-arrow-right ml-2"></i>
              </button>
            </div>
          </div>

          <!-- Step 3/4: Enter Quantity -->
          <div v-else-if="(isTaxExempt && currentStep === 3) || (!isTaxExempt && currentStep === 4)" class="space-y-4">
            <!-- Selected item display -->
            <div class="flex items-center justify-between p-3 rounded-xl bg-gray-100/50 dark:bg-gray-800/50">
              <div>
                <span class="text-gray-600 dark:text-gray-400">Item:</span>
                <span class="font-semibold text-gray-900 dark:text-white ml-2">{{ itemDescription }}</span>
              </div>
              <span class="font-bold text-primary-600">${{ unitPrice.toFixed(2) }}</span>
            </div>
            
            <!-- Quantity Display -->
            <div class="text-center py-4">
              <p class="text-sm text-gray-500 dark:text-gray-400 mb-2">Enter Quantity</p>
              <div class="text-4xl font-bold text-gray-900 dark:text-white">
                {{ quantityInput || '0' }}
              </div>
            </div>
            
            <!-- Numeric Keypad (no decimal for quantity) -->
            <div class="grid grid-cols-3 gap-2">
              <button v-for="n in ['7','8','9','4','5','6','1','2','3']" :key="n" @click="handleKeyPress(n)" class="keypad-btn">{{ n }}</button>
              <button @click="handleKeyPress('C')" class="keypad-btn keypad-btn-danger">C</button>
              <button @click="handleKeyPress('0')" class="keypad-btn">0</button>
              <button @click="handleKeyPress('backspace')" class="keypad-btn keypad-btn-warning">
                <i class="fas fa-backspace">Del</i>
              </button>
            </div>
            
            <!-- Total & Add Button -->
            <div class="pt-4 border-t border-gray-200/50 dark:border-gray-700/50">
              <div class="space-y-2 mb-4">
                <div class="flex justify-between items-center text-sm text-gray-600 dark:text-gray-400">
                  <span>Subtotal</span>
                  <span>${{ subtotal.toFixed(2) }}</span>
                </div>
                <div v-if="!isTaxExempt" class="flex justify-between items-center text-sm text-gray-600 dark:text-gray-400">
                  <span>Tax ({{ selectedTaxRate }}%)</span>
                  <span>${{ taxAmount.toFixed(2) }}</span>
                </div>
                <div class="flex justify-between items-center pt-2 border-t border-gray-200/30 dark:border-gray-700/30">
                  <span class="text-lg font-medium text-gray-700 dark:text-gray-300">Total</span>
                  <span class="text-2xl font-bold text-gray-900 dark:text-white">
                    ${{ totalAmount.toFixed(2) }}
                  </span>
                </div>
              </div>
              <div class="text-xs text-center mb-3" :class="isTaxExempt ? 'text-green-600 dark:text-green-400' : 'text-blue-600 dark:text-blue-400'">
                {{ isTaxExempt ? 'Tax Exempt (0% tax)' : `${selectedTaxRate}% tax included` }}
              </div>
              <button
                @click="handleAddItem"
                :disabled="!canAdd || isAdding"
                class="w-full py-4 rounded-xl font-bold text-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                :class="isTaxExempt ? 'btn-glass-green text-white' : 'btn-glass-blue text-white'"
              >
                <i v-if="isAdding" class="fas fa-spinner fa-spin"></i>
                <i v-else class="fas fa-plus"></i>
                <span>{{ isAdding ? 'Adding...' : 'Add to Cart' }}</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<style scoped>
.keypad-btn {
  @apply min-h-[56px] text-xl font-bold rounded-xl transition-all;
  @apply bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm;
  @apply border border-gray-200/50 dark:border-gray-600/50;
  @apply text-gray-900 dark:text-white;
  @apply hover:bg-gray-100 dark:hover:bg-gray-700;
  @apply active:scale-95 active:bg-gray-200 dark:active:bg-gray-600;
}

.keypad-btn-danger {
  @apply bg-red-500/20 text-red-600 dark:text-red-400 border-red-300/50 dark:border-red-600/50;
  @apply hover:bg-red-500/30;
}

.keypad-btn-warning {
  @apply bg-orange-500/20 text-orange-600 dark:text-orange-400 border-orange-300/50 dark:border-orange-600/50;
  @apply hover:bg-orange-500/30;
}
</style>
