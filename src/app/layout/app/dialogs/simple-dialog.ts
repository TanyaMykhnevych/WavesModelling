import * as KEY_CODES from '@angular/cdk/keycodes';
import { MatDialogRef } from '@angular/material';
import { ApplicationDialog } from './application-dialog';

export abstract class SimpleDialog extends ApplicationDialog {

    public preventEnter: boolean = false;

    constructor(protected dialogRef: MatDialogRef<any>) {
        super(dialogRef);
        this.dialogRef.keydownEvents()
            .subscribe((event: KeyboardEvent) => {
                if (event.keyCode === KEY_CODES.ENTER || event.keyCode === KEY_CODES.TAB) {
                    if (event.keyCode === KEY_CODES.TAB || this.preventEnter) {
                        event.preventDefault();
                    }

                    event.stopPropagation();
                }
            });
    }
}
