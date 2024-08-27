import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AccountService } from '../account.service';

/**
 * Component responsible for user login functionality.
 */
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent implements OnInit {

  // Reactive form for capturing login input fields
  loginForm: FormGroup;

  /**
   * Constructor to inject dependencies and initialize the login form.
   * @param fb FormBuilder instance for reactive form creation
   * @param accountService AccountService for managing account operations
   */
  constructor(private fb: FormBuilder, private accountService: AccountService) {
    this.loginForm = this.fb.group({
      email: ['', Validators.required],    // Form control for email with required validator
      password: ['', Validators.required]  // Form control for password with required validator
    });
  }

  /**
   * Lifecycle hook called on component initialization.
   * Currently not performing any action.
   */
  ngOnInit(): void {
    // Initialization logic can be added here if needed in the future
  }

  /**
   * Handles the submission of the login form.
   * Submits the login credentials to the AccountService.
   */
  onSubmit() {
    if (this.loginForm.valid) {
      this.accountService.login(this.loginForm.value).subscribe({
        next: () => console.log('Login successful', this.loginForm.value),  // Log message on successful login
        error: (err) => console.error('Login failed', err)  // Log error if login fails
      });
    }
  }
}
