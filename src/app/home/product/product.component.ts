import { Component, OnInit, Input,Injectable, Inject } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { productService } from 'app/lib/service/product.service';
import { DOCUMENT } from '@angular/common';

import { fontArray_1 } from './dropDown';
import { fontArray_2 } from './dropDown';

@Injectable({
  providedIn: 'root'
})
@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.scss']
})
export class ProductComponent implements OnInit {
  products: any;
  imgUrl = 'https://www.licenseplates.tv/images/';
  text: any = '';
  text2: any = '';
  Urltext: any = '';
  num = 1;
  itemOn: any;
  dropDown1: { id: string; text: string; }[];
  font: any;
  input1: boolean;
  input2: boolean;
  fontUrl: string;
  stateDecal: any;
  selectedDecal: any;
  Urltext2: any = '';
  index: any;
  plateHolders: any;
  plateType = '--NONE--'
  plateholderPrice: any = 0;
  plateTypeName: any;
  clink: any;

  constructor(
    private router: Router,
    private _productService: productService,
    private route: ActivatedRoute,
    @Inject(DOCUMENT) private doc
) {}

  ngOnInit() {
    this.dropDown1 = fontArray_1;
    this.dropDown1 = fontArray_2;
    this.route.params.subscribe( params => {
      return this.getProdDetail(params.id)
  });
  // this.Urltext = encodeURIComponent(this.text);
  }

  setFont(e) {
    this.font = e.id;
  }

  selectInput1() {
    // console.log('input 1 selected!');
    this.input1 = true;
    this.input2 = false;
  }

  selectInput2() {
    // console.log('input 2 selected!');
    this.input2 = true;
    this.input1 = false;
  }

  changeimg(val, num) {
    this.selectedDecal = num;
    if (this.input2) {
      this.text2 += decodeURIComponent(val);
      this.Urltext2 += val;
    } else {
      this.text += decodeURIComponent(val);
      this.Urltext += val;
    }
  }

  addVal(val) {
    console.log(val);
    // tslint:disable-next-line:no-bitwise
    if (val == '#' || val == '$' || val == '&' || val == '<' || val == '+') {
      if(this.input2) {
          this.text2 += val;
          this.Urltext2 += encodeURIComponent(val);
      } else {
        this.text += val;
      this.Urltext += encodeURIComponent(val);
      }

    } else {
      if (this.input2) {
        this.text2 += val;
        this.Urltext2 += val;
      } else {
        this.text += val;
      this.Urltext += val;
      }
    }
  }

  confirm() {
    if(this.products[0].xPos1 != null && this.text == '') {
      alert('Text field shouldn\'t be empty!');
    } else {
      const r = confirm("Make sure the letters you entered for your Custom License Plate/Frame are Correct! \n\n" +
    " Please remember that custom items are personalized individually for you, "+ 
  "and are not refundable or returnable.\n\n Our replica State license plates are for unofficial use only, "+
  "and are not to be used in lieu of officially issued plates.");
    if (r == true) {
      this.addCart();
    } else {
      console.log('cancel');
    }
    }
  }

  addCart() {
    let cart = {
        productImage: this.products[0].products_image,
        productName: this.products[0].products_name,
        productModel: this.products[0].products_model,
        plateText1: this.text ? this.text : '',
        plateText2: this.text2 ? this.text2 : '',
        itemQuantity: this.num,
        productID: this.products[0].products_id,
        TotalPrice: (parseFloat(this.products[0].old_price) + parseFloat(this.plateholderPrice)) * this.num,
        UnitPrice: this.products[0].old_price,
        plateType: this.plateTypeName,
        platePrice: this.plateholderPrice
      };

    if (localStorage.cartItems) {
      let Items = JSON.parse(localStorage.getItem('cartItems'));
      if (Items.map((e) => { return e.productID; }).indexOf(cart.productID) > -1) {
          this.arrayCheck(cart);
      } else {
        Items.push(cart);
      localStorage.cartItems = JSON.stringify(Items);
      this.getCartitemCount();
      this.router.navigateByUrl('cart');
      }
    } else {
      let CartItem = [];
      CartItem.push(cart);
      localStorage.cartItems = JSON.stringify(CartItem);
      this.getCartitemCount();
      this.router.navigateByUrl('cart');
    }
  }

  test() {
    if (this.plateType !== '--NONE--') {
      console.log('hhh')
      console.log(this.plateType)
    console.log(this.plateType);
    let selctplate = this.plateHolders.filter( e => e.products_options_values_name == this.plateType)
    console.log(selctplate[0].options_values_price);
    this.plateTypeName = this.plateType;
    this.plateholderPrice = selctplate[0].options_values_price;
    }
  }

  selectPlate(val) {
    this.plateTypeName = val.products_options_values_name;
    this.plateholderPrice = val.options_values_price;
    console.log(parseFloat(this.plateholderPrice));
    console.log((parseFloat(this.products[0].old_price) + parseFloat(this.plateholderPrice)) * this.num);
    alert('plate selected is ' + this.plateTypeName + ' ' + this.plateholderPrice );
  }

  arrayCheck(cart) {
    console.log('array check on');
    let Items = JSON.parse(localStorage.getItem('cartItems'));
    if (Items.map((e) => { return e.plateText1
      }).indexOf(cart.plateText1) > -1) {
        console.log('index is greater');
      if (cart.plateText2 != '') {
        this.arrayCheck2(cart);
      } else {
        console.log('array check 2 else on');
        this.index = Items.map( e => e.plateText1).indexOf(cart.plateText1);
        Items[this.index].itemQuantity += 1;
        console.log(this.index);
        localStorage.cartItems = JSON.stringify(Items);
        this.getCartitemCount();
        this.router.navigateByUrl('cart');
      }

  } else {
    Items.push(cart);
    localStorage.cartItems = JSON.stringify(Items);
    this.getCartitemCount();
    this.router.navigateByUrl('cart');
  }
  }

  arrayCheck2(cart) {
    console.log('array check 2 on');
    let Items = JSON.parse(localStorage.getItem('cartItems'));
    if (Items.map((e) => { return e.plateText2; }).indexOf(cart.plateText2) > -1) {
     this.updateQuantity(cart);
  } else {
    Items.push(cart);
    localStorage.cartItems = JSON.stringify(Items);
    this.router.navigateByUrl('cart');
  }
  }

  updateQuantity(cart) {

  }

  getCartitemCount() {
    // console.log('jjhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhh')
    let Items = JSON.parse(localStorage.getItem('cartItems'));
    const itemNum = Items.length;
    this._productService.changeItem(itemNum);
  }

  changeTxt() {
    // console.log('hhhh' + encodeURIComponent(this.text));
    this.Urltext = encodeURIComponent(this.text);
    this.Urltext2 = encodeURIComponent(this.text2);
  }

  toggle(item) {
    if (item === this.itemOn) {
      this.itemOn = '';
    } else {
      this.itemOn = item;
    }
  }

  getProdDetail(id) {
    this._productService.getProdDetails(id)
    .subscribe( (data: any) => {
      //console.log(data);
      this.products = data.product;
      this.plateHolders = data.productvariation;
      if (this.products[0].statedecal) {
        this.stateDecal = this.products[0].statedecal.split(';');
      }
      let link: HTMLLinkElement = this.doc.createElement('link');
      link.setAttribute('rel', 'canonical');
      this.doc.head.appendChild(link);
      link.setAttribute('href', data.canonicalurl);
      this.clink=link;
      //console.log('https://www.licenseplates.tv/fonts/truetype/' + this.products[0].font1 + '.ttf')
      this.fontUrl = 'https://www.licenseplates.tv/fonts/truetype/' + this.products[0].font1 + '.ttf';
    });

  }

  decriment() {
    if(this.num !== 1) {
      this.num = this.num - 1;
    }
  }

  incriment() {
    this.num = this.num + 1;
  }

}
