import { v4 as uuidv4 } from 'uuid';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment.development';
import { BehaviorSubject, map } from 'rxjs';
import { Basket, IBasket, IBasketItem, IBasketTotals } from '../shared/models/basket';
import { IProduct } from '../shared/models/product';
import { IDeliveryMethod } from '../shared/models/deliveryMethod';

@Injectable({
  providedIn: 'root'
})
export class BasketService {

  baseURL: string = environment.baseURL;
  private basketSource = new BehaviorSubject<IBasket>({
    id: '',
    basketItems: []
  });

  basket$ = this.basketSource.asObservable();
  shipping: number = 0;

  constructor(private http: HttpClient) {
    const basketId = localStorage.getItem('basket_id');
    if (basketId) {
      this.getBasket(basketId).subscribe();
    }
  }

  private basketTotalSource = new BehaviorSubject<IBasketTotals>({
    shipping: 0,
    subtotal: 0,
    total: 0
  });

  basketTotal$ = this.basketTotalSource.asObservable();

  /**
   * Increments the quantity of the given basket item.
   * @param item The item to increment in the basket.
   */
  incrementBasketItemQuantity(item: IBasketItem) {
    const basket = this.getCurrentBasketValue();
    if (basket) {
      const itemIndex = basket.basketItems.findIndex(x => x.id === item.id);
      if (itemIndex !== -1) {
        basket.basketItems[itemIndex].quantity++;
        this.setBasket(basket);
      }
    } else {
      console.error('Basket is null');
    }
  }

  /**
   * Decrements the quantity of the given basket item or removes it if quantity is 1.
   * @param item The item to decrement in the basket.
   */
  decrementBasketItemQuantity(item: IBasketItem) {
    const basket = this.getCurrentBasketValue();
    if (basket) {
      const itemIndex = basket.basketItems.findIndex(x => x.id === item.id);
      if (itemIndex !== -1) {
        if (basket.basketItems[itemIndex].quantity > 1) {
          basket.basketItems[itemIndex].quantity--;
          this.setBasket(basket);
        } else {
          this.removeItemFromBasket(item);
        }
      }
    } else {
      console.error('Basket is null');
    }
  }

  /**
   * Removes an item from the basket.
   * @param item The item to be removed from the basket.
   */
  removeItemFromBasket(item: IBasketItem) {
    const basket = this.getCurrentBasketValue();
    if (basket) {
      if (basket.basketItems.some(x => x.id === item.id)) {
        basket.basketItems = basket.basketItems.filter(x => x.id !== item.id);
        if (basket.basketItems.length > 0) {
          this.setBasket(basket);
        } else {
          this.deleteBasket(basket);
        }
      }
    } else {
      console.error('Basket is null');
    }
  }

  /**
   * Deletes the entire basket.
   * @param basket The basket to be deleted.
   */
  deleteBasket(basket: IBasket) {
    return this.http.delete(`${this.baseURL}Baskets/delete-basket-item/${basket.id}`)
      .subscribe({
        next: () => {
          this.basketSource.next({
            id: '',
            basketItems: []
          });
          this.basketTotalSource.next({
            shipping: 0,
            subtotal: 0,
            total: 0
          });
          localStorage.removeItem('basket_id');
        },
        error: (err) => {
          console.error(err);
        }
      });
  }

  /**
   * Sets the shipping price based on the selected delivery method and recalculates the total.
   * @param deliveryMethod The selected delivery method.
   */
  setShippingPrice(deliveryMethod: IDeliveryMethod) {
    this.shipping = deliveryMethod.price;
    this.calculateTotal();
  }

  /**
   * Recalculates the basket totals including shipping, subtotal, and total.
   */
  private calculateTotal() {
    const basket = this.getCurrentBasketValue();
    const shipping = this.shipping;
    const subtotal = basket!.basketItems.reduce((a, c) => {
      return (c.price * c.quantity) + a;
    }, 0);
    const total = shipping + subtotal;
    this.basketTotalSource.next({shipping, subtotal, total});
  }

  /**
   * Retrieves the basket by its ID.
   * @param id The basket ID to retrieve.
   * @returns An observable of the basket.
   */
  getBasket(id: string) {
    return this.http.get<IBasket>(`${this.baseURL}Baskets/get-basket-item/${id}`).pipe(
      map((basket: IBasket) => {
        this.basketSource.next(basket);
        this.calculateTotal();
        console.info(this.getCurrentBasketValue());
      })
    );
  }

  /**
   * Sets the current basket and stores its ID in local storage.
   * @param basket The basket to set.
   */
  setBasket(basket: IBasket) {
    this.http.post<IBasket>(`${this.baseURL}Baskets/update-basket`, basket).subscribe({
      next: (res: IBasket) => {
        this.basketSource.next(res);
        this.calculateTotal();
        localStorage.setItem('basket_id', basket.id);
      },
      error: (err) => {
        console.error(err);
      },
    });
  }

  /**
   * Gets the current basket value.
   * @returns The current basket or null if not available.
   */
  getCurrentBasketValue(): IBasket | null {
    return this.basketSource.value;
  }

  /**
   * Adds an item to the basket or updates the quantity if it already exists.
   * @param item The product to add to the basket.
   * @param quantity The quantity of the product.
   */
  addItemToBasket(item: IProduct, quantity: number = 1) {
    const itemToAdd: IBasketItem = this.mapProductItemToBasketItem(item, quantity);
    const basket = this.getCurrentBasketValue() ?? this.createBasket();

    basket.basketItems = this.addOrUpdate(basket.basketItems, itemToAdd, quantity);
    return this.setBasket(basket);
  }

  /**
   * Adds or updates an item in the basket.
   * @param basketItems The current basket items.
   * @param itemToAdd The item to add or update.
   * @param quantity The quantity of the item.
   * @returns The updated basket items.
   */
  private addOrUpdate(basketItems: IBasketItem[], itemToAdd: IBasketItem, quantity: number): IBasketItem[] {
    const index = basketItems.findIndex(i => i.id === itemToAdd.id);
    if (index === -1) {
      itemToAdd.quantity = quantity;
      basketItems.push(itemToAdd);
    } else {
      basketItems[index].quantity += quantity;
    }
    return basketItems;
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
   * Maps a product to a basket item.
   * @param item The product to map.
   * @param quantity The quantity of the product.
   * @returns The mapped basket item.
   */
  private mapProductItemToBasketItem(item: IProduct, quantity: number): IBasketItem {
    return {
      id: item.id,
      productName: item.name,
      price: item.price,
      productPicture: item.productPicture,
      category: item.categoryName,
      quantity
    };
  }

  /**
   * Initializes the basket by loading its data from local storage or creating a new one.
   */
  public initializeBasket() {
    let basketId = localStorage.getItem('basket_id');

    if (!basketId) {
      basketId = uuidv4();
      localStorage.setItem('basket_id', basketId);
    }

    this.getBasket(basketId).subscribe({
      next: (basket) => {
        console.log('Basket has been loaded - InitialBasket:', basket);
      },
      error: (err) => {
        console.error('Basket could not be loaded:', err);
      }
    });
  }
}


