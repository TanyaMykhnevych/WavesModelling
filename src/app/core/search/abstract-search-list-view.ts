import { Subscription } from 'rxjs';
import { Router, ActivatedRoute } from '@angular/router';
import * as _ from 'lodash';
import { OnInit, OnDestroy } from '@angular/core';

export abstract class AbstractSearchListView<TParams> implements OnInit, OnDestroy {
    protected searchParameters: TParams = null;
    protected abstract router: Router;
    protected abstract route: ActivatedRoute;

    private _subscription: Subscription;

    public ngOnInit(): void {
        this._subscription = this.route.queryParams.subscribe((searchParameters: TParams) => {
            this.searchParameters = searchParameters;
            if (!_.isEmpty(this.searchParameters)) {
                this.loadData();
            }
        });
    }

    public ngOnDestroy(): void {
        this._subscription.unsubscribe();
    }

    protected onSearch(searchParameters: TParams): void {
        this.router.navigate(['.'], {
            relativeTo: this.route,
            queryParams: searchParameters,
        });
    }

    protected abstract loadData(): void;
}
