import { IAddress } from './address';
import { IBasketItem } from './basket';
import { IDeliveryMethod } from './deliveryMethod';

// Interface to represent an order
export interface IOrder {
    id: number;                      // Unique identifier for the order
    buyerEmail: string;              // Email of the user who placed the order
    orderDate: Date;                 // Date when the order was placed
    shipToAddress: IAddress;         // Address to which the order will be shipped
    deliveryMethod: IDeliveryMethod; // Chosen delivery method for the order
    orderItems: IBasketItem[];       // Items included in the order
    subtotal: number;                // Subtotal price of the order
    shippingPrice: number;           // Shipping price of the order
    total: number;                   // Total price of the order
    status: string;                  // Current status of the order (e.g., "Pending", "Shipped")
}
