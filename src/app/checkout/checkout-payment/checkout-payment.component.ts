import {
  AfterViewInit,
  Component,
  ElementRef,
  Input,
  OnDestroy,
  ViewChild,
} from '@angular/core';
import {
  loadStripe,
  Stripe,
  StripeElements,
  StripeCardNumberElement,
  StripeCardExpiryElement,
  StripeCardCvcElement,
} from '@stripe/stripe-js';
import { CheckoutService } from '../checkout.service';
import { BasketService } from '../../basket/basket.service';
import { ToastrService } from 'ngx-toastr';
import { IBasket } from '../../shared/models/basket';
import { FormGroup } from '@angular/forms';
import { NavigationExtras, Router } from '@angular/router';
import { environment } from '../../../environments/environment.development';

@Component({
  selector: 'app-checkout-payment',
  templateUrl: './checkout-payment.component.html',
  styleUrl: './checkout-payment.component.scss',
})
export class CheckoutPaymentComponent implements AfterViewInit, OnDestroy {
  @ViewChild('cardNumber', { static: true }) cardNumberElement!: ElementRef;
  @ViewChild('cardExpiration', { static: true }) cardExpirationElement!: ElementRef;
  @ViewChild('cardCVV', { static: true }) cardCVVElement!: ElementRef;

  private stripePromise = loadStripe(environment.stripe_publishable_key);
  stripe: Stripe | null = null;
  elements: StripeElements | null = null;
  cardNumber: StripeCardNumberElement | null = null;
  cardExpiration: StripeCardExpiryElement | null = null;
  cardCVV: StripeCardCvcElement | null = null;
  cardError: string | null = null;
  loading: boolean = false;

  // Tracks the validity of individual card fields
  cardNumberValid: boolean = false;
  cardExpirationValid: boolean = false;
  cardCVVValid: boolean = false;

  @Input() checkoutForm: FormGroup = new FormGroup({});

  constructor(
    private checkoutService: CheckoutService,
    private basketService: BasketService,
    private toastr: ToastrService,
    private router: Router
  ) {}

  /**
   * Initializes Stripe and its elements after the view is fully loaded.
   * This method loads Stripe, sets up the elements for the credit card number, expiration date,
   * and CVV, and mounts them to the DOM.
   */
  async ngAfterViewInit() {
    this.stripe = await this.stripePromise;

    if (!this.stripe) {
      console.error('Stripe initialization failed.');
      return;
    }

    // Initialize Stripe Elements
    this.elements = this.stripe.elements();

    // Create and mount Stripe Elements
    this.cardNumber = this.elements.create('cardNumber') as StripeCardNumberElement;
    this.cardExpiration = this.elements.create('cardExpiry') as StripeCardExpiryElement;
    this.cardCVV = this.elements.create('cardCvc') as StripeCardCvcElement;

    this.cardNumber.mount(this.cardNumberElement.nativeElement);
    this.cardExpiration.mount(this.cardExpirationElement.nativeElement);
    this.cardCVV.mount(this.cardCVVElement.nativeElement);

    // Attach event listener for error handling
    this.cardNumber.on('change', (event) => this.updateCardError(event));
    this.cardExpiration.on('change', (event) => this.updateCardError(event));
    this.cardCVV.on('change', (event) => this.updateCardError(event));
  }

  /**
   * Destroys Stripe Elements to clean up resources when the component is destroyed.
   * This method ensures that Stripe elements are cleaned up properly when the component
   * is no longer in use.
   */
  ngOnDestroy() {
    this.cardNumber?.destroy();
    this.cardExpiration?.destroy();
    this.cardCVV?.destroy();
  }

  /**
   * Submits the order and processes payment using Stripe.
   * This method handles order creation and Stripe payment confirmation
   * while managing the loading state and error feedback.
   */
  async submitOrder() {
    this.loading = true;
    const basket = this.basketService.getCurrentBasketValue();
    if (!basket) {
      this.toastr.error('Basket is empty or not available.');
      this.loading = false;
      return;
    }

    try {
      const createdOrder = await this.createOrder(basket);
      const paymentResult = await this.confirmPaymentWithStripe(basket);

      if (paymentResult?.paymentIntent) {
        // Payment succeeded, delete local basket and navigate to success page
        this.basketService.deleteLocalBasket(basket.id);
        const navigationExtras: NavigationExtras = { state: createdOrder };
        this.router.navigate(['checkout/success'], navigationExtras);
      } else {
        this.handlePaymentError(paymentResult?.error?.message);
      }
    } catch (error) {
      console.error('Error during order submission or payment:', error);
      this.toastr.error('An error occurred while processing your order.');
    } finally {
      this.loading = false;
    }
  }

  /**
   * Confirms the payment using Stripe's API.
   * @param basket The current basket data containing the client secret.
   * @returns The result of the Stripe payment confirmation.
   */
  private async confirmPaymentWithStripe(basket: IBasket) {
    if (basket.clientSecret && this.cardNumber) {
      return this.stripe?.confirmCardPayment(basket.clientSecret, {
        payment_method: {
          card: this.cardNumber as StripeCardNumberElement,
          billing_details: {
            name: this.checkoutForm.get('paymentForm.nameOnCard')?.value || '',
          },
        },
      });
    }
    return null;
  }

  /**
   * Creates an order using the checkout service.
   * @param basket The current basket data.
   * @returns The created order object.
   */
  private async createOrder(basket: IBasket) {
    const orderToCreate = this.getOrderToCreate(basket);
    return this.checkoutService.createOrder(orderToCreate).toPromise();
  }

  /**
   * Handles errors encountered during payment confirmation.
   * @param errorMessage The error message from Stripe, if any.
   */
  private handlePaymentError(errorMessage?: string) {
    const message = errorMessage || 'An unknown payment error occurred.';
    this.toastr.error(message);
  }

  /**
   * Creates an order object based on the provided basket and form data.
   * @param basket The current basket data.
   * @returns An object containing details required to create an order.
   */
  private getOrderToCreate(basket: IBasket) {
    return {
      basketId: basket.id,
      deliveryMethodId: this.checkoutForm.get('deliveryForm.deliveryMethod')?.value,
      shipToAddress: this.checkoutForm.get('addressForm')?.value,
    };
  }

  /**
   * Updates the card error state based on the Stripe element's validation result.
   * @param event The event object containing the error message, if any.
   */
  private updateCardError(event: {
    complete: boolean;
    elementType: any; error?: { message: string } 
}) {
    // Log the event for debugging purposes
    console.log(event);

    // Update the card error message if an error exists
    this.cardError = event.error ? event.error.message : null;

    // Update the validity status for the specific card field
    switch (event.elementType) {
      case 'cardNumber':
        this.cardNumberValid = event.complete;
        break;
      case 'cardExpiration':
        this.cardExpirationValid = event.complete;
        break;
      case 'cardCVV':
        this.cardCVVValid = event.complete;
        break;
    }
  }
}
