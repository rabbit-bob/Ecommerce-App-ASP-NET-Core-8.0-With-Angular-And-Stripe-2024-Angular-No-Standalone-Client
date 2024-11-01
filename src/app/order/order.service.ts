import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment.development';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { IOrder } from '../shared/models/order';

@Injectable({
  providedIn: 'root'
})
export class OrderService {

  baseURL: string = environment.baseURL;

  constructor(private http: HttpClient) { }

  /**
   * Retrieves the list of orders for the current user.
   * @returns An observable of the user's orders as an array of IOrder objects.
   */
  getOrdersForUser(): Observable<IOrder[]> {
    return this.http.get<IOrder[]>(`${this.baseURL}Orders/get-orders-for-user`);
  }

  /**
   * Fetches the details of a specific order by ID.
   * @param id The ID of the order to retrieve.
   * @returns An observable of the specified order as an IOrder object.
   */
  getOrderDetails(id: number): Observable<IOrder> {
    return this.http.get<IOrder>(`${this.baseURL}Orders/get-order-by-id/${id}`);
  }
  
}
