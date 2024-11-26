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
import { IOrder } from '../../shared/models/order';

@Component({
  selector: 'app-checkout-payment',
  templateUrl: './checkout-payment.component.html',
  styleUrl: './checkout-payment.component.scss',
})
export class CheckoutPaymentComponent implements AfterViewInit, OnDestroy {
  @ViewChild('cardNumber', { static: true }) cardNumberElement!: ElementRef;
  @ViewChild('cardExpiration', { static: true }) cardExpirationElement!: ElementRef;
  @ViewChild('cardCVV', { static: true }) cardCVVElement!: ElementRef;

  private stripePromise = loadStripe('your-public-key-here');
  stripe: Stripe | null = null;
  elements: StripeElements | null = null;
  cardNumber: StripeCardNumberElement | null = null;
  cardExpiration: StripeCardExpiryElement | null = null;
  cardCVV: StripeCardCvcElement | null = null;
  cardError: string | null = null;

  @Input() checkoutForm: FormGroup = new FormGroup({});

  constructor(
    private checkoutService: CheckoutService,
    private basketService: BasketService,
    private toastr: ToastrService,
    private router: Router
  ) {}

  /**
   * Initializes Stripe and its elements after the view is fully loaded.
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
   */
  ngOnDestroy() {
    this.cardNumber?.destroy();
    this.cardExpiration?.destroy();
    this.cardCVV?.destroy();
  }

  /**
   * Submits the order by creating an order object from the current basket and form data,
   * sending it to the server, and handling the response.
   * If successful, removes the local basket and navigates to the success page.
   */
  submitOrder() {
    const basket = this.basketService.getCurrentBasketValue();
    if (!basket) {
      this.toastr.error('Basket is empty or not available.');
      return;
    }

    const orderToCreate = this.getOrderToCreate(basket);
    this.checkoutService.createOrder(orderToCreate).subscribe({
      next: (order) => {
        const typedOrder = order as IOrder;
        this.toastr.success('Order submitted successfully');
        this.basketService.deleteLocalBasket(basket.id);
        const navigationExtras: NavigationExtras = { state: typedOrder };
        this.router.navigate(['checkout/success'], navigationExtras);
      },
      error: (err: { message: string | undefined }) => {
        this.toastr.error(err.message || 'An error occurred during order submission.');
        console.error(err);
      },
    });
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
   * Updates the card error state with the error message, if any.
   * This method handles errors triggered by the card input fields.
   * @param event The event object containing the error message.
   */
  private updateCardError(event: { error?: { message: string } }) {
    this.cardError = event.error ? event.error.message : null;
  }
  
}


