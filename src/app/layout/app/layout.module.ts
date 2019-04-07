import { NgModule } from '@angular/core';
import { MaterialModule } from '../material/material.module';
import { ExpansionMenuModule } from './expansion-menu/expansion-menu.module';
import { DialogsModule } from './dialogs/dialogs.module';

const MODULES = [
    MaterialModule,
    ExpansionMenuModule,
    DialogsModule,
];
const COMPONENTS = [];

const PIPES = [];

const SERVICES = [];

@NgModule({
    imports: [
        ...MODULES,
    ],
    exports: [
        ...MODULES,
    ],
})
export class LayoutModule { }
