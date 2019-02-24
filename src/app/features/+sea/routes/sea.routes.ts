import { Route } from '@angular/router';
import { Sea2DWavesComponent } from '../containers/sea-2d-waves/sea-2d-waves.component';
import { Sea1DWavesComponent } from '../containers/sea-1d-waves/sea-1d-waves.component';

export const routes: Route[] = [
    {
        path: '2d',
        component: Sea2DWavesComponent,
    },
    {
        path: '1d',
        component: Sea1DWavesComponent,
    }
];
