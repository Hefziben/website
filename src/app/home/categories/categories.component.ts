import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { productService } from 'app/lib/service/product.service';

@Component({
  selector: 'app-categories',
  templateUrl: './categories.component.html',
  styleUrls: ['./categories.component.scss']
})
export class CategoriesComponent implements OnInit { 
  subCategories: any;
  imgUrl = 'https://www.licenseplates.tv/images/';
  parent: any;

  constructor(
    private router: Router,
    private _productService: productService,
    private route: ActivatedRoute
){}

ngOnInit() {
  this.route.params.subscribe( params => {
      return this.getSubCat(params.id)
  } );
}

getSubCat(id) {
  if (id == '000') {
    this.router.navigateByUrl('special-request');
  } else {
    this._productService.getSubCategory(id)
  .subscribe( (res: any) => {
    console.log('sub cat res ', res);
    this.subCategories =  res.category;
    console.log(this.subCategories);
    this.parent = res.parent;
  });
  }
}

getProduct(item) {
  if (item.subcategory) {
    this.getSubCat(item.categories_id)
  } else {
    this.router.navigateByUrl('categories/' + item.categories_id);
  }
}


}
