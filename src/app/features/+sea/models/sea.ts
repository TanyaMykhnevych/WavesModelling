import { IOscillator } from './oscillator';
import { IPoint } from './point';

export interface ISea {

    chronos?: number,
    n?: number,
    oscillators?: IOscillator[],
    isles?: any[],
    water?: IPoint[][],
    point?: IPoint,




    // constructor(n) {
    //     this.chronos = -1;
    //     this.n = n;
    //     this.oscs = [];
    //     this.isles = [];
    //     // water
    //     this.w = [];
    //     for (let r = 0; r < n; r++) {
    //         let row = [];
    //         for (let c = 0; c < n; c++) {
    //             row.push({x: 0, f: 0, v: 0, free: 1});
    //         }
    //         this.w.push(row);
    //     }
    //     this.point = {r: 0, c: 0};
    // }
}