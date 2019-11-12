import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EditProductRoutingModule } from './edit-product-routing.module';
import { EditProductComponent } from './edit-product.component';
import { FormsModule } from '@angular/forms';

@NgModule({
  imports: [
    CommonModule,
    EditProductRoutingModule,
    FormsModule
  ],
  declarations: [EditProductComponent]
})
export class EditProductModule { }
