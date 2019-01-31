import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { routes } from './sea.routes';

@NgModule({
    imports: [
        RouterModule.forRoot(routes),
    ],
})
export class SeaRoutingModule { }
