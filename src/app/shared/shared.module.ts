import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PaginationModule } from 'ngx-bootstrap/pagination';
import { PagingHeaderComponent } from './components/paging-header/paging-header.component';
import { PagerComponent } from './components/pager/pager.component';
import { CarouselModule } from 'ngx-bootstrap/carousel';
import { OrderSummaryComponent } from './components/order-summary/order-summary.component';
import { ReactiveFormsModule } from '@angular/forms';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { CdkStepperModule } from '@angular/cdk/stepper'; // Importing Angular CDK Stepper Module
import { StepperComponent } from './components/stepper/stepper.component'; // Stepper component for multi-step processes

/**
 * Shared module that bundles commonly used components and modules across the application.
 * Includes pagination, carousel, order summary, and stepper components.
 */
@NgModule({
  declarations: [
    PagingHeaderComponent,  // Component for displaying pagination headers
    PagerComponent,         // Component for displaying pagination controls
    OrderSummaryComponent,  // Component for summarizing order details
    StepperComponent        // Component for handling multi-step processes
  ],
  imports: [
    CommonModule,                    // Common Angular directives
    PaginationModule.forRoot(),      // Pagination module for page navigation
    CarouselModule.forRoot(),        // Carousel module for image sliders
    BsDropdownModule.forRoot(),      // Initializing BsDropdownModule with forRoot for root module configuration
    ReactiveFormsModule,             // Reactive forms module for form handling
    CdkStepperModule                 // CDK Stepper module for creating step-by-step forms
  ],
  exports: [
    PaginationModule,        // Exporting for usage in other modules
    PagingHeaderComponent,   // Exporting for usage in other modules
    PagerComponent,          // Exporting for usage in other modules
    CarouselModule,          // Exporting for usage in other modules
    OrderSummaryComponent,   // Exporting for usage in other modules
    ReactiveFormsModule,     // Exporting Reactive Forms module for usage in other modules
    BsDropdownModule,        // Exporting BsDropdownModule to make it available throughout the app
    CdkStepperModule,        // Exporting CdkStepperModule for use in other modules
    StepperComponent         // Exporting StepperComponent for use in multi-step processes
  ]
})
export class SharedModule { }


