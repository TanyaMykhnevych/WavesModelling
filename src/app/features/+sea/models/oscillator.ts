import { ISea } from './sea';

export interface IOscillator {
    omega: number,
    amplitude?: number,
    sea?: ISea,
}
