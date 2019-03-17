import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { TokenService } from './token.service';
import { catchError } from 'rxjs/operators';
import { Router } from '@angular/router';
import { UserResponseCode } from '../../http/response-codes.enum';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

    constructor(private _tokenService: TokenService, private _router: Router) { }

    public intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        const request = req.clone({
            headers: req.headers.set('Authorization', `Bearer ${this._tokenService.token}`),
        });

        return next.handle(request).pipe(catchError(error => {
            this._handleError(error);

            return of(error);
        }));
    }

    private _handleError(err: HttpErrorResponse): void {
        if (err.status === UserResponseCode.Unauthorized) {
            this._router.navigate([`/login`]);
        } else {
            throw (err);
        }
    }
}
