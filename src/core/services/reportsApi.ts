import { useApiService } from './api'
import type { ApiResponse } from '@/core/types/api'

export interface ShiftReportData {
  shiftId: number
  shiftDate: string
  employeeName: string
  startTime: string
  endTime: string
  duration: string
  startingCash: number
  endingCash: number
  expectedCash: number
  cashDifference: number
  
  // Sales data
  totalSales: number
  totalOrders: number
  averageTicket: number
  totalTax: number
  totalDiscounts: number
  
  // Payment breakdown
  cashPayments: number
  cardPayments: number
  mobileMoneyPayments: number
  bankTransferPayments: number
  
  // Order items detail
  orderItems: {
    orderNo: string
    time: string
    customer: string
    items: number
    subtotal: number
    tax: number
    discount: number
    total: number
    paymentMethod: string
  }[]
  
  // Top products sold
  topProducts: {
    productName: string
    quantitySold: number
    revenue: number
  }[]
}

export interface DayReportData {
  date: string
  storeName: string
  
  // Shifts summary
  totalShifts: number
  shifts: {
    shiftId: number
    employeeName: string
    startTime: string
    endTime: string
    duration: string
    sales: number
    orders: number
  }[]
  
  // Daily totals
  totalSales: number
  totalOrders: number
  averageTicket: number
  totalTax: number
  totalDiscounts: number
  netSales: number
  
  // Payment breakdown
  cashPayments: number
  cardPayments: number
  mobileMoneyPayments: number
  bankTransferPayments: number
  
  // Hourly breakdown
  hourlyBreakdown: {
    hour: string
    sales: number
    orders: number
  }[]
  
  // Top products of the day
  topProducts: {
    productName: string
    quantitySold: number
    revenue: number
  }[]
  
  // Top employees
  topEmployees: {
    employeeName: string
    sales: number
    orders: number
    averageTicket: number
  }[]
}

class ReportsApiService {
  private readonly baseUrl = '/reports'
  public apiService = useApiService()

  /**
   * Get shift report
   */
  async getShiftReport(shiftId: number): Promise<ApiResponse<ShiftReportData>> {
    try {
      const response = await this.apiService.get<ApiResponse<ShiftReportData>>(
        `${this.baseUrl}/shift/${shiftId}`
      )
      return response.data
    } catch (error: any) {
      return {
        success: false,
        data: null as any,
        message: error.response?.data?.message || 'Failed to fetch shift report'
      }
    }
  }

  /**
   * Get day report
   */
  async getDayReport(storeId: number, date: string): Promise<ApiResponse<DayReportData>> {
    try {
      const response = await this.apiService.get<ApiResponse<DayReportData>>(
        `${this.baseUrl}/day?storeId=${storeId}&date=${date}`
      )
      return response.data
    } catch (error: any) {
      return {
        success: false,
        data: null as any,
        message: error.response?.data?.message || 'Failed to fetch day report'
      }
    }
  }

  /**
   * Print shift report
   */
  printShiftReport(reportData: ShiftReportData): void {
    const printWindow = window.open('', '_blank')
    if (!printWindow) return

    const html = this.generateShiftReportHTML(reportData)
    printWindow.document.write(html)
    printWindow.document.close()
    printWindow.focus()
    
    // Auto print after a short delay to ensure rendering
    setTimeout(() => {
      printWindow.print()
    }, 250)
  }

  /**
   * Print day report
   */
  printDayReport(reportData: DayReportData): void {
    const printWindow = window.open('', '_blank')
    if (!printWindow) return

    const html = this.generateDayReportHTML(reportData)
    printWindow.document.write(html)
    printWindow.document.close()
    printWindow.focus()
    
    // Auto print after a short delay to ensure rendering
    setTimeout(() => {
      printWindow.print()
    }, 250)
  }

  /**
   * Generate HTML for shift report
   */
  private generateShiftReportHTML(data: ShiftReportData): string {
    const formatCurrency = (amount: number) => {
      return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount)
    }

    return `
<!DOCTYPE html>
<html>
<head>
  <title>Shift Report - ${data.shiftDate}</title>
  <style>
    body {
      font-family: Arial, sans-serif;
      padding: 20px;
      max-width: 800px;
      margin: 0 auto;
    }
    h1 { text-align: center; margin-bottom: 5px; }
    h2 { border-bottom: 2px solid #333; padding-bottom: 5px; margin-top: 20px; }
    .header { text-align: center; margin-bottom: 30px; }
    .info-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin: 20px 0; }
    .info-item { padding: 10px; background: #f5f5f5; }
    .info-label { font-weight: bold; color: #666; font-size: 12px; }
    .info-value { font-size: 16px; font-weight: bold; }
    table { width: 100%; border-collapse: collapse; margin: 15px 0; }
    th, td { padding: 8px; text-align: left; border-bottom: 1px solid #ddd; }
    th { background-color: #f5f5f5; font-weight: bold; }
    .text-right { text-align: right; }
    .totals { background-color: #f9f9f9; font-weight: bold; }
    .highlight { background-color: #fff3cd; }
    .cash-diff-positive { color: green; }
    .cash-diff-negative { color: red; }
    @media print {
      body { padding: 0; }
      button { display: none; }
    }
  </style>
</head>
<body>
  <div class="header">
    <h1>SHIFT REPORT</h1>
    <p><strong>Date:</strong> ${data.shiftDate}</p>
    <p><strong>Employee:</strong> ${data.employeeName}</p>
    <p><strong>Shift #${data.shiftId}</strong></p>
  </div>

  <h2>Shift Details</h2>
  <div class="info-grid">
    <div class="info-item">
      <div class="info-label">Start Time</div>
      <div class="info-value">${data.startTime}</div>
    </div>
    <div class="info-item">
      <div class="info-label">End Time</div>
      <div class="info-value">${data.endTime}</div>
    </div>
    <div class="info-item">
      <div class="info-label">Duration</div>
      <div class="info-value">${data.duration}</div>
    </div>
    <div class="info-item">
      <div class="info-label">Total Orders</div>
      <div class="info-value">${data.totalOrders}</div>
    </div>
  </div>

  <h2>Cash Reconciliation</h2>
  <div class="info-grid">
    <div class="info-item">
      <div class="info-label">Starting Cash</div>
      <div class="info-value">${formatCurrency(data.startingCash)}</div>
    </div>
    <div class="info-item">
      <div class="info-label">Expected Cash</div>
      <div class="info-value">${formatCurrency(data.expectedCash)}</div>
    </div>
    <div class="info-item">
      <div class="info-label">Actual Ending Cash</div>
      <div class="info-value">${formatCurrency(data.endingCash)}</div>
    </div>
    <div class="info-item ${data.cashDifference !== 0 ? 'highlight' : ''}">
      <div class="info-label">Cash Difference</div>
      <div class="info-value ${data.cashDifference >= 0 ? 'cash-diff-positive' : 'cash-diff-negative'}">
        ${formatCurrency(data.cashDifference)}
      </div>
    </div>
  </div>

  <h2>Sales Summary</h2>
  <table>
    <tr>
      <td>Subtotal</td>
      <td class="text-right">${formatCurrency(data.totalSales - data.totalTax + data.totalDiscounts)}</td>
    </tr>
    <tr>
      <td>Tax</td>
      <td class="text-right">${formatCurrency(data.totalTax)}</td>
    </tr>
    <tr>
      <td>Discounts</td>
      <td class="text-right">-${formatCurrency(data.totalDiscounts)}</td>
    </tr>
    <tr class="totals">
      <td>Total Sales</td>
      <td class="text-right">${formatCurrency(data.totalSales)}</td>
    </tr>
    <tr>
      <td>Average Ticket</td>
      <td class="text-right">${formatCurrency(data.averageTicket)}</td>
    </tr>
  </table>

  <h2>Payment Breakdown</h2>
  <table>
    <tr>
      <td>Cash</td>
      <td class="text-right">${formatCurrency(data.cashPayments)}</td>
    </tr>
    <tr>
      <td>Card</td>
      <td class="text-right">${formatCurrency(data.cardPayments)}</td>
    </tr>
    <tr>
      <td>Mobile Money</td>
      <td class="text-right">${formatCurrency(data.mobileMoneyPayments)}</td>
    </tr>
    <tr>
      <td>Bank Transfer</td>
      <td class="text-right">${formatCurrency(data.bankTransferPayments)}</td>
    </tr>
  </table>

  <h2>Top Products Sold</h2>
  <table>
    <thead>
      <tr>
        <th>Product</th>
        <th class="text-right">Quantity</th>
        <th class="text-right">Revenue</th>
      </tr>
    </thead>
    <tbody>
      ${data.topProducts.map(p => `
        <tr>
          <td>${p.productName}</td>
          <td class="text-right">${p.quantitySold}</td>
          <td class="text-right">${formatCurrency(p.revenue)}</td>
        </tr>
      `).join('')}
    </tbody>
  </table>

  <h2>Order Details</h2>
  <table>
    <thead>
      <tr>
        <th>Order #</th>
        <th>Time</th>
        <th>Customer</th>
        <th class="text-right">Items</th>
        <th class="text-right">Total</th>
        <th>Payment</th>
      </tr>
    </thead>
    <tbody>
      ${data.orderItems.map(order => `
        <tr>
          <td>${order.orderNo}</td>
          <td>${order.time}</td>
          <td>${order.customer}</td>
          <td class="text-right">${order.items}</td>
          <td class="text-right">${formatCurrency(order.total)}</td>
          <td>${order.paymentMethod}</td>
        </tr>
      `).join('')}
    </tbody>
  </table>

  <p style="text-align: center; margin-top: 40px; color: #666; font-size: 12px;">
    Report Generated: ${new Date().toLocaleString()}<br>
    Shift Report for ${data.employeeName}
  </p>
</body>
</html>
    `
  }

  /**
   * Generate HTML for day report
   */
  private generateDayReportHTML(data: DayReportData): string {
    const formatCurrency = (amount: number) => {
      return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount)
    }

    return `
<!DOCTYPE html>
<html>
<head>
  <title>Day Report - ${data.date}</title>
  <style>
    body {
      font-family: Arial, sans-serif;
      padding: 20px;
      max-width: 900px;
      margin: 0 auto;
    }
    h1 { text-align: center; margin-bottom: 5px; }
    h2 { border-bottom: 2px solid #333; padding-bottom: 5px; margin-top: 20px; }
    .header { text-align: center; margin-bottom: 30px; }
    .info-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 10px; margin: 20px 0; }
    .info-item { padding: 10px; background: #f5f5f5; text-align: center; }
    .info-label { font-weight: bold; color: #666; font-size: 12px; }
    .info-value { font-size: 18px; font-weight: bold; margin-top: 5px; }
    table { width: 100%; border-collapse: collapse; margin: 15px 0; }
    th, td { padding: 8px; text-align: left; border-bottom: 1px solid #ddd; }
    th { background-color: #f5f5f5; font-weight: bold; }
    .text-right { text-align: right; }
    .totals { background-color: #f9f9f9; font-weight: bold; }
    @media print {
      body { padding: 0; }
    }
  </style>
</head>
<body>
  <div class="header">
    <h1>DAILY SALES REPORT</h1>
    <p><strong>Store:</strong> ${data.storeName}</p>
    <p><strong>Date:</strong> ${data.date}</p>
  </div>

  <h2>Daily Overview</h2>
  <div class="info-grid">
    <div class="info-item">
      <div class="info-label">Total Sales</div>
      <div class="info-value">${formatCurrency(data.totalSales)}</div>
    </div>
    <div class="info-item">
      <div class="info-label">Total Orders</div>
      <div class="info-value">${data.totalOrders}</div>
    </div>
    <div class="info-item">
      <div class="info-label">Average Ticket</div>
      <div class="info-value">${formatCurrency(data.averageTicket)}</div>
    </div>
    <div class="info-item">
      <div class="info-label">Tax Collected</div>
      <div class="info-value">${formatCurrency(data.totalTax)}</div>
    </div>
    <div class="info-item">
      <div class="info-label">Discounts Given</div>
      <div class="info-value">${formatCurrency(data.totalDiscounts)}</div>
    </div>
    <div class="info-item">
      <div class="info-label">Net Sales</div>
      <div class="info-value">${formatCurrency(data.netSales)}</div>
    </div>
  </div>

  <h2>Payment Methods</h2>
  <table>
    <tr>
      <td>Cash</td>
      <td class="text-right">${formatCurrency(data.cashPayments)}</td>
      <td class="text-right">${((data.cashPayments / data.totalSales) * 100).toFixed(1)}%</td>
    </tr>
    <tr>
      <td>Card</td>
      <td class="text-right">${formatCurrency(data.cardPayments)}</td>
      <td class="text-right">${((data.cardPayments / data.totalSales) * 100).toFixed(1)}%</td>
    </tr>
    <tr>
      <td>Mobile Money</td>
      <td class="text-right">${formatCurrency(data.mobileMoneyPayments)}</td>
      <td class="text-right">${((data.mobileMoneyPayments / data.totalSales) * 100).toFixed(1)}%</td>
    </tr>
    <tr>
      <td>Bank Transfer</td>
      <td class="text-right">${formatCurrency(data.bankTransferPayments)}</td>
      <td class="text-right">${((data.bankTransferPayments / data.totalSales) * 100).toFixed(1)}%</td>
    </tr>
  </table>

  <h2>Shift Summary (${data.totalShifts} shifts)</h2>
  <table>
    <thead>
      <tr>
        <th>Shift #</th>
        <th>Employee</th>
        <th>Start</th>
        <th>End</th>
        <th>Duration</th>
        <th class="text-right">Sales</th>
        <th class="text-right">Orders</th>
      </tr>
    </thead>
    <tbody>
      ${data.shifts.map(shift => `
        <tr>
          <td>#${shift.shiftId}</td>
          <td>${shift.employeeName}</td>
          <td>${shift.startTime}</td>
          <td>${shift.endTime}</td>
          <td>${shift.duration}</td>
          <td class="text-right">${formatCurrency(shift.sales)}</td>
          <td class="text-right">${shift.orders}</td>
        </tr>
      `).join('')}
    </tbody>
  </table>

  <h2>Top Employees</h2>
  <table>
    <thead>
      <tr>
        <th>Employee</th>
        <th class="text-right">Sales</th>
        <th class="text-right">Orders</th>
        <th class="text-right">Avg Ticket</th>
      </tr>
    </thead>
    <tbody>
      ${data.topEmployees.map(emp => `
        <tr>
          <td>${emp.employeeName}</td>
          <td class="text-right">${formatCurrency(emp.sales)}</td>
          <td class="text-right">${emp.orders}</td>
          <td class="text-right">${formatCurrency(emp.averageTicket)}</td>
        </tr>
      `).join('')}
    </tbody>
  </table>

  <h2>Top Products</h2>
  <table>
    <thead>
      <tr>
        <th>Product</th>
        <th class="text-right">Quantity Sold</th>
        <th class="text-right">Revenue</th>
      </tr>
    </thead>
    <tbody>
      ${data.topProducts.map(product => `
        <tr>
          <td>${product.productName}</td>
          <td class="text-right">${product.quantitySold}</td>
          <td class="text-right">${formatCurrency(product.revenue)}</td>
        </tr>
      `).join('')}
    </tbody>
  </table>

  <h2>Hourly Breakdown</h2>
  <table>
    <thead>
      <tr>
        <th>Hour</th>
        <th class="text-right">Sales</th>
        <th class="text-right">Orders</th>
      </tr>
    </thead>
    <tbody>
      ${data.hourlyBreakdown.map(hour => `
        <tr>
          <td>${hour.hour}</td>
          <td class="text-right">${formatCurrency(hour.sales)}</td>
          <td class="text-right">${hour.orders}</td>
        </tr>
      `).join('')}
    </tbody>
  </table>

  <p style="text-align: center; margin-top: 40px; color: #666; font-size: 12px;">
    Report Generated: ${new Date().toLocaleString()}<br>
    End of Day Report for ${data.storeName}
  </p>
</body>
</html>
    `
  }
}

export const reportsApiService = new ReportsApiService()





