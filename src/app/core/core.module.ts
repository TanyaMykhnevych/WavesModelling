import { NgModule } from '@angular/core';
import { AppLinkActiveDirective } from './http/directives/app-link-active.directive';

const MODULES = [

];

const DIRECTIVES = [
    AppLinkActiveDirective,
];

@NgModule({
    imports: [
        ...MODULES,
    ],
    exports: [
        ...DIRECTIVES,
    ],
    declarations: [
        ...DIRECTIVES,
    ],
})
export class CoreModule { }
