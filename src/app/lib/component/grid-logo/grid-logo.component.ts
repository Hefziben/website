import { Component, OnInit, Input } from '@angular/core';
import { trigger, state, style, animate, transition, keyframes } from '@angular/animations';
import * as _ from "lodash";
import { productService } from '../../service/product.service';

@Component({
    selector: 'grid-logo',
    templateUrl: './grid-logo.component.html',
    styleUrls: ['./grid-logo.component.scss'],
    animations:[
        trigger('fade', [
            state('shown' , style({ opacity: 1 })), 
            state('hidden', style({ opacity: 0 })),
            transition('* => *', animate('.5s'))
        ]),
    ]
})
export class GridLogoComponent implements OnInit {
    public logos : any[] = [];
    public limit: number;

    @Input() setlimit;
    
    constructor(
        private mainService: productService
    ){ }

    ngOnInit() {
        this.fetch();
    }
    
    // Limit
    limitLogo(logo){
        if(this.setlimit === undefined){
            this.limit = logo.length;
        }else{
            this.limit = this.setlimit;
        }
    }

    // Fetching
    fetch(){
        this.mainService.getLogo().subscribe(data => {
            this.logos = [];
            _.map(data,(x)=>{
                this.logos.push(x);
            });
            this.limitLogo(data);
        });
    }
}
