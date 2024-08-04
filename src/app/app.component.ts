import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { IProduct } from './shared/Models/IProduct';
import { IPagination } from './shared/Models/IPagination';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit {
  title = 'client';
  baseURL = "https://localhost:44302/api/Products/get-all-products";
  products: IProduct[] | undefined;

  constructor(private http: HttpClient) {}
  
  getProduct() {
    return this.http.get<IPagination>(this.baseURL).subscribe(
      (values: IPagination) => {
        this.products = values.data;
      }
    );
  }

  ngOnInit(): void {
    this.getProduct();
  }
}
