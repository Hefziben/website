import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { RouterModule } from '@angular/router';

// Component
import { Home1Component } from './home1/home1.component';
import { Home2Component } from './home2/home2.component';
import { HomeslideDirective } from './home2/home-slide.directive';

// Material
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {
    MatProgressSpinnerModule,
    MatIconModule,
    MatButtonModule
} from '@angular/material';
import 'hammerjs';

// Anguushop Lib
import { libModule } from '../lib/lib.module';
import { CategoriesComponent } from './categories/categories.component';
import { ProductComponent } from './product/product.component';
import { SpecialComponent } from './special/special.component';
import { GuestCheckoutComponent } from './guest-checkout/guest-checkout.component';
import { EditProductComponent } from './edit-product/edit-product.component';
// import { CartComponent } from './cart/cart.component';

@NgModule({
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    MatProgressSpinnerModule,
    MatIconModule,
    MatButtonModule,
    libModule,
    FormsModule,
    HttpModule,
    RouterModule
  ],
  declarations: [
    Home1Component,
    Home2Component,
    HomeslideDirective,
    CategoriesComponent,
    ProductComponent
  ],
  exports: [Home1Component, Home2Component]
})
export class HomeModule { }
