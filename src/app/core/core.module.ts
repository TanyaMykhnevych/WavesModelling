import { NgModule } from '@angular/core';
import { AppLinkActiveDirective } from './http/directives/app-link-active.directive';
import { AuthModule } from './auth';
import { TranslateModule } from '@ngx-translate/core';

const MODULES = [
    AuthModule.forRoot(),
    TranslateModule,
];

const DIRECTIVES = [
    AppLinkActiveDirective,
];

@NgModule({
    imports: [
        ...MODULES,
    ],
    exports: [
        TranslateModule,
        ...DIRECTIVES,
    ],
    declarations: [
        ...DIRECTIVES,
    ],
})
export class CoreModule { }
