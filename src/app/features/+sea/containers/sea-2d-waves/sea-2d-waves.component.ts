import { Component, OnInit } from '@angular/core';
import { IOptions } from '../../models/options';
import { Handler } from '../../models/handlers.enum';
import { DEFAULT_SEA_2D_OPTIONS, DEFAULT_SEA } from '../../constants/sea.constant';
import { MatDialog } from '@angular/material';
import { SeaSaveDialogComponent } from '../../components/sea-save-dialog/sea-save-dialog.component';
import { ISea2D, ISea } from '../../models/sea';
import { ProjectService } from 'src/app/features/+project/services/project.service';
import { IProject } from 'src/app/features/+project/models/project';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
    selector: 'app-sea-2d-waves',
    templateUrl: './sea-2d-waves.component.html',
    styleUrls: ['./sea-2d-waves.component.css']
})
export class Sea2DWavesComponent implements OnInit {

    public options: IOptions = DEFAULT_SEA_2D_OPTIONS;
    public handler: Handler = Handler.Oscil;
    public sea: ISea = DEFAULT_SEA;

    public constructor(
        private _dialog: MatDialog,
        private _projectService: ProjectService,
        private _route: ActivatedRoute,
        private _router: Router) { }

    public ngOnInit(): void {
        const project = this._route.snapshot.data.project;
        this.options = project ? project.options : DEFAULT_SEA_2D_OPTIONS;
        this.sea = project ? project.sea : DEFAULT_SEA;
    }

    public handleOptionsChanges(options: IOptions): void {
        this.options = { ...this.options, ...options };
    }

    public handleHandlerChanges(handler: Handler): void {
        this.handler = handler;
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

    public navigateToProjectsCreation(): void {
        this._router.navigate(['/dashboard/sea/2d']);
    }

    private _getSeaToPost(): ISea {
        const seaToPost = { ...this.sea } as ISea2D;
        seaToPost.water = null;
        seaToPost.point = null;
        seaToPost.oscillators.forEach(o => o.sea = null);

        return seaToPost;
    }
}
