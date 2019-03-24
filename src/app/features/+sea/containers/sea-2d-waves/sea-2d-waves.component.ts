import { Component, OnInit } from '@angular/core';
import { IOptions } from '../../models/options';
import { Handler } from '../../models/handlers.enum';
import { DEFAULT_SEA_2D_OPTIONS } from '../../constants/sea.constant';
import { MatDialog } from '@angular/material';
import { SeaSaveDialogComponent } from '../../components/sea-save-dialog/sea-save-dialog.component';
import { ISea2D, ISea } from '../../models/sea';
import { ProjectService } from 'src/app/features/+project/services/project.service';
import { IProject } from 'src/app/features/+project/models/project';

@Component({
    selector: 'app-sea-2d-waves',
    templateUrl: './sea-2d-waves.component.html',
    styleUrls: ['./sea-2d-waves.component.css']
})
export class Sea2DWavesComponent implements OnInit {

    public options: IOptions = DEFAULT_SEA_2D_OPTIONS;
    public handler: Handler = Handler.Oscil;
    public sea: ISea;

    public constructor(
        private _dialog: MatDialog,
        private _projectService: ProjectService) { }

    public ngOnInit(): void {
    }

    public handleOptionsChanges(options: IOptions): void {
        this.options = options;
    }

    public handleHandlerChanges(handler: Handler): void {
        this.handler = handler;
    }

    public handleSeaChanges(sea: ISea): void {
        this.sea = sea;
    }

    public openSavePopup(): void {
        const dialogRef = this._dialog.open(SeaSaveDialogComponent);

        dialogRef.afterClosed().subscribe(name => {

            const project = {
                name: name,
                sea: this._getSeaToPost(),
                options: this.options
            } as IProject;

            this._projectService.create(project).subscribe();

        });
    }

    private _getSeaToPost(): ISea {
        const seaToPost = { ...this.sea } as ISea2D;
        seaToPost.water = null;
        seaToPost.point = null;
        seaToPost.oscillators.forEach(o => o.sea = null);

        return seaToPost;
    }
}
