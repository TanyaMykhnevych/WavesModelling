import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthForm, AuthService } from 'src/app/core/auth';

@Component({
    selector: 'app-login-view',
    templateUrl: './login-view.component.html',
    styleUrls: ['./login-view.component.scss'],
})
export class LoginViewComponent implements OnInit {

    constructor(private _auth: AuthService, private _router: Router) { }

    public ngOnInit(): void {
        if (this._auth.isAuthenticated()) {
            this._router.navigate(['/']);
        }
    }

    public login(value: AuthForm): void {
        this._auth.authorize(value)
            .subscribe((isAuthorized: boolean) => {
                if (isAuthorized) {
                    this._router.navigate(['/home']);
                } else {
                    // TODO handle error;
                }
            });
    }

    public goHome(): void {
        this._router.navigate(['/home']);
    }
}
