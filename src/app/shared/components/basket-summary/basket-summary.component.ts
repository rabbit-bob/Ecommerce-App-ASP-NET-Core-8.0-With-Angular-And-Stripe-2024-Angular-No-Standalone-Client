import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { BasketService } from '../../../basket/basket.service';
import { Observable } from 'rxjs';
import { IBasket, IBasketItem } from '../../models/basket';

@Component({
  selector: 'app-basket-summary',
  templateUrl: './basket-summary.component.html',
  styleUrls: ['./basket-summary.component.scss']
})
export class BasketSummaryComponent implements OnInit {

  basket$!: Observable<IBasket>;  // Observable to hold the basket details
  @Output() decrement: EventEmitter<IBasketItem> = new EventEmitter<IBasketItem>();  // EventEmitter for decreasing item quantity
  @Output() increment: EventEmitter<IBasketItem> = new EventEmitter<IBasketItem>();  // EventEmitter for increasing item quantity
  @Output() remove: EventEmitter<IBasketItem> = new EventEmitter<IBasketItem>();    // EventEmitter for removing an item from the basket

  /**
   * Constructor initializes the BasketService.
   * BasketService is injected to access and manage the basket.
   */
  constructor(private basketService: BasketService) { }

  /**
   * Lifecycle hook for component initialization.
   * Subscribes to the basket observable from BasketService.
   */
  ngOnInit(): void {
    this.basket$ = this.basketService.basket$;  // Subscribe to basket observable
  }

  /**
   * Emits the decrement event to reduce item quantity.
   * @param item - The basket item to decrement.
   */
  decrementBasketItemQuantity(item: IBasketItem): void {
    this.decrement.emit(item);
  }

  /**
   * Emits the increment event to increase item quantity.
   * @param item - The basket item to increment.
   */
  incrementBasketItemQuantity(item: IBasketItem): void {
    this.increment.emit(item);
  }

  /**
   * Emits the remove event to delete an item from the basket.
   * @param item - The basket item to remove.
   */
  removeBasketItem(item: IBasketItem): void {
    this.remove.emit(item);
  }
}
