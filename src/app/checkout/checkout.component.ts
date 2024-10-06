import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { IDeliveryMethod } from '../shared/models/deliveryMethod';
import { AccountService } from '../account/account.service';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.scss']
})
export class CheckoutComponent implements OnInit {

  checkoutForm: FormGroup;
  @Input() deliveryMethods: IDeliveryMethod[] = [];;

  /**
   * Constructor initializes the form builder service.
   * FormBuilder is used to create the checkout form structure.
   */
  constructor(private fb: FormBuilder, private accountService: AccountService) {
    // Initialize an empty form group upon component creation
    this.checkoutForm = this.fb.group({});
  }

  /**
   * Lifecycle hook called on component initialization.
   * Calls the method to create the checkout form with necessary fields.
   */
  ngOnInit(): void {
    this.createCheckoutForm();
    this.getAddressFormValues();
  }

  /**
   * Creates the checkout form structure.
   * Includes address, delivery, and payment subforms with their respective validations.
   */
  createCheckoutForm() {
    this.checkoutForm = this.fb.group({
      // Address form group with required validators
      addressForm: this.fb.group({
        firstName: ['', Validators.required],
        lastName: ['', Validators.required],
        street: ['', Validators.required],
        city: ['', Validators.required],
        state: ['', Validators.required],
        zipCode: ['', Validators.required]
      }),
      // Delivery form group with delivery method selection
      deliveryForm: this.fb.group({
        deliveryMethod: ['', Validators.required]
      }),
      // Payment form group with required name on card validation
      paymentForm: this.fb.group({
        nameOnCard: ['', Validators.required]
      })
    });
  }

  /**
   * Retrieves the user's saved address and patches the address form with the retrieved data.
   * This method is used to pre-fill the address form with the user's saved information.
   */
  getAddressFormValues() {
    this.accountService.getUserAddress().subscribe({
      next: (address) => {
        this.checkoutForm.get('addressForm')?.patchValue(address);
      },
      error: (err) => {
        console.log(err);
      }
    });
  }

}

