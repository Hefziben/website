import { Component, OnInit } from '@angular/core';
import { productService } from 'app/lib/service/product.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnInit {
  subCat: boolean;
  categories: Object;
  subCategories: any;
  catName: any;
  navOpen: boolean;
  search: boolean;
  itemNum = '';
  User: any;
  loggedIn: boolean;
  constructor(public _producService: productService, private router: Router) { }

  ngOnInit() {
    this.getCategories();
    // this.getCartitemCount();
    this._producService.currentData.subscribe( data => {
      if (data) {
        console.log('new data is ', data);
        this.itemNum = data;
      } else {
        let Items = JSON.parse(localStorage.getItem('cartItems'));
        if (Items) {
          this.itemNum = Items.length;
        }
      }
    });
    // this.getUser();
    this._producService.authData.subscribe( data => {
      if (data) {
        console.log('user logged in ', data);
        this.loggedIn = data;
        this.getUser();
      } else {
        this.User = JSON.parse(localStorage.getItem('currentUser'));
        if (this.User) {
          this.loggedIn = true;
          this.getUser();
        }
      }
    });
  }

  checkNav() {
    if (this.navOpen) {
      this. closeNav();
    }
  }

  getUser() {
    this.User = JSON.parse(localStorage.getItem('currentUser'));
    if (this.User) {
      this.loggedIn = true;
    }
  }

  logout() {
    localStorage.removeItem('currentUser');
    this.loggedIn = !this.loggedIn;
    document.getElementById('mySidenav').style.width = '0%';
    this.router.navigateByUrl('')
    // window.location.reload();
  }

  getCartitemCount() {
    let Items = JSON.parse(localStorage.getItem('cartItems'));

    this.itemNum = this._producService.itemNum ? this._producService.itemNum : 0;
  }

  openNav() {
    document.getElementById('mySidenav').style.width = '80%';
    // document.getElementById('main').style.marginLeft = '250px';
    // document.body.style.backgroundColor = 'rgba(0,0,0,0.4)';
    this.navOpen = true;
  }

  closeNav() {
    document.getElementById('mySidenav').style.width = '0%';
  // document.getElementById('main').style.marginLeft = '0';
  // document.body.style.backgroundColor = 'white';
  }

  closeSubCat() {
    this.subCat = !this.subCat;
  }

  closeSearch() {
    this.search = !this.search;
    document.getElementById('searchBlock').style.width = '0%';
  }

  Search() {
    this.search = true;
    document.getElementById('searchBlock').style.width = '100%';
  }

  getSubCat(item) {
    this.closeNav();
    this.router.navigateByUrl('subcategories/' + item.categories_id);
    // this.catName = item.categories_name;
    // this._producService.getSubCategory(item.categories_id)
    // .subscribe( (res: any) => {
    //   console.log(res);
    //   this.subCategories = res.category;
    //   this.subCat = !this.subCat;
    // });
  }

  getCategories() {
    this._producService.getCategory()
    .subscribe( (data: any) => {
      this.categories = data.category;
      this._producService.catId = this.categories[0].categories_id;
      console.log('cats are ', data);
      // console.log('cats are ', this.categories);
    });
  }

  Auth() {
    this.router.navigateByUrl('login');
    this. closeNav();
  }

  // clickOut() {
  //   window.addEventListener('click', function(e){
  //     if (document.getElementById('mySidenav').contains(e.target)) {
  //     } else {
  //       document.getElementById('mySidenav').style.width = '0';
  //       document.getElementById('main').style.marginLeft = '0';
  //       document.body.style.backgroundColor = 'white';
  //     }
  //   });
  // }

}
