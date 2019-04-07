import { NgModule } from '@angular/core';
import { ConfirmDialogComponent } from './confirm-dialog/confirm-dialog.component';
import { AlertDialogComponent } from './alert-dialog/alert-dialog.component';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '../../material/material.module';
import { TranslateModule } from '@ngx-translate/core';

const ENTRY_COMPONENTS = [
    ConfirmDialogComponent,
    AlertDialogComponent,
];

const COMPONENTS = [ENTRY_COMPONENTS];

@NgModule({
    imports: [CommonModule, MaterialModule, TranslateModule],
    declarations: [...COMPONENTS],
    entryComponents: [ENTRY_COMPONENTS],
    exports: [...COMPONENTS],
})
export class DialogsModule { }
