import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AccountRoutingModule } from './account-routing.module';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { AccountService } from './account.service';
import { SharedModule } from '../shared/shared.module';

/**
 * Module handling functionalities related to user account management.
 * Imports SharedModule for shared components and directives.
 */
@NgModule({
  declarations: [
    LoginComponent,    // Component for user login
    RegisterComponent  // Component for user registration
  ],
  imports: [
    CommonModule,         // Common Angular directives
    AccountRoutingModule, // Routing module for account features
    SharedModule          // Shared module for shared components and modules
  ],
  providers: [AccountService] // Providing AccountService at the module level
})
export class AccountModule { }


