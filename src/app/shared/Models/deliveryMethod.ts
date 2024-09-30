// Interface to represent a delivery method
export interface IDeliveryMethod {
    id: number;               // Unique identifier for the delivery method
    shortName: string;         // Short name of the delivery method
    deliveryTime?: any;        // Optional field for delivery time
    description: string;       // Description of the delivery method
    price: number;             // Price of the delivery method
  }
  