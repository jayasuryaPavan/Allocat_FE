# Allocat ERP - Inventory Management System

This guide explains the complete inventory management workflow in the Allocat ERP system, including CSV import, stock verification, and discrepancy management.

## Overview

The inventory management system follows a comprehensive workflow from CSV upload to verified inventory management, similar to your Pinnacle-Wholesale-FE project but specifically designed for the Allocat ERP backend API structure.

## System Workflow

### 1. CSV Upload Process
1. **Upload CSV**: Frontend uploads CSV with unverified stock data
2. **Received Stock**: Data is stored as "received stock" with PENDING status
3. **Verification**: Client verifies actual received quantities
4. **Inventory Update**: Verified stock is added to inventory

### 2. Key Features
- **Drag & Drop Upload**: Easy file upload with drag and drop support
- **Data Validation**: Comprehensive validation of CSV data with detailed error reporting
- **Stock Verification**: Interactive verification of received stock
- **Discrepancy Management**: Track and resolve stock discrepancies
- **Real-time Updates**: Live inventory updates after verification
- **Multi-tab Interface**: Separate views for inventory, received stock, and discrepancies

## Supported CSV Format

### Required Columns
- `product_code` - Unique product identifier
- `product_name` - Product name
- `expected_quantity` - Expected quantity from supplier (must be >= 0)
- `unit_price` - Price per unit (must be >= 0)

### Optional Columns
- `supplier_name` - Supplier name
- `supplier_invoice` - Supplier invoice number
- `batch_number` - Batch identifier
- `notes` - Additional notes or comments

## How to Use

### 1. Access the Import Feature
- Navigate to the Inventory section
- Click the "Import CSV" button in the top-right corner

### 2. Upload Your CSV File
- Drag and drop your CSV file onto the upload area, or
- Click the upload area to browse and select your file
- The system will automatically validate the file format

### 3. Review Your Data
- Preview the parsed data in a table format
- Check validation errors if any
- Review statistics (total rows, valid rows, invalid rows)

### 4. Import to Received Stock
- Click "Import X Items" to upload the data to received stock
- Items will be created with PENDING status
- You'll be redirected to the "Received Stock" tab

### 5. Verify Received Stock
- Navigate to the "Received Stock" tab
- Review each item and enter the actual verified quantity
- Click "Verify Stock" to add items to inventory
- Or click "Reject" to mark items as rejected

### 6. Monitor Discrepancies
- Navigate to the "Discrepancies" tab to review any stock discrepancies
- Resolve discrepancies as needed

## CSV Template

Download the CSV template to ensure your data is formatted correctly:

```csv
product_code,product_name,expected_quantity,unit_price,supplier_name,supplier_invoice,batch_number,notes
PROD001,Sample Product,10,99.99,Supplier A,INV-001,BATCH-001,Sample description
```

## Data Validation Rules

### Required Fields
- All required fields must be present and non-empty
- SKU must be unique (duplicates will be flagged)

### Data Types
- `quantity`, `unit_price`, `min_stock_level`, `max_stock_level`, `reorder_point` must be valid numbers
- All numeric fields must be >= 0
- Text fields are automatically trimmed

### Business Rules
- `max_stock_level` should be >= `min_stock_level` (warning if not)
- `reorder_point` should be <= `min_stock_level` (warning if not)

## Error Handling

The system provides detailed error messages for:
- Missing required fields
- Invalid data types
- Business rule violations
- File format issues

Errors are displayed with:
- Row number
- Column name
- Error message
- Invalid value

## Best Practices

### 1. Prepare Your Data
- Use the provided template
- Ensure all required fields are filled
- Use consistent formatting for categories and suppliers
- Avoid special characters in SKUs

### 2. Test with Small Files
- Start with a small test file (5-10 items)
- Verify the import works correctly
- Then proceed with larger files

### 3. Data Quality
- Use consistent naming conventions
- Ensure SKUs are unique
- Set appropriate stock levels
- Include meaningful descriptions

## File Size Limits

- Maximum file size: 10MB
- Recommended: Keep files under 5MB for better performance
- For very large datasets, consider splitting into multiple files

## Troubleshooting

### Common Issues

1. **"No valid data found"**
   - Check that your CSV has the correct headers
   - Ensure required fields are not empty
   - Verify data types are correct

2. **"CSV parsing errors"**
   - Check file encoding (use UTF-8)
   - Ensure proper CSV formatting
   - Avoid special characters in headers

3. **"File size too large"**
   - Split your file into smaller chunks
   - Remove unnecessary columns
   - Compress the file if possible

### Getting Help

If you encounter issues:
1. Check the error messages in the preview
2. Download and use the template
3. Verify your data format
4. Contact support with specific error messages

## Technical Details

### Supported File Formats
- CSV files only (.csv extension)
- UTF-8 encoding recommended
- Comma-separated values
- First row should contain headers

### Performance
- Processing time depends on file size
- Large files (>1000 rows) may take a few seconds
- Progress indicators show processing status

### Data Processing
- Automatic calculation of total values
- Duplicate detection based on SKU
- Automatic status assignment (In Stock, Low Stock, Out of Stock)
- Timestamp generation for created/updated dates

## Integration with Existing Features

The imported data integrates seamlessly with:
- Inventory dashboard statistics
- Search and filtering
- Stock level monitoring
- Reporting features
- POS system integration

## Security Considerations

- Files are processed client-side for privacy
- No data is sent to external servers during processing
- Temporary data is cleared after import
- All validation happens locally

## Future Enhancements

Planned improvements include:
- Excel file support (.xlsx)
- API integration for real-time validation
- Bulk update capabilities
- Advanced data mapping options
- Integration with supplier systems