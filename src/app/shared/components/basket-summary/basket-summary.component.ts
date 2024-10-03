import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
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
  @Input() isBasket: boolean = true;  // Input property to toggle between basket and order summary views

  /**
   * Constructor to initialize the BasketService.
   * BasketService is injected to manage and access the basket details.
   */
  constructor(private basketService: BasketService) { }

  /**
   * Lifecycle hook to initialize the component.
   * Subscribes to the basket observable from the BasketService to track basket updates.
   */
  ngOnInit(): void {
    this.basket$ = this.basketService.basket$;  // Subscribe to the basket observable
  }

  /**
   * Emits the decrement event to decrease the quantity of the given basket item.
   * @param item - The basket item whose quantity needs to be reduced.
   */
  decrementBasketItemQuantity(item: IBasketItem): void {
    this.decrement.emit(item);
  }

  /**
   * Emits the increment event to increase the quantity of the given basket item.
   * @param item - The basket item whose quantity needs to be increased.
   */
  incrementBasketItemQuantity(item: IBasketItem): void {
    this.increment.emit(item);
  }

  /**
   * Emits the remove event to delete the specified item from the basket.
   * @param item - The basket item to be removed.
   */
  removeBasketItem(item: IBasketItem): void {
    this.remove.emit(item);
  }
}
