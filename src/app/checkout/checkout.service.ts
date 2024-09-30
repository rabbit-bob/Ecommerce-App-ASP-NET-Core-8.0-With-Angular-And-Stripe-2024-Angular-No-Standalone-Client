import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment.development'; // Import environment for API base URL
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs';
import { IDeliveryMethod } from '../shared/models/deliveryMethod'; // Import interface for delivery method

@Injectable({
  providedIn: 'root'
})
export class CheckoutService {

  // Base URL for API calls, coming from environment settings
  baseURL: string = environment.baseURL;

  constructor(private http: HttpClient) { }

  // Fetch delivery methods from the API and sort them by price in descending order
  getDeliveryMethods() {
    return this.http.get<IDeliveryMethod[]>(this.baseURL + 'Orders/get-delivery-methods').pipe(
      map((res: IDeliveryMethod[]) => {
        // Sorting the delivery methods based on price
        return res.sort((a, b) => b.price - a.price); 
      })
    );
  }
}

