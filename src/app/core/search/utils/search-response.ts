import { ISearchResponse } from '../models/search-response';

export class SearchResponseUtils<T> {

    public static getEmptySearchResponse<T>(): ISearchResponse<T> {
        return {
            items: [],
            totalCount: 0,
        };
    }

}
