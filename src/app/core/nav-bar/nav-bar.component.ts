import { Component, OnInit } from '@angular/core';
import { BasketService } from '../../basket/basket.service';
import { filter, Observable } from 'rxjs';
import { IBasket } from '../../shared/models/basket';
import { AccountService } from '../../account/account.service';
import { IUser } from '../../shared/models/user';

/**
 * Component responsible for displaying the navigation bar.
 * Shows the basket items count and login/logout actions based on user authentication state.
 */
@Component({
  selector: 'app-nav-bar',
  templateUrl: './nav-bar.component.html',
  styleUrl: './nav-bar.component.scss',
})
export class NavBarComponent implements OnInit {
  
  basket$!: Observable<IBasket>;  // Observable for the current state of the user's basket
  currentUser$!: Observable<IUser>; // Observable for the current authenticated user
  
  /**
   * Injects services for basket management and user authentication.
  */
  constructor(
    private basketService: BasketService,
    private accountService: AccountService
  ) {
    console.log('NavBarComponent constructor called'); 
  }
  
  /**
   * Initializes component data streams for basket and user state.
  */
 ngOnInit(): void {
   console.log('NavBarComponent ngOnInit called');
   
   // Sets up an observable to listen for changes in the user's basket
   this.basket$ = this.basketService.basket$.pipe(
     filter((basket): basket is IBasket => basket !== null)
    );
    
    // Sets up an observable to listen for changes in the user's authentication state
    this.currentUser$ = this.accountService.currentUser$.pipe(
      filter((user): user is IUser => user !== null)
    );
    
    // Logs the user information whenever it is updated
    this.currentUser$.subscribe(user => {
      console.log('Current User in NavBarComponent after login:', user);
    });
  }
  
  /**
   * Logs the user out by calling the logout method in AccountService.
   */
  logout() {
  this.accountService.logout();
  }

  /**
   * Lifecycle hook to perform cleanup when the component is destroyed.
   */
  ngOnDestroy(): void {
    console.log('NavBarComponent destroyed');
  }
}
