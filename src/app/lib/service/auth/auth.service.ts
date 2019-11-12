import { Injectable } from '@angular/core';

import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  //$baseUrl = 'https://www.lptv.petalsaroma.in/api/v1/auth';
  $baseUrl = 'https://www.m.licenseplates.tv/api/v1/auth'

  constructor(public http: HttpClient) { }

  login(params) {
    return this.http.get(this.$baseUrl + '/customerlogin?email=' + params.email + '&pass=' + params.password + '');
  }
}
