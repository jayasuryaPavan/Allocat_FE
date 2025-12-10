/**
 * Hardware Service for POS peripherals
 * Supports WebUSB thermal printers and cash drawer triggers
 */

import type { USBDevice } from '../types/webusb';

// ESC/POS Commands
const ESC = '\x1B';
const GS = '\x1D';

export interface PrinterDevice {
    device: USBDevice;
    name: string;
    vendorId: number;
    productId: number;
}

export class HardwareService {
    private connectedPrinter: USBDevice | null = null;
    private printerInterfaceNumber: number = 0;

    /**
     * Request access to USB printer
     */
    async requestPrinter(): Promise<PrinterDevice | null> {
        try {
            const device = await navigator.usb.requestDevice({
                filters: [
                    { vendorId: 0x04b8 }, // Epson
                    { vendorId: 0x0519 }, // Star Micronics
                    { vendorId: 0x154f }, // Citizen
                    { vendorId: 0x0483 }, // Generic
                ],
            });
            await device.open();
            if (device.configuration === null) {
                await device.selectConfiguration(1);
            }
            const interfaceNumber = device.configuration?.interfaces[0].interfaceNumber || 0;
            await device.claimInterface(interfaceNumber);
            this.connectedPrinter = device;
            this.printerInterfaceNumber = interfaceNumber;
            return {
                device,
                name: device.productName || 'Unknown Printer',
                vendorId: device.vendorId,
                productId: device.productId,
            };
        } catch (error) {
            console.error('Failed to connect to printer:', error);
            return null;
        }
    }

    /**
     * Get list of already paired printers
     */
    async getPairedPrinters(): Promise<PrinterDevice[]> {
        try {
            const devices = await navigator.usb.getDevices();
            return devices.map((device: USBDevice) => ({
                device,
                name: device.productName || 'Unknown Printer',
                vendorId: device.vendorId,
                productId: device.productId,
            }));
        } catch (error) {
            console.error('Failed to get paired printers:', error);
            return [];
        }
    }

    /**
     * Connect to a specific printer
     */
    async connectToPrinter(device: USBDevice): Promise<boolean> {
        try {
            if (device.opened) {
                this.connectedPrinter = device;
                return true;
            }
            await device.open();
            if (device.configuration === null) {
                await device.selectConfiguration(1);
            }
            const interfaceNumber = device.configuration?.interfaces[0].interfaceNumber || 0;
            await device.claimInterface(interfaceNumber);
            this.connectedPrinter = device;
            this.printerInterfaceNumber = interfaceNumber;
            return true;
        } catch (error) {
            console.error('Failed to connect to printer:', error);
            return false;
        }
    }

    /**
     * Disconnect from printer
     */
    async disconnect(): Promise<void> {
        if (this.connectedPrinter) {
            try {
                await this.connectedPrinter.releaseInterface(this.printerInterfaceNumber);
                await this.connectedPrinter.close();
            } catch (error) {
                console.error('Error disconnecting printer:', error);
            }
            this.connectedPrinter = null;
        }
    }

    /**
     * Send raw data to printer
     */
    private async sendToPrinter(data: Uint8Array): Promise<boolean> {
        if (!this.connectedPrinter) {
            throw new Error('No printer connected');
        }
        try {
            const device = this.connectedPrinter;
            const iface = device.configuration?.interfaces[this.printerInterfaceNumber];
            const alternate = iface?.alternates[0];
            const outEndpoint = alternate?.endpoints.find((ep: any) => ep.direction === 'out');
            if (!outEndpoint) {
                throw new Error('No OUT endpoint found');
            }
            await device.transferOut(outEndpoint.endpointNumber, data);
            return true;
        } catch (error) {
            console.error('Failed to send data to printer:', error);
            return false;
        }
    }

    /**
     * Print text with formatting
     */
    async printText(
        text: string,
        options: { bold?: boolean; underline?: boolean; align?: 'left' | 'center' | 'right'; size?: 'normal' | 'large' | 'xlarge' } = {}
    ): Promise<boolean> {
        let commands = '';
        // Initialize
        commands += ESC + '@';
        // Alignment
        if (options.align === 'center') {
            commands += ESC + 'a' + '\x01';
        } else if (options.align === 'right') {
            commands += ESC + 'a' + '\x02';
        } else {
            commands += ESC + 'a' + '\x00';
        }
        // Text size
        if (options.size === 'large') {
            commands += GS + '!' + '\x11';
        } else if (options.size === 'xlarge') {
            commands += GS + '!' + '\x22';
        }
        // Bold
        if (options.bold) {
            commands += ESC + 'E' + '\x01';
        }
        // Underline
        if (options.underline) {
            commands += ESC + '-' + '\x01';
        }
        // Add text
        commands += text;
        // Reset formatting
        commands += ESC + '@';
        const encoder = new TextEncoder();
        const data = encoder.encode(commands);
        return this.sendToPrinter(data);
    }

    /**
     * Print receipt
     */
    async printReceipt(receipt: {
        storeName: string;
        storeAddress?: string;
        orderNo: string;
        date: string;
        cashier: string;
        items: Array<{ name: string; quantity: number; price: number; total: number }>;
        subtotal: number;
        tax: number;
        total: number;
        paymentMethod: string;
        amountPaid: number;
        change?: number;
    }): Promise<boolean> {
        try {
            await this.printText(receipt.storeName, { align: 'center', size: 'large', bold: true });
            await this.printText('\n', {});
            if (receipt.storeAddress) {
                await this.printText(receipt.storeAddress, { align: 'center' });
                await this.printText('\n', {});
            }
            await this.printText('--------------------------------\n', {});
            await this.printText(`Order: ${receipt.orderNo}\n`, {});
            await this.printText(`Date: ${receipt.date}\n`, {});
            await this.printText(`Cashier: ${receipt.cashier}\n`, {});
            await this.printText('--------------------------------\n', {});
            for (const item of receipt.items) {
                await this.printText(`${item.name}\n`, {});
                await this.printText(`  ${item.quantity} x $${item.price.toFixed(2)} = $${item.total.toFixed(2)}\n`, {});
            }
            await this.printText('--------------------------------\n', {});
            await this.printText(`Subtotal:        $${receipt.subtotal.toFixed(2)}\n`, {});
            await this.printText(`Tax:             $${receipt.tax.toFixed(2)}\n`, {});
            await this.printText(`TOTAL:           $${receipt.total.toFixed(2)}\n`, { bold: true, size: 'large' });
            await this.printText('--------------------------------\n', {});
            await this.printText(`Payment: ${receipt.paymentMethod}\n`, {});
            await this.printText(`Paid:            $${receipt.amountPaid.toFixed(2)}\n`, {});
            if (receipt.change !== undefined && receipt.change > 0) {
                await this.printText(`Change:          $${receipt.change.toFixed(2)}\n`, {});
            }
            await this.printText('\n\n', {});
            await this.printText('Thank you for your business!\n', { align: 'center' });
            await this.printText('\n\n\n\n', {});
            await this.cut();
            return true;
        } catch (error) {
            console.error('Failed to print receipt:', error);
            return false;
        }
    }

    /**
     * Cut paper
     */
    async cut(): Promise<boolean> {
        const cutCommand = GS + 'V' + '\x00'; // Full cut
        const encoder = new TextEncoder();
        const data = encoder.encode(cutCommand);
        return this.sendToPrinter(data);
    }

    /**
     * Open cash drawer
     */
    async openCashDrawer(): Promise<boolean> {
        const drawerCommand = ESC + 'p' + '\x00' + '\x19' + '\xFA';
        const encoder = new TextEncoder();
        const data = encoder.encode(drawerCommand);
        return this.sendToPrinter(data);
    }

    /**
     * Test print
     */
    async testPrint(): Promise<boolean> {
        await this.printText('TEST PRINT\n', { align: 'center', size: 'large', bold: true });
        await this.printText('--------------------------------\n', {});
        await this.printText('This is a test receipt\n', { align: 'center' });
        await this.printText('If you can read this,\n', { align: 'center' });
        await this.printText('the printer is working!\n', { align: 'center' });
        await this.printText('\n\n\n\n', {});
        await this.cut();
        return true;
    }

    /**
     * Check if printer is connected
     */
    isConnected(): boolean {
        return this.connectedPrinter !== null;
    }
}

// Create singleton instance
export const hardwareService = new HardwareService();
