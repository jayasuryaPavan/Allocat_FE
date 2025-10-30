import Papa from 'papaparse'
import type { 
  InventoryItem, 
  CSVInventoryData, 
  CSVError, 
  CSVParseResult, 
  InventoryCSVColumn 
} from '../types/inventory'

export class CSVInventoryParser {
  private columns: InventoryCSVColumn[]

  constructor(columns: InventoryCSVColumn[]) {
    this.columns = columns
  }

  /**
   * Parse CSV file content and validate inventory data
   */
  async parseCSVFile(file: File): Promise<CSVParseResult> {
    try {
      const csvText = await this.readFileAsText(file)
      return this.parseCSVText(csvText)
    } catch (error) {
      return {
        success: false,
        error: `Failed to read file: ${error instanceof Error ? error.message : 'Unknown error'}`
      }
    }
  }

  /**
   * Parse CSV text content
   */
  parseCSVText(csvText: string): CSVParseResult {
    try {
      const parseResult = Papa.parse(csvText, {
        header: true,
        skipEmptyLines: true,
        transformHeader: (header: string) => header.trim().toLowerCase().replace(/\s+/g, '_')
      })

      if (parseResult.errors.length > 0) {
        return {
          success: false,
          error: `CSV parsing errors: ${parseResult.errors.map(e => e.message).join(', ')}`
        }
      }

      const data = parseResult.data as Record<string, any>[]
      const validationResult = this.validateAndTransformData(data)

      return {
        success: true,
        data: validationResult
      }
    } catch (error) {
      return {
        success: false,
        error: `Failed to parse CSV: ${error instanceof Error ? error.message : 'Unknown error'}`
      }
    }
  }

  /**
   * Validate and transform CSV data to inventory items
   */
  private validateAndTransformData(data: Record<string, any>[]): CSVInventoryData {
    const errors: CSVError[] = []
    const validRows: Record<string, any>[] = []
    const headers = this.columns.map(col => col.csvColumn)

    data.forEach((row, index) => {
      const rowErrors: CSVError[] = []
      
      // Check for required fields
      this.columns.forEach(column => {
        if (column.required && (!row[column.csvColumn] || row[column.csvColumn].toString().trim() === '')) {
          rowErrors.push({
            row: index + 1,
            column: column.csvColumn,
            message: `${column.csvColumn} is required`,
            value: row[column.csvColumn]
          })
        }
      })

      // Validate data types and constraints
      this.columns.forEach(column => {
        const value = row[column.csvColumn]
        if (value && value.toString().trim() !== '') {
          const validationError = this.validateField(column, value, index + 1)
          if (validationError) {
            rowErrors.push(validationError)
          }
        }
      })

      if (rowErrors.length === 0) {
        // Transform the row to match inventory item structure
        const transformedRow = this.transformRow(row)
        validRows.push(transformedRow)
      } else {
        errors.push(...rowErrors)
      }
    })

    return {
      headers,
      rows: validRows,
      totalRows: data.length,
      validRows: validRows.length,
      invalidRows: data.length - validRows.length,
      errors
    }
  }

  /**
   * Validate individual field
   */
  private validateField(column: InventoryCSVColumn, value: any, rowNumber: number): CSVError | null {
    const stringValue = value.toString().trim()

    // Type validation
    if (column.dataType === 'number') {
      const numValue = parseFloat(stringValue)
      if (isNaN(numValue)) {
        return {
          row: rowNumber,
          column: column.csvColumn,
          message: `${column.csvColumn} must be a valid number`,
          value
        }
      }

      // Range validation
      if (column.validation) {
        if (column.validation.min !== undefined && numValue < column.validation.min) {
          return {
            row: rowNumber,
            column: column.csvColumn,
            message: `${column.csvColumn} must be at least ${column.validation.min}`,
            value
          }
        }
        if (column.validation.max !== undefined && numValue > column.validation.max) {
          return {
            row: rowNumber,
            column: column.csvColumn,
            message: `${column.csvColumn} must be at most ${column.validation.max}`,
            value
          }
        }
      }
    }

    // Pattern validation
    if (column.validation?.pattern) {
      const regex = new RegExp(column.validation.pattern)
      if (!regex.test(stringValue)) {
        return {
          row: rowNumber,
          column: column.csvColumn,
          message: `${column.csvColumn} format is invalid`,
          value
        }
      }
    }

    return null
  }

  /**
   * Transform CSV row to inventory item structure
   */
  private transformRow(row: Record<string, any>): Record<string, any> {
    const transformed: Record<string, any> = {}

    this.columns.forEach(column => {
      const value = row[column.csvColumn]
      if (value !== undefined && value !== null && value.toString().trim() !== '') {
        if (column.dataType === 'number') {
          transformed[column.inventoryField] = parseFloat(value.toString())
        } else if (column.dataType === 'date') {
          transformed[column.inventoryField] = new Date(value.toString()).toISOString()
        } else {
          transformed[column.inventoryField] = value.toString().trim()
        }
      }
    })

    // Calculate total value if both quantity and unitPrice are present
    if (transformed.quantity && transformed.unitPrice) {
      transformed.totalValue = transformed.quantity * transformed.unitPrice
    }

    return transformed
  }

  /**
   * Read file as text
   */
  private readFileAsText(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.onload = (e) => {
        if (e.target?.result) {
          resolve(e.target.result as string)
        } else {
          reject(new Error('Failed to read file'))
        }
      }
      reader.onerror = () => reject(new Error('Failed to read file'))
      reader.readAsText(file)
    })
  }

  /**
   * Generate CSV template
   */
  generateTemplate(): string {
    const headers = this.columns.map(col => col.csvColumn)
    const sampleRow = this.columns.map(col => {
      switch (col.dataType) {
        case 'number':
          return col.validation?.min !== undefined ? col.validation.min : '0'
        case 'date':
          return '2024-01-01'
        default:
          return `Sample ${col.csvColumn}`
      }
    })

    return Papa.unparse([headers, sampleRow])
  }

  /**
   * Export data to CSV
   */
  exportToCSV(data: InventoryItem[]): string {
    const csvData = data.map(item => {
      const row: Record<string, any> = {}
      this.columns.forEach(column => {
        const value = item[column.inventoryField]
        row[column.csvColumn] = value !== undefined ? value : ''
      })
      return row
    })

    return Papa.unparse(csvData)
  }
}
