import { v4 as uuidv4 } from 'uuid';

/**
 * Represents a customer's shopping basket, including items, delivery, and payment details.
 */
export interface IBasket {
  /**
   * The unique identifier for the basket.
   */
  id: string;

  /**
   * The list of items in the basket.
   */
  basketItems: IBasketItem[];

  /**
   * The unique identifier for the client secret used in payment processing.
   * This is optional and may not always be present.
   */
  clientSecret?: string;

  /**
   * The payment intent identifier associated with this basket.
   * Used to track payment-related activities.
   */
  paymentIntentId?: string;

  /**
   * The identifier of the selected delivery method.
   * If not set, the default delivery method is used.
   */
  deliveryMethodId?: number;
  
    /**
   * The shipping price for the basket.
   * Optional, defaults to 0 if not provided.
   */
  shippingPrice?: number;
}

/**
 * Represents an item in the customer's basket.
 */
export interface IBasketItem {
  /**
   * The unique identifier for the item.
   */
  id: number;

  /**
   * The name of the product.
   */
  productName: string;

  /**
   * The URL of the product's picture.
   */
  productPicture: string;

  /**
   * The price of the product.
   */
  price: number;

  /**
   * The quantity of the product in the basket.
   */
  quantity: number;

  /**
   * The category to which the product belongs.
   */
  category: string;
}

/**
 * Represents the totals for the customer's basket, including shipping, subtotal, and total costs.
 */
export interface IBasketTotals {
  /**
   * The shipping cost for the basket.
   */
  shipping: number;

  /**
   * The subtotal cost of the basket items before shipping.
   */
  subtotal: number;

  /**
   * The total cost of the basket, including shipping.
   */
  total: number;
}

/**
 * Represents a new customer's shopping basket.
 * Automatically generates a unique identifier.
 */
export class Basket implements IBasket {
  /**
   * The unique identifier for the basket.
   */
  id: string;

  /**
   * The list of items in the basket. Defaults to an empty array.
   */
  basketItems: IBasketItem[] = [];

  constructor() {
    this.id = uuidv4();
  }
}
