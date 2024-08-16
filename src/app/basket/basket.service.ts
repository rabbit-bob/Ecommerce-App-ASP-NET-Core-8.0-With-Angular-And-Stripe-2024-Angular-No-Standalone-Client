import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment.development';
import { BehaviorSubject, map } from 'rxjs';
import { Basket, IBasket, IBasketItem } from '../shared/Models/Basket';
import { IProduct } from '../shared/Models/IProduct';

@Injectable({
  providedIn: 'root'
})
export class BasketService {

  baseURL: string = environment.baseURL;
  private basketSource = new BehaviorSubject<IBasket | null>(null);
  basket$ = this.basketSource.asObservable();

  constructor(private http: HttpClient) {
    const basketId = localStorage.getItem('basket_id');
    if (basketId) {
      this.getBasket(basketId).subscribe();
    }
  }

  getBasket(id: string) {
    return this.http.get<IBasket>(`${this.baseURL}Baskets/get-basket-item/${id}`).pipe(
      map((basket: IBasket) => {
        this.basketSource.next(basket);
        this.storeBasketId(basket.id);
      })
    );
  }

  setBasket(basket: IBasket) {
    this.http.post<IBasket>(`${this.baseURL}Baskets/update-basket`, basket).subscribe({
      next: (res: IBasket) => {
        this.basketSource.next(res);
        this.storeBasketId(res.id);
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
    let basket = this.getCurrentBasketValue();

    if (!basket) {
      basket = this.createBasket();
    }

    const itemToAdd: IBasketItem = this.mapProductItemToBasketItem(item, quantity);
    basket.basketItems = this.addOrUpdate(basket.basketItems, itemToAdd, quantity);
    this.setBasket(basket);
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
    const basketId = localStorage.getItem('basket_id');

    if (basketId) {
      this.getBasket(basketId).subscribe({
        next: (basket) => {
          console.log('Basket has been loaded:', basket);
        },
        error: (err) => {
          console.error('Basket could not be loaded:', err);
        }
      });
    } else {
      this.createBasket();
      console.log('New basket has been created');
    }
  }

}

