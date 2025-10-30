import { computed } from 'vue'

export function useCurrency() {
  /**
   * Format currency value
   */
  const formatCurrency = (
    value: number | string | null | undefined,
    currency: string = 'USD',
    display: 'symbol' | 'code' | 'name' = 'symbol',
    digitsInfo?: string,
    locale?: string
  ): string => {
    if (value === null || value === undefined || value === '') {
      return ''
    }

    const numericValue = typeof value === 'string' ? parseFloat(value) : value
    
    if (isNaN(numericValue)) {
      return ''
    }

    try {
      const options: Intl.NumberFormatOptions = {
        style: 'currency',
        currency: currency,
        currencyDisplay: display,
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
      }

      if (digitsInfo) {
        const [minIntegerDigits, minFractionDigits, maxFractionDigits] = digitsInfo.split('.')
        options.minimumIntegerDigits = parseInt(minIntegerDigits) || 1
        options.minimumFractionDigits = parseInt(minFractionDigits) || 0
        options.maximumFractionDigits = parseInt(maxFractionDigits) || 2
      }

      return new Intl.NumberFormat(locale || 'en-US', options).format(numericValue)
    } catch (error) {
      console.error('Currency formatting error:', error)
      return numericValue.toString()
    }
  }

  /**
   * Format number with thousand separators
   */
  const formatNumber = (
    value: number | string | null | undefined,
    locale?: string,
    options?: Intl.NumberFormatOptions
  ): string => {
    if (value === null || value === undefined || value === '') {
      return ''
    }

    const numericValue = typeof value === 'string' ? parseFloat(value) : value
    
    if (isNaN(numericValue)) {
      return ''
    }

    try {
      return new Intl.NumberFormat(locale || 'en-US', options).format(numericValue)
    } catch (error) {
      console.error('Number formatting error:', error)
      return numericValue.toString()
    }
  }

  /**
   * Format percentage
   */
  const formatPercentage = (
    value: number | string | null | undefined,
    decimals: number = 2,
    locale?: string
  ): string => {
    if (value === null || value === undefined || value === '') {
      return ''
    }

    const numericValue = typeof value === 'string' ? parseFloat(value) : value
    
    if (isNaN(numericValue)) {
      return ''
    }

    try {
      return new Intl.NumberFormat(locale || 'en-US', {
        style: 'percent',
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals
      }).format(numericValue / 100)
    } catch (error) {
      console.error('Percentage formatting error:', error)
      return `${numericValue}%`
    }
  }

  /**
   * Parse currency string to number
   */
  const parseCurrency = (currencyString: string): number => {
    if (!currencyString) return 0
    
    // Remove currency symbols and thousand separators
    const cleaned = currencyString.replace(/[^\d.-]/g, '')
    const parsed = parseFloat(cleaned)
    
    return isNaN(parsed) ? 0 : parsed
  }

  /**
   * Get currency symbol
   */
  const getCurrencySymbol = (currency: string): string => {
    try {
      return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: currency,
        currencyDisplay: 'symbol'
      }).formatToParts(0).find(part => part.type === 'currency')?.value || currency
    } catch {
      return currency
    }
  }

  /**
   * Get currency name
   */
  const getCurrencyName = (currency: string): string => {
    try {
      return new Intl.DisplayNames(['en'], { type: 'currency' }).of(currency) || currency
    } catch {
      return currency
    }
  }

  /**
   * Convert currency
   */
  const convertCurrency = (
    amount: number,
    fromCurrency: string,
    toCurrency: string,
    exchangeRate: number
  ): number => {
    return amount * exchangeRate
  }

  /**
   * Calculate tax
   */
  const calculateTax = (amount: number, taxRate: number): number => {
    return amount * (taxRate / 100)
  }

  /**
   * Calculate discount
   */
  const calculateDiscount = (
    amount: number,
    discountType: 'percentage' | 'fixed',
    discountValue: number
  ): number => {
    if (discountType === 'percentage') {
      return amount * (discountValue / 100)
    } else {
      return Math.min(discountValue, amount)
    }
  }

  /**
   * Calculate total with tax and discount
   */
  const calculateTotal = (
    subtotal: number,
    taxRate: number = 0,
    discountType: 'percentage' | 'fixed' = 'percentage',
    discountValue: number = 0
  ): {
    subtotal: number
    discount: number
    tax: number
    total: number
  } => {
    const discount = calculateDiscount(subtotal, discountType, discountValue)
    const afterDiscount = subtotal - discount
    const tax = calculateTax(afterDiscount, taxRate)
    const total = afterDiscount + tax

    return {
      subtotal,
      discount,
      tax,
      total
    }
  }

  return {
    formatCurrency,
    formatNumber,
    formatPercentage,
    parseCurrency,
    getCurrencySymbol,
    getCurrencyName,
    convertCurrency,
    calculateTax,
    calculateDiscount,
    calculateTotal
  }
}