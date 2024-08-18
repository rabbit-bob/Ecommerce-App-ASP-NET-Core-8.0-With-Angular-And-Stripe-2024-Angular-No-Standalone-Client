import { v4 as uuidv4 } from 'uuid';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment.development';
import { BehaviorSubject, map } from 'rxjs';
import { Basket, IBasket, IBasketItem, IBasketTotals } from '../shared/Models/Basket';
import { IProduct } from '../shared/Models/IProduct';

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

  incrementBasketItemQuantity(item: IBasketItem) {
    const basket = this.getCurrentBasketValue();
    const itemIndex = basket!.basketItems.findIndex(x => x.id === item.id);
    basket!.basketItems[itemIndex].quantity++;
    this.setBasket(basket!);
  }

  decrementBasketItemQuantity(item: IBasketItem) {
    const basket = this.getCurrentBasketValue();
    const itemIndex = basket!.basketItems.findIndex(x => x.id === item.id);

    if (basket!.basketItems[itemIndex].quantity > 1) {
      basket!.basketItems[itemIndex].quantity--;
      this.setBasket(basket!);
    } else {
      this.removeItemFromBasket(item);
    }
  }

  removeItemFromBasket(item: IBasketItem) {
    const basket = this.getCurrentBasketValue();
    if (basket!.basketItems.some(x => x.id === item.id)) {
      basket!.basketItems = basket!.basketItems.filter(x => x.id !== item.id);
      if (basket!.basketItems.length > 0) {
        this.setBasket(basket!);
      } else {
        this.deleteBasket(basket!);
      }
    }
    throw new Error('Method not implemented.');
  }
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
      })
    throw new Error('Method not implemented.');
  }

  private calculateTotal() {
    const basket = this.getCurrentBasketValue();
    const shipping = 0;
    const subtotal = basket!.basketItems.reduce((a, c) => {
      return (c.price * c.quantity) + a;
    }, 0);
    const total = shipping + subtotal;
    this.basketTotalSource.next({shipping, subtotal, total});
  }

  getBasket(id: string) {
    return this.http.get<IBasket>(`${this.baseURL}Baskets/get-basket-item/${id}`).pipe(
      map((basket: IBasket) => {
        this.basketSource.next(basket);
        this.calculateTotal();
        console.info(this.getCurrentBasketValue());
      })
    );
  }

  setBasket(basket: IBasket) {
    this.http.post<IBasket>(`${this.baseURL}Baskets/update-basket`, basket).subscribe({
      next: (res: IBasket) => {
        this.basketSource.next(res);
        console.log(res);
        this.calculateTotal();
        localStorage.setItem('basket_id', basket.id);
      },
      error: (err) => {
        console.error(err);
      },
    });
  }

  getCurrentBasketValue(): IBasket | null {
    return this.basketSource.value;
  }

  addItemToBasket(item: IProduct, quantity: number = 1) {
    const itemToAdd: IBasketItem = this.mapProductItemToBasketItem(item, quantity);
    const basket = this.getCurrentBasketValue() ?? this.createBasket();

    basket.basketItems = this.addOrUpdate(basket.basketItems, itemToAdd, quantity);
    return this.setBasket(basket);
  }

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

  private createBasket(): IBasket {
    const basket = new Basket();
    localStorage.setItem('basket_id', basket.id);
    this.basketSource.next(basket);
    return basket;
  }

  private storeBasketId(id: string) {
    localStorage.setItem('basket_id', id);
  }

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

