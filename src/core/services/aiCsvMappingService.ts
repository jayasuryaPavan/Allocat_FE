import { invenGaduApi } from './invenGaduApi'

export interface ColumnMapping {
  csvColumn: string
  mappedField: string
  confidence: number
  reasoning?: string
}

export interface AIMappingResult {
  mappings: ColumnMapping[]
  unmappedColumns: string[]
  suggestions: string[]
}

export interface DataIssue {
  row: number
  column: string
  issue: string
  severity: 'error' | 'warning' | 'info'
  suggestion?: string
}

export class AICsvMappingService {
  private static readonly TARGET_FIELDS = {
    product: ['productCode', 'name', 'description', 'category', 'unitPrice', 
              'unitOfMeasure', 'minimumStockLevel', 'barcode', 'sku', 'brand', 
              'model', 'color', 'size', 'weight'],
    receivedStock: ['productCode', 'productName', 'expectedQuantity', 
                    'unitPrice', 'supplierName', 'supplierInvoice', 'batchNumber', 'notes']
  }

  /**
   * AI analyzes CSV headers and suggests mappings
   */
  static async analyzeAndMapColumns(
    csvHeaders: string[],
    sampleRows: Record<string, any>[],
    targetType: 'product' | 'receivedStock' = 'receivedStock'
  ): Promise<AIMappingResult> {
    const targetFields = this.TARGET_FIELDS[targetType]
    
    const prompt = `You are a CSV data mapping expert for an inventory management system.

**User's CSV Headers:** ${csvHeaders.join(', ')}

**Sample Data (first 3 rows):**
${JSON.stringify(sampleRows.slice(0, 3), null, 2)}

**Target API Fields:** ${targetFields.join(', ')}

**Task:** Map each CSV column to the most appropriate target field. Return a JSON array of mappings:
[
  {
    "csvColumn": "original_column_name",
    "mappedField": "target_field_name",
    "confidence": 0.95,
    "reasoning": "Why this mapping makes sense"
  }
]

**Rules:**
- productCode/sku: unique identifiers (SKU, Code, Item#, etc.)
- productName/name: product names
- expectedQuantity/quantity: numeric stock amounts
- unitPrice/price: monetary values
- Only map if confidence > 0.6
- If unsure or no good match, set mappedField to "unmapped"
- Be flexible with variations (e.g., "Qty" -> expectedQuantity, "Item Name" -> productName)

Return ONLY the JSON array, no markdown formatting.`

    try {
      const response = await invenGaduApi.sendMessage({
        message: prompt,
        conversationId: 'csv-mapping-' + Date.now()
      })

      if (response.success && response.data) {
        const mappings = this.parseAIResponse(response.data.message)
        if (mappings.length > 0) {
          return this.buildMappingResult(mappings, csvHeaders)
        }
      }
    } catch (error) {
      console.warn('AI mapping failed, falling back to heuristic:', error)
    }

    // Fallback: rule-based mapping
    return this.heuristicMapping(csvHeaders, targetFields)
  }

  /**
   * Parse AI response and extract mappings
   */
  private static parseAIResponse(aiMessage: string): ColumnMapping[] {
    try {
      // Extract JSON from markdown code blocks if present
      const jsonMatch = aiMessage.match(/```(?:json)?\s*([\s\S]*?)\s*```/) || 
                       aiMessage.match(/\[[\s\S]*?\]/)
      const jsonString = jsonMatch ? (jsonMatch[1] || jsonMatch[0]) : aiMessage
      const parsed = JSON.parse(jsonString.trim())
      return Array.isArray(parsed) ? parsed : []
    } catch (error) {
      console.error('Failed to parse AI response:', error)
      return []
    }
  }

  /**
   * Build mapping result with validation
   */
  private static buildMappingResult(
    mappings: ColumnMapping[], 
    csvHeaders: string[]
  ): AIMappingResult {
    const validMappings = mappings.filter(m => 
      m.confidence > 0.6 && m.mappedField !== 'unmapped'
    )
    const mappedCols = new Set(validMappings.map(m => m.csvColumn))
    const unmapped = csvHeaders.filter(h => !mappedCols.has(h))

    return {
      mappings: validMappings,
      unmappedColumns: unmapped,
      suggestions: this.generateSuggestions(unmapped, validMappings)
    }
  }

  /**
   * Fallback heuristic mapping using pattern matching
   */
  private static heuristicMapping(
    headers: string[],
    targetFields: string[]
  ): AIMappingResult {
    const mappings: ColumnMapping[] = []
    const synonyms: Record<string, string[]> = {
      productCode: ['sku', 'code', 'item_code', 'product_id', 'item_id', 'item#', 'itemcode', 'product_code'],
      productName: ['name', 'item_name', 'product', 'item', 'description', 'product_name', 'itemname'],
      expectedQuantity: ['qty', 'quantity', 'amount', 'count', 'stock', 'expected_quantity', 'expected_qty'],
      unitPrice: ['price', 'cost', 'unit_price', 'rate', 'value', 'unitprice', 'unit_cost'],
      supplierName: ['supplier', 'vendor', 'manufacturer', 'supplier_name'],
      category: ['category', 'type', 'group', 'class'],
      batchNumber: ['batch', 'batch_number', 'lot', 'lot_number'],
      supplierInvoice: ['invoice', 'supplier_invoice', 'invoice_number', 'po', 'purchase_order']
    }

    headers.forEach(header => {
      const normalized = header.toLowerCase().replace(/[_\s-]/g, '')
      
      for (const [field, syns] of Object.entries(synonyms)) {
        if (targetFields.includes(field)) {
          for (const syn of syns) {
            const normalizedSyn = syn.replace(/[_\s-]/g, '')
            if (normalized.includes(normalizedSyn) || normalizedSyn.includes(normalized)) {
              mappings.push({
                csvColumn: header,
                mappedField: field,
                confidence: 0.85,
                reasoning: `Pattern matched: ${syn}`
              })
              return // Move to next header
            }
          }
        }
      }
    })

    const mapped = new Set(mappings.map(m => m.csvColumn))
    return {
      mappings,
      unmappedColumns: headers.filter(h => !mapped.has(h)),
      suggestions: this.generateSuggestions(headers.filter(h => !mapped.has(h)), mappings)
    }
  }

  /**
   * Generate helpful suggestions for unmapped columns
   */
  private static generateSuggestions(
    unmapped: string[],
    mappings: ColumnMapping[]
  ): string[] {
    const suggestions: string[] = []
    
    if (unmapped.length > 0) {
      suggestions.push(`${unmapped.length} column(s) couldn't be mapped automatically: ${unmapped.join(', ')}`)
    }
    
    const requiredFields = ['productCode', 'productName', 'expectedQuantity', 'unitPrice']
    const mappedFields = new Set(mappings.map(m => m.mappedField))
    const missing = requiredFields.filter(f => !mappedFields.has(f))
    
    if (missing.length > 0) {
      suggestions.push(`⚠️ Missing required fields: ${missing.join(', ')}. Please map them manually.`)
    }
    
    return suggestions
  }

  /**
   * Validate and clean data based on mappings
   */
  static async validateAndCleanData(
    rows: Record<string, any>[],
    mappings: ColumnMapping[]
  ): Promise<{
    cleanedRows: Record<string, any>[]
    issues: DataIssue[]
    suggestions: string[]
  }> {
    const issues: DataIssue[] = []
    const cleanedRows: Record<string, any>[] = []

    // Basic validation
    rows.forEach((row, idx) => {
      const cleaned: Record<string, any> = {}
      
      mappings.forEach(mapping => {
        const value = row[mapping.csvColumn]
        
        // Check for required fields
        if (['productCode', 'productName', 'expectedQuantity', 'unitPrice'].includes(mapping.mappedField)) {
          if (!value || value === '') {
            issues.push({
              row: idx + 1,
              column: mapping.csvColumn,
              issue: `Required field '${mapping.mappedField}' is empty`,
              severity: 'error'
            })
          }
        }

        // Validate numeric fields
        if (['expectedQuantity', 'unitPrice'].includes(mapping.mappedField)) {
          const numValue = parseFloat(value)
          if (isNaN(numValue)) {
            issues.push({
              row: idx + 1,
              column: mapping.csvColumn,
              issue: `Invalid number: '${value}'`,
              severity: 'error',
              suggestion: 'Please provide a valid number'
            })
          } else if (numValue < 0) {
            issues.push({
              row: idx + 1,
              column: mapping.csvColumn,
              issue: `Negative value: ${numValue}`,
              severity: 'warning',
              suggestion: 'Values should be positive'
            })
          }
          cleaned[mapping.mappedField] = numValue
        } else {
          cleaned[mapping.mappedField] = value
        }
      })

      cleanedRows.push(cleaned)
    })

    // Check for duplicates
    const productCodes = cleanedRows.map(r => r.productCode).filter(Boolean)
    const duplicates = productCodes.filter((code, idx) => productCodes.indexOf(code) !== idx)
    if (duplicates.length > 0) {
      issues.push({
        row: 0,
        column: 'productCode',
        issue: `Duplicate product codes found: ${[...new Set(duplicates)].join(', ')}`,
        severity: 'warning',
        suggestion: 'Consider consolidating duplicate entries'
      })
    }

    return {
      cleanedRows,
      issues,
      suggestions: issues.length > 0 
        ? [`Found ${issues.length} issue(s). Review before importing.`]
        : ['Data looks good! Ready to import.']
    }
  }

  /**
   * Transform CSV data using confirmed mappings
   */
  static transformData(
    csvRows: Record<string, any>[],
    mappings: ColumnMapping[]
  ): Record<string, any>[] {
    return csvRows.map(row => {
      const transformed: Record<string, any> = {}
      mappings.forEach(mapping => {
        if (mapping.mappedField !== 'unmapped') {
          transformed[mapping.mappedField] = row[mapping.csvColumn]
        }
      })
      return transformed
    })
  }
}

