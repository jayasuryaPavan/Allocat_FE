<template>
  <div class="space-y-6">
    <div class="flex items-center justify-between">
      <h3 class="text-lg font-semibold text-gray-900 dark:text-white">Stores</h3>
      <button @click="fetchStores" class="px-3 py-1 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700">Refresh</button>
    </div>

    <div class="card overflow-hidden">
      <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
        <thead class="bg-gray-50 dark:bg-gray-700">
          <tr>
            <th class="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Store ID</th>
            <th class="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Name</th>
            <th class="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Location</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-gray-200 dark:divide-gray-700">
          <tr v-for="s in stores" :key="s.id">
            <td class="px-4 py-2 text-sm text-gray-900 dark:text-white">{{ s.id }}</td>
            <td class="px-4 py-2 text-sm text-gray-900 dark:text-white">{{ s.name }}</td>
            <td class="px-4 py-2 text-sm text-gray-900 dark:text-white">{{ s.location || '-' }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

interface StoreItem { id: number; name: string; location?: string }
const stores = ref<StoreItem[]>([])

const fetchStores = async () => {
  // TODO: integrate stores API when available
  stores.value = []
}

fetchStores()
</script>


