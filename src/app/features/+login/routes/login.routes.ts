import { Route } from '@angular/router';
import { LoginViewComponent } from '../containers';
import { RegisterViewComponent } from '../containers/register-view/register-view.component';

export const routes: Route[] = [
    {
        path: 'login',
        component: LoginViewComponent,
    },
    {
        path: 'register',
        component: RegisterViewComponent,
    },
];