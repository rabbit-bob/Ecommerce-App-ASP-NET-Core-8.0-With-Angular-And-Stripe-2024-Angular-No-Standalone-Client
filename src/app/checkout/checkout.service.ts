import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment.development'; // Import environment for API base URL
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { IDeliveryMethod } from '../shared/models/deliveryMethod'; // Import interface for delivery method
import { IOrder } from '../shared/models/order';

@Injectable({
  providedIn: 'root'
})
export class CheckoutService {

  // Base URL for API calls, coming from environment settings
  baseURL: string = environment.baseURL;

  constructor(private http: HttpClient) { }

  /**
   * Creates an order by sending the order details to the API.
   * @param order The order details to create.
   * @returns An observable of the created order.
   */
  createOrder(order: any): Observable<IOrder> {
    return this.http.post<IOrder>(`${this.baseURL}Orders/create-order`, order);
  }

  /**
   * Fetches available delivery methods from the API and sorts them by price in descending order.
   * @returns An observable containing a sorted list of delivery methods.
   */
  getDeliveryMethods() {
    return this.http.get<IDeliveryMethod[]>(this.baseURL + 'Orders/get-delivery-methods').pipe(
      map((res: IDeliveryMethod[]) => {
        // Sorting the delivery methods based on price
        return res.sort((a, b) => b.price - a.price); 
      })
    );
  }
}

