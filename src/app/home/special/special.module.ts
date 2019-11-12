import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SpecialRoutingModule } from './special-routing.module';
import { SpecialComponent } from './special.component';

@NgModule({
  imports: [
    CommonModule,
    SpecialRoutingModule
  ],
  declarations: [SpecialComponent]
})
export class SpecialModule { }
