import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment.development';
import { BehaviorSubject, map } from 'rxjs';
import { Basket, IBasket } from '../shared/Models/Basket';

@Injectable({
  providedIn: 'root'
})
export class BasketService {

  baseURL: string = environment.baseURL;
  private basketSource = new BehaviorSubject<IBasket>(new Basket());
  basket$ = this.basketSource.asObservable();
  constructor(private http: HttpClient) { }

  getBasket(id: string) {
    return this.http.get<IBasket>(`${this.baseURL}Baskets/get-basket-item/${id}`)
      .pipe(
        map((basket: IBasket) => {
          this.basketSource.next(basket);
        })
      );
  }
  
  setBasket(basket: IBasket) {
    this.http.post<IBasket>(this.baseURL + 'Baskets/update-basket', basket).subscribe({
      next: (res: IBasket) => {
        this.basketSource.next(res);
      },
      error: (err) => {
        console.error(err);
      },
    });
  }  

  getCurrentBasketValue() {
    return this.basketSource.value;
  }
}
