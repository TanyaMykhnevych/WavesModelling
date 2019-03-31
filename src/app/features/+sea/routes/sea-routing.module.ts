import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { routes } from './sea.routes';
import { SeaResolver } from '../services/sea.resolver';

@NgModule({
    imports: [
        RouterModule.forChild(routes),
    ],
    providers: [SeaResolver]
})
export class SeaRoutingModule { }
