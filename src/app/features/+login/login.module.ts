import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoginRoutingModule } from './routes/login-routing.module';
import { LoginViewComponent } from './containers';
import { ReactiveFormsModule } from '@angular/forms';
import { LoginFormComponent } from './components/login-form/login-form.component';
import { LayoutModule } from 'src/app/layout/app/layout.module';
import { CoreModule } from 'src/app/core/core.module';
import { RegisterViewComponent } from './containers/register-view/register-view.component';
import { RegisterFormComponent } from './components/register-form/register-form.component';
import { UserService } from './services/user.service';

@NgModule({
    imports: [
        CommonModule,
        LayoutModule,
        ReactiveFormsModule,
        CoreModule,
        LoginRoutingModule,
    ],
    declarations: [
        LoginViewComponent,
        LoginFormComponent,
        RegisterViewComponent,
        RegisterFormComponent
    ],
})
export class LoginModule {
    public static forRoot(): ModuleWithProviders {
        return {
            ngModule: LoginModule,
            providers: [UserService],
        };
    }
}
