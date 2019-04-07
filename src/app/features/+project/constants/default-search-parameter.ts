import { IProjectSearchParameter } from '../models/project-search-parameter';

export const DEFAULT_SEARCH_PARAMETERS: IProjectSearchParameter = {
    isActive: true,
    perPage: 10,
    page: 1,
    searchTerm: null,
};
