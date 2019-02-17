import { IOscillator } from './oscillator';

export interface IOscillator2D extends IOscillator {
    row?: number,
    column: number,
}
