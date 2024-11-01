import { IAddress } from './address';

// Interface to represent an initial order process
export interface IOrderToCreate {
    basketId: string;               // Unique identifier for the user's basket
    deliveryMethodId: number;       // ID of the chosen delivery method
    shipToAddress: IAddress;        // Shipping address for the order
}

// Interface to represent an order
export interface IOrder {
    id: number;                      // Unique identifier for the order
    buyerEmail: string;              // Email address of the buyer
    orderDate: Date;                 // Date when the order was placed
    shipToAddress: IAddress;         // Shipping address for the order
    deliveryMethod: string;          // Selected delivery method name
    shippingPrice: number;           // Cost of the selected delivery method
    orderItems: IOrderItem[];        // List of items in the order
    subtotal: number;                // Total cost before shipping
    total: number;                   // Total cost including shipping
    orderStatus: string;             // Current status of the order (e.g., "Pending", "Shipped")
}

// Interface to represent individual items in an order
export interface IOrderItem {
    productItemId: number;           // Unique identifier for the product
    productItemName: string;         // Name of the product item
    pictureUrl: string;              // URL to the product image
    price: number;                   // Unit price of the product
    quantity: number;                // Quantity of the product in the order
}
