import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment.development';
import { BehaviorSubject, map, Observable, of, ReplaySubject } from 'rxjs';
import { IUser } from '../shared/models/user';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';

/**
 * Service managing operations related to user accounts.
 */
@Injectable({
  providedIn: 'root' // Makes the service available at the root level of the application
})
export class AccountService {

  // Base URL for API requests, derived from environment configuration
  _baseURL = environment.baseURL;

  // BehaviorSubject to manage the state of the current user
  private currentUser = new ReplaySubject<IUser | null>(1);

  // Observable stream of the current user's state
  currentUser$ = this.currentUser.asObservable();

  /**
   * Injects HttpClient for API requests and Router for navigation.
   */
  constructor(private http: HttpClient, private router: Router) {
    console.log('AccountService initialized');
    // Example user for testing purposes
    const exampleUser: IUser = {
      email: 'test@example.com',
      displayName: 'Test User',
      token: 'example-token'
    };
    // Uncomment below line to set a default user during testing
    // this.currentUser.next(exampleUser);
  }

  /**
   * Returns the current user value from BehaviorSubject.
   * This method provides direct access to the user data stored in the currentUser BehaviorSubject.
   */
  // getCurrentUserValue(): IUser | null {
  //   return this.currentUser.value;
  // }

  /**
   * Loads the current user from the server using a provided token.
   * @param token - The JWT token used for authentication in the Authorization header.
   * This method makes an HTTP GET request to fetch the current user data and updates the BehaviorSubject.
   */
  loadCurrentUser(token: string): Observable<IUser | null> {
    if (token === null) {
      this.currentUser.next(null);
      return of(null);
    }
    let headers = new HttpHeaders();
    headers = headers.set('Authorization', `Bearer ${token}`);

    return this.http.get<IUser>(`${this._baseURL}Accounts/get-current-user`, { headers }).pipe(
      map((user: IUser) => {
        if (user) {
          // Store the token in localStorage for future requests.
          localStorage.setItem('token', user.token);
          // Update the current user BehaviorSubject with the fetched user data.
          this.currentUser.next(user);
          return user;
        } else {
          return null;
        }
      })
    );
  }

  /**
   * Authenticates a user with the provided credentials.
   * @param value The login credentials.
   * @returns An observable that resolves when the user is authenticated.
   */
  login(value: any) {
    return this.http.post<IUser>(this._baseURL + 'Accounts/login', value).pipe(
      map((user: IUser) => {
        if (user) {
          console.log('User from server:', user);
          // Store the authentication token in local storage
          localStorage.setItem('token', user.token);
          // Update the current user state
          this.currentUser.next(user);
          // console.log('Current user after setting in BehaviorSubject:', this.currentUser.value);
        }
      })
    );
  }
  
  /**
   * Initializes the current user by checking for a token in localStorage.
   * If a token exists, it loads the user using the loadCurrentUser method.
   */
  initializeCurrentUser(): void {
    const token = localStorage.getItem('token');
    if (token) {
      this.loadCurrentUser(token).subscribe({
        next: () => {
          console.log('User loaded successfully');
        },
        error: (err) => {
          console.error('Error loading user:', err);
        }
      });
    }
  }

  /**
   * Registers a new user with the provided information.
   * @param value The registration details.
   * @returns An observable that resolves when the user is registered.
   */
  register(value: any) {
    return this.http.post<IUser>(this._baseURL + 'Accounts/register', value).pipe(
      map((user: IUser) => {
        if (user) {
          // Store the authentication token in local storage upon registration
          localStorage.setItem('token', user.token);
          this.currentUser.next(user);
        }
      })
    );
  }

  /**
   * Logs out the current user, removing their authentication token and resetting user state.
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

    // Navigate to the home page after logging out
    this.router.navigateByUrl('/');
  }

  /**
   * Checks if an email address is already registered.
   * @param email The email address to check.
   * @returns An observable indicating whether the email exists.
   */
  checkEmailExist(email: string) {
    return this.http.get(this._baseURL + 'Accounts/check-email-exist?email=' + email);
  }
}
