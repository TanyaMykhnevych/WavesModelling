import { Component, OnInit } from '@angular/core';
import { IOptions } from '../../models/options';
import { Handler } from '../../models/handlers.enum';
import { DEFAULT_SEA_2D_OPTIONS, DEFAULT_SEA } from '../../constants/sea.constant';
import { SeaSaveDialogComponent } from '../../components/sea-save-dialog/sea-save-dialog.component';
import { ISea2D, ISea } from '../../models/sea';
import { ProjectService } from 'src/app/features/+project/services/project.service';
import { IProject } from 'src/app/features/+project/models/project';
import { ActivatedRoute, Router } from '@angular/router';
import { MatDialog } from '@angular/material';
import { AlertDialogComponent } from 'src/app/layout/app/dialogs/alert-dialog/alert-dialog.component';
import { AuthService } from 'src/app/core/auth';
import { filter } from 'rxjs/operators';

@Component({
    selector: 'app-sea-2d-waves',
    templateUrl: './sea-2d-waves.component.html',
    styleUrls: ['./sea-2d-waves.component.css']
})
export class Sea2DWavesComponent implements OnInit {
    public isAuthenticated: boolean = false;
    public handler: Handler = Handler.Oscil;
    public sea: ISea = DEFAULT_SEA;
    public project: IProject = {
        options: DEFAULT_SEA_2D_OPTIONS,
        sea: DEFAULT_SEA
    };

    public constructor(
        private _dialog: MatDialog,
        private _projectService: ProjectService,
        private _route: ActivatedRoute,
        private _router: Router,
        private _authService: AuthService) { }

    public ngOnInit(): void {
        this.isAuthenticated = this._authService.isAuthenticated();
        this.project = this._route.snapshot.data.project ? this._route.snapshot.data.project : this.project;
        this.sea = this.project ? this.project.sea : DEFAULT_SEA;
    }

    public handleOptionsChanges(options: IOptions): void {
        this.project.options = { ...this.project.options, ...options };
    }

    public handleHandlerChanges(handler: Handler): void {
        this.handler = handler;
    }

    public openSavePopup(): void {
        const dialogRef = this._dialog.open(SeaSaveDialogComponent);

        dialogRef.afterClosed()
            .pipe(filter(name => !!name))
            .subscribe(name => {

                const project = {
                    name: name,
                    sea: this._getSeaToPost(),
                    options: this.project.options
                } as IProject;

                this._projectService.create(project).subscribe();

            });
    }

    public saveChanges(): void {
        if (!this.project.name) { return; }

        const project = { ...this.project };
        project.sea = this._getSeaToPost();

        this._projectService.update(project).subscribe(result =>
            this._dialog.open(AlertDialogComponent, {
                disableClose: true,
                data: {
                    message: "Project was updated successfully."
                },
            })
        );
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
