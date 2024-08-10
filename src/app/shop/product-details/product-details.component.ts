import { Component, OnInit } from '@angular/core';
import { ShopService } from '../shop.service';
import { ActivatedRoute } from '@angular/router';
import { IProduct } from '../../shared/Models/IProduct';

@Component({
  selector: 'app-product-details',
  templateUrl: './product-details.component.html',
  styleUrl: './product-details.component.scss'
})
export class ProductDetailsComponent implements OnInit {

  product: IProduct | undefined;
  constructor(private shopService: ShopService, private activeRoute: ActivatedRoute) { }

  ngOnInit(): void {
    this.loadProducts();
  }

  loadProducts() {
    const id = parseInt(this.activeRoute.snapshot.paramMap.get('id') || '0');
    this.shopService.getProductById(id)
      .subscribe(res => {
        this.product = res;
      });
  }
}