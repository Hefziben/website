import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { productService } from 'app/lib/service/product.service';

import { fontArray_1 } from './dropDown';
import { fontArray_2 } from './dropDown';

@Component({
  selector: 'app-edit-product',
  templateUrl: './edit-product.component.html',
  styleUrls: ['./edit-product.component.scss']
})
export class EditProductComponent implements OnInit {
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
  plateTypeName: any;
  plateholderPrice: any;
  plateType: string;

  constructor(
    private router: Router,
    private _productService: productService,
    private route: ActivatedRoute
) {}

  ngOnInit() {
    this.dropDown1 = fontArray_1;
    this.dropDown1 = fontArray_2;
    this.route.params.subscribe( params => {
      return this.getProdDetail(params.id)
  });
  // this.Urltext = encodeURIComponent(this.text);
  }

  getEditItem() {
    console.log('it\'s working...');
    let Item = JSON.parse(localStorage.getItem('editItem'));
    if (Item.plateText1) {
      this.text = Item.plateText1;
      this.Urltext = encodeURIComponent(Item.plateText1);
      console.log(this.text);
    }
    if (Item.plateText2) {
      this.text2 = Item.plateText2;
          this.Urltext2 += encodeURIComponent(Item.plateText2);
    }
    this.num = Item.itemQuantity
    this.plateTypeName = Item.plateType;
    this.plateType = Item.plateType + '($' + Item.platePrice + ')';
    this.plateholderPrice = Item.platePrice;
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

  addCart() {
    let cart = {
      productImage: this.products[0].products_image,
        productName: this.products[0].products_name,
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
      }
    } else {
      let CartItem = [];
      CartItem.push(cart);
      localStorage.cartItems = JSON.stringify(CartItem);
      this.getCartitemCount();
    }
  }

  updateCart() {
    let Items = JSON.parse(localStorage.getItem('cartItems'));
    let Item = JSON.parse(localStorage.getItem('editItem'));
    Items[Item.indexVal].plateText1 = this.text ? this.text : '';
    Items[Item.indexVal].plateText2 = this.text2 ? this.text2 : '';
    Items[Item.indexVal].itemQuantity = this.num;
    localStorage.cartItems = JSON.stringify(Items);
    this.router.navigateByUrl('cart');
  }

  arrayCheck(cart) {
    let Items = JSON.parse(localStorage.getItem('cartItems'));
    if (Items.map((e) => {
      this.index = e.plateText1.indexOf(cart.plateText1)
      return e.plateText1
      }).indexOf(cart.plateText1) > -1) {
      if (cart.plateText2 != '') {
        this.arrayCheck2(cart);
      } else {
        Items[this.index].itemQuantity += 1;
        localStorage.cartItems = JSON.stringify(Items);
        this.getCartitemCount();
      }

  } else {
    Items.push(cart);
    localStorage.cartItems = JSON.stringify(Items);
    this.getCartitemCount();
  }
  }

  arrayCheck2(cart) {
    let Items = JSON.parse(localStorage.getItem('cartItems'));
    if (Items.map((e) => { return e.plateText2; }).indexOf(cart.plateText2) > -1) {
     this.updateQuantity(cart);
  } else {
    Items.push(cart);
    localStorage.cartItems = JSON.stringify(Items);
  }
  }

  updateQuantity(cart) {

  }

  getCartitemCount() {
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

  selectPlate(val) {
    if (val == '--NONE--') {
      this.plateholderPrice = 0;
    } else {
      this.plateTypeName = val.products_options_values_name;
    this.plateholderPrice = val.options_values_price;
    }
  }

  getProdDetail(id) {
    this._productService.getProdDetails(id)
    .subscribe( (data: any) => {
      console.log(data);
      this.products = data.product;
      this.plateHolders = data.productvariation;
      this.getEditItem();
      if (this.products[0].statedecal) {
        this.stateDecal = this.products[0].statedecal.split(';');
      }
      console.log('https://www.licenseplates.tv/fonts/truetype/' + this.products[0].font1 + '.ttf')
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

