import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})
export class SignupComponent implements OnInit {
  user: any = {};
  States: any;
  model: any = {};
  fpass: boolean;
  success: boolean;
  state: boolean;
  check: boolean;
  loading: boolean;
  message = '';
  Countries: any;

  constructor() { }

  ngOnInit() {
    this.getCountry();
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
    this.user.state = val.target.value;
    console.log(this.user.state)
  }

  authCheck() {
    alert('Under Development!')
  }

}
