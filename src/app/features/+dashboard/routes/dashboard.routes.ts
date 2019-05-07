import { Route } from '@angular/router';
import { DashboardViewComponent } from '../containers/dashboard-view/dashboard-view.component';
import { SeaModule } from '../../+sea/sea.module';
import { ProjectModule } from '../../+project/project.module';
import { Sea2DWavesSharedComponent } from '../../+sea/containers/sea-2d-waves-shared/sea-2d-waves-shared.component';
import { SeaSharedResolver } from '../../+sea/services/sea-shared.resolver';

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
    {
        path: 'shared',
        children: [
            {
                path: '',
                component: Sea2DWavesSharedComponent,
            },
            {
                path: ':id',
                children: [
                    {
                        path: '',
                        component: Sea2DWavesSharedComponent,
                        resolve: {
                            project: SeaSharedResolver,
                        }
                    },
                ]
            },
        ],
    }
];

