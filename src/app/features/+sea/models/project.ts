import { ISea } from './sea';
import { IOptions } from './options';

export interface IProject {
    name?: string;
    sea?: ISea;
    options?: IOptions;
    userId?: number;
}