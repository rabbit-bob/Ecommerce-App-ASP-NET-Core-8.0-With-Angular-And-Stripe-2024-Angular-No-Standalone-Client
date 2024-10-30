import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { TestErrorComponent } from './core/test-error/test-error.component';
import { NotFoundComponent } from './core/not-found/not-found.component';
import { ServerErrorComponent } from './core/server-error/server-error.component';
import { authGuard } from './core/guards/auth.guard';

/**
 * Defines routes for the main application, including lazy-loaded modules and guards.
 * The breadcrumb data is used for navigation trails across different routes.
 */
const routes: Routes = [
  // Default route to the Home component
  { path: '', component: HomeComponent, data: { breadcrumb: 'Home' } },

  // Error routes for 404 (Not Found) and 500 (Server Error) pages
  { path: 'not-found', component: NotFoundComponent, data: { breadcrumb: 'Not Found' } },
  { path: 'server-error', component: ServerErrorComponent, data: { breadcrumb: 'Server Error' } },
  { path: 'test-error', component: TestErrorComponent, data: { breadcrumb: 'Test Error' } },

  // Lazy-loaded route for Shop module
  { 
    path: 'shop', 
    loadChildren: () => import('./shop/shop.module').then(m => m.ShopModule),
    data: { breadcrumb: 'Shop' } 
  },

  // Lazy-loaded route for Basket module
  { 
    path: 'basket', 
    loadChildren: () => import('./basket/basket.module').then(m => m.BasketModule),
    data: { breadcrumb: 'Basket' } 
  },

  // Lazy-loaded route for Checkout module with auth guard
  { 
    path: 'checkout', 
    canActivate: [authGuard],
    loadChildren: () => import('./checkout/checkout.module').then(m => m.CheckoutModule),
    data: { breadcrumb: 'Checkout' } 
  },

  // Lazy-loaded route for Account module with breadcrumb skipping
  { 
    path: 'account', 
    loadChildren: () => import('./account/account.module').then(m => m.AccountModule),
    data: { breadcrumb: { skip: true } } 
  },

  // Lazy-loaded route for Orders module with auth guard
  { 
    path: 'orders', 
    canActivate: [authGuard],
    loadChildren: () => import('./order/order.module').then(m => m.OrderModule),
    data: { breadcrumb: 'Orders' } 
  },

  // Wildcard route redirects to Not Found page for unknown paths
  { path: '**', redirectTo: 'not-found', pathMatch: 'full' }
];

/**
 * AppRoutingModule sets up the main application routes.
 */
@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

