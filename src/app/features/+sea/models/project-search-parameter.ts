import { ISearchQueryParameter } from 'src/app/core/search/models/search-query-parameter';

export interface IProjectSearchParameter extends ISearchQueryParameter {
    userId?: number;
    name?: string;
}
