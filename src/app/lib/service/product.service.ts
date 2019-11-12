import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import * as _ from "lodash";

import { BehaviorSubject } from 'rxjs';

@Injectable()
export class productService {
    private base: string = './assets/json/'; // https://www.lptv.petalsaroma.in/api/v1/auth/producttocatMob/
    //$baseUrl = 'https://www.lptv.petalsaroma.in'; // prod
     $baseUrl = 'https://www.m.licenseplates.tv';             // For Development
    // subbaseUrl = 'https://cors-anywhere.herokuapp.com/www.lptv.petalsaroma.in/public';             // For Development
  catId: any;
  itemNum: any;
  Data: any;
  private dataSource = new BehaviorSubject(this.Data);
  currentData = this.dataSource.asObservable();
  private authdataSource = new BehaviorSubject(this.Data);
  authData = this.authdataSource.asObservable();

  constructor(private http: HttpClient){}

  // Get Products
  getProduct(){
    // return this.http.get(this.base + 'product.json');
    return this.http.get(this.$baseUrl + '/api/v1/auth/getAllProducts');
  }

  changeItem(resData: any) {
    this.dataSource.next(resData);
  }

  loggedData(Data: boolean) {
    this.authdataSource.next(Data);
  }

  // Get Product By Id
  getIdProduct(id: number){
    const promiseObj = new Promise((resolve, reject)=>{
      this.getProduct().subscribe(products =>{
        resolve(_.find(products,{id: id}));
      });
    });
    return promiseObj;
  }

  // Get Product By Slug
  getSlugProduct(slug: string){
    const promiseObj = new Promise((resolve, reject)=>{
      this.getProduct().subscribe(products =>{
        resolve(_.find(products,{slug: slug}));
      });
    });
    return promiseObj;
  }

  // Get Logo
  getLogo(){
    return this.http.get(this.base + 'logo.json');
  }

  // Get Category
  getCategory() {
    //   return this.http.get(this.base + 'category.json');
    return this.http.get(this.$baseUrl + '/api/v1/auth/showCat/');
  }

  getSubCategory(id) {
    return this.http.get(this.$baseUrl + '/api/v1/auth/showCat/' + id);
  }

  getStaticSubCategory(id, num) {
    return this.http.get(this.$baseUrl + '/api/v1/auth/producttocatMob/' + id + '?page_number=' + num);
  }

  getProdDetails(id) {
    return this.http.get(this.$baseUrl + '/api/v1/auth/getproductbyid/' + id);
  }

  // Get Size
  getSize(){
    return this.http.get(this.$baseUrl + '/api/v1/auth/showCat/ ');
  }

  // Get Color
  getColor(){
    return this.http.get(this.base + 'color.json');
  }

  getCoupon(val) {
    const $baseUrl ='https://www.m.licenseplates.tv/api/v1/auth'; //'https://www.lptv.petalsaroma.in/api/v1/auth';
    return this.http.get($baseUrl + '/applycoupon?couponcode=' + val);
  }

  postOrderData(data) {
    //return this.http.post('https://www.lptv.petalsaroma.in/api/v1/auth/addToOrder', data);
      return this.http.post('https://www.m.licenseplates.tv/api/v1/auth/addToOrder', data);
  }

  // httpOptions
  Options() {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    const httpOptions = {
      headers: new HttpHeaders({
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      })
    };
    return httpOptions;
  }

}
