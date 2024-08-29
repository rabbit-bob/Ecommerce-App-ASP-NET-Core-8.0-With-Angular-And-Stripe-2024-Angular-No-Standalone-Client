import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export class PasswordValidator {
  // Regex for password validation: minimum 8 characters, at least one uppercase letter, one lowercase letter, one number and one special character
  static regex: string = '^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[$@$!%*?&#])[A-Za-z\\d$@$!%*?&#]{8,}';

  // Custom validator for checking password and confirm password match
  static mustMatch(passwordControlName: string, confirmPasswordControlName: string): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const passwordControl = control.get(passwordControlName);
      const confirmPasswordControl = control.get(confirmPasswordControlName);

      if (confirmPasswordControl?.errors && !confirmPasswordControl.errors['mustMatch']) {
        return null;
      }

      if (passwordControl?.value !== confirmPasswordControl?.value) {
        confirmPasswordControl?.setErrors({ mustMatch: true });
        return { mustMatch: true };
      } else {
        confirmPasswordControl?.setErrors(null);
        return null;
      }
    };
  }
}
