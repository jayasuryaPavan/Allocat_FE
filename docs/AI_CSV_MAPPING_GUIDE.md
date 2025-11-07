# AI-Powered CSV Mapping Feature

## Overview

The AI CSV Mapping feature uses InvenGadu to automatically analyze and map CSV columns to your inventory system's API fields. This eliminates the need for users to manually match column names, making CSV imports faster and more intuitive.

## Features

### 🎯 Automatic Column Detection
- AI analyzes CSV headers and sample data
- Intelligently maps columns to target fields
- Provides confidence scores for each mapping
- Falls back to heuristic matching if AI is unavailable

### 🔍 Interactive Review Interface
- Visual table showing all mappings
- Dropdown to adjust any mapping
- Confidence indicators (green/yellow/red)
- Sample data preview for verification
- Real-time validation of required fields

### 🤖 InvenGadu Integration
- "Ask InvenGadu" button for help with unmapped columns
- Opens chat with full CSV context
- Get suggestions for difficult mappings

### ✅ Data Validation
- Checks for required fields
- Validates numeric values
- Detects duplicate product codes
- Suggests data quality improvements

## How It Works

### 1. Upload CSV
User drags or selects a CSV file with any column names.

### 2. AI Analysis
InvenGadu analyzes:
- Column headers (e.g., "SKU", "Item Name", "Qty")
- Sample data from first 3-5 rows
- Target API fields (productCode, productName, etc.)

### 3. Review Mappings
User sees interactive table:
```
Your CSV Column    Maps To              Confidence    Sample
─────────────────  ───────────────────  ────────────  ──────────
SKU                productCode          95%           ABC-123
Item Name          productName          90%           Widget A
Qty                expectedQuantity     85%           100
Price              unitPrice            90%           19.99
```

### 4. Adjust & Confirm
- User can change any mapping via dropdown
- Required fields are validated
- Click "Confirm & Import" to proceed

### 5. Transform & Import
- Data is transformed using confirmed mappings
- Imported to received stock for verification

## Configuration

### Enable/Disable Feature

In `src/environments/index.ts`:

```typescript
integrations: {
  enableAICsvMapping: true // Set to false to disable
}
```

When disabled, the system uses the original preview flow.

## Target Fields

### Received Stock Import
- `productCode` (required) - Unique product identifier
- `productName` (required) - Product name
- `expectedQuantity` (required) - Stock quantity
- `unitPrice` (required) - Price per unit
- `supplierName` (optional) - Supplier/vendor name
- `supplierInvoice` (optional) - Invoice number
- `batchNumber` (optional) - Batch/lot number
- `notes` (optional) - Additional notes

## AI Mapping Logic

### Confidence Levels
- **High (≥80%)**: Green badge - Direct match or strong pattern
- **Medium (60-79%)**: Yellow badge - Probable match
- **Low (<60%)**: Red badge - Uncertain, requires review

### Synonym Detection
The system recognizes common variations:
- Product Code: `sku`, `code`, `item_code`, `product_id`, `item#`
- Product Name: `name`, `item_name`, `product`, `item`, `description`
- Quantity: `qty`, `quantity`, `amount`, `count`, `stock`
- Price: `price`, `cost`, `unit_price`, `rate`, `value`

### Fallback Strategy
1. Try AI mapping via InvenGadu API
2. If AI fails, use heuristic pattern matching
3. If heuristic fails, columns remain unmapped
4. User can manually select from dropdown

## Components

### `AICsvMappingService`
**Location**: `src/core/services/aiCsvMappingService.ts`

**Methods**:
- `analyzeAndMapColumns()` - AI/heuristic column analysis
- `validateAndCleanData()` - Data quality checks
- `transformData()` - Apply mappings to CSV data

### `CSVColumnMappingReview`
**Location**: `src/components/CSVColumnMappingReview.vue`

**Props**:
- `mappingResult` - AI mapping results
- `sampleData` - CSV rows for preview
- `availableFields` - Target field list

**Events**:
- `confirm` - User confirms mappings
- `cancel` - User cancels import
- `askAI` - User requests AI help

### `InventoryView` Integration
**Location**: `src/features/inventory/views/InventoryView.vue`

**Flow**:
1. `handleUploadSuccess()` - Triggers AI analysis
2. `handleMappingConfirmed()` - Transforms & imports data
3. `handleAskAI()` - Opens InvenGadu chat

## Usage Examples

### Example 1: Standard Product CSV
```csv
SKU,Item Name,Quantity,Price,Supplier
ABC-123,Widget A,100,19.99,Acme Corp
DEF-456,Widget B,50,29.99,Acme Corp
```

**AI Mapping**:
- SKU → productCode (95%)
- Item Name → productName (90%)
- Quantity → expectedQuantity (90%)
- Price → unitPrice (95%)
- Supplier → supplierName (85%)

### Example 2: Non-Standard Headers
```csv
Product ID,Description,Count,Unit Cost,Vendor Name
P001,Laptop Computer,25,899.00,TechSupply Inc
P002,Wireless Mouse,150,19.99,TechSupply Inc
```

**AI Mapping**:
- Product ID → productCode (85%)
- Description → productName (80%)
- Count → expectedQuantity (80%)
- Unit Cost → unitPrice (90%)
- Vendor Name → supplierName (75%)

### Example 3: Asking InvenGadu for Help
User has unmapped column "Part#". Clicks "Ask InvenGadu":

**Chat opens with**:
```
I'm trying to import a CSV file to my inventory system. 
I have these unmapped columns: Part#.

My CSV sample data looks like this:
[{ "Part#": "XYZ-789", "Name": "Cable", ... }]

My target fields are: productCode, productName, expectedQuantity, unitPrice...

Can you help me understand which columns should map to which target fields?
```

**InvenGadu responds**:
```
The "Part#" column appears to be a product identifier. 
I recommend mapping it to "productCode" since it contains 
unique identifiers like "XYZ-789".
```

## Best Practices

### For Users
1. **Use descriptive column headers** - "Product Code" is better than "Col1"
2. **Keep headers consistent** - Stick to one naming convention
3. **Review confidence scores** - Yellow/red badges need attention
4. **Ask InvenGadu** - Use AI help for unclear mappings
5. **Validate data** - Check sample values before confirming

### For Developers
1. **Add new synonyms** - Update `heuristicMapping()` for new patterns
2. **Improve prompts** - Refine AI prompts in `analyzeAndMapColumns()`
3. **Handle edge cases** - Add validation for special data types
4. **Monitor errors** - Log AI failures for improvement
5. **Test with real CSVs** - Use actual customer data formats

## Troubleshooting

### AI Mapping Fails
- **Fallback**: Heuristic matching activates automatically
- **Action**: Check InvenGadu API connectivity
- **Workaround**: Disable `enableAICsvMapping` temporarily

### Low Confidence Scores
- **Cause**: Non-standard column names
- **Solution**: Manually adjust mappings in dropdown
- **Tip**: Ask InvenGadu for suggestions

### Missing Required Fields
- **Error**: Red banner shows missing fields
- **Action**: Map unmapped columns to required fields
- **Required**: productCode, productName, expectedQuantity, unitPrice

### Duplicate Mappings
- **Warning**: Console logs duplicate detection
- **Action**: Ensure each target field maps to only one CSV column
- **Fix**: Change one of the duplicates to "Skip"

## Future Enhancements

- [ ] Learn from user corrections (ML feedback loop)
- [ ] Store mapping templates per supplier
- [ ] Auto-detect data types (dates, currencies)
- [ ] Suggest data transformations (e.g., "10 ea" → 10)
- [ ] Multi-file batch imports with same mapping
- [ ] Export mapping configuration as JSON
- [ ] Import mapping from previous uploads

## Support

For questions or issues:
1. Check this documentation
2. Ask InvenGadu in the app
3. Review console logs for detailed errors
4. Contact development team

---

**Last Updated**: November 2025  
**Feature Version**: 1.0.0  
**Status**: ✅ Production Ready

