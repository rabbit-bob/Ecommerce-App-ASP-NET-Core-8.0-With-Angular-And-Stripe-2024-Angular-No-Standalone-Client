import { Component, Input, OnInit } from '@angular/core';
import { IProduct } from '../../shared/models/product';
import { BasketService } from '../../basket/basket.service';

@Component({
  selector: 'app-shop-item',
  templateUrl: './shop-item.component.html',
  styleUrl: './shop-item.component.scss'
})
export class ShopItemComponent implements OnInit {
  @Input() product: IProduct | undefined;
  
  constructor(private basketService: BasketService) { }
  
  ngOnInit(): void {
    
  }
  
  addItemToBasket() {
    if (this.product) {
      this.basketService.addItemToBasket(this.product);
    } else {
      console.error('Product is undefined');
    }
  }
}
