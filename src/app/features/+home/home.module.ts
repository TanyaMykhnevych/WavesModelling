import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomeRoutingModule } from './routes/home-routing.module';
import { HomeComponent } from './home.component';
import { LayoutModule } from 'src/app/layout/app/layout.module';
import { CoreModule } from 'src/app/core/core.module';
import { RouterModule } from '@angular/router';


@NgModule({
    imports: [
        CommonModule,
        LayoutModule,
        HomeRoutingModule,
        CoreModule,
        RouterModule,
    ],
    declarations: [
        HomeComponent,
    ],
})
export class HomeModule { }
