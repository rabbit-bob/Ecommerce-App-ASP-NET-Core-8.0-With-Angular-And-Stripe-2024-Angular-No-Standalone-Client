import { Component, Input, OnInit } from '@angular/core';
import { CheckoutService } from '../checkout.service'; // Import service to fetch delivery methods
import { IDeliveryMethod } from '../../shared/models/deliveryMethod'; // Import delivery method interface
import { FormGroup } from '@angular/forms';
import { BasketService } from '../../basket/basket.service';

@Component({
  selector: 'app-checkout-delivery',
  templateUrl: './checkout-delivery.component.html',
  styleUrls: ['./checkout-delivery.component.scss']
})
export class CheckoutDeliveryComponent implements OnInit {

  // Delivery form passed from the parent component
  @Input() checkoutForm: FormGroup = new FormGroup({});

  // List of delivery methods to be fetched and displayed
  deliveryMethods: IDeliveryMethod[] = [];

  constructor(private checkoutService: CheckoutService, private basketService: BasketService) { }

  ngOnInit(): void {
    // Fetch delivery methods from the CheckoutService on component initialization
    this.checkoutService.getDeliveryMethods().subscribe({
      next: (res: IDeliveryMethod[]) => {
        // Store the sorted delivery methods in the component
        this.deliveryMethods = res;
      },
      error: (err) => {
        // Handle any errors that occur while fetching data
        console.error(err);
      },
    });
  }

  // Set the shipping price based on selected delivery method
  setShippingPrice(deliveryMethod: IDeliveryMethod) {
    this.basketService.setShippingPrice(deliveryMethod);
  }

}

