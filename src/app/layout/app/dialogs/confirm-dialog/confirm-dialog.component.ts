import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { SimpleDialog } from '../simple-dialog';

export interface IConfirmDialogConfig {
    title: string;
    header?: string;
    confirmCheckboxLabel?: string;
    trueText?: string;
    falseText?: string;
    cancelText?: string;
}

@Component({
    selector: 'app-confirm-dialog',
    templateUrl: './confirm-dialog.component.html',
    styleUrls: ['./confirm-dialog.component.css'],
})
export class ConfirmDialogComponent extends SimpleDialog {

    public isCLosableByEsc = true;
    public isChecked = false;

    constructor(dialogRef: MatDialogRef<ConfirmDialogComponent>, @Inject(MAT_DIALOG_DATA) public context: IConfirmDialogConfig) {
        super(dialogRef);
    }

    public checkConfirmation(): void {
        this.isChecked = !this.isChecked;
    }

}
