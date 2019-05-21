import { MediaMatcher } from '@angular/cdk/layout';
import { ChangeDetectorRef, Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/core/auth';
import { MatSelectChange } from '@angular/material';
import { TranslateService } from '@ngx-translate/core';

@Component({
    selector: 'app-top-menu',
    templateUrl: './top-menu.component.html',
    styleUrls: ['./top-menu.component.scss'],
})
export class TopMenuComponent implements OnInit, OnDestroy {
    public mobileQuery: MediaQueryList;
    public currentLanguage = 'en';
    public isAuthenticated: boolean = false;

    private _mobileQueryListener: () => void;

    constructor(
        public router: Router,
        private _authService: AuthService,
        changeDetectorRef: ChangeDetectorRef,
        media: MediaMatcher,
        private _translateService: TranslateService) {
        this.mobileQuery = media.matchMedia('(max-width: 1024px)');
        this._mobileQueryListener = () => changeDetectorRef.detectChanges();
        this.mobileQuery.addListener(this._mobileQueryListener);
    }

    public ngOnInit(): void {
        this.currentLanguage = this._translateService.getDefaultLang() ? this._translateService.getDefaultLang() : this.currentLanguage;
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
