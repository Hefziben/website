import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Title, Meta } from '@angular/platform-browser';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss'],
})
export class AppComponent {
    public scrollbarOptions = { axis: 'y', theme: 'minimal-dark' };

    constructor(
        private router: Router,
        private meta: Meta,
        private titleService: Title
    ){}

    mainclass: boolean;
    ngOnInit() {
        document.getElementById("loader").style.display = 'none';
        
        this.router.events.subscribe(evt => {
            this.mainclass = false;
            window.scrollTo(0,0);
        });

        this.meta.addTag({ name: 'keyword', content: 'Custom License Plates' });
        this.meta.addTag({ name: 'description', content: 'Custom License Plates' });
        this.meta.addTag({ name: 'robots', content: 'index, follow' });
    }
}
