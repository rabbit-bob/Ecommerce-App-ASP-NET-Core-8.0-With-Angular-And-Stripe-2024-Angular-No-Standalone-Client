import { Component, Input, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { AccountService } from '../../account/account.service';
import { ToastrService } from 'ngx-toastr';
import { IAddress } from '../../shared/models/address';

@Component({
  selector: 'app-checkout-address',
  templateUrl: './checkout-address.component.html',
  styleUrls: ['./checkout-address.component.scss']
})
export class CheckoutAddressComponent implements OnInit {

  // Accepting the checkoutForm as an input to this component
  @Input() checkoutForm: FormGroup = new FormGroup({});

  constructor(private accountService: AccountService, private toastr: ToastrService) { }

  ngOnInit(): void {}
  
  // Saves the user's address to the server
  saveUserAddress() {
    // Get the current address from the address form
    let currentAddress = this.checkoutForm.get('addressForm')?.value;
    
    // Call the account service to update the user's address
    this.accountService.updateUserAddress(currentAddress).subscribe({
        next: (address: IAddress) => {
            // Notify the user about the successful update
            this.toastr.success('Updated successfully');
            
            // Reset the address form with the updated address data
            this.checkoutForm.get('addressForm')?.reset(address);
        },
        error: (err) => {
            // Notify the user about the error
            this.toastr.error('Error while updating', err);
        },
    });
  }

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

