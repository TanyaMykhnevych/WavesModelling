
import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { AppSettings } from 'src/app/core/settings';
import { RegistrationForm } from 'src/app/core/auth';

@Injectable()
export class UserService {
    constructor(private _http: HttpClient) { }

    public create(user: RegistrationForm): Observable<any> {
        return this._http.post<any>(`${AppSettings.apiHost}/user`, user);
    }
}

