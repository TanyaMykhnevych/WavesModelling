import { Route } from '@angular/router';
import { DashboardViewComponent } from '../containers/dashboard-view/dashboard-view.component';
import { SeaModule } from '../../+sea/sea.module';

export function loadSeaModule(): typeof SeaModule { return SeaModule; }

export const routes: Route[] = [
    {
        path: 'dashboard',
        component: DashboardViewComponent,
        children: [
            {
                path: '',
                redirectTo: '/dashboard/sea',
                pathMatch: 'full',
            },
            {
                path: 'sea',
                loadChildren: loadSeaModule,
            }
        ],
    },
];

