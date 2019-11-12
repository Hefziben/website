import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GuestCheckOutRoutingModule } from './guest-checkout-routing.module';
import { GuestCheckoutComponent } from './guest-checkout.component';
import { FormsModule } from '@angular/forms';
import { NgxPayPalModule } from 'ngx-paypal';

@NgModule({
  imports: [
    CommonModule,
    GuestCheckOutRoutingModule,
    FormsModule,
    NgxPayPalModule
  ],
  declarations: [GuestCheckoutComponent]
})
export class GuestCheckoutModule { }
