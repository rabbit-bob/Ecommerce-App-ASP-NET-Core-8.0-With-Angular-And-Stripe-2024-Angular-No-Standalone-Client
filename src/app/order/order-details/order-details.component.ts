import { Component, OnInit } from '@angular/core';
import { IOrder } from '../../shared/models/order';
import { OrderService } from '../order.service';
import { BreadcrumbService } from 'xng-breadcrumb';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-order-details',
  templateUrl: './order-details.component.html',
  styleUrl: './order-details.component.scss'
})
export class OrderDetailsComponent implements OnInit {

  order: IOrder | undefined;

  constructor(
    private orderService: OrderService,
    private breadcrumb: BreadcrumbService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    // Setting the breadcrumb label initially as empty
    breadcrumb.set('@OrderDetails', '');
  }

  /**
   * On component initialization, retrieves the order details based on the route ID parameter.
   * If ID is valid, fetches and displays the order; otherwise, navigates to the orders list.
   */
  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('id');
    const id = idParam ? +idParam : null;
  
    if (id !== null) {
      this.orderService.getOrderDetails(id).subscribe({
        next: (order: IOrder) => {
          this.order = order;
          this.breadcrumb.set('@OrderDetails', `Order #${order.id} - ${order.orderStatus}`);
        },
        error: (err) => {
          console.error(err.message);
          this.breadcrumb.set('@OrderDetails', 'Order not found');
          this.router.navigate(['/orders']);
        }
      });
    } else {
      this.breadcrumb.set('@OrderDetails', 'Invalid order ID');
      this.router.navigate(['/orders']);
    }
  }
}


