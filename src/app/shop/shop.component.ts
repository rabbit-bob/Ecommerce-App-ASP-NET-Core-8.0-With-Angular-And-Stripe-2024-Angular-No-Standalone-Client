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
  
  categoryIdSelected: number = 0;
  
  constructor(private shopService: ShopService) { }
  
  ngOnInit(): void {
    this.getProducts();
    this.getCategories();
  }
  
  getProducts() {
    this.shopService.getProduct(this.categoryIdSelected).subscribe(res => {
      if (res && res.data) {
        this.products = res.data;
      } else {
        console.error('Response is null or does not contain data');
      }
    });
  }
  
  getCategories() {
    this.shopService.getCategory().subscribe(res => {
      this.categories = [{id: 0, name: 'All', description: ''}, ...res];
    })
  }
  
  onCategorySelect(categoryId: number) {
    this.categoryIdSelected = categoryId;
    this.getProducts();
  }
}
