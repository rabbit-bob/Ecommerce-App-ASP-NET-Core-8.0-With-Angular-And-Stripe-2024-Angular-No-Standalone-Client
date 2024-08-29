import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AccountService } from '../account.service';
import { PasswordValidator } from '../../shared/validators/password.validator';
import { EmailValidator } from '../../shared/validators/email.validator';
import { Router } from '@angular/router';

/**
 * Component responsible for user registration functionality.
 */
@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
})
export class RegisterComponent implements OnInit {
  registerForm: FormGroup; // Reactive form for capturing registration input fields

  /**
   * Constructor to inject dependencies and initialize the register form.
   * @param fb FormBuilder instance for reactive form creation
   * @param accountService AccountService for managing account operations
   * @param router Router for navigating on successful registration
   */
  constructor(
    private fb: FormBuilder,
    private accountService: AccountService,
    private router: Router
  ) {
    this.registerForm = this.fb.group(
      {
        firstName: ['', [Validators.required]], // Form control for first name with required validator
        lastName: ['', [Validators.required]], // Form control for last name with required validator
        email: [
          '',
          [
            Validators.required,
            Validators.pattern(EmailValidator.regex),
          ],
        ], // Form control for email with required validator
        password: [
          '',
          [
            Validators.required,
            Validators.pattern(PasswordValidator.regex),
          ],
        ], // Form control for password with required validator
        confirmPassword: [
          '',
          [
            Validators.required,
            Validators.pattern(PasswordValidator.regex),
          ],
        ], // Form control for confirm password with required validator
      },
      {
        validator: PasswordValidator.mustMatch('password', 'confirmPassword'), // Custom validator for password matching
      }
    );
  }

  ngOnInit(): void {}

  // Getter methods for form controls
  get _displayName() {
    return this.registerForm.get('displayName');
  }

  get _email() {
    return this.registerForm.get('email');
  }

  get _password() {
    return this.registerForm.get('password');
  }

  get _confirmPassword() {
    return this.registerForm.get('confirmPassword');
  }

  /**
   * Handles the submission of the registration form.
   * Submits the registration data to the AccountService.
   */
  onSubmit() {
    if (this.registerForm.valid) {
      this.accountService.register(this.registerForm.value).subscribe({
        next: () => {
          this.router.navigateByUrl('/shop'); // Navigate to the shop page after successful registration
          console.log('Registration successful', this.registerForm.value); // Log message on successful registration
        },
        error: (err) => console.error('Registration failed', err), // Log error if registration fails
      });
    }
  }
}
