import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { IPagination } from '../shared/Models/IPagination';
import { ICategory } from '../shared/Models/ICategory';
import { map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ShopService {
  baseURL = "https://localhost:44302/api/";

  constructor(private http: HttpClient) { }

  getProduct(categoryId?: number, sort?: string) {
    let params = new HttpParams;
    if (categoryId) {
      params = params.append('categoryId', categoryId.toString());  
    }
    if (sort) {
      params = params.append('sort', sort);
    }

    return this.http.get<IPagination>(this.baseURL + 'Products/get-all-products', {observe: 'response', params})
      .pipe(
        map( response => {
          return response.body;
        })
      )
  }

  getCategory() {
    return this.http.get<ICategory[]>(this.baseURL + 'Categories/get-all-categories');
  }
}
