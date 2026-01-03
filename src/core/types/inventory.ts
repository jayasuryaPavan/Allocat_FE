// Product interface matching backend API
export interface Product {
  id: number
  productCode: string
  name: string
  description?: string
  category: string
  unitPrice: number
  unitOfMeasure: string
  minimumStockLevel: number
  maximumStockLevel: number
  isActive: boolean
  supplierName?: string
  barcode?: string
  sku?: string
  brand?: string
  model?: string
  color?: string
  size?: string
  weight?: number
  dimensions?: string
  createdAt?: string
  updatedAt?: string
  // Inventory fields (may be populated by API)
  availableQuantity?: number
  currentQuantity?: number
}

// Received Stock interface matching backend API exactly
export interface ReceivedStock {
  id: number
  productId?: number
  productCode: string
  productName: string
  expectedQuantity: number
  receivedQuantity: number
  verifiedQuantity: number
  unitPrice: number
  totalValue: number
  status: 'PENDING' | 'VERIFIED' | 'REJECTED' | 'PARTIAL' | 'DISCREPANCY'
  batchNumber?: string
  supplierName?: string
  supplierInvoiceNumber?: string
  deliveryDate?: string
  receivedDate: string
  verifiedDate?: string
  receivedBy?: string
  verifiedBy?: string
  csvUploadId?: number
  rowNumber?: number
  notes?: string
}

// JSON Upload Data interface for the new API endpoint
export interface ReceivedStockUploadData {
  productCode: string
  productName: string
  expectedQuantity: number
  unitPrice: number
  supplierName?: string
  supplierInvoice?: string
  batchNumber?: string
  notes?: string
}

// Inventory interface matching backend API
export interface Inventory {
  id: number
  productId: number
  product?: Product
  currentQuantity: number
  reservedQuantity: number
  availableQuantity: number
  unitCost: number
  totalValue: number
  lastUpdated: string
  lastUpdatedBy?: string
  location?: string
  warehouse?: string
  shelf?: string
  bin?: string
  batchNumber?: string
  expiryDate?: string
  supplierName?: string
  purchaseOrderNumber?: string
  receivedStockId?: number
}

// Legacy interface for backward compatibility
export interface InventoryItem {
  id?: string
  name: string
  sku: string
  category: string
  quantity: number
  unitPrice: number
  totalValue: number
  supplier?: string
  location?: string
  description?: string
  minStockLevel?: number
  maxStockLevel?: number
  reorderPoint?: number
  lastUpdated?: string
  createdAt?: string
  updatedAt?: string
}

export interface CSVInventoryData {
  headers: string[]
  rows: Record<string, any>[]
  totalRows: number
  validRows: number
  invalidRows: number
  errors: CSVError[]
}

export interface CSVError {
  row: number
  column: string
  message: string
  value: any
}

export interface CSVParseResult {
  success: boolean
  data?: CSVInventoryData
  error?: string
}

export interface InventoryCSVColumn {
  csvColumn: string
  inventoryField: keyof InventoryItem
  required: boolean
  dataType: 'string' | 'number' | 'date'
  validation?: {
    min?: number
    max?: number
    pattern?: string
  }
}

// Updated CSV columns to match backend API structure and JSON upload format
export const INVENTORY_CSV_COLUMNS: InventoryCSVColumn[] = [
  {
    csvColumn: 'product_code',
    inventoryField: 'productCode',
    required: true,
    dataType: 'string'
  },
  {
    csvColumn: 'product_name',
    inventoryField: 'productName',
    required: true,
    dataType: 'string'
  },
  {
    csvColumn: 'expected_quantity',
    inventoryField: 'expectedQuantity',
    required: true,
    dataType: 'number',
    validation: {
      min: 0
    }
  },
  {
    csvColumn: 'unit_price',
    inventoryField: 'unitPrice',
    required: true,
    dataType: 'number',
    validation: {
      min: 0
    }
  },
  {
    csvColumn: 'supplier_name',
    inventoryField: 'supplierName',
    required: false,
    dataType: 'string'
  },
  {
    csvColumn: 'supplier_invoice',
    inventoryField: 'supplierInvoice',
    required: false,
    dataType: 'string'
  },
  {
    csvColumn: 'batch_number',
    inventoryField: 'batchNumber',
    required: false,
    dataType: 'string'
  },
  {
    csvColumn: 'notes',
    inventoryField: 'notes',
    required: false,
    dataType: 'string'
  }
]

// JSON Upload columns mapping
export const JSON_UPLOAD_COLUMNS = [
  'productCode',
  'productName',
  'expectedQuantity',
  'unitPrice',
  'supplierName',
  'supplierInvoice',
  'batchNumber',
  'notes'
] as const

// Additional interfaces for API responses
export interface StockDiscrepancy {
  id: number
  productCode: string
  productName: string
  expectedQuantity: number
  receivedQuantity: number
  verifiedQuantity: number
  status: string
  shortageQuantity?: number
  notes?: string
}

export interface InventoryStats {
  totalItems: number
  inStock: number
  lowStock: number
  outOfStock: number
  totalValue: number
  discrepancies: number
}

export interface ReservationRequest {
  productId: number
  quantity: number
  reservedBy: string
  notes?: string
}

export interface ReleaseReservationRequest {
  productId: number
  quantity: number
  releasedBy: string
  notes?: string
}
