import { Component, OnInit } from '@angular/core';
import { AuthService } from 'app/lib/service/auth/auth.service';
import { Router } from '@angular/router';
import { ResponseOptions } from '@angular/http';
import { productService } from 'app/lib/service/product.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  loading: boolean;
  model: any = {};
  user: any = {};
  fullName: string;
  message: any;
  fpass: boolean;
  success: boolean;
  Countries: any;
  state: boolean;
  States: any;
  constructor(public _authService: AuthService, public router: Router, public _productService: productService) { }

  ngOnInit() {
    this.getCountry();
  }

  authCheck() {
    this.loading = true;
    this.message = '';
    this._authService.login(this.user)
    .subscribe( (res: any) => {
      console.log(res);
      this.loading = false;
      if (res.success == 1) {
        this.message = res.message;
        // this.fullName = res.firstname + ' ' + res.lastname;
        let currentUser = {
          firstname : res.firstname,
          lastname : res.lastname,
          loggedIn: true
        }
        localStorage.currentUser = JSON.stringify(currentUser);
        this._productService.loggedData(true);
        this.router.navigateByUrl('cart')
      } else {
        this.message = res.message;
      }

    }, err => {
      console.log(err.statusText);
      this.loading = false;
      this.message = err.statusText;
    })
  }

  forgotPass() {
    this.fpass = true;
  }

  getCountry() {
    fetch('https://www.m.licenseplates.tv/public/api/v1/auth/country')
    .then( (res: any) => {
      return res.json();
    })
    .then((myJson) => {
      console.log(JSON.stringify(myJson));
      this.Countries = myJson.countries;
      console.log(this.Countries);
    });
  }

  getState(val) {
    fetch('https://www.m.licenseplates.tv/public/api/v1/auth/state/' + val)
    .then( (res: any) => {
      return res.json();
    })
    .then((myJson) => {
      console.log(JSON.stringify(myJson));
      this.States = myJson.states;
      console.log(this.States);
    });
  }

  back() {
    this.model = {};
    this.fpass = !this.fpass;
  }

  resetPass() {
    this.success = true;
  }

  checkCountry(e) {
    console.log(e.target.value)
    if (e.target.value == '38' || e.target.value == '38') {
      this.state = true;
      return this.getState(e.target.value);
    } else {
      this.state = false;
    }
  }

  checkState(val) {
    this.model.state = val.target.value;
    console.log(this.model.state)
  }

  authCheck2() {
    alert('Under Development!')
  }

}
