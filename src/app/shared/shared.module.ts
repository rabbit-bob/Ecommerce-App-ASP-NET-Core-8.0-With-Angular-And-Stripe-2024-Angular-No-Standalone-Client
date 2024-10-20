import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PaginationModule } from 'ngx-bootstrap/pagination';
import { PagingHeaderComponent } from './components/paging-header/paging-header.component';
import { PagerComponent } from './components/pager/pager.component';
import { CarouselModule } from 'ngx-bootstrap/carousel';
import { OrderSummaryComponent } from './components/order-summary/order-summary.component';
import { ReactiveFormsModule } from '@angular/forms';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { CdkStepperModule } from '@angular/cdk/stepper'; // Import Angular CDK Stepper module for step-based form navigation
import { StepperComponent } from './components/stepper/stepper.component';
import { BasketSummaryComponent } from './components/basket-summary/basket-summary.component'; // Import Basket Summary Component
import { RouterModule } from '@angular/router';
import { CheckoutSuccessComponent } from './components/checkout-success/checkout-success.component';

/**
 * The shared module includes reusable components and third-party modules used across the application.
 * This module consolidates common elements to avoid redundancy across feature modules.
 */
@NgModule({
  declarations: [
    PagingHeaderComponent,  // Pagination header component for displaying page headers
    PagerComponent,         // Pager component for page navigation controls
    OrderSummaryComponent,  // Component to display a summary of the order during checkout
    StepperComponent,       // Stepper component for guiding users through multi-step processes
    BasketSummaryComponent, CheckoutSuccessComponent  // Component for displaying and interacting with the shopping basket
  ],
  imports: [
    CommonModule,                    // Basic Angular directives and pipes
    PaginationModule.forRoot(),      // ngx-bootstrap pagination module for pagination features
    CarouselModule.forRoot(),        // ngx-bootstrap carousel module for creating image sliders
    BsDropdownModule.forRoot(),      // ngx-bootstrap dropdown module for enhanced dropdown menus
    ReactiveFormsModule,             // Reactive forms module for form management
    CdkStepperModule,                // CDK Stepper module for step-by-step navigation in forms
    RouterModule                     // Router module for handling navigation between pages
  ],
  exports: [
    PaginationModule,        // Export pagination module to make it available for use in other modules
    PagingHeaderComponent,   // Export pagination header component for reuse in other parts of the application
    PagerComponent,          // Export pager component for pagination controls across other modules
    CarouselModule,          // Export carousel module for image slider functionality
    OrderSummaryComponent,   // Export order summary component for checkout process reuse
    ReactiveFormsModule,     // Export reactive forms module for form handling in other modules
    BsDropdownModule,        // Export BsDropdownModule to allow dropdown usage throughout the application
    CdkStepperModule,        // Export CDK Stepper module for step navigation across other modules
    StepperComponent,        // Export stepper component for multi-step processes in forms
    BasketSummaryComponent   // Export Basket Summary Component for handling shopping basket functionality
  ]
})
export class SharedModule { }



