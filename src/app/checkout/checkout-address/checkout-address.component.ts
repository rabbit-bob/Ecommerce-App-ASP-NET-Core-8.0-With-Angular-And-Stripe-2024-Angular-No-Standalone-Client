import { Component, Input, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'app-checkout-address',
  templateUrl: './checkout-address.component.html',
  styleUrls: ['./checkout-address.component.scss']
})
export class CheckoutAddressComponent implements OnInit {

  // Accepting the checkoutForm as an input to this component
  @Input() checkoutForm: FormGroup = new FormGroup({});

  constructor() { }

  ngOnInit(): void {}

  // Getter for the first name control from the address form group
  get _firstName() {
    return this.checkoutForm.get('addressForm.firstName');
  }

  // Getter for the last name control from the address form group
  get _lastName() {
    return this.checkoutForm.get('addressForm.lastName');
  }

  // Getter for the street control from the address form group
  get _street() {
    return this.checkoutForm.get('addressForm.street');
  }

  // Getter for the city control from the address form group
  get _city() {
    return this.checkoutForm.get('addressForm.city');
  }

  // Getter for the state control from the address form group
  get _state() {
    return this.checkoutForm.get('addressForm.state');
  }

  // Getter for the zip code control from the address form group
  get _zipCode() {
    return this.checkoutForm.get('addressForm.zipCode');
  }
}

