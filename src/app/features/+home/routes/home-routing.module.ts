import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { routes } from './home.routes';

@NgModule({
    imports: [
        RouterModule.forRoot(routes),
    ],
})
export class HomeRoutingModule { }
