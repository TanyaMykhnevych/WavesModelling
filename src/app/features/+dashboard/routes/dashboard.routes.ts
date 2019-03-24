import { Route } from '@angular/router';
import { DashboardViewComponent } from '../containers/dashboard-view/dashboard-view.component';
import { SeaModule } from '../../+sea/sea.module';
import { ProjectModule } from '../../+project/project.module';

export function loadSeaModule(): typeof SeaModule { return SeaModule; }
export function loadProjectsModule(): typeof ProjectModule { return ProjectModule; }

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
            },
            {
                path: 'projects',
                loadChildren: loadProjectsModule,
                runGuardsAndResolvers: 'paramsOrQueryParamsChange',
            },
        ],
    },
];

