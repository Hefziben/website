import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HashLocationStrategy, PathLocationStrategy, LocationStrategy } from "@angular/common";

// Dependencies
import { MatProgressSpinnerModule, MatIconModule, MatButtonModule, MatMenuModule } from '@angular/material';
import 'hammerjs';

// Compoenent
import { AppComponent } from './app.component';
import { SideComponent } from './side/side.component';
import { HomeModule } from './home/home.module';
import { ProductModule } from './product/product.module';
import { NotFoundComponent } from './not-found/not-found.component';
import { contactModule } from './contact/contact.module';
import { ElementModule } from './element/element.module';

// Routing MOdule
import { AppRoutingModule } from './routing.module';

// Directive Height
import { FullscreenDirective } from './lib/directive/fullscreen.directive';
import { SidebarComponent } from './common/sidebar/sidebar.component';
import { CategoriesComponent } from './home/categories/categories.component';
import { ProductComponent } from './home/product/product.component';
import { ThankyouComponent } from './home/thankyou/thankyou.component';
import { ThankyouModule } from './home/thankyou/thankyou.module';
import { LoginComponent } from './login/login.component';
import { SignupComponent } from './signup/signup.component';
import { SignupModule } from './signup/signup.module';
import { LoginModule } from './login/login.module';

@NgModule({
  declarations: [
    AppComponent,
    SideComponent,
    NotFoundComponent,
    FullscreenDirective,
    SidebarComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    BrowserAnimationsModule,
    MatProgressSpinnerModule,
    MatIconModule,
    MatButtonModule,
    MatMenuModule,
    AppRoutingModule,
    HomeModule,
    ProductModule,
    ElementModule,
    contactModule
  ],
  providers: [
    { provide: LocationStrategy, useClass: PathLocationStrategy }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
