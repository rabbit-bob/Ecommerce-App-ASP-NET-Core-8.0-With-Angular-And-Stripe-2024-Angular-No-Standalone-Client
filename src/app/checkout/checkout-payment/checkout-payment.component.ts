import { Component, Input, OnInit } from '@angular/core';
import { CheckoutService } from '../checkout.service';
import { BasketService } from '../../basket/basket.service';
import { ToastrService } from 'ngx-toastr';
import { IBasket } from '../../shared/models/basket';
import { FormGroup } from '@angular/forms';
import { NavigationExtras, Router } from '@angular/router';
import { IOrder } from '../../shared/models/order';

@Component({
  selector: 'app-checkout-payment',
  templateUrl: './checkout-payment.component.html',
  styleUrl: './checkout-payment.component.scss'
})
export class CheckoutPaymentComponent implements OnInit {

  @Input() checkoutForm: FormGroup = new FormGroup({});
  constructor(
    private checkoutService: CheckoutService,
    private basketService: BasketService,
    private toastr: ToastrService,
    private router: Router
  ) {}

  ngOnInit(): void {
  }

  /**
   * Submits the order by creating an order object from the current basket and form data,
   * sending it to the server, and handling the response. 
   * If successful, removes the local basket and navigates to the success page.
   */
  submitOrder() {
    const basket = this.basketService.getCurrentBasketValue();
    if (!basket) {
      this.toastr.error('Basket is empty or not available.');
      return;
    }
    const orderToCreate = this.getOrderToCreate(basket);
    this.checkoutService.createOrder(orderToCreate).subscribe({
      next: (order => {
        const typedOrder = order as IOrder;
        this.toastr.success('Order submitted successfully');
        this.basketService.deleteLocalBasket(basket.id);
        const navigationExtras: NavigationExtras = { state: typedOrder };
        this.router.navigate(['checkout/success'], navigationExtras);
        console.log(order);
      }),
      error: ((err: { message: string | undefined; }) => {
        this.toastr.error(err.message);
        console.error(err);
      })
    })
  }
  
  /**
   * Creates an order object based on the provided basket and form data.
   * @param basket The current basket data.
   * @returns An object containing details required to create an order.
   */
  private getOrderToCreate(basket: IBasket) {
    return {
      basketId: basket.id,
      deliveryMethodId: this.checkoutForm.get('deliveryForm.deliveryMethod')?.value,
      shipToAddress: this.checkoutForm.get('addressForm')?.value
    }
  }

}
