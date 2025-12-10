export enum PaymentType {
    CASH = 'CASH',
    CARD = 'CARD',
    MOBILE_MONEY = 'MOBILE_MONEY',
    BANK_TRANSFER = 'BANK_TRANSFER',
    SPLIT = 'SPLIT'
}

export enum PaymentStatus {
    PENDING = 'PENDING',
    COMPLETED = 'COMPLETED',
    FAILED = 'FAILED',
    REFUNDED = 'REFUNDED'
}

export enum OrderStatus {
    DRAFT = 'DRAFT',
    PENDING = 'PENDING',
    CONFIRMED = 'CONFIRMED',
    PROCESSING = 'PROCESSING',
    COMPLETED = 'COMPLETED',
    CANCELLED = 'CANCELLED',
    HELD = 'HELD',
    RETURNED = 'RETURNED'
}

export enum DiscountType {
    PERCENTAGE = 'PERCENTAGE',
    FIXED_AMOUNT = 'FIXED_AMOUNT',
    BUY_X_GET_Y = 'BUY_X_GET_Y'
}

export enum ShiftStatus {
    PENDING = 'PENDING',
    ACTIVE = 'ACTIVE',
    COMPLETED = 'COMPLETED',
    CANCELLED = 'CANCELLED'
}

export enum ShiftSwapStatus {
    PENDING = 'PENDING',
    APPROVED = 'APPROVED',
    MANAGER_APPROVED = 'MANAGER_APPROVED',
    REJECTED = 'REJECTED',
    CANCELLED = 'CANCELLED'
}

export enum SalesPersonLoginType {
    SHIFT_START = 'SHIFT_START',
    BREAK_RETURN = 'BREAK_RETURN',
    SHIFT_END = 'SHIFT_END',
    DAY_END = 'DAY_END'
}

export interface Shift {
    id: number
    storeId: number
    userId: number
    userName?: string
    shiftDate: string
    startedAt?: string
    endedAt?: string
    expectedStartTime?: string
    expectedEndTime?: string
    startingCashAmount?: number
    endingCashAmount?: number
    expectedCashAmount?: number
    cashDifference?: number
    status: ShiftStatus
    notes?: string
    endedBy?: number
    createdAt?: string
}

export interface ShiftSwap {
    id: number
    storeId: number
    originalShiftId: number
    requestedByUserId: number
    requestedToUserId: number
    requestedByName?: string
    requestedToName?: string
    originalShiftDate: string
    swapShiftDate: string
    status: ShiftSwapStatus
    reason?: string
    managerNotes?: string
    approvedBy?: number
    rejectedBy?: number
    approvedAt?: string
    rejectedAt?: string
    createdAt?: string
}

export interface SalesPersonLogin {
    id: number
    storeId: number
    userId: number
    userName?: string
    shiftId?: number
    loginTime: string
    logoutTime?: string
    loginType: SalesPersonLoginType
    deviceInfo?: string
    ipAddress?: string
    location?: string
    createdAt?: string
}

export interface Discount {
    id: number;
    code: string;
    name: string;
    type: DiscountType;
    value: number;
    minPurchaseAmount?: number;
    maxDiscountAmount?: number;
    validFrom?: string;
    validTo?: string;
    maxUsageCount?: number;
    currentUsageCount?: number;
    isActive: boolean;
}

export interface CartItem {
    itemId: string;
    productId: number;
    productName: string;
    sku: string;
    barcode: string;
    quantity: number;
    unitPrice: number;
    taxRate: number;
    taxAmount: number;
    discount: number;
    total: number;
}

export interface Cart {
    cartId: string;
    storeId: number;
    cashierId: number;
    items: CartItem[];
    discount?: Discount;
    subtotal: number;
    taxAmount: number;
    discountAmount: number;
    total: number;
    createdAt: string;
}

export interface Payment {
    id: number;
    paymentType: PaymentType;
    amount: number;
    transactionId?: string;
    status: PaymentStatus;
    processedAt: string;
    notes?: string;
}

export interface SalesOrderItem {
    id: number;
    product: {
        id: number;
        name: string;
        sku: string;
        barcode: string;
        price: number;
    };
    quantity: number;
    unitPrice: number;
    discount: number;
    taxRate: number;
    taxAmount: number;
    total: number;
}

export interface SalesOrder {
    id: number;
    orderNo: string;
    store: {
        id: number;
        name: string;
    };
    customer?: {
        id: number;
        firstName: string;
        lastName: string;
        email?: string;
        phone?: string;
    };
    cashier: {
        id: number;
        firstName: string;
        lastName: string;
    };
    orderDate: string;
    subtotal: number;
    taxAmount: number;
    discountAmount: number;
    total: number;
    status: OrderStatus;
    paymentStatus: PaymentStatus;
    items: SalesOrderItem[];
    payments: Payment[];
    notes?: string;
}

export interface CheckoutRequest {
    cartId: string;
    customerId?: number;
    payments: {
        paymentType: PaymentType;
        amount: number;
        transactionId?: string;
    }[];
    notes?: string;
    emailReceipt?: boolean;
    receiptEmail?: string;
}
