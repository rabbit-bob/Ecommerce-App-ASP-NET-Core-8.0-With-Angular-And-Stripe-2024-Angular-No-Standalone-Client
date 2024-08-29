import { Injectable } from '@angular/core';
import { AsyncValidatorFn, AbstractControl, ValidationErrors } from '@angular/forms';
import { map, of, switchMap, timer } from 'rxjs';
import { AccountService } from '../../account/account.service';

@Injectable({ providedIn: 'root' })
export class EmailValidator {
    static regex: RegExp = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; // Pattern regex for email
  constructor(private accountService: AccountService) {}

  /**
   * Validates that the email is not already taken.
   * @returns AsyncValidatorFn
   */
  ValidateEmailNotTaken(): AsyncValidatorFn {
    return (controls: AbstractControl) => {
      return timer(1000).pipe(
        switchMap(() => {
          if (!controls.value) {
            return of(null); // Returns null if the email field is empty
          }
          return this.accountService.checkEmailExist(controls.value).pipe(
            map((res) => {
              return res ? { emailExists: true } : null; // Returns 'emailExists' error if the email is already taken
            })
          );
        })
      );
    };
  }
}
