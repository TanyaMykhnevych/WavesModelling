import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ModuleWithProviders } from '@angular/compiler/src/core';
import { AuthService, TokenService } from './services';
import { AuthGuard } from './guards';
import { HTTP_INTERCEPTORS } from '../../../../node_modules/@angular/common/http';
import { AuthInterceptor } from './services/auth.interceptor';

@NgModule({
    imports: [
        CommonModule,
    ],
    declarations: [],
})
export class AuthModule {
    public static forRoot(): ModuleWithProviders {
        return {
            ngModule: AuthModule,
            providers: [
                AuthService,
                TokenService,
                AuthGuard,
                { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
            ],
        };
    }
}
