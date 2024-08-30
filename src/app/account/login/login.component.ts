import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AccountService } from '../account.service';
import { ActivatedRoute, Router } from '@angular/router';

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
  returnUrl: string;

  /**
   * Constructor to inject dependencies and initialize the login form.
   * @param fb FormBuilder instance for reactive form creation
   * @param accountService AccountService for managing account operations
   * @param router Router for navigating on successful login
   * @param activatedRoute ActivatedRoute for accessing route parameters
   */
  constructor(
    private fb: FormBuilder,
    private accountService: AccountService,
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) {
    this.loginForm = this.fb.group({
      email: [
        '',
        [
          Validators.required,
          Validators.email  // Use Validators.email for better email validation
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
    this.returnUrl = '';
  }

  // Lifecycle hook called on component initialization.
  ngOnInit(): void {
    this.returnUrl = this.activatedRoute.snapshot.queryParams['returnUrl'] || '/shop'; // Removed incorrect dot before ['returnUrl']
  }

  // Getter methods for form controls
  get email() {
    return this.loginForm.get('email');
  }

  get password() {
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
          this.router.navigateByUrl(this.returnUrl); // Navigate to the returnUrl after successful login
          console.log('Login successful', this.loginForm.value); // Log message on successful login
        },
        error: (err) => console.error('Login failed', err), // Log error if login fails
      });
    }
  }
}


