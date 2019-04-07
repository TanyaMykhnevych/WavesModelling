import { Component } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { AbstractSearchListView } from 'src/app/core/search/abstract-search-list-view';
import { ISearchProject } from '../../models/search-project';
import { ProjectService } from '../../services/project.service';
import { cloneDeep } from 'lodash';
import { ISearchResponse } from 'src/app/core/search/models/search-response';
import { IProjectSearchParameter } from '../../models/project-search-parameter';


@Component({
    selector: 'app-projects-view',
    templateUrl: './projects-view.component.html',
    styleUrls: ['./projects-view.component.scss'],
})
export class ProjectsViewComponent extends AbstractSearchListView<IProjectSearchParameter> {
    public pageSize: number = 10;
    public projects: ISearchProject[];
    public totalCount: number;
    public selectedProjects: ISearchProject[] = [];
    private _isActive: boolean = true;

    constructor(
        private _projectService: ProjectService,
        protected router: Router,
        protected route: ActivatedRoute) {
        super();
        this.route.queryParams
        .subscribe((params: { isActive: boolean }) => {
            this._isActive = params.isActive;
        });
    }

    public reloadProjects(): void {
        this.loadData();
    }

    public onSearch(searchParameters: IProjectSearchParameter): void {
        searchParameters.isActive = this._isActive;
        super.onSearch(searchParameters);
    }

    public updateSelectedProjects(projects: ISearchProject[]): void {
        this.selectedProjects = projects;
    }

    protected loadData(): void {
        const searchParameters: IProjectSearchParameter = cloneDeep(this.searchParameters);
        this._projectService
            .getProjects(searchParameters)
            .subscribe((result: ISearchResponse<ISearchProject>) => {
                this.projects = result.items;
                this.totalCount = result.totalCount;
            });
    }
}
