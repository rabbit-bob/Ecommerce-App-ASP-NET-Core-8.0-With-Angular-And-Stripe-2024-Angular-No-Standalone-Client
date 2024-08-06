import { Component, OnInit } from '@angular/core';
import { IProduct } from '../shared/Models/IProduct';
import { ShopService } from './shop.service';
import { ICategory } from '../shared/Models/ICategory';

@Component({
  selector: 'app-shop',
  templateUrl: './shop.component.html',
  styleUrl: './shop.component.scss'
})
export class ShopComponent implements OnInit {

  categories: ICategory[] | undefined;
  products: IProduct[] | undefined;
  constructor(private shopService: ShopService) { }
  
  ngOnInit(): void {
      this.getProducts();
      this.getCategories();
  }

  getProducts() {
    this.shopService.getProduct().subscribe(res => {
      this.products = res.data;
    });
  }

  getCategories() {
    this.shopService.getCategory().subscribe(res => {
      this.categories = res;
    })
  }
}
