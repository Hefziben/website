import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, NavigationExtras } from "@angular/router";
import * as _ from "lodash";

import { productService } from '../../lib/service/product.service';
import { Category } from '../../lib/service/data/category';
import { Color } from '../../lib/service/data/color';

@Component({
    selector: 'app-main',
    templateUrl: './product1.component.html',
    styleUrls: ['./product1.component.scss']
})
export class product1Component implements OnInit {
    public search: string = null;
    public price: number;
    public page: number;
    public category: string;
    public sizes: any;
    public color: string;
    public valueSearch: string = '';
    private objectNavigation = {};
    public currentPage: number = 1;
    private navigateRoute = 'shop/product1';
    subCat: boolean;
    subCatID: any;
    subCategories: any;
    nextCategory: any;

    constructor(
        private router: Router,
        private activeRoute: ActivatedRoute,
        private productService: productService
    ){
        this.activeRoute.queryParams.subscribe(params => {
            this.search = _.lowerCase(params["search"]);
            this.price = Number(params["price"]);
            this.category = _.lowerCase(params["category"]);
            this.color = params["color"];

            // Pagination
            if(!isNaN(params["page"])){
                this.currentPage = Number(params["page"]);
            }else{
                this.currentPage = 1;
            }
            
            if(params["size"] != undefined){
                this.sizes = params["size"].split('-').map(function(item) {
                    return parseInt(item, 10);
                });

                // Init Size
                _.merge(this.arraySize, this.sizes);
            }else{
                this.sizes = null;
            }

            if(!_.isEmpty(params)){
                // Merge Object on init
                _.merge(this.objectNavigation, params);

                // Value Search
                if(this.search != undefined){
                    this.valueSearch = this.search;
                }

                // Value Price
                if(!isNaN(this.price)){
                    this.priceToggle = true;
                }
            }
        });
    }
    
    ngOnInit(){
        // Fetch init
        this.fetchCategory();
        this.fetchSize();
        this.fetchColor();
        
        // Check Category
        if(this.chekCategory == ''){
            this.allCategory = true;
        }
    }

    // Color
    public colors: any = [];
    private selectedColor: Color;
    fetchColor(){
        this.productService.getColor().subscribe(data => {
            this.colors = [];
            _.map(data,(x)=>{
                this.colors.push(x);
            });
            this.initColor(data);
        });
    }
    initColor(obj){
        if(this.color !== undefined){
            this.selectedColor = _.find(obj, (o) => { 
                return o.nameColor == this.color 
            });
        }
    }
    selectColor(val){
        if( this.selectedColor == val){
            this.selectedColor = null;
            let clearColor: NavigationExtras = {
                queryParams: this.objectNavigation
            };
            delete this.objectNavigation['color'];
            delete this.objectNavigation['page'];
            this.router.navigate([this.navigateRoute], clearColor);
        }else{
            this.selectedColor = val;
            let navColor: NavigationExtras = {
                queryParams: this.objectNavigation
            };
            this.objectNavigation['color'] = val.nameColor;
            delete this.objectNavigation['page'];
            this.router.navigate([this.navigateRoute], navColor);
        }
    }

    // Price
    public priceToggle: boolean = false;
    onChangeprice(e){
        this.priceToggle = true;
        let navPrice: NavigationExtras = {
            queryParams: this.objectNavigation
        };
        this.objectNavigation['price'] = e.value;
        delete this.objectNavigation['page'];
        this.router.navigate([this.navigateRoute], navPrice);
    }
    refreshPrice(){
        this.priceToggle = false;
        this.price = 550;
        let clearPrice: NavigationExtras = {
            queryParams: this.objectNavigation
        };
        delete this.objectNavigation['price'];
        delete this.objectNavigation['page'];
        this.router.navigate([this.navigateRoute], clearPrice);
    }

    // Category
    public categories: any[] = [];
    public allCategory: boolean;
    private selectedCategory: Category;
    private chekCategory: string = _.lowerCase(this.activeRoute.queryParams['_value'].category);

    fetchCategory(){
        console.log('fetching..')
        this.productService.getCategory().subscribe( (data: any) => {
            this.categories = data.category;
            this.nextCategory = data.category;
            console.log('categories are 0', this.categories)
            // _.map(data,(x)=>{
            //     this.categories.push(x);
            // });
            // this.initCategory(data)
        });
    }
    initCategory(obj){
        if(this.chekCategory !== undefined){
            this.selectedCategory = _.find(obj, (o) => { 
                return o.categoryName == this.chekCategory 
            });
        }
    }
    selectCategory(e) {
        e.subCat = true;
        this.categories = this.nextCategory;
        this.subCatID = e.categories_id;
        this.getSubCategory(this.subCatID);
        this.selectedCategory =  e;
        this.allCategory = false;
        let navCategory: NavigationExtras = {
            queryParams: this.objectNavigation
        };
        this.objectNavigation['category'] = _.kebabCase(e.categoryName);
        delete this.objectNavigation['page'];
        this.router.navigate([this.navigateRoute], navCategory);
    }

    getSubCategory(id) {
        this.productService.getSubCategory(id)
        .subscribe((data: any) => {
            console.log('sub category is ', data);
            this.subCategories = data.category;        })
    }

    resetCategory(){
        this.selectedCategory = null;
        this.allCategory = true;
        let clearCategory: NavigationExtras = {
            queryParams: this.objectNavigation
        };
        delete this.objectNavigation['category'];
        delete this.objectNavigation['page'];
        this.router.navigate([this.navigateRoute], clearCategory);
    }

    // Search Product
    private timeout: any;
    onSearch(e){
        clearTimeout(this.timeout);
        this.timeout = setTimeout(()=>{
            let navSearch: NavigationExtras = {
                queryParams: this.objectNavigation
            };

            if(e.target.value.length !== 0){
                this.objectNavigation['search'] = _.kebabCase(e.target.value);
                delete this.objectNavigation['page'];
                this.router.navigate([this.navigateRoute], navSearch);
            }else{
                delete this.objectNavigation['search'];
                delete this.objectNavigation['page'];
                this.router.navigate([this.navigateRoute], navSearch);
            }
        }, 500);
    }

    // Size Product
    public sizeProduct: any[] = []
    fetchSize(){
        this.productService.getSize().subscribe(data => {
            this.sizeProduct = [];
            _.map(data,(x)=>{
                this.sizeProduct.push(x);
            });
            this.initSize()
        });
    }
    initSize(){
        for(let i=0; i<this.sizeProduct.length; i++){
            let checkSize = _.find(this.sizes, (e) =>{
                return this.sizeProduct[i].size == e
            });
            if(checkSize != undefined){
                this.sizeProduct[i].check = true;
            }
        }
    }
    arraySize = [];
    selectSize(size,check){
        if(check == false){
            this.arraySize.push(size);
        }else{
            let index = this.arraySize.indexOf(size);
            this.arraySize.splice(index, 1);
        }
        
        if(this.arraySize.length != 0){
            let navSize: NavigationExtras = {
                queryParams: this.objectNavigation
            };
            this.objectNavigation['size'] = _.kebabCase(JSON.stringify(this.arraySize));
            delete this.objectNavigation['page'];
            this.router.navigate([this.navigateRoute], navSize);
        }else{
            let clearSize: NavigationExtras = {
                queryParams: this.objectNavigation
            };
            delete this.objectNavigation['size'];
            delete this.objectNavigation['page'];
            this.router.navigate([this.navigateRoute], clearSize);
        }
    }
    
    // On Page Change
    onPageChange(e){
        let navSize: NavigationExtras = {
            queryParams: this.objectNavigation
        };
        this.objectNavigation['page'] = e;
        this.router.navigate([this.navigateRoute], navSize);
    }
}



//  var $CUSTOM_FONTS_ARRAY = array(
//                    1 => array( array("id" => "0", "text" => "Choose font..."),
//                             //    array("id" => "ag_alb", "text" => "Albertus Medium"),
//                             //    array("id" => "bnkgothm", "text" => "Bank Gothic"),
//                             //    array("id" => "brushscriptstd", "text" => "Brush Script"),
//                             //    array("id" => "copgothb", "text" => "Copperplate Gothic"),
//                             //    array("id" => "harlowsi", "text" => "Harlow Solid Italic"),
//                             //    array("id" => "verdana", "text" => "Verdana"),
//                             //    array("id" => "times", "text" => "Times New Roman"),
//                             //    array("id" => "lithograph", "text" => "Lithograph"),
//                             //    array("id" => "magnetob", "text" => "Magneto"),
//                             //    array("id" => "ag_zurchke", "text" => "Zurich BLKEX BT")
//                            ),
//                    2 => array( array("id" => "0", "text" => "Choose font..."),
//                             //    array("id" => "ag_alb", "text" => "Albertus Medium"),
//                             //    array("id" => "ag_alger", "text" => "Algerian"),
//                             //    array("id" => "ag_arialb", "text" => "Arial"),
//                             //    array("id" => "bnkgothm", "text" => "Bank Gothic"),
//                             //    array("id" => "brushscriptstd", "text" => "Brush Script"),
//                             //    array("id" => "copgothb", "text" => "Copperplate Gothic"),
//                             //    array("id" => "harlowsi", "text" => "Harlow Solid Italic"),
//                             //    array("id" => "oldeng", "text" => "Old English Text"),
//                             //    array("id" => "verdana", "text" => "Verdana"),
//                             //    array("id" => "times", "text" => "Times New Roman"),
//                             //    array("id" => "lithograph", "text" => "Lithograph"),
//                             //    array("id" => "magnetob", "text" => "Magneto"),
//                             //    array("id" => "ag_zurchke", "text" => "Zurich BLKEX BT")
//                            )
//                       );


 let fontArray_1 = [
    {
     id: '0',
     text: 'Choose font...'
    },
    {
        id: 'ag_alb',
        text: 'Albertus Medium'
       },
       {
        id: 'bnkgothm',
        text: 'Bank Gothic'
       },
       {
        id: 'brushscriptstd',
        text: 'Brush Script'
       },
       {
        id: 'copgothb',
        text: 'Copperplate Gothic'
       },
       {
        id: 'harlowsi',
        text: 'Harlow Solid Italic'
       },
       {
        id: 'verdana',
        text: 'Verdana'
       },
       {
        id: 'times',
        text: 'Times New Roman'
       },
       {
        id: 'lithograph',
        text: 'Lithograph'
       },
       {
        id: 'magnetob',
        text: 'Magneto'
       },
       {
        id: 'ag_zurchke',
        text: 'Zurich BLKEX BT'
       },
];


let fontArray_2 = [
    {
        id: '0',
        text: 'Choose font...'
    },
    {
        id: 'ag_alb',
        text: 'Albertus Medium'
    },
    {
        id: 'ag_alger',
        text: 'Algerian'
    },
    {
        id: 'ag_arialb',
        text: 'Arial'
    },
    {
        id: 'bnkgothm',
        text: 'Bank Gothic'
    },
    {
        id: 'brushscriptstd',
        text: 'Brush Script'
    },
    {
        id: 'copgothb',
        text: 'Copperplate Gothic'
    },
    {
        id: 'harlowsi',
        text: 'Harlow Solid Italic'
    },
    {
        id: 'oldeng',
        text: 'Old English Text'
    },
    {
        id: 'verdana',
        text: 'Verdana'
    },
    {
        id: 'times',
        text: 'Times New Roman'
    },
    {
        id: 'lithograph',
        text: 'Lithograph'
    },
    {
        id: 'magnetob',
        text: 'Magneto'
    },
    {
        id: 'ag_zurchke',
        text: 'Zurich BLKEX BT'
    },
];
