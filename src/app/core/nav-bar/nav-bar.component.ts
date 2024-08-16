import { Component, OnInit } from '@angular/core';
import { BasketService } from '../../basket/basket.service';
import { filter, Observable } from 'rxjs';
import { IBasket } from '../../shared/Models/Basket';

@Component({
  selector: 'app-nav-bar',
  templateUrl: './nav-bar.component.html',
  styleUrl: './nav-bar.component.scss'
})
export class NavBarComponent implements OnInit {

  constructor(private basketService: BasketService) {}
  basket$!: Observable<IBasket>;

  ngOnInit(): void {
    this.basket$ = this.basketService.basket$.pipe(
      filter((basket): basket is IBasket => basket !== null)
    );
  }

}
