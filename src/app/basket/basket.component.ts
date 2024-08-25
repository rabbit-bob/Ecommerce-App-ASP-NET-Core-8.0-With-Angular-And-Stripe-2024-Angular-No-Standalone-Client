import { Component, OnInit } from '@angular/core';
import { BasketService } from './basket.service';
import { filter, Observable } from 'rxjs';
import { IBasket, IBasketItem } from '../shared/models/basket';

@Component({
  selector: 'app-basket',
  templateUrl: './basket.component.html',
  styleUrl: './basket.component.scss'
})
export class BasketComponent implements OnInit {

  baskets$!: Observable<IBasket>;
  constructor(private basketService: BasketService) { }

  ngOnInit(): void {
    this.baskets$ = this.basketService.basket$.pipe(
      filter((basket): basket is IBasket => basket !== null)
    );
  }

  incrementBasketItemQuantity(item: IBasketItem) {
    this.basketService.incrementBasketItemQuantity(item);
  }

  decrementBasketItemQuantity(item: IBasketItem) {
    this.basketService.decrementBasketItemQuantity(item);
  }

  removeBasketItem(item: IBasketItem) {
    this.basketService.removeItemFromBasket(item);
  }

}
