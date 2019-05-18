import { MediaMatcher } from '@angular/cdk/layout';
import { ChangeDetectorRef, Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService } from 'src/app/core/auth';
import { Validators, FormControl } from '@angular/forms';
import { MatSelectChange } from '@angular/material';
import { TranslateService } from '@ngx-translate/core';

@Component({
    selector: 'app-dashboard-view',
    templateUrl: './dashboard-view.component.html',
    styleUrls: ['./dashboard-view.component.scss'],
})
export class DashboardViewComponent implements OnInit, OnDestroy {
    public mobileQuery: MediaQueryList;
    public isAuthenticated: boolean = false;
    public currentLanguage = 'en';

    private _mobileQueryListener: () => void;

    constructor(
        public router: Router,
        private _route: ActivatedRoute,
        private _authService: AuthService,
        changeDetectorRef: ChangeDetectorRef,
        media: MediaMatcher, 
        private _translateService: TranslateService) {
        this.mobileQuery = media.matchMedia('(max-width: 1024px)');
        this._mobileQueryListener = () => changeDetectorRef.detectChanges();
        this.mobileQuery.addListener(this._mobileQueryListener);
    }

    public ngOnInit(): void {
        this.isAuthenticated = this._authService.isAuthenticated();      
    }

    public ngOnDestroy(): void {
        this.mobileQuery.removeListener(this._mobileQueryListener);
    }

    public languageChange(event: MatSelectChange): void {
        this.currentLanguage = event.value;
        this._translateService.setDefaultLang(event.value);
        this._translateService.use(event.value);
    }

    public logout(): void {
        this._authService.unauthorize();
        this.router.navigate(['/home']);
    }

    public login(): void {
        this.router.navigate(['/login']);
    }
}
