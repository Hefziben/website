import { Component, OnInit } from '@angular/core';
import { Router } from "@angular/router";
import { trigger, state, style, animate, transition } from '@angular/animations';
import * as _ from "lodash";
import { productService } from 'app/lib/service/product.service';
import { HomeModal } from './data';

@Component({
    selector: 'app-home1',
    templateUrl: './home1.component.html',
    styleUrls: ['./home1.component.scss'],
    animations:[
        trigger('fade', [
            state('shown' , style({ opacity: 1 })), 
            state('hidden', style({ opacity: 0 })),
            transition('* => *', animate('.5s'))
        ]),
    ]
})
export class Home1Component implements OnInit {
    subCategories: any;
    categories: any;
    imgUrl = 'https://www.licenseplates.tv/images/';
    slider = '../../../assets/images/banner.jpg';
    staticImgUrl = '../../../assets/images/homePage/';
    constructor(
        private router: Router, private _productService: productService
    ) {}

    ngOnInit() {
            this.getCategories();
            // console.log(HomeModal);
      }


      subCat(item) {
        this.router.navigateByUrl('subcategories/' + item.id);
      }

    // Detail Product
    detailProduct(e){
        let product = _.kebabCase(e.slug);
        this.router.navigate(['shop/p/' + product]);
    }

    getSubCat(id) {
        this._productService.getSubCategory(id)
        .subscribe( (res: any) => {
          console.log('home res ', res);
          this.subCategories = res.category;
        });
      }

      getCategories() {
        // this._productService.getCategory()
        // .subscribe( (data: any) => {
        //   this.categories = data.category;
        //   this._productService.catId = this.categories[0].categories_id;
        // //   this.getSubCat(this.categories[0].categories_id);
        // })
        this.categories = HomeModal;
      }

}
