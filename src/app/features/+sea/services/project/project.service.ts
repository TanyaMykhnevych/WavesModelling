import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { HttpClient, HttpParams } from '@angular/common/http';

import { IProject } from '../../models/project';
import { AppSettings } from 'src/app/core/settings';
import { convertToHttpParams } from 'src/app/core/http/request/http-params.utils';
import { ISearchResponse } from '../../models/search-response';
import { IProjectSearchParameter } from '../../models/project-search-parameter';

@Injectable()
export class ProjectService {

    constructor(
        private _http: HttpClient,
    ) { }

    public getProject(projectId: number): Observable<IProject> {
        return projectId ? this._http.get<IProject>(`${AppSettings.apiHost}/project/${projectId}`) : of(this.emptyProject);
    }

    public getOrders(parameters: IProjectSearchParameter): Observable<ISearchResponse<IProject>> {
        const params: HttpParams = convertToHttpParams<IProjectSearchParameter>(parameters);

        return parameters ? this._http.get<ISearchResponse<IProject>>(`${AppSettings.apiHost}/project`, { params })
            : of(this.emptyLookupResponse);
    }

    public create(project: IProject): Observable<IProject> {
        return this._http.post<IProject>(`${AppSettings.apiHost}/project`, project);
    }

    public update(project: IProject): Observable<IProject> {
        return this._http.put<IProject>(`${AppSettings.apiHost}/project`, project);
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
