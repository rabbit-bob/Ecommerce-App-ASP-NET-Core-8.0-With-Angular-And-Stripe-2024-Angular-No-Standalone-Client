import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { map, Observable } from 'rxjs';
import { AccountService } from '../../account/account.service';

/**
 * Authentication Guard to protect routes that require authentication.
 */
export const authGuard: CanActivateFn = (route, state): Observable<boolean> => {
  // Inject services needed for authentication check
  const accountService = inject(AccountService);
  const router = inject(Router);

  return accountService.currentUser$.pipe(
    map(auth => {
      if (auth) {
        return true; // User is authenticated
      }
      // Navigate to login page if not authenticated, with the intended URL as a query parameter
      router.navigate(['account/login'], { queryParams: { returnUrl: state.url } });
      return false; // User is not authenticated
    })
  );
};
