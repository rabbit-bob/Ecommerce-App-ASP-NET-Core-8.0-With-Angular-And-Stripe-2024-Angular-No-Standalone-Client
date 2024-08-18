import { Component, OnInit } from '@angular/core';
import { ShopService } from '../shop.service';
import { ActivatedRoute } from '@angular/router';
import { IProduct } from '../../shared/Models/IProduct';
import { BreadcrumbService } from 'xng-breadcrumb';
import { BasketService } from '../../basket/basket.service';

@Component({
  selector: 'app-product-details',
  templateUrl: './product-details.component.html',
  styleUrl: './product-details.component.scss',
})
export class ProductDetailsComponent implements OnInit {
  product: IProduct | undefined;
  quantity: number = 1;
  constructor(
    private shopService: ShopService,
    private activeRoute: ActivatedRoute,
    private bcService: BreadcrumbService,
    private basketService: BasketService
  ) {
    this.bcService.set('@productDetails', '')
  }

  ngOnInit(): void {
    this.loadProducts();
  }

  loadProducts() {
    const id = parseInt(this.activeRoute.snapshot.paramMap.get('id') || '0');
    this.shopService.getProductById(id).subscribe((res) => {
      this.product = res;
      this.bcService.set('@productDetails', res.name)
    });
  }

  addItemToBasket() {
    if (this.product) {
      this.basketService.addItemToBasket(this.product, this.quantity);      
    } else {
      console.error("Product is null");
    }
  }

  incrementQuantityItem() {
    this.quantity++;
  }

  decrementQuantityItem() {
    if (this.quantity > 1) {
      this.quantity--;      
    }
  }
}
