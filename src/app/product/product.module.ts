import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

// Dependencies
import { 
    MatProgressSpinnerModule,
    MatIconModule,
    MatButtonModule,
    MatCheckboxModule,
    MatChipsModule,
    MatSliderModule,
    MatTabsModule,
    MatInputModule,
    MatSnackBarModule
} from '@angular/material';
import 'hammerjs';
import { CustomFormsModule } from 'ng2-validation';
import { NgxPayPalModule } from 'ngx-paypal';

// Angushop Library module
import { libModule } from '../lib/lib.module';
import { productService } from '../lib/service/product.service';
import { MatchHeightDirective } from '../lib/directive/match-height.directive';

// Product Component
import { DashboardProdut } from './dashboard/dashboard.component';
import { product1Component } from './product1/product1.component';
import { DetailProductComponent } from './detail-product/detail-product.component';
import { Product2Component } from './product2/product2.component';
import { Product3Component } from './product3/product3.component';
import { Product4Component } from './product4/product4.component';
import { Product5Component } from './product5/product5.component';
import { CartComponent } from './cart/cart.component';
import { ShippingComponent } from './shipping/shipping.component';
import { ReceiptComponent } from './receipt/receipt.component';
import { WishlistComponent } from './wishlist//wishlist.component';
import { CookieService } from '../lib/service/cookie.service';
import { CompareComponent } from './compare/compare.component';

@NgModule({
    imports: [
        CommonModule,
        BrowserModule,
        BrowserAnimationsModule,
        MatProgressSpinnerModule,
        MatIconModule,
        MatButtonModule,
        MatCheckboxModule,
        MatChipsModule,
        MatSliderModule,
        MatTabsModule,
        MatInputModule,
        FormsModule,
        libModule,
        RouterModule,
        MatSnackBarModule,
        CustomFormsModule  ,
        NgxPayPalModule
    ],
    declarations: [ 
        DashboardProdut,
        product1Component,
        DetailProductComponent,
        Product2Component,
        Product3Component,
        CartComponent,
        ShippingComponent,
        Product4Component,
        Product5Component,
        ReceiptComponent,
        WishlistComponent,
        CompareComponent,
        MatchHeightDirective
    ],
    providers: [CookieService],        
    exports: [ 
        DashboardProdut
    ]
})
export class ProductModule { }
