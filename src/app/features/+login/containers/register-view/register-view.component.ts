import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/core/auth';
import { RegistrationForm } from 'src/app/core/auth/models/registration-form.model';
import { UserService } from '../../services/user.service';

@Component({
    selector: 'app-register-view',
    templateUrl: './register-view.component.html',
    styleUrls: ['./register-view.component.scss'],
})
export class RegisterViewComponent implements OnInit {

    constructor(private _auth: AuthService, private _router: Router, private _userService: UserService) { }

    public ngOnInit(): void {
        if (this._auth.isAuthenticated()) {
            this._router.navigate(['/']);
        }
    }

    public register(value: RegistrationForm): void {
        this._userService.create(value).subscribe((user) => {
            if (user) {
                this._router.navigate(['/home']);
            }
        });
    }

    public goHome(): void {
        this._router.navigate(['/home']);
    }
}
