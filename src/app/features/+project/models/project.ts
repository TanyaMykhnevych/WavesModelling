import { ISea } from '../../+sea/models/sea';
import { IOptions } from '../../+sea/models/options';

export interface IProject {
    id?: number;
    name?: string;
    sea?: ISea;
    options?: IOptions;
    userId?: number;
    isDeleted?: boolean;
}