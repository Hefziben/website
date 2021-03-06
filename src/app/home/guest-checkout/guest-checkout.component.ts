import { Component, OnInit, AfterViewChecked, ViewChild, ElementRef } from '@angular/core';

import { of } from 'rxjs';
import { PayPalConfig, PayPalEnvironment, PayPalIntegrationType } from 'ngx-paypal';
import { Router } from '@angular/router';

import { countries } from './country'
import { productService } from 'app/lib/service/product.service';
import { HttpClient } from '@angular/common/http';
import { async } from 'q';
import { renderComponent } from '@angular/core/src/render3';

declare let paypal;
import * as dropin from 'braintree-web-drop-in';
import * as $ from 'jquery';
declare let Accept: any;

@Component({
  selector: 'app-guest-checkout',
  templateUrl: './guest-checkout.component.html',
  styleUrls: ['./guest-checkout.component.scss']
})
export class GuestCheckoutComponent implements OnInit, AfterViewChecked {
  @ViewChild('paypalPay') paypalElement: ElementRef;

  testproduct = {
    price:10.00,
    description: 'leather coach'    
  }
  public BRAINTREE_TOKEN;
  payAmount = 10;
  paidFor = false;
  model: any = {};
  shipping: any = {};
  card = { name: null, number: null, month: null, year: null, cvv: null };
  same = true;
  imgUrl = 'https://www.licenseplates.tv/images/';
  Items: any;
  sum: number = 0.00;
  check: boolean;
  country = 'United States';
  state = 'Alberta';
  payPalConfig?: PayPalConfig;
  coupon: number = 0.00;
  Countries = countries;
  tax: number = 0.00;
  ship_amt: number = 0.00;
  totalAmount: number = 0.00;
  // authorize dot net creds
  apiLoginId = '9Nd3y7r76VF';//9Nd3y7r76VF
  clientKey = '7h3Xvgn97K3Vkf9u6gkGzcj8k23thba7K4n9537JUMMC4fgs25LqBsNWWBNSFXje';
  transactionKey = '53j562rZTM3kYrLu';//53j562rZTM3kYrLu
  apiUrl = 'https://api.authorize.net/xml/v1/request.api';
  // end


  addScript: boolean = false;
  paypalLoad: boolean = true;
  doPaypal: boolean;
  finalAmount: number = 1; //  sandbox: 'AZDxjDScFpQtjWTOUtWKbyN_bDt4OgqaF4eYXlewfBP4-8aqX3PiV8e1GWU6liB2CUXlkA59kJXE7M6R',

  paypalConfig = {
    env: 'production',
    client: {
      sandbox: 'AQRNAkeUZt_HJYsAKwXwFWVSYlorOGjtT4k_PzWwY-fuVIRjkunB9qxOGVPLnR_7Up7qZkL3ML9VQSg4',
      production: 'AeZzJUqyE4AtG7VI54dadwdJeJIvylhghKmmBJkcTNZD0FwE7nstpM1w-8xj7iMmjnow56SYmF9OFgz2'
    },
    commit: true,
    payment: (data, actions) => {
      return actions.payment.create({
        payer: {
          payment_method: 'paypal',
          payer_info: {
            first_name: this.model.fname,
            last_name: this.model.lname,
            email: this.model.email,
            country_code: this.model.countryCode,
            billing_address: {
              line1: this.model.street_address,
              line2: this.model.address_line_1,
              city: this.model.city,
              country_code: this.model.countryCode,
              postal_code: this.model.zipcode.toString(),
              state: this.model.state,
              phone: this.model.phone
            }
          }
        },
        payment: {
          transactions: [
            {
              amount: {
                // total: this.sum + this.ship_amt - this.coupon,
                total: this.totalAmount,
                currency: 'USD',
                details: {
                  subtotal: this.sum,
                  tax: this.tax,
                  shipping: this.ship_amt,
                  handling_fee: 0,
                  shipping_discount: this.coupon
                }
              },
              item_list: {
                items: this.paypalArray,
                shipping_address: {
                  recipient_name: this.same ? this.model.fname + ' ' + this.model.lname : this.shipping.fname + ' ' + this.shipping.lname,
                  line1: this.same ? this.model.street_address : this.shipping.street_address,
                  line2: this.same ? this.model.address_line_1 : this.shipping.address_line_2,
                  city: this.same ? this.model.city : this.shipping.city,
                  state: this.same ? this.model.state : this.shipping.state,
                  country_code: this.model.countryCode,
                  postal_code: this.same ? this.model.zipcode.toString() : this.shipping.zipcode.toString()
                }
              }
            }
          ]
        }
      });
    },
    onAuthorize: (data, actions) => {
      this.verifying = true;
      console.log(data);
      actions.payment.execute().then((payment) => {
        // console.log('Payment Success', payment);
        localStorage.lastPayment = JSON.stringify(payment);
        localStorage.cartItems = JSON.stringify([]);
        this.paymentSuccess(payment);
        // if ( this.same === false) {
        //   localStorage.lastPaymentShipping = JSON.stringify(this.shipping);
        // }
        // this.router.navigateByUrl('success')
      });
    },
    onCancel: (data, actions) => {
      console.log('Payment Failed');
      alert('Payment was Cancelled!');
      this.verifying = false;
    },
    onError: (err) => {
      console.log('Payment Error', err);
      alert('Error occured!');
      this.verifying = false;
    },
    style: {
      size: 'medium',
      color: 'gold',
      shape: 'pill',
      label: 'checkout',
      tagline: 'true'
    }
  }; // end of paypal config
  
  paypalArray: any[];
  clicked: boolean;
  User: any;
  loggedIn: boolean;
  verifying: boolean;

  constructor(private router: Router,
  
    public _productService: productService,
    private _http: HttpClient,
    
    ) { }

  ngOnInit() {
    this.getCartitems();
    this.getTotal();
    this.getUser();
    this.paypalArr();
    this.paypalCredit();
    //let _this = this;
          // Render the PayPal button into #paypal-button-container
     
   

  }
paypalCredit(){
  paypal.Buttons({

    // Set up the transaction
    createOrder: function (data, actions) {
      return actions.order.create({
        purchase_units: [{
          description: this.paypalArray.description,
          amount: {
            value: this.totalAmount
          }
        }]
      });
    },

    // Finalize the transaction
    onApprove: function (data, actions) {
      return actions.order.capture()
        .then(function (details) {
          console.log(details);
          // Show a success message to the buyer
          alert('Transaction completed by ' + details.payer.name.given_name + '!');
        })
        .catch(err => {
          console.log(err);
        })
    }
  }).render('#paypalPay')
}
  getUser() {
    this.User = JSON.parse(localStorage.getItem('currentUser'));
    if (this.User) {
      this.loggedIn = true;
      this.model.fname = this.User.firstname ? this.User.firstname : '';
      this.model.lname = this.User.lastname ? this.User.lastname : '';
    }
  }

  getItem(item) {
    // console.log('getItem');
    // console.log(item);
    if (this.same === true) {
      this.model.country = item.name;
      this.model.countryCode = item.code;
      // console.log(this.model.country);
      if (this.model.country === 'United States') {
        this.ship_amt = 0;
      }
      if (this.model.country === 'Canada') {
        this.ship_amt = 30;
      }
      if (this.model.country !== 'Canada' && this.model.country !== 'United States') {
        this.ship_amt = 50;
      }
    }
  }

  paypalArr() {
    let paypalArray = [];

    for (let i = 0; i < this.Items.length; i++) {
      let obj = {
        name: this.Items[i].productName,
        // tslint:disable-next-line:max-line-length
        description: this.Items[i].plateText1 ? this.Items[i].plateText1 : '' + ' ' + this.Items[i].plateText2 ? + '& ' + this.Items[i].plateText2 : '',
        quantity: this.Items[i].itemQuantity,
        price: this.Items[i].TotalPrice.toString(),
        sku: this.Items[i].plateType,
        currency: 'USD'
      }
      paypalArray.push(obj);
    }
    // console.log(paypalArray);
    this.paypalArray = paypalArray;
  }

  getCartitems() {
    this.Items = JSON.parse(localStorage.getItem('cartItems'));
    this.model.country = 'United States';
    this.shipping.country = 'United States';
    this.model.countryCode = 'US';
    this.shipping.countryCode = 'US';
    // this.paypalArr();
  }

  getTotalAmount() {
    let total = this.sum + this.ship_amt + this.tax - this.coupon;
    total=Math.round(total * 100) / 100;
    this.totalAmount=total;
    return total;
  }

  onEditClick(e) {
    // console.log(e);
  }

  checkCountry(e) {
    let selectedOptions = event.target['options'];
    let selectedIndex = selectedOptions.selectedIndex;
    let country = selectedOptions[selectedIndex].text;
    // console.log(this.country);
    // console.log(e);
    if (this.same === true) {
      this.model.country = country;
      this.model.countryCode = e.target.value;
      // console.log(e.target.value);
      // console.log(this.model.country);
      if (this.model.country === 'United States') {
        this.ship_amt = 0;
        this.model.state = '';
      }
      if (this.model.country === 'Canada') {
        this.ship_amt = 30;
        this.model.state = '';
      }
      if (this.model.country !== 'Canada' && this.model.country !== 'United States') {
        this.ship_amt = 50;
        this.model.state = '';
      }
    }
  }

  CheckState(e) {
    let selectedOptions = event.target['options'];
    let selectedIndex = selectedOptions.selectedIndex;
    let state = selectedOptions[selectedIndex].text;
    this.model.state = state;
    // console.log(state);
    if (this.model.state == 'Florida') {
      let taxVal = this.sum * (7 / 100);
      this.tax = Math.round(taxVal * 100) / 100;
    } else {
      this.tax = 0.00;
    }
  }

  checkState(e) {
    // console.log('moz val');
    // console.log(e);
    this.model.state = e;
  }

  checkCountryShip(e) {
    let selectedOptions = event.target['options'];
    let selectedIndex = selectedOptions.selectedIndex;
    let country = selectedOptions[selectedIndex].text;
    this.country = country;
    // console.log('Country is ', this.country)
    if (this.country === 'United States') {
      this.ship_amt = 0;
      this.shipping.state = '';
    }
    if (this.country === 'Canada') {
      this.ship_amt = 30;
      this.shipping.state = '';
    }
    if (this.country !== 'Canada' && this.shipping.country !== 'United States') {
      this.ship_amt = 50;
      this.shipping.state = '';
    }
  }

  checkStateShip(e) {
    // this.shipping.state  = e;
    // console.log(e);
    let selectedOptions = event.target['options'];
    let selectedIndex = selectedOptions.selectedIndex;
    let state = selectedOptions[selectedIndex].text;
    this.shipping.state = state;
    // console.log(this.shipping.state);
    if (this.shipping.state == 'Florida') {
      let taxVal = (this.sum - this.coupon) * (7 / 100);
      this.tax = Math.round(taxVal * 100) / 100;
    } else {
      this.tax = 0.00;
    }
  }

  getTotal() {
    let result = this.Items.map(a => a.TotalPrice);
    // console.log(result);
    this.sum = result.reduce((a, b) => { return a + b; }, 0);
  }

  checkout() {
    // console.log('clicked!')
    // console.log(this.model)
    // this.addScript = true;
    // tslint:disable-next-line:max-line-length
    // console.log(this.model);
    if (!this.model.fname || !this.model.lname || !this.model.street_address || !this.model.city || !this.model.country || !this.model.state || !this.model.zipcode || !this.model.phone || !this.model.email) {
      this.check = true;
      alert('Some Billing Infomartions are empty!')
    } else {
      if (this.same) { this.sendPaymentDataToAnet(); }
    }
    // diffrent address
    if (this.same === false) {
      // tslint:disable-next-line:max-line-length
      if (!this.shipping.fname || !this.shipping.lname || !this.shipping.street_address || !this.shipping.city || !this.shipping.country || !this.shipping.state || !this.shipping.zipcode) {
        this.check = true;
        alert('Some Shipping Infomartions are empty!')
      } else {
        this.sendPaymentDataToAnet()
      }
    }
  }

  initConfig() {
    // console.log('clicked!')
    // console.log(this.model)
    // this.addScript = true;
    // tslint:disable-next-line:max-line-length
    if (!this.model.fname || !this.model.lname || !this.model.street_address || !this.model.city || !this.model.country || !this.model.state || !this.model.zipcode || !this.model.phone || !this.model.email) {
      this.check = true;
      alert('Some Billing Infomartions are empty!')
    } else {
      if (this.same) { this.doPaypal = true; }
    }
    // diffrent address
    if (this.same === false) {
      // tslint:disable-next-line:max-line-length
      if (!this.shipping.fname || !this.shipping.lname || !this.shipping.street_address || !this.shipping.city || !this.shipping.country || !this.shipping.state || !this.shipping.zipcode) {
        this.check = true;
        alert('Some Shipping Infomartions are empty!')
      } else {
        this.doPaypal = true;
      }
    }
  }

  setval() {
    // console.log(this.same);
    // console.log('invalid');
  }
////customer payment config


  ngAfterViewChecked(): void {
    if (!this.addScript) {
      this.addPaypalScript().then(() => {
        paypal.Button.render(this.paypalConfig, '#paypal-checkout-btn')
        });
      this.addAuthnetScript();
    }
  }

  getCartitemCount() {
    // let Items = JSON.parse(localStorage.getItem('cartItems'));
    // // console.log(Items);
    // // console.log(Items.length);
    let itemNum = 0;
    this._productService.changeItem(itemNum);
  }

  getValues() {
    // console.log(this.model);
    // console.log(this.shipping);
  }

  addPaypalScript() {
    this.addScript = true;
    return new Promise((resolve, reject) => {
      let scripttagElement = document.createElement('script');
      scripttagElement.src = 'https://www.paypalobjects.com/api/checkout.js';
      
      scripttagElement.onload = resolve;
      document.body.appendChild(scripttagElement);
    })
  }

  

  addAuthnetScript() {
    // this.addScript = true;
    return new Promise((resolve, reject) => {
      let scripttagElement = document.createElement('script');
      // scripttagElement.src = 'https://jstest.authorize.net/v1/Accept.js';
      scripttagElement.src = 'https://js.authorize.net/v1/Accept.js'; // for production
      scripttagElement.onload = resolve;
      document.body.appendChild(scripttagElement);
    })
  }



  sendPaymentDataToAnet() {
    if (this.card.name && this.card.number && this.card.month && this.card.year) {
      // console.log('Auth.net ready!')
      // let authData = {
      //   clientKey: '6jZy4G5vmCEat9G3xjtNguj7DLw5NhgS4PBr4KNp7tV2tXa34E3BkdG33dcX4S84',
      //   apiLoginID: '3e3b5H4YLP'
      // };
      let authData = {
        clientKey: this.clientKey,
        apiLoginID: this.apiLoginId
      };

      let cardData = {
        cardNumber: this.card.number.toString(),
        month: this.card.month.toString(),
        year: this.card.year.toString(),
        cardCode: this.card.cvv.toString(),
        fullName: this.card.name.toString()
      };

      let secureData = {
        authData: authData,
        cardData: cardData
      };

      // If using banking information instead of card information,
      // send the bankData object instead of the cardData object.
      //
      // secureData.bankData = bankData;
      Accept.dispatchData(secureData, this.responseHandler);
    } else {
      alert('Card Details are not completed!')
    }
  }

  responseHandler(response) {
    if (response.messages.resultCode === 'Error') {
      for (var i = 0; i < response.messages.message.length; i++) {
        // console.log(response.messages.message[i].code + ':' + response.messages.message[i].text);
      }
      alert(response.messages.message[0].text);
    } else {
      let opaqueData = response.opaqueData;

      let paymentData = {};
      let createTransactionRequest = {};
      let merchantAuthentication = {
        name: this.apiLoginId,
        transactionKey: this.transactionKey
      }

      // create billing and shipping address object
      let billTo = {
        "firstName": this.model.fname,
        "lastName": this.model.lname,
        "company": this.model.company,
        "address": this.model.street_address + ' ' + this.model.address_line_1,
        "city": this.model.city,
        "state": this.model.state,
        "zip": this.model.zipcode.toString(),
        "country": this.model.countryCode
      };

      let shipTo = {};
      if (this.same) {
        shipTo = billTo;
      } else {
        shipTo = {
          "firstName": this.shipping.fname,
          "lastName": this.shipping.lname,
          "company": this.shipping.company,
          "address": this.shipping.street_address + ' ' + this.shipping.address_line_1,
          "city": this.shipping.city,
          "state": this.shipping.state,
          "zip": this.shipping.zipcode.toString(),
          "country": this.model.countryCode
        }
      }
      // end

      let transactionRequest = {
        transactionType: "authCaptureTransaction",
        amount: +(this.sum + this.ship_amt - this.coupon + this.tax),
        payment: {
          opaqueData: opaqueData
        },
        billTo: billTo,
        shipTo: shipTo
      }

      createTransactionRequest['merchantAuthentication'] = merchantAuthentication;
      createTransactionRequest['transactionRequest'] = transactionRequest;
      paymentData['createTransactionRequest'] = createTransactionRequest;
      this.makeAuthorizeDotNetPayment(paymentData);
    }
  }

  makeAuthorizeDotNetPayment = (postData) => {
    this.verifying = true;
    this._http.post(this.apiUrl, postData).subscribe(
      (res) => {
        if (res['messages'] && res['messages']['resultCode'] === "Ok") {
          this.verifying = false;
          this.getCartitemCount();
          this.router.navigateByUrl('success');
        } else {
          alert('Payment Failed');
        }
      },
      (error) => {
      }
    )
  }

  goBack() {
    this.doPaypal = !this.doPaypal;
    // this.addScript = !this.addScript;
  }

  checkCoupon() {
    // // console.log(this.coupon);
    this._productService.getCoupon(this.model.coupon)
      .subscribe((res: any) => {
        // console.log(res);
        if (res.success === '1') {
          // this.coupon = res.couponamt.toString();
          // alert(res.message);
          if (res.coupon_type === 'F') {
            this.coupon = Math.round(parseFloat(res.couponamt) * 100) / 100;
            alert(res.message);
          } else if (res.coupon_type === 'P' || res.coupon_type === 'E') {
            this.addPercentage(res);
          }
          if (this.model.state == 'Florida') {
            let taxVal = (this.sum - this.coupon) * (7 / 100);
            this.tax = Math.round(taxVal * 100) / 100;
          } else {
            this.tax = 0.00;
          }
        } else {
          alert(res.message);
          this.coupon = 0;
        }
      });
  }

  addPercentage(res) {
    let discount = +this.sum * (parseFloat(res.couponamt) / 100);
    // console.log('discount is ', discount.toFixed(2));
    this.coupon = Math.round(discount * 100) / 100;
    alert(res.message);
  }

  paymentSuccess(payment) {
    // this.Items = JSON.parse(localStorage.getItem('cartItems'));
    let data = {
      cart: {
        cart: payment.cart,
        create_time: payment.create_time,
        id: payment.id,
        intent: payment.intent,
        currency: 'USD',
      },
      payer: payment.payer,
      items: this.Items
    };



    let saveData = {
      payer: {
        payment_method: 'paypal',
        payer_info: {
          first_name: this.model.fname,
          last_name: this.model.lname,
          email: this.model.email,
          country_code: this.model.countryCode,
          billing_address: {
            line1: this.model.street_address,
            line2: this.model.address_line_1,
            city: this.model.city,
            country_code: this.model.countryCode,
            postal_code: this.model.zipcode.toString(),
            state: this.model.state,
            phone: this.model.phone
          }
        }
      },
      cart: {
        cart: payment.cart,
        create_time: payment.create_time,
        id: payment.id,
        intent: payment.intent,
        currency: 'USD',
      },
      payment: {
        transactions: [
          {
            amount: {
              total: this.sum + this.ship_amt - this.coupon,
              currency: 'USD',
              details: {
                subtotal: this.sum,
                tax: this.tax,
                shipping: this.ship_amt,
                handling_fee: 0,
                coupon_discount: this.coupon,
                coupon_code: this.model.coupon,
                special_instruction: this.model.instructions
              }
            },
            item_list: {
              items: this.Items,
              shipping_address: {
                recipient_name: this.same ? this.model.fname + ' ' + this.model.lname : this.shipping.fname + ' ' + this.shipping.lname,
                line1: this.same ? this.model.street_address : this.shipping.street_address,
                line2: this.same ? this.model.address_line_1 : this.shipping.address_line_2,
                city: this.same ? this.model.city : this.shipping.city,
                state: this.same ? this.model.state : this.shipping.state,
                country_code: this.model.countryCode,
                postal_code: this.same ? this.model.zipcode.toString() : this.shipping.zipcode.toString()
              }
            }
          }
        ]
      }
    }

    // send to server
    // localStorage.lastPaymentAdress = JSON.stringify(this.model);
    this._productService.postOrderData(saveData)
      .subscribe((res: any) => {
        // console.log(res);
        if (res.success == 1) {
          // this.paymentSuccess(payment)
          this.getCartitemCount();
          console.log('success', saveData);
          localStorage.lastPaymentShipping = JSON.stringify(data);
          this.verifying = false;
          this.router.navigateByUrl('success')
        } else {
          // console.log('Payment Failed');
        }
      });

  } // paymentSuccess

  paydata(){
    this.BRAINTREE_TOKEN = 'sandbox_vpthqzzr_xwt69yw628qjyz9m';

	  // let loading = this.loadingCtrl.create({content:'Processing... please wait'});
		// 		loading.present();
		// 		setTimeout(() => {
		// 		  loading.dismiss();
		// 		},3000);

	  console.log("-----paydata()--------call");
	  $('#confirmData').hide();
	  $('#confirmmsg').hide();
    $('#confirmdonation').show();
    $('#Authenticating').hide();

  
  
  $("#donate").html("Pay");
  var self = this;
  var form = document.querySelector('#nonce-form');
  var hiddenNonceInput = document.querySelector('#my-nonce-input');
  var form = document.querySelector('#payment-form');
      dropin.create({
        authorization: this.BRAINTREE_TOKEN,
        container: '#dropin-container',
        //  paypal: {
        //     flow: 'checkout',
        //     singleUse: true,
        //     amount: this.payAmount,
        //     currency: '$',
        //   }
      }, function (err, dropinInstance) {
           $('#shareAmount').hide();
		   
		   if (err) {
		     console.log("err 1 : "+err);
		     console.error(err);
		     return;
		   }
        
          form.addEventListener('submit', function (event) {
             event.preventDefault();

          dropinInstance.requestPaymentMethod(function (err, payload) {
             if (err) {
              console.log("err 2 : "+err);
              return;
             }
         	  console.log("-----paydata() payload--------");
		        console.log("payload 2 : "+JSON.stringify(payload));
			      console.log("payload.nonce : "+payload.nonce);
            
            if(payload.nonce !==undefined){
               this.paymentDetailsSave(payload.nonce);  
            }
            $("#donate").hide();
            $('#confirmdonation').hide();
            $('#Authenticating').show();
           
          });
        });
      });
     }
     paymentDetailsSave(payloadNonce){
      console.log('payloadNonce :' + payloadNonce);
    }
}
