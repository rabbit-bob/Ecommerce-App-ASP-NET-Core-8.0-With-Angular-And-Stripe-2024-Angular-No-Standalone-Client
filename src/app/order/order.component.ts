import { Component, OnInit } from '@angular/core';
import { IOrder } from '../shared/models/order';
import { OrderService } from './order.service';

@Component({
  selector: 'app-order',
  templateUrl: './order.component.html',
  styleUrl: './order.component.scss'
})
export class OrderComponent implements OnInit {

  orders: IOrder[] = [];

  constructor(private orderService: OrderService) { }

  /**
   * Initializes the component and retrieves the list of user orders.
   */
  ngOnInit(): void {
    this.getOrders();
  }

  /**
   * Calls the order service to fetch user orders and handles the response.
   * On success, populates the orders array; on error, logs the error message.
   */
  getOrders() {
    this.orderService.getOrdersForUser().subscribe({
      next: (orders: IOrder[]) => {
        this.orders = orders;
      },
      error: (err) => {
        console.error(err.message);
      }
    });
  }
  
}

