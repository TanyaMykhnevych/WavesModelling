import { IOptions } from '../models/options';
import { ISea } from '../models/sea';

export const DEFAULT_SEA_OPTIONS: IOptions = {
    D: 2,                           // triangle size for 3d visualize
    N: 500,                         // 3 * 167 = 501
    OMEGA: Number((0.2 / (2 * Math.PI)).toFixed(4)),  // 0.2 < OMEGA < 0.8
    W: 1,
    R: 0,
    _3d: false,
    _1d: false,
    W_ROCK: 1,
}

export const DEFAULT_SEA: ISea = {
    chronos: -1,
    oscillators: [],
    isles: [],
    water: [],
}