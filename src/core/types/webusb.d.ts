// Minimal WebUSB type declarations for TypeScript
export interface USBDevice {
    vendorId: number;
    productId: number;
    productName?: string;
    opened?: boolean;
    configuration?: any;
    open(): Promise<void>;
    selectConfiguration(configurationValue: number): Promise<void>;
    claimInterface(interfaceNumber: number): Promise<void>;
    releaseInterface(interfaceNumber: number): Promise<void>;
    close(): Promise<void>;
    transferOut(endpointNumber: number, data: Uint8Array): Promise<any>;
}

export interface USB {
    requestDevice(options: { filters: Array<{ vendorId: number }> }): Promise<USBDevice>;
    getDevices(): Promise<USBDevice[]>;
}

declare global {
    interface Navigator {
        usb: USB;
    }
}
