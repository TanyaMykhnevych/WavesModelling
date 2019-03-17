import { ISearchQueryParameter } from 'src/app/core/models/search-query-parameter';

export interface IProjectSearchParameter extends ISearchQueryParameter {
    userId?: number;
    nme?: string;
}
