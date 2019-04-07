import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { SimpleDialog } from '../simple-dialog';

export interface IAlertDialogOptions {
    message?: string;
    buttonLabel?: string;
}

export const DEFAULT_ALERT_OPTIONS: IAlertDialogOptions = {
    message: '',
    buttonLabel: 'Ok',
};

@Component({
    selector: 'app-alert-dialog',
    templateUrl: './alert-dialog.component.html',
    styleUrls: ['./alert-dialog.component.scss'],
})
export class AlertDialogComponent extends SimpleDialog {
    public isCLosableByEsc = true;

    private _options: IAlertDialogOptions = DEFAULT_ALERT_OPTIONS;

    constructor(
        dialogRef: MatDialogRef<AlertDialogComponent>,
        @Inject(MAT_DIALOG_DATA) options: IAlertDialogOptions,
    ) {
        super(dialogRef);
        this.options = options;
    }

    public set options(options: IAlertDialogOptions) {
        this.options.buttonLabel = options.buttonLabel ? options.buttonLabel : DEFAULT_ALERT_OPTIONS.buttonLabel;
        this.options.message = options.message ? options.message : DEFAULT_ALERT_OPTIONS.message;
    }

    public get options(): IAlertDialogOptions {
        return this._options;
    }

    public close(): void {
        this.dialogRef.close();
    }
}
