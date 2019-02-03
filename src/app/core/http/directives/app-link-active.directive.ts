import {
    Directive, ElementRef, Input, Renderer2, SimpleChanges, ContentChildren, QueryList, OnChanges, OnDestroy, AfterContentInit, OnInit,
} from '@angular/core';
import { Router, RouterEvent, NavigationEnd, RouterLink, RouterLinkWithHref, ActivatedRoute, Params } from '@angular/router';
import { Subscription } from 'rxjs';

@Directive({
    selector: '[appLinkActive]',
})
export class AppLinkActiveDirective implements OnInit, OnChanges, OnDestroy, AfterContentInit {

    @Input()
    set appLinkActive(data: string[] | string) {
        const classes = Array.isArray(data) ? data : data.split(' ');
        this._classes = classes.filter(c => !!c);
    }
    @ContentChildren(RouterLink, { descendants: true })
    public links !: QueryList<RouterLink>;
    @ContentChildren(RouterLinkWithHref, { descendants: true })
    public linksWithHrefs !: QueryList<RouterLinkWithHref>;
    public isActive: boolean = false;

    @Input() public appLinkActiveOptions: { exact: boolean, except: string[] } = { exact: false, except: [] };

    private _classes: string[] = [];
    private _subscription: Subscription;
    private _queryParams: string[];

    constructor(
        private _router: Router,
        private _element: ElementRef,
        private _renderer: Renderer2,
        private _route: ActivatedRoute) {
        this._subscription = _router.events.subscribe((s: RouterEvent) => {
            if (s instanceof NavigationEnd) {
                this._update();
            }
        });
    }

    public ngOnInit(): void {
        this._route.queryParams.subscribe((params: Params) => {
            this._queryParams = Object.keys(params);
        });
    }

    public ngAfterContentInit(): void {
        this.links.changes.subscribe(_ => this._update());
        this.linksWithHrefs.changes.subscribe(_ => this._update());
        this._update();
    }

    public ngOnChanges(changes: SimpleChanges): void { this._update(); }
    public ngOnDestroy(): void { this._subscription.unsubscribe(); }

    private _update(): void {
        if (!this.links || !this.linksWithHrefs || !this._router.navigated) { return; }
        Promise.resolve().then(() => {
            const hasActiveLinks = this._hasActiveLinks();
            if (this.isActive !== hasActiveLinks) {
                this.isActive = hasActiveLinks;
                this._classes.forEach(c => {
                    if (hasActiveLinks) {
                        this._renderer.addClass(this._element.nativeElement, c);
                    } else {
                        this._renderer.removeClass(this._element.nativeElement, c);
                    }
                });
            }
        });
    }

    private _isLinkActive(_router: Router): (link: (RouterLink | RouterLinkWithHref)) => boolean {
        return (link: RouterLink | RouterLinkWithHref) =>
            _router.isActive(link.urlTree, this.appLinkActiveOptions.exact)
            && (!this.appLinkActiveOptions.except || this._isEmptyParametersIntersect());
    }

    private _hasActiveLinks(): boolean {
        return this.links.some(this._isLinkActive(this._router)) ||
            this.linksWithHrefs.some(this._isLinkActive(this._router));
    }

    private _isEmptyParametersIntersect(): boolean {
        const commonParams = this.appLinkActiveOptions.except.filter(param => {
            return this._queryParams.indexOf(param) > -1;
        });

        return commonParams.length === 0;
    }
}
