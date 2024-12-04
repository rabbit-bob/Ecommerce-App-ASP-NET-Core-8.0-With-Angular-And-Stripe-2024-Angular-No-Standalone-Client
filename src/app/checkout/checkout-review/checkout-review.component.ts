import { Component, Input, OnInit } from '@angular/core';
import { BasketService } from '../../basket/basket.service';
import { ToastrService } from 'ngx-toastr';
import { CdkStepper } from '@angular/cdk/stepper';

@Component({
  selector: 'app-checkout-review',
  templateUrl: './checkout-review.component.html',
  styleUrl: './checkout-review.component.scss',
})
export class CheckoutReviewComponent implements OnInit {
  /**
   * Reference to the stepper for programmatic navigation.
   */
  @Input()
  appStepper!: CdkStepper;

  constructor(
    private basketService: BasketService,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {}

  /**
   * Initiates the creation of a payment intent for the current basket.
   * On success, displays a toast message and navigates to the next step.
   * Logs an error message if the request fails.
   */
  createPaymentIntent() {
    this.basketService.createPaymentIntent()?.subscribe({
      next: () => {
        this.toastr.success('Payment intent created successfully');
        this.appStepper.next();
      },
      error: (err) => {
        console.error('Error creating payment intent:', err.message);
      },
    });
  }
}

