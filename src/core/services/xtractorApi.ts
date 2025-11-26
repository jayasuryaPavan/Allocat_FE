import axios from 'axios'
import { environment } from '@/environments'

export interface XtractorTable {
  table_id: number
  page_number: number
  headers: string[]
  rows: string[][]
  row_count: number
  column_count: number
  metadata: {
    row_count: number
    column_count: number
    has_headers: boolean
  }
}

export interface XtractorResponse {
  extraction_id: string
  filename: string
  status: 'success' | 'failed' | 'processing'
  total_tables: number
  pages_processed: number
  tables: XtractorTable[]
  timestamp: string
  error?: string
}

export interface XtractorHealthResponse {
  status: string
  version: string
  gemini_available: boolean
}

class XtractorApiService {
  private baseUrl: string

  constructor() {
    this.baseUrl = environment.apiUrl;
  }

  /**
   * Check if Xtractor service is available
   */
  async healthCheck(): Promise<{ success: boolean; data?: XtractorHealthResponse; message?: string }> {
    try {
      const response = await axios.get<XtractorHealthResponse>(`${this.baseUrl}/health`)
      return {
        success: true,
        data: response.data
      }
    } catch (error: any) {
      return {
        success: false,
        message: error.message || 'Xtractor service unavailable'
      }
    }
  }

  /**
   * Extract tables from PDF file
   */
  async extractTables(file: File): Promise<{ success: boolean; data?: XtractorResponse; message?: string }> {
    try {
      const formData = new FormData()
      formData.append('file', file)

      const response = await axios.post<XtractorResponse>(
        `${this.baseUrl}/v1/extract`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data'
          },
          timeout: 120000 // 2 minutes timeout for large PDFs
        }
      )

      if (response.data.status === 'success') {
        return {
          success: true,
          data: response.data
        }
      } else {
        return {
          success: false,
          message: response.data.error || 'Failed to extract tables from PDF'
        }
      }
    } catch (error: any) {
      console.error('Xtractor API error:', error)
      return {
        success: false,
        message: error.response?.data?.detail || error.message || 'Failed to extract PDF tables'
      }
    }
  }

  /**
   * Get extraction status by ID
   */
  async getExtractionStatus(extractionId: string): Promise<{ success: boolean; data?: XtractorResponse; message?: string }> {
    try {
      const response = await axios.get<XtractorResponse>(
        `${this.baseUrl}/v1/extract/${extractionId}`
      )

      return {
        success: true,
        data: response.data
      }
    } catch (error: any) {
      return {
        success: false,
        message: error.response?.data?.detail || 'Extraction not found'
      }
    }
  }

  /**
   * Convert extracted table to CSV format for AI mapping
   */
  convertTableToCSV(table: XtractorTable): { headers: string[]; rows: Record<string, any>[] } {
    const headers = table.headers
    const rows = table.rows.map(row => {
      const rowObj: Record<string, any> = {}
      headers.forEach((header, index) => {
        rowObj[header] = row[index] || ''
      })
      return rowObj
    })

    return { headers, rows }
  }

  /**
   * Convert all tables to CSV format
   */
  convertAllTablesToCSV(extraction: XtractorResponse): Array<{ tableId: number; pageNumber: number; data: { headers: string[]; rows: Record<string, any>[] } }> {
    return extraction.tables.map(table => ({
      tableId: table.table_id,
      pageNumber: table.page_number,
      data: this.convertTableToCSV(table)
    }))
  }
}

export const xtractorApi = new XtractorApiService()
