import { ProjectService } from "../../+project/services/project.service";
import { Injectable } from '@angular/core';
import { IProject } from '../../+project/models/project';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs/';

@Injectable()
export class SeaSharedResolver implements Resolve<IProject> {
    constructor(private _projectService: ProjectService) { }

    resolve(
        route: ActivatedRouteSnapshot,
        state: RouterStateSnapshot
    ): Observable<IProject> {
        return this._projectService.getShared(route.params.id);
    }
}