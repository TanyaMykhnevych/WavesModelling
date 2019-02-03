import { MatDialogRef } from '@angular/material';
import { IApplicationDialog } from './application-dialog.interface';
import { filter } from 'rxjs/operators';
import * as keycodes from '@angular/cdk/keycodes';

export class ApplicationDialog<T> implements IApplicationDialog<T> {
    constructor(public dialogRef: MatDialogRef<IApplicationDialog<T>>) {
        this.dialogRef.keydownEvents()
            .pipe(filter((event: KeyboardEvent) => event.keyCode === keycodes.ESCAPE))
            .subscribe((event: KeyboardEvent) => {
                event.stopPropagation();
                this.closeByEsc();
            });
    }

    public closeByEsc(): void {
        this.close();
    }

    public close(): void {
        this.dialogRef.close();
    }

    public submit(data: T): void {
        this.dialogRef.close(data);
    }
}
