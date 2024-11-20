import { Component, OnInit } from '@angular/core';
import { BasketService } from '../../basket/basket.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-checkout-review',
  templateUrl: './checkout-review.component.html',
  styleUrls: ['./checkout-review.component.scss'],
})
export class CheckoutReviewComponent implements OnInit {
  constructor(
    private basketService: BasketService,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {}

  /**
   * Triggers the creation of a payment intent for the current basket.
   * Displays a success notification upon success and logs errors otherwise.
   */
  createPaymentIntent() {
    this.basketService.createPaymentIntent()?.subscribe({
      next: () => {
        this.toastr.success('Payment intent created successfully');
      },
      error: (err) => {
        console.error('Error creating payment intent:', err.message);
      },
    });
  }
}

