import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { IDeliveryMethod } from '../shared/models/deliveryMethod';
import { AccountService } from '../account/account.service';
import { BasketService } from '../basket/basket.service';

/**
 * Component for handling the checkout process.
 * Includes forms for address, delivery, and payment information.
 */
@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrl: './checkout.component.scss'
})
export class CheckoutComponent implements OnInit {
  /**
   * Form group for managing the checkout form.
   * Contains subforms for address, delivery, and payment.
   */
  checkoutForm: FormGroup;

  /**
   * List of available delivery methods to choose from.
   */
  @Input() deliveryMethods: IDeliveryMethod[] = [];

  /**
   * Constructor initializes necessary services and form builder.
   * @param fb FormBuilder for creating reactive forms.
   * @param accountService Service to manage user account-related data.
   * @param basketService Service to manage basket-related data and actions.
   */
  constructor(
    private fb: FormBuilder,
    private accountService: AccountService,
    private basketService: BasketService
  ) {
    // Initialize an empty form group upon component creation
    this.checkoutForm = this.fb.group({});
  }

  /**
   * Lifecycle hook triggered on component initialization.
   * Initializes the checkout form and preloads data for address and delivery method.
   */
  ngOnInit(): void {
    this.createCheckoutForm();
    this.getAddressFormValues();
    this.getDeliveryMethodValue();
  }

  /**
   * Creates the structure of the checkout form.
   * Includes address, delivery, and payment subforms with respective validations.
   */
  createCheckoutForm(): void {
    this.checkoutForm = this.fb.group({
      /**
       * Subform for address information.
       */
      addressForm: this.fb.group({
        firstName: ['', Validators.required],
        lastName: ['', Validators.required],
        street: ['', Validators.required],
        city: ['', Validators.required],
        state: ['', Validators.required],
        zipCode: ['', Validators.required]
      }),
      /**
       * Subform for selecting a delivery method.
       */
      deliveryForm: this.fb.group({
        deliveryMethod: ['', Validators.required]
      }),
      /**
       * Subform for payment information.
       */
      paymentForm: this.fb.group({
        nameOnCard: ['', Validators.required]
      })
    });
  }

  /**
   * Retrieves the user's saved address from the account service.
   * Patches the address form with the retrieved address data.
   */
  getAddressFormValues(): void {
    this.accountService.getUserAddress().subscribe({
      next: (address) => {
        this.checkoutForm.get('addressForm')?.patchValue(address);
      },
      error: (err) => {
        console.error('Failed to load user address:', err);
      }
    });
  }

/**
 * Preloads the selected delivery method from the basket service.
 * Updates the delivery form with the previously selected delivery method.
 */
getDeliveryMethodValue(): void {
  const basket = this.basketService.getCurrentBasketValue();
  if (basket && basket.deliveryMethodId !== undefined && basket.deliveryMethodId !== null) {
    this.checkoutForm
      .get('deliveryForm.deliveryMethod')
      ?.patchValue(basket.deliveryMethodId.toString());
  }
}

}


