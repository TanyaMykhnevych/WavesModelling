import { MediaMatcher } from '@angular/cdk/layout';
import { ChangeDetectorRef, Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService } from 'src/app/core/auth';

@Component({
    selector: 'app-dashboard-view',
    templateUrl: './dashboard-view.component.html',
    styleUrls: ['./dashboard-view.component.scss'],
})
export class DashboardViewComponent implements OnInit, OnDestroy {
    public mobileQuery: MediaQueryList;


    private _mobileQueryListener: () => void;

    constructor(
        public router: Router,
        private _route: ActivatedRoute,
        private _authService: AuthService,
        changeDetectorRef: ChangeDetectorRef,
        media: MediaMatcher,) {
        this.mobileQuery = media.matchMedia('(max-width: 1024px)');
        this._mobileQueryListener = () => changeDetectorRef.detectChanges();
        this.mobileQuery.addListener(this._mobileQueryListener);
    }

    public ngOnInit(): void {
    }

    public ngOnDestroy(): void {
        this.mobileQuery.removeListener(this._mobileQueryListener);
    }

    public logout(): void {
        this._authService.unauthorize();
        this.router.navigate(['/login']);
    }
}
