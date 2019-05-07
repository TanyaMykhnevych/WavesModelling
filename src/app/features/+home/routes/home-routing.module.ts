import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { routes } from './home.routes';
import { CommonModule } from '@angular/common';

@NgModule({
    imports: [
        CommonModule,
        RouterModule.forRoot(routes, { useHash: true }),
    ],
})
export class HomeRoutingModule { }
