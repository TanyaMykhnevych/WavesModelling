import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoginRoutingModule } from './routes/login-routing.module';
import { LoginViewComponent } from './containers';
import { ReactiveFormsModule } from '@angular/forms';
import { LoginFormComponent } from './components/login-form/login-form.component';
import { LayoutModule } from 'src/app/layout/app/layout.module';
import { CoreModule } from 'src/app/core/core.module';

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
    ],
})
export class LoginModule { }
