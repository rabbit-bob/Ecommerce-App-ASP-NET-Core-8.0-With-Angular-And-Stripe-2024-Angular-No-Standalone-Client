import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CheckoutRoutingModule } from './checkout-routing.module';
import { CheckoutComponent } from './checkout.component';
import { SharedModule } from '../shared/shared.module';

/**
 * Module responsible for the checkout process.
 * Imports SharedModule for shared components like the order summary.
 */
@NgModule({
  declarations: [
    CheckoutComponent  // Component handling the checkout functionality
  ],
  imports: [
    CommonModule,         // Common Angular directives
    CheckoutRoutingModule, // Routing for checkout-related features
    SharedModule          // Shared module for components used in multiple modules
  ]
})
export class CheckoutModule { }
