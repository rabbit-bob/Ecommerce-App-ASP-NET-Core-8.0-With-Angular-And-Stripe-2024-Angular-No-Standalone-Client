import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment.development';
import { map, Observable, of, ReplaySubject } from 'rxjs';
import { IUser } from '../shared/models/user';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { IAddress } from '../shared/models/address';

/**
 * Service managing operations related to user accounts.
 */
@Injectable({
  providedIn: 'root' // Makes the service available at the root level of the application
})
export class AccountService {

  // Base URL for API requests, derived from environment configuration
  private _baseURL = environment.baseURL;

  // ReplaySubject to manage the state of the current user
  private currentUser = new ReplaySubject<IUser | null>(1);

  // Observable stream of the current user's state
  currentUser$ = this.currentUser.asObservable();

  /**
   * Injects HttpClient for API requests and Router for navigation.
   */
  constructor(private http: HttpClient, private router: Router) {
    console.log('AccountService initialized');
  }

  /**
   * Loads the current user from the server using a provided token.
   * @param token - The JWT token used for authentication in the Authorization header.
   * This method makes an HTTP GET request to fetch the current user data and updates the ReplaySubject.
   */
  loadCurrentUser(token: string): Observable<IUser | null> {
    if (!token) {
      this.currentUser.next(null); // If no token, set current user to null
      return of(null); // Return an observable of null
    }

    let headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    return this.http.get<IUser>(`${this._baseURL}Accounts/get-current-user`, { headers }).pipe(
      map((user: IUser) => {
        if (user) {
          // Store the token in localStorage for future requests.
          localStorage.setItem('token', user.token);
          // Update the current user ReplaySubject with the fetched user data.
          this.currentUser.next(user);
          return user;
        } else {
          return null;
        }
      })
    );
  }

  /**
   * Retrieves the user's saved address from the server.
   * @returns Observable of the user's address.
   */
  getUserAddress(): Observable<IAddress> {
    return this.http.get<IAddress>(`${this._baseURL}Accounts/get-user-address`);
  }

  /**
   * Updates the user's address on the server.
   * @param address The address to be updated.
   * @returns Observable of the updated address.
   */
  updateUserAddress(address: IAddress): Observable<IAddress> {
    return this.http.post<IAddress>(`${this._baseURL}Accounts/update-user-address`, address);
  }
}


