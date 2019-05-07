import { NgModule } from '@angular/core';
import { MaterialModule } from '../material/material.module';
import { ExpansionMenuModule } from './expansion-menu/expansion-menu.module';
import { DialogsModule } from './dialogs/dialogs.module';
import { RulerComponent } from './ruler/ruler.component';
import { CommonModule } from '@angular/common';

const MODULES = [
    MaterialModule,
    ExpansionMenuModule,
    DialogsModule,
    CommonModule,
];
const COMPONENTS = [RulerComponent];

const PIPES = [];

const SERVICES = [];

@NgModule({
    imports: [
        ...MODULES,
    ],
    declarations: [...COMPONENTS],
    exports: [
        ...MODULES,
        ...COMPONENTS,
    ],
})
export class LayoutModule { }
