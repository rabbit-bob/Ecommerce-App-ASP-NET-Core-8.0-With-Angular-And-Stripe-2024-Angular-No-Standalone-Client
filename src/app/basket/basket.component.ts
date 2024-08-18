import { Component, OnInit } from '@angular/core';
import { BasketService } from './basket.service';
import { filter, Observable } from 'rxjs';
import { IBasket } from '../shared/Models/Basket';

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

}
