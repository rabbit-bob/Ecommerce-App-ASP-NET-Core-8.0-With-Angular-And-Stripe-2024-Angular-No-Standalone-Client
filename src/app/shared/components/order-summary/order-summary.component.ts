import { Component, OnInit } from '@angular/core';
import { BasketService } from '../../../basket/basket.service';
import { Observable } from 'rxjs';
import { IBasketTotals } from '../../models/basket';

@Component({
  selector: 'app-order-summary',
  templateUrl: './order-summary.component.html',
  styleUrl: './order-summary.component.scss'
})
export class OrderSummaryComponent implements OnInit {

  basketTotals$!: Observable<IBasketTotals>;
  constructor(private basketService: BasketService) {}

  ngOnInit(): void {
    this.basketTotals$ = this.basketService.basketTotal$;
  }

}
