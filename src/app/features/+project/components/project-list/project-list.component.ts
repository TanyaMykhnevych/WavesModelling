import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { SelectionModel } from '@angular/cdk/collections';
import { MatTableDataSource } from '@angular/material';
import { ISearchProject } from '../../models/search-project';
import { ProjectService } from '../../services/project.service';

@Component({
    selector: 'app-project-list',
    templateUrl: './project-list.component.html',
    styleUrls: ['./project-list.component.scss'],
})

export class ProjectListComponent implements OnInit {
    @Input()
    public set projects(projects: ISearchProject[]) {
        this._projects = projects;
        if (this._projects) {
            this.dataSource = new MatTableDataSource(this._projects);
            this.selection = new SelectionModel<ISearchProject>(true, []);
            this.isLoading = false;
        }
        this._clearSelection();
    }
    public dataSource: MatTableDataSource<ISearchProject>;
    public displayedColumns = ['select', 'name', 'createdOn'];
    public selection: SelectionModel<ISearchProject> = new SelectionModel<ISearchProject>(true, []);
    public isLoading: boolean = true;
    @Output() public selectProject: EventEmitter<ISearchProject[]> = new EventEmitter<ISearchProject[]>();
    private _projects: ISearchProject[] = [];
    private _selectedProjects: ISearchProject[] = [];

    constructor(private _projectService: ProjectService) { }

    public ngOnInit(): void { }

    public get selectedProject(): ISearchProject {
        if (this._selectedProjects.length === 1) {
            return this._selectedProjects[0];
        } else {
            return null;
        }
    }

    public isAllSelected(): boolean {
        const numSelected = this.selection.selected.length;
        const numRows = this.dataSource.data.length;

        return numSelected === numRows;
    }

    public toggle(row: ISearchProject): void {
        if (this._selectedProjects.some((project: ISearchProject) => project.id === row.id)) {
            const indexOfRow = this._selectedProjects.indexOf(row);
            this._selectedProjects.splice(indexOfRow, 1);
        } else {
            this._selectedProjects.push(row);
        }

        this.selection.toggle(row);

        this.selectProject.emit(this._selectedProjects);
    }

    public masterToggle(): void {
        this.isAllSelected() ?
            this._clearSelection() :
            this._selectAll();

        this.selectProject.emit(this._selectedProjects);
    }

    public selectSingle(row: ISearchProject): void {
        if (this.selectedProject === row || (this._selectedProjects.length > 1)
            && this._selectedProjects.some((project: ISearchProject) => project.id === row.id)) {
            this._clearSelection();

            return;
        }

        this._clearSelection();
        this.toggle(row);
    }

    private _clearSelection(): void {
        this.selection.clear();
        this._selectedProjects = [];
    }

    private _selectAll(): void {
        this.dataSource.data.forEach(row => this.selection.select(row));
        this._selectedProjects = [];
        this.dataSource.data.forEach(row => this._selectedProjects.push(row));
    }
}
