import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { HomeRoutingModule } from './routes/home-routing.module';
import { HomeComponent } from './home.component';


@NgModule({
    imports: [
        RouterModule,
        CommonModule,
        HomeRoutingModule,
    ],
    declarations: [
        HomeComponent,
    ],
    providers: [],
})
export class HomeModule { }
