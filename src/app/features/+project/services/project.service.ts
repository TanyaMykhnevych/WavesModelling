
import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { AppSettings } from 'src/app/core/settings';
import { ISearchProject } from '../models/search-project';
import { SearchRequestParametersUtils } from 'src/app/core/search/utils/search-request-parameters';
import { SearchResponseUtils } from 'src/app/core/search/utils/search-response';
import { ISearchResponse } from 'src/app/core/search/models/search-response';
import { IProjectSearchParameter } from '../models/project-search-parameter';
import { IProject } from '../models/project';

@Injectable()
export class ProjectService {
    constructor(private _http: HttpClient) { }

    public getProjects(parameters: IProjectSearchParameter): Observable<ISearchResponse<ISearchProject>> {

        const params: HttpParams = SearchRequestParametersUtils.getHttpRequestParams<IProjectSearchParameter>(parameters);

        return parameters ? this._http.get<ISearchResponse<ISearchProject>>(`${AppSettings.apiHost}/project`, { params })
            : of(SearchResponseUtils.getEmptySearchResponse<ISearchProject>());
    }

    public getProject(projectId: number): Observable<IProject> {
        return projectId ? this._http.get<IProject>(`${AppSettings.apiHost}/project/${projectId}`) : of(this.emptyProject);
    }

    public getShared(projectId: number): Observable<IProject> {
        return projectId ? this._http.get<IProject>(`${AppSettings.apiHost}/project/shared/${projectId}`) : of(this.emptyProject);
    }

    public create(project: IProject): Observable<IProject> {
        return this._http.post<IProject>(`${AppSettings.apiHost}/project`, project);
    }

    public update(project: IProject): Observable<IProject> {
        return this._http.post<IProject>(`${AppSettings.apiHost}/project`, project);
    }

    public setIsActive(id: number, isActive: boolean): Observable<IProject> {
        return this._http.put<IProject>(`${AppSettings.apiHost}/project/${id}`, { isActive: isActive });
    }

    public share(id: number, isShared: boolean): Observable<IProject> {
        return this._http.patch<IProject>(`${AppSettings.apiHost}/project/${id}`, { isShared: isShared });
    }

    public get emptyProject(): IProject {
        return {
            name: null,
            sea: {},
            options: {},
            userId: 0,
        };
    }

    public get emptyLookupResponse(): ISearchResponse<IProject> {
        return {
            items: [],
            totalCount: 0,
        };
    }
}

