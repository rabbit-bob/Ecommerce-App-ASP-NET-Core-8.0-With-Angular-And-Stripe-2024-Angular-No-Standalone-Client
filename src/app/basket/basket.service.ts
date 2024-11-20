import { v4 as uuidv4 } from 'uuid';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment.development';
import { BehaviorSubject, map } from 'rxjs';
import { Basket, IBasket, IBasketItem, IBasketTotals } from '../shared/models/basket';
import { IProduct } from '../shared/models/product';
import { IDeliveryMethod } from '../shared/models/deliveryMethod';
import { ToastrService } from 'ngx-toastr';

/**
 * Service to manage the customer's shopping basket.
 * Handles adding, updating, removing items, and managing totals.
 */
@Injectable({
  providedIn: 'root',
})
export class BasketService {
  /**
   * Base URL for API requests related to the basket.
   */
  private readonly baseURL: string = environment.baseURL;

  /**
   * BehaviorSubject tracking the current basket state.
   * Default value is an empty basket.
   */
  private readonly basketSource = new BehaviorSubject<IBasket>({
    id: '',
    basketItems: [],
  });

  /**
   * Observable providing the current basket state.
   */
  basket$ = this.basketSource.asObservable();

  /**
   * BehaviorSubject tracking the current basket totals (shipping, subtotal, total).
   */
  private readonly basketTotalSource = new BehaviorSubject<IBasketTotals>({
    shipping: 0,
    subtotal: 0,
    total: 0,
  });

  /**
   * Observable providing the current basket totals.
   */
  basketTotal$ = this.basketTotalSource.asObservable();

  /**
   * Current shipping cost for the basket.
   */
  private shipping: number = 0;

  constructor(private http: HttpClient, private toastr: ToastrService) {
    this.initializeBasketFromLocalStorage();
  }

  /**
   * Adds an item to the basket or updates the quantity if it already exists.
   * @param item The product to add to the basket.
   * @param quantity The quantity of the product.
   */
  addItemToBasket(item: IProduct, quantity: number = 1): void {
    let basket = this.getCurrentBasketValue();
    if (!basket) {
      basket = this.createBasket();
    }

    const updatedItems = this.addOrUpdateItem(basket.basketItems, item, quantity);
    basket.basketItems = updatedItems;
    this.setBasket(basket);
  }

  /**
   * Increments the quantity of the given basket item.
   * @param item The item to increment in the basket.
   */
 incrementBasketItemQuantity(item: IBasketItem): void {
  const basket = this.getCurrentBasketValue();
  if (!basket) return;

  const updatedItems = basket.basketItems.map(i => i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i

  );
  basket.basketItems = updatedItems;
  this.setBasket(basket);
 }

  /**
   * Decrements the quantity of the given basket item or removes it if quantity is 1.
   * @param item The item to decrement in the basket.
  */
  decrementBasketItemQuantity(item: IBasketItem) {
    const basket = this.getCurrentBasketValue();
    if (!basket) return;

    const updatedItems = basket.basketItems.map(i => i.id === item.id ? { ...i, quantity: Math.max(i.quantity - 1, 1) } : i
   );
    basket.basketItems = updatedItems;
    this.setBasket(basket);
   }

  /**
   * Removes an item from the basket.
   * If the basket is empty after removal, it is deleted.
   * @param item The item to be removed from the basket.
   */
  removeItemFromBasket(item: IBasketItem): void {
    const basket = this.getCurrentBasketValue();
    if (!basket) return;

    const updatedItems = basket.basketItems.filter(i => i.id !== item.id);
    basket.basketItems = updatedItems.length ? updatedItems : [];
    updatedItems.length ? this.setBasket(basket) : this.deleteBasket(basket.id);
  }

  /**
   * Sets the shipping price and recalculates the basket totals.
   * @param deliveryMethod The selected delivery method.
   */
  setShippingPrice(deliveryMethod: IDeliveryMethod): void {
    this.shipping = deliveryMethod.price;
    const basket = this.getCurrentBasketValue();
    if (!basket) return;
    basket.deliveryMethodId = deliveryMethod.id;
    basket.shippingPrice = deliveryMethod.price;

    this.calculateTotals();
    this.setBasket(basket);
  }

  /**
   * Retrieves the basket by ID from the API.
   * @param id The basket ID.
   * @returns An observable of the basket.
   */
  getBasket(id: string) {
    return this.http.get<IBasket>(`${this.baseURL}Baskets/get-basket-item/${id}`).pipe(
      map((basket) => {
        this.basketSource.next(basket);
        this.shipping = basket.shippingPrice ?? 0;
        this.calculateTotals();
      })
    );
  }

  /**
   * Sets the current basket and saves its ID in local storage.
   * @param basket The basket to save.
   */
  setBasket(basket: IBasket): void {
    this.http.post<IBasket>(`${this.baseURL}Baskets/update-basket`, basket).subscribe({
      next: (updatedBasket) => {
        this.basketSource.next(updatedBasket);
        this.calculateTotals();
        localStorage.setItem('basket_id', updatedBasket.id);
      },
      error: (err) => {
        this.toastr.error('Failed to set basket', 'Error');
      },
    });
  }

  /**
   * Deletes the basket by its ID.
   * @param basketId The basket ID to delete.
   */
  deleteBasket(basketId: string): void {
    this.http.delete(`${this.baseURL}Baskets/delete-basket-item/${basketId}`).subscribe({
      next: () => {
        this.clearBasket();
        this.toastr.success('Basket deleted successfully', 'Success');
      },
      error: (err) => {
        this.toastr.error('Failed to delete basket', 'Error');
      },
    });
  }

  /**
   * Deletes the basket locally by its ID and clears related data.
   * @param basketId The ID of the basket to delete.
   */
  deleteLocalBasket(basketId: string): void {
    const currentBasket = this.getCurrentBasketValue();
    if (currentBasket?.id === basketId) {
      this.clearBasket();
    }
  }

  /**
   * Creates a payment intent for the current basket.
   * Updates the basket in the state upon success.
   * @returns An observable containing the updated basket.
   */
  createPaymentIntent() {
    const basketId = this.getCurrentBasketValue()?.id;

    if (!basketId) {
      console.error('Basket ID is missing!');
      return;
    }

    return this.http.post<IBasket>(`${this.baseURL}Payments/${basketId}`, {}).pipe(
      map((basket: IBasket) => {
        this.basketSource.next(basket);
        console.log('Updated Basket:', this.getCurrentBasketValue());
      })
    );
  }
  
  /**
   * Retrieves the current basket value.
   * @returns The current basket or null if not set.
  */
 getCurrentBasketValue(): IBasket | null {
   return this.basketSource.value;
  }
  
  /**
   * Public method to initialize the basket.
   * Calls the internal method to load the basket from local storage.
  */
 initializeBasket(): void {
   this.initializeBasketFromLocalStorage();
  }
  
  /**
   * Calculates the basket totals (shipping, subtotal, total).
   */
  private calculateTotals(): void {
    const basket = this.getCurrentBasketValue();
    if (!basket) return;

    const subtotal = basket.basketItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const total = subtotal + this.shipping;

    this.basketTotalSource.next({ shipping: this.shipping, subtotal, total });
  }

  /**
   * Creates a new basket and stores its ID in local storage.
   * @returns The newly created basket.
   */
  private createBasket(): IBasket {
    const basket = new Basket();
    localStorage.setItem('basket_id', basket.id);
    this.basketSource.next(basket);
    return basket;
  }

  /**
   * Adds or updates an item in the basket.
   * @param items The current basket items.
   * @param product The product to add or update.
   * @param quantity The quantity of the product.
   * @returns The updated basket items.
   */
  private addOrUpdateItem(items: IBasketItem[], product: IProduct, quantity: number): IBasketItem[] {
    const index = items.findIndex((i) => i.id === product.id);
    if (index === -1) {
      items.push(this.mapProductToBasketItem(product, quantity));
    } else {
      items[index].quantity += quantity;
    }
    return items;
  }

  /**
   * Maps a product to a basket item.
   * @param product The product to map.
   * @param quantity The quantity of the product.
   * @returns The mapped basket item.
   */
  private mapProductToBasketItem(product: IProduct, quantity: number): IBasketItem {
    return {
      id: product.id,
      productName: product.name,
      price: product.price,
      productPicture: product.productPicture,
      category: product.categoryName,
      quantity,
    };
  }

  /**
   * Initializes the basket by loading its ID from local storage.
   */
  private initializeBasketFromLocalStorage(): void {
    let basketId = localStorage.getItem('basket_id');
    if (!basketId) {
      basketId = uuidv4();
      localStorage.setItem('basket_id', basketId);
    }

    this.getBasket(basketId).subscribe({
      next: () => {},
      error: (err) => {
        this.toastr.error('Failed to load basket', 'Error');
      },
    });
  }

  /**
   * Clears the current basket state and removes its ID from local storage.
   */
  private clearBasket(): void {
    this.basketSource.next({ id: '', basketItems: [] });
    this.basketTotalSource.next({ shipping: 0, subtotal: 0, total: 0 });
    localStorage.removeItem('basket_id');
  }

}
