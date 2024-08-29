import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AccountService } from '../account.service';
import { Router } from '@angular/router';

/**
 * Component responsible for user login functionality.
 */
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  // Reactive form for capturing login input fields
  loginForm: FormGroup;

  /**
   * Constructor to inject dependencies and initialize the login form.
   * @param fb FormBuilder instance for reactive form creation
   * @param accountService AccountService for managing account operations
   * @param router Router for navigating on successful login
   */
  constructor(
    private fb: FormBuilder,
    private accountService: AccountService,
    private router: Router
  ) {
    this.loginForm = this.fb.group({
      email: [
        '',
        [
          Validators.required,
          Validators.pattern('^\\w+[\\w-\\.]*\\@\\w+((-\\w+)|(\\w*))\\.[a-z]{2,3}$')
        ],
      ], // Form control for email with required validator
      password: [
        '',
        [
          Validators.required,
          Validators.pattern('^(?=.*\\d)(?=.*[a-z])(?=.*[A-Z]).{8,15}$')
        ],
      ], // Form control for password with required validator
    });
  }

  // Lifecycle hook called on component initialization.
  ngOnInit(): void {}

  // Getter methods for form controls
  get _email() {
    return this.loginForm.get('email');
  }

  get _password() {
    return this.loginForm.get('password');
  }

  /**
   * Handles the submission of the login form.
   * Submits the login credentials to the AccountService.
   */
  onSubmit() {
    if (this.loginForm.valid) {
      this.accountService.login(this.loginForm.value).subscribe({
        next: () => {
          this.router.navigateByUrl('/shop'); // Navigate to the shop page after successful login
          console.log('Login successful', this.loginForm.value); // Log message on successful login
        },
        error: (err) => console.error('Login failed', err), // Log error if login fails
      });
    }
  }
}

