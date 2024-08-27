import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavBarComponent } from './nav-bar/nav-bar.component';
import { RouterModule } from '@angular/router';
import { TestErrorComponent } from './test-error/test-error.component';
import { NotFoundComponent } from './not-found/not-found.component';
import { ServerErrorComponent } from './server-error/server-error.component';
import { ToastrModule } from 'ngx-toastr';
import { SectionHeaderComponent } from './section-header/section-header.component';
import { BreadcrumbComponent, BreadcrumbItemDirective } from 'xng-breadcrumb';
import { SharedModule } from '../shared/shared.module';

/**
 * CoreModule is responsible for providing core components and services.
 * It is intended to be imported only once in the AppModule to maintain singleton services.
 */
@NgModule({
  declarations: [
    NavBarComponent,           // Component for navigation bar
    TestErrorComponent,        // Component to test error handling
    NotFoundComponent,         // Component displayed for 404 errors
    ServerErrorComponent,      // Component displayed for server errors
    SectionHeaderComponent     // Component for displaying section headers with breadcrumbs
  ],
  imports: [
    CommonModule,              // Import CommonModule to use common Angular directives
    RouterModule,              // Import RouterModule to enable navigation functionalities
    ToastrModule.forRoot({     // Configure ToastrModule for global notifications
      positionClass: 'toast-bottom-right',
      countDuplicates: true,
      preventDuplicates: true
    }),
    BreadcrumbComponent,       // Breadcrumb component from xng-breadcrumb for navigation
    BreadcrumbItemDirective,   // Directive for individual breadcrumb items
    SharedModule               // Import SharedModule to reuse shared components and directives
  ],
  exports: [
    NavBarComponent,           // Export NavBarComponent to use it outside of CoreModule
    SectionHeaderComponent     // Export SectionHeaderComponent for breadcrumb usage
  ]
})
export class CoreModule { }

