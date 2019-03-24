import { ISea } from '../../+sea/models/sea';
import { IOptions } from '../../+sea/models/options';

export interface IProject {
    name?: string;
    sea?: ISea;
    options?: IOptions;
    userId?: number;
}