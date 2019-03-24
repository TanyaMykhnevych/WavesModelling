import { Route } from '@angular/router';
import { ProjectsViewComponent } from '../containers/projects-view/projects-view.component';

export const routes: Route[] = [
    {
        path: '',
        component: ProjectsViewComponent,
    },
];
