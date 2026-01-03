<template>
  <Teleport to="body">
    <div class="fixed inset-0 z-50 flex items-center justify-center">
      <!-- Backdrop -->
      <div class="absolute inset-0 bg-black/40 backdrop-blur-sm"></div>
      
      <!-- Summary Card -->
      <div class="relative bg-white/90 backdrop-blur-xl border border-white/50 rounded-3xl p-8 w-96 shadow-2xl animate-fade-in">
        <!-- Success Icon -->
        <div class="flex justify-center mb-4">
          <div class="w-16 h-16 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center shadow-lg">
            <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7" />
            </svg>
          </div>
        </div>
        
        <h3 class="text-xl font-bold text-gray-800 text-center mb-4">Associate Signed Out</h3>
        
        <div class="text-center space-y-3">
          <!-- Associate Name -->
          <p class="text-2xl font-bold text-gray-900">{{ associate.name }}</p>
          <p class="text-gray-500">Associate #{{ associate.associateNumber }}</p>
          
          <!-- Time Details -->
          <div class="bg-gray-50 rounded-xl p-4 mt-4 space-y-2 border border-gray-100">
            <div class="flex justify-between text-sm">
              <span class="text-gray-500">Signed In:</span>
              <span class="text-gray-700 font-medium">{{ associate.signInTime }}</span>
            </div>
            <div class="flex justify-between text-sm">
              <span class="text-gray-500">Signed Out:</span>
              <span class="text-gray-700 font-medium">{{ associate.signOutTime }}</span>
            </div>
          </div>
        </div>
        
        <!-- Auto-close Progress Bar -->
        <div class="mt-6 h-1 bg-gray-100 rounded-full overflow-hidden">
          <div class="h-full bg-gradient-to-r from-green-400 to-green-600 animate-shrink-width"></div>
        </div>
        
        <p class="text-gray-400 text-center text-xs mt-2">Closing automatically...</p>
      </div>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
interface Associate {
  name: string
  associateNumber: string
  signInTime: string
  signOutTime: string
}

defineProps<{
  associate: Associate
}>()

defineEmits<{
  (e: 'close'): void
}>()
</script>

<style scoped>
@keyframes fade-in {
  from {
    opacity: 0;
    transform: scale(0.95);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

@keyframes shrink-width {
  from {
    width: 100%;
  }
  to {
    width: 0%;
  }
}

.animate-fade-in {
  animation: fade-in 0.3s ease-out forwards;
}

.animate-shrink-width {
  animation: shrink-width 3s linear forwards;
}
</style>
