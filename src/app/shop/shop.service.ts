import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { IPagination } from '../shared/Models/IPagination';
import { ICategory } from '../shared/Models/ICategory';
import { map } from 'rxjs';
import { ShopParams } from '../shared/Models/shopParams';

@Injectable({
  providedIn: 'root'
})
export class ShopService {
  baseURL = "https://localhost:44302/api/";

  constructor(private http: HttpClient) { }

  getProduct(shopParams: ShopParams) {
    let params = new HttpParams;
    if (shopParams.categoryId != 0) {
      params = params.append('categoryId', shopParams.categoryId.toString());  
    }

    params = params.append('sort', shopParams.sort);

    params = params.append('pageNumber', shopParams.pageNumber);
    params = params.append('pageSize', shopParams.pageSize);

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
