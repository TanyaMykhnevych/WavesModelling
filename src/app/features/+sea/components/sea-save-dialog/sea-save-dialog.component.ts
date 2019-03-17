import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, FormControl } from '@angular/forms';
import { MatDialogRef } from '@angular/material';

@Component({
    selector: 'app-sea-save-dialog',
    templateUrl: './sea-save-dialog.component.html',
    styleUrls: ['./sea-save-dialog.component.scss']
})
export class SeaSaveDialogComponent implements OnInit {
    public name: string;

    constructor(public dialogRef: MatDialogRef<SeaSaveDialogComponent>) {
    }

    public ngOnInit(): void {
    }

    public save(): void {
        if (!this.name) {
            return;
        }

        this.dialogRef.close(this.name);
    }

    public close(): void {
        this.dialogRef.close();
    }
}
