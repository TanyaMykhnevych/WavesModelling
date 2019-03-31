import { IOscillator } from './oscillator';
import { IPoint } from './point';
import { IOscillator2D } from './oscillator-2d';
import { IOscillator1D } from './oscillator-1d';
import { IIsle } from './isle';

export interface ISea {
    id?: number,
    chronos?: number,
    n?: number,
    oscillators?: IOscillator[],
}

export interface ISea2D extends ISea {
    oscillators?: IOscillator2D[],
    isles?: IIsle[],
    water?: IPoint[][],
    point?: IPoint,
}

export interface ISea1D extends ISea {
    oscillators?: IOscillator1D[],
    isles?: any[],
    water?: IPoint[],
    point?: IPoint,
}