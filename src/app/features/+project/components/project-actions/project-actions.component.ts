import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { ISearchProject } from '../../models/search-project';
import { Router } from '@angular/router';

@Component({
    selector: 'app-project-actions',
    templateUrl: './project-actions.component.html',
    styleUrls: ['./project-actions.component.scss'],
})

export class ProjectActionsComponent implements OnInit {
    @Output() public reload: EventEmitter<void> = new EventEmitter<void>();
    @Input() public projects: ISearchProject[] = [];

    constructor(private _router: Router) { }

    public ngOnInit(): void { }

    public navigateToProjectsCreation(): void {
        this._router.navigate(['/dashboard/sea/2d']);
    }
}
