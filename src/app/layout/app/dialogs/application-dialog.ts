import { MatDialogRef } from '@angular/material';
import { ESCAPE } from '@angular/cdk/keycodes';
import { ElementRef } from '@angular/core';

export interface IApplicationDialog {
    close(): void;
    submit(data: any): void;
}

export class ApplicationDialog implements IApplicationDialog {
    public isCLosableByEsc = true;
    public stopEnterPropagation = true;

    constructor(private _dialogRef: MatDialogRef<IApplicationDialog>) {
        this._dialogRef.keydownEvents()
            .subscribe((event: KeyboardEvent) => {
                if (event.keyCode === ESCAPE) {
                    if (event.keyCode === ESCAPE) {
                        this.closeByEsc();
                    }
                    event.stopPropagation();
                }
            });
    }

    public closeByEsc() {
        if (this.isCLosableByEsc) {
            this.close();
        }
    }

    public close(): void {
        this._dialogRef.close();
    }

    public submit(data: any): void {
        this._dialogRef.close(data);
    }

    public focusFirstFormField(hostElement: ElementRef): void {
        const firstFormElement = this._findInitialFocusFormElement(hostElement);
        if (firstFormElement) {
            firstFormElement.focus();
        }
    }

    private _findInitialFocusFormElement(hostElement: ElementRef): HTMLElement {
        return (hostElement.nativeElement as HTMLElement).querySelector('[cdkFocusInitial]');
    }
}
