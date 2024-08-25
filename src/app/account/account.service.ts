import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment.development';
import { BehaviorSubject, map } from 'rxjs';
import { IUser } from '../shared/models/user'; // Importing IUser interface for user details
import { HttpClient } from '@angular/common/http';

/**
 * Service managing operations related to user accounts.
 */
@Injectable({
  providedIn: 'root' // Makes the service available at the root level of the application
})
export class AccountService {

  // Base URL for API requests, derived from environment configuration
  baseURL = environment.baseURL;

  // BehaviorSubject to manage the state of the current user
  private currentUser = new BehaviorSubject<IUser>({
    email: '',          // Default email is empty
    displayName: '',    // Default display name is empty
    token: ''           // Default token is empty
  });

  // Observable stream of the current user's state
  currentUser$ = this.currentUser.asObservable();

  // Injecting HttpClient to make HTTP requests to the API
  constructor(private http: HttpClient) { }

  /**
   * Authenticates a user with the provided credentials.
   * @param value The login credentials.
   * @returns An observable that resolves when the user is authenticated.
   */
  login(value: any) {
    return this.http.post<IUser>(this.baseURL + 'Accounts/login', value).pipe(
      map((user: IUser) => {
        if (user) {
          // Store the authentication token in local storage
          localStorage.setItem('token', user.token);
          
          // Update the current user state
          this.currentUser.next(user);
        }
      })
    );
  }

  /**
   * Registers a new user with the provided information.
   * @param value The registration details.
   * @returns An observable that resolves when the user is registered.
   */
  register(value: any) {
    return this.http.post<IUser>(this.baseURL + 'Accounts/register', value).pipe(
      map((user: IUser) => {
        if (user) {
          // Store the authentication token in local storage upon registration
          localStorage.setItem('token', user.token);
        }
      })
    );
  }

  /**
   * Logs out the current user, removing their authentication token.
   */
  logout() {
    // Remove the authentication token from local storage
    localStorage.removeItem('token');

    // Reset the current user state to default values
    this.currentUser.next({
      email: '',
      displayName: '',
      token: ''
    });
  }
}

