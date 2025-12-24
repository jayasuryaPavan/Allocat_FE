// Customer types based on API documentation

export interface Customer {
  id: number
  customerCode: string
  name: string
  email?: string
  phone?: string
  address?: string
  city?: string
  state?: string
  country?: string
  postalCode?: string
  invoiceNumber?: string
  taxId?: string
  companyName?: string
  contactPerson?: string
  notes?: string
  isActive: boolean
  storeId: number
  storeCode?: string
  storeName?: string
  createdAt: string
  updatedAt: string
}

export interface CreateCustomerRequest {
  customerCode: string
  name: string
  email?: string
  phone?: string
  address?: string
  city?: string
  state?: string
  country?: string
  postalCode?: string
  invoiceNumber?: string
  taxId?: string
  companyName?: string
  contactPerson?: string
  notes?: string
  storeId: number
}

export interface UpdateCustomerRequest {
  customerCode?: string
  name?: string
  email?: string
  phone?: string
  address?: string
  city?: string
  state?: string
  country?: string
  postalCode?: string
  invoiceNumber?: string
  taxId?: string
  companyName?: string
  contactPerson?: string
  notes?: string
  isActive?: boolean
}

export interface CustomerFilters {
  storeId?: number
  active?: boolean
  search?: string
}



