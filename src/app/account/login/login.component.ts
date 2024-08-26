import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
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

  // Reactive form for login input fields
  loginForm: FormGroup;

  /**
   * Injects the AccountService to handle login operations.
   * Initializes the login form with form controls and validators.
   */
  constructor(private accountService: AccountService) {
    this.loginForm = new FormGroup({
      email: new FormControl('', Validators.required),    // Email input with validation
      password: new FormControl('', Validators.required)  // Password input with validation
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
    this.accountService.login(this.loginForm.value).subscribe({
      next: () => {
        console.log('Login success');  // Log message on successful login
      },
      error: (err) => {
        console.error(err);  // Log error if login fails
      }
    });
  }

}
