import { Injectable } from '@angular/core';
import { TokenService } from './token.service';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthForm, AuthResponse } from '../models';
import { map } from 'rxjs/operators';
import { AppSettings } from '../../settings';

@Injectable()
export class AuthService {

    private _availibleFeatures: string[] = [];

    constructor(private _http: HttpClient, private _tokenService: TokenService) { }

    public isAuthenticated(): boolean {
        return !!this._tokenService.token;
    }

    public authorize(form: AuthForm): Observable<boolean> {
        return this._http.post<AuthResponse>(`${AppSettings.apiHost}/auth/token`, form)
            .pipe(
                map((response: AuthResponse) => {
                    if (!response.isAuthorized) { return false; }
                    this._tokenService.token = response.token;
                    this.availibleFeatures = response.features;

                    return true;
                }),
            );
    }

    public unauthorize(): void {
        this._tokenService.clearToken();
    }

    public get availibleFeatures(): string[] {
        return this._availibleFeatures;
    }

    public set availibleFeatures(features: string[]) {
        this._availibleFeatures = features;
    }

}
