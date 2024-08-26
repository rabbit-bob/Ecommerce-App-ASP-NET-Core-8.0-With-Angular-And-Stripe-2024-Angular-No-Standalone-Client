import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PaginationModule } from 'ngx-bootstrap/pagination';
import { PagingHeaderComponent } from './components/paging-header/paging-header.component';
import { PagerComponent } from './components/pager/pager.component';
import { CarouselModule } from 'ngx-bootstrap/carousel';
import { OrderSummaryComponent } from './components/order-summary/order-summary.component';
import { ReactiveFormsModule } from '@angular/forms';

/**
 * Shared module that bundles commonly used components and modules across the application.
 */
@NgModule({
  declarations: [
    PagingHeaderComponent, // Component for displaying pagination headers
    PagerComponent,        // Component for displaying pagination controls
    OrderSummaryComponent  // Component for summarizing order details
  ],
  imports: [
    CommonModule,                    // Common Angular directives
    PaginationModule.forRoot(),      // Pagination module for page navigation
    CarouselModule.forRoot(),        // Carousel module for image sliders
    ReactiveFormsModule              // Reactive forms module for form handling
  ],
  exports: [
    PaginationModule,        // Exporting for usage in other modules
    PagingHeaderComponent,   // Exporting for usage in other modules
    PagerComponent,          // Exporting for usage in other modules
    CarouselModule,          // Exporting for usage in other modules
    OrderSummaryComponent,   // Exporting for usage in other modules
    ReactiveFormsModule      // Exporting Reactive Forms module for usage in other modules
  ]
})
export class SharedModule { }
