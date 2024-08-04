import { Component, OnInit } from '@angular/core';
import { IProduct } from '../shared/Models/IProduct';
import { ShopService } from './shop.service';

@Component({
  selector: 'app-shop',
  templateUrl: './shop.component.html',
  styleUrl: './shop.component.scss'
})
export class ShopComponent implements OnInit {

  products: IProduct[] | undefined;
  constructor(private shopService: ShopService) { }
  
  ngOnInit(): void {
      this.getProducts();
  }

  getProducts() {
    this.shopService.getProduct().subscribe(res => {
      this.products = res.data;
    });
  }
}
