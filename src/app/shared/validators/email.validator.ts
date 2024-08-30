import { Injectable } from '@angular/core';
import { AsyncValidatorFn, AbstractControl } from '@angular/forms';
import { map, of, switchMap, timer } from 'rxjs';
import { AccountService } from '../../account/account.service';

@Injectable({ providedIn: 'root' })
export class EmailValidator {
  constructor(private accountService: AccountService) {}

  /**
   * Asynchronous validator to check if the email is already taken.
   * Uses a timer to debounce the API request to prevent too many requests being made.
   * @returns AsyncValidatorFn - A function that returns an observable of ValidationErrors or null
   */
  validateEmailNotTaken(): AsyncValidatorFn {
    return (control: AbstractControl) => {
      // If the control's value is empty, return null (valid)
      if (!control.value) {
        return of(null);
      }

      // Debounce the check to avoid too many API calls
      return timer(1000).pipe(
        switchMap(() => {
          // Check if the email exists via AccountService
          return this.accountService.checkEmailExist(control.value).pipe(
            map((emailExists) => {
              // If email exists, return an error object, otherwise return null
              return emailExists ? { emailExists: true } : null;
            })
          );
        })
      );
    };
  }
}

