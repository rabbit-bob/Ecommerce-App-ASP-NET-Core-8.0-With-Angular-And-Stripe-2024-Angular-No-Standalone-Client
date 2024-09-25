import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CheckoutRoutingModule } from './checkout-routing.module';
import { CheckoutComponent } from './checkout.component';
import { SharedModule } from '../shared/shared.module';
import { CheckoutAddressComponent } from './checkout-address/checkout-address.component';
import { CheckoutDeliveryComponent } from './checkout-delivery/checkout-delivery.component';
import { CheckoutReviewComponent } from './checkout-review/checkout-review.component';
import { CheckoutPaymentComponent } from './checkout-payment/checkout-payment.component';

/**
 * Module responsible for the checkout process.
 * This module organizes the various steps of checkout, including address input, delivery selection,
 * order review, and payment. It imports SharedModule to reuse shared components like the order summary.
 */
@NgModule({
  declarations: [
    CheckoutComponent,           // Main checkout component
    CheckoutAddressComponent,     // Component for handling address input
    CheckoutDeliveryComponent,    // Component for selecting delivery options
    CheckoutReviewComponent,      // Component for reviewing the order
    CheckoutPaymentComponent      // Component for handling payment processing
  ],
  imports: [
    CommonModule,                // Common Angular directives
    CheckoutRoutingModule,        // Routing for checkout-related features
    SharedModule                 // Shared module for commonly used components
  ]
})
export class CheckoutModule { }
