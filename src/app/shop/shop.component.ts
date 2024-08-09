import { Component, ElementRef, OnInit, ViewChild, viewChild } from '@angular/core';
import { IProduct } from '../shared/Models/IProduct';
import { ShopService } from './shop.service';
import { ICategory } from '../shared/Models/ICategory';
import { ShopParams } from '../shared/Models/shopParams';

@Component({
  selector: 'app-shop',
  templateUrl: './shop.component.html',
  styleUrl: './shop.component.scss'
})
export class ShopComponent implements OnInit {
  
  @ViewChild('search') searchTerm!: ElementRef;
  categories: ICategory[] | undefined;
  products: IProduct[] | undefined;
  
  shopParams = new ShopParams;
  totalCount: number = 0;
  
  sortOptions = [
    { name: 'Name', value: 'Name' },
    { name: 'Price: Max-Min', value: 'PriceDesc' },
    { name: 'Price: Min-Max', value: 'PriceAsc' }
  ];
  
  constructor(private shopService: ShopService) { }
  
  ngOnInit(): void {
    this.getProducts();
    this.getCategories();
  }
  
  getProducts() {
    this.shopService.getProduct(this.shopParams).subscribe(res => {
      if (res && res.data) {
        this.products = res.data;
        this.totalCount = res.count;
        this.shopParams.pageNumber = res.pageNumber;
        this.shopParams.pageSize = res.pageSize;
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
    this.shopParams.categoryId = categoryId;
    this.shopParams.pageNumber = 1;
    this.getProducts();
  }
  
  onSortSelect(sort: Event) {
    let sortValue = (sort.target as HTMLInputElement).value;
    this.shopParams.sort = sortValue;
    this.getProducts();
  }

  onPageChanged(event: any) {
    if (this.shopParams.pageNumber !== event) {
      this.shopParams.pageNumber = event;
      this.getProducts();      
    }
  }

  onSearch() {
    this.shopParams.search = this.searchTerm.nativeElement.value;
    this.getProducts();
  }

  onReset() {
    this.searchTerm.nativeElement.value = '';
    this.shopParams = new ShopParams();
    this.getProducts();
  }
}
