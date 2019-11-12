import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';

// Vendor
import { 
    MatProgressSpinnerModule,
    MatIconModule,
    MatButtonModule
} from '@angular/material';
import { NgxPaginationModule } from 'ngx-pagination';

// Directive
import { libHeightDirective } from './directive/lib-height.directive';

// Service
import { productService } from './service/product.service';

// Pipe
import { productFilterPipe } from './pipe/filter-product';

// Component
import { ProductComponent } from './component/product/product.component';
import { GridLogoComponent } from './component/grid-logo/grid-logo.component';
import { LightboxComponent } from './component/lightbox/lightbox.component';
import { BreadcumbComponent } from './component/breadcumb/breadcumb.component';
import { RatingComponent } from './component/rating/rating.component';

@NgModule({
  imports: [
    CommonModule,
    BrowserModule,
    BrowserAnimationsModule,
    MatProgressSpinnerModule,
    MatIconModule,
    MatButtonModule,
    NgxPaginationModule,
    RouterModule,
    HttpClientModule
  ],
  providers: [productService],
  declarations: [
    ProductComponent,
    libHeightDirective,
    GridLogoComponent,
    LightboxComponent,
    productFilterPipe,
    BreadcumbComponent,
    RatingComponent
  ],
  exports: [
    ProductComponent,
    GridLogoComponent,
    BreadcumbComponent,
    RatingComponent
  ]
})
export class libModule { }
