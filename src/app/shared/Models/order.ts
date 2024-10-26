import { IAddress } from './address';

// Interface to represent an initial order process
export interface IOrderToCreate {
    basketId: string;               // Unique identifier for user basket
    deliveryMethodId: number;       // Selected delivery method
    shipToAddress: IAddress         // Address coresponding with user shipping address
}

// Interface to represent an order
export interface IOrder {
    id: number;                      // Unique identifier for the order
    buyerEmail: string;              // Email of the user who placed the order
    orderDate: Date;                 // Date when the order was placed
    shipToAddress: IAddress;         // Address to which the order will be shipped
    deliveryMethod: string;          // Chosen delivery method for the order
    orderItems: IOrderItem[];        // Items included in the order
    subtotal: number;                // Subtotal price of the order
    total: number;                   // Total price of the order
    orderStatus: string              // Current status of the order (e.g., "Pending", "Shipped")
}

// Interface to represent order items
export interface IOrderItem {
    productItemId: number;           // Unique identifier for the product item
    productItemName: string;         // Product item name
    pictureUrl: string;              // Path for picture of product
    price: number;                   // Product price
    quantity: number                 // Quantity of product
}