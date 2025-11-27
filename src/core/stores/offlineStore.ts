import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export interface QueuedTransaction {
    id: string
    type: 'sale' | 'return' | 'inventory_update'
    data: any
    timestamp: number
    retryCount: number
}

export const useOfflineStore = defineStore('offline', () => {
    const isOnline = ref(navigator.onLine)
    const syncQueue = ref<QueuedTransaction[]>([])
    const isSyncing = ref(false)
    const lastSyncTime = ref<number | null>(null)

    // Load queue from localStorage on init
    const loadQueue = () => {
        try {
            const stored = localStorage.getItem('sync_queue')
            if (stored) {
                syncQueue.value = JSON.parse(stored)
            }
        } catch (error) {
            console.error('Failed to load sync queue:', error)
        }
    }

    // Save queue to localStorage
    const saveQueue = () => {
        try {
            localStorage.setItem('sync_queue', JSON.stringify(syncQueue.value))
        } catch (error) {
            console.error('Failed to save sync queue:', error)
        }
    }

    // Add transaction to queue
    const queueTransaction = (type: QueuedTransaction['type'], data: any): string => {
        const transaction: QueuedTransaction = {
            id: `${type}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
            type,
            data,
            timestamp: Date.now(),
            retryCount: 0
        }

        syncQueue.value.push(transaction)
        saveQueue()

        return transaction.id
    }

    // Remove transaction from queue
    const removeTransaction = (id: string) => {
        syncQueue.value = syncQueue.value.filter(t => t.id !== id)
        saveQueue()
    }

    // Sync pending transactions
    const syncPendingTransactions = async () => {
        if (isSyncing.value || syncQueue.value.length === 0) {
            return
        }

        isSyncing.value = true

        try {
            // Process queue in order
            for (const transaction of [...syncQueue.value]) {
                try {
                    // Attempt to sync transaction
                    // This would call the appropriate API based on transaction type
                    // For now, just simulate success after a delay
                    await new Promise(resolve => setTimeout(resolve, 100))

                    // Remove from queue on success
                    removeTransaction(transaction.id)
                } catch (error) {
                    console.error(`Failed to sync transaction ${transaction.id}:`, error)

                    // Increment retry count
                    transaction.retryCount++

                    // Remove if max retries exceeded
                    if (transaction.retryCount >= 3) {
                        console.error(`Max retries exceeded for transaction ${transaction.id}, removing from queue`)
                        removeTransaction(transaction.id)
                    }
                }
            }

            lastSyncTime.value = Date.now()
            saveQueue()
        } finally {
            isSyncing.value = false
        }
    }

    // Update online status
    const updateOnlineStatus = (online: boolean) => {
        const wasOffline = !isOnline.value
        isOnline.value = online

        // If just came online, trigger sync
        if (wasOffline && online) {
            syncPendingTransactions()
        }
    }

    // Set up online/offline listeners
    const initOfflineDetection = () => {
        window.addEventListener('online', () => updateOnlineStatus(true))
        window.addEventListener('offline', () => updateOnlineStatus(false))
        isOnline.value = navigator.onLine
    }

    // Initialize
    loadQueue()
    initOfflineDetection()

    const queueSize = computed(() => syncQueue.value.length)
    const hasQueuedTransactions = computed(() => syncQueue.value.length > 0)

    return {
        isOnline,
        syncQueue,
        isSyncing,
        lastSyncTime,
        queueSize,
        hasQueuedTransactions,
        queueTransaction,
        removeTransaction,
        syncPendingTransactions,
        updateOnlineStatus
    }
})
