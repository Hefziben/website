import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ThankyouRoutingModule } from './thankyou-routing.module';
import { ThankyouComponent } from './thankyou.component';

@NgModule({
  imports: [
    CommonModule,
    ThankyouRoutingModule
  ],
  declarations: [ThankyouComponent]
})
export class ThankyouModule { }
