import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ValidatorFn, Validators } from '@angular/forms';
import { Customer } from './customer';

function ratingRange(min: number, max: number): ValidatorFn {
  return (c: AbstractControl): {[key: string]: boolean } | null => {
  if (c.value !== null && (isNaN(c.value) || c.value < min || c.value > max)) {
    return { 'range': true }
  }
  return null;
};
}

@Component({
  selector: 'app-customer',
  templateUrl: './customer.component.html',
  styleUrls: ['./customer.component.css']
})
export class CustomerComponent implements OnInit {
  customerForm: FormGroup;
  customer = new Customer();

private validationMessages = {
  required: 'Please enter your email adress.',
  email: 'Please enter a valid email adress.' 
}

  constructor(private fb: FormBuilder) { }

  ngOnInit()  {
    this.customerForm = this.fb.group({
      firstName: ['', [Validators.required, Validators.minLength(3)]],
      lastName: ['', [Validators.required, Validators.maxLength(50)
      ]],
      email: ['', [ Validators.required, Validators.email]],
      phone: '',
      notification: 'email',
      rating :[null, ratingRange(1,5)],
      sendCatalog: true
    });
    this.customerForm.get('notification').valueChanges.subscribe(
      value => this.setNotification(value)
    );
  }

  populateTestData(): void {
    this.customerForm.patchValue({
    firstName: 'Jack',
    lastName: 'Simpson',
    email: 'jack@toch.com',
    sendCatalog: false
    });
  }

  save() {
    console.log(this.customerForm);
    console.log('Saved: ' + JSON.stringify(this.customerForm.value));
  }

  setNotification(notifyVia: string): void {
    const phoneControl = this.customerForm.get('phone');
    if (notifyVia === 'text') {
      phoneControl.setValidators(Validators.required);
    } else {
      phoneControl.clearValidators();
    }
    phoneControl.updateValueAndValidity();
  }
  
}
