import { Component, OnInit, Output, EventEmitter, Input, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, FormControl } from '@angular/forms';
import { MatPaginator, PageEvent } from '@angular/material';
import { ProjectService } from '../../services/project.service';
import { IProjectSearchParameter } from '../../models/project-search-parameter';
import { DEFAULT_SEARCH_PARAMETERS } from '../../constants/default-search-parameter';


@Component({
    selector: 'app-project-search-form',
    templateUrl: './project-search-form.component.html',
    styleUrls: ['./project-search-form.component.scss'],
})

export class ProjectSearchFormComponent implements OnInit {
    @Output() public valueChanges: EventEmitter<IProjectSearchParameter> = new EventEmitter<IProjectSearchParameter>();
    @Input() public totalCount: number = 0;
    public searchForm: FormGroup;
    @ViewChild(MatPaginator) public paginator: MatPaginator;
    public modules: number[] = [];

    private _searchParameters: IProjectSearchParameter = DEFAULT_SEARCH_PARAMETERS;

    constructor(
        private _projectService: ProjectService,
        private _builder: FormBuilder) { }

    public ngOnInit(): void {
        this.searchForm = this._builder.group({
            searchTerm: new FormControl(this.searchParameters.searchTerm),
        });
        this.paginator.pageSize = this.pageSize;
        this.paginator.pageIndex = this.page - 1;

        this._emit(this.searchForm.value);
        this._subscribeControlValuesChages();
    }

    @Input()
    public set searchParameters(parameters: IProjectSearchParameter) {
        this._searchParameters = { ...DEFAULT_SEARCH_PARAMETERS, ...parameters };
        if (this.searchForm) {
            this.searchForm.patchValue({
                searchTerm: this._searchParameters.searchTerm ? this._searchParameters.searchTerm : DEFAULT_SEARCH_PARAMETERS.searchTerm,
            }, { emitEvent: false });
        }
    }

    public get searchParameters(): IProjectSearchParameter {
        return this._searchParameters;
    }

    public get page(): number {
        return parseInt(this._searchParameters.page.toString(), 10);
    }

    public set page(value: number) {
        this._searchParameters.page = parseInt(value.toString(), 10) + 1;
    }

    public get pageSize(): number {
        return parseInt(this._searchParameters.perPage.toString(), 10);
    }

    public set pageSize(value: number) {
        this._searchParameters.perPage = parseInt(value.toString(), 10);
    }

    public filter(value: IProjectSearchParameter): void {
        this._emit({ ...this.searchForm.value, ...value });
    }

    public onPaginateChange(event: PageEvent): void {
        this.page = event.pageIndex;
        this.pageSize = event.pageSize;
        this._emit(this.searchForm.value);
    }

    private _setupSearchParameters({ searchTerm: term }: IProjectSearchParameter): void {
        this._searchParameters = {
            page: this.page,
            perPage: this.pageSize,
            searchTerm: term,
        };
    }

    private _emit(value: IProjectSearchParameter): void {
        this._setupSearchParameters(value);
        this.valueChanges.emit({ ...this._searchParameters });
    }

    private _subscribeControlValuesChages(): void {
        this.searchForm.controls.searchTerm.valueChanges.subscribe((value: string) => {
            if (value.length < 1) {
                this.filter({ searchTerm: null });
            } else {
                this.filter({ searchTerm: value });
            }
        });
    }
}
