import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { routes } from './dashboard.routes';
import { SeaSharedResolver } from '../../+sea/services/sea-shared.resolver';

@NgModule({
    imports: [
        CommonModule,
        RouterModule.forRoot(routes, { useHash: true }),
    ],
    declarations: [],
    exports: [
        RouterModule,
    ],
    providers: [SeaSharedResolver]
})
export class DashboardRoutingModule { }
