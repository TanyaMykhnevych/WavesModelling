import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { ISearchProject } from '../../models/search-project';
import { Router } from '@angular/router';
import { ProjectService } from '../../services/project.service';

@Component({
    selector: 'app-project-actions',
    templateUrl: './project-actions.component.html',
    styleUrls: ['./project-actions.component.scss'],
})

export class ProjectActionsComponent implements OnInit {
    @Output() public reload: EventEmitter<void> = new EventEmitter<void>();
    @Input() public projects: ISearchProject[] = [];

    constructor(private _router: Router,
        private _projectService: ProjectService) { }

    public ngOnInit(): void { }

    public navigateToProjectsCreation(): void {
        this._router.navigate(['/dashboard/sea/2d']);
    }

    public isEditDisabled(): boolean {
        return this.projects.length !== 1 || this.projects[0].isDeleted;
    }

    public isDeactivateDisabled(): boolean {
        return this.projects.length !== 1  || this.projects.some(p => p.isDeleted);
    }

    public isActivateDisabled(): boolean {
        return this.projects.length !== 1  || this.projects.some(p => !p.isDeleted);
    }

    public editProject(): void {
        this._router.navigate([`/dashboard/sea/2d/${this.projects[0].id}`]);
    }

    public deactivate(): void {
        this._projectService.setIsActive(this.projects[0].id, false).subscribe(_ => {
            this.reload.emit();
        });
    }

    public activate(): void {
        this._projectService.setIsActive(this.projects[0].id, true).subscribe(_ => {
            this.reload.emit();
        });
    }
}
