import { Injectable } from '@angular/core';
import { ISea1D } from '../models/sea';
import { IOptions } from '../models/options';
import { IOscillator1D } from '../models/oscillator-1d';

@Injectable()
export class Sea1DOperationsService {

    constructor() { }

    private _sea: ISea1D;

    public get sea() {
        return this._sea;
    }

    public set sea(sea: ISea1D) {
        this._sea = sea;
    }

    public addOscillator(x: number, omega: number, ampl: number): void {
        const osc = {
            x: x,
            omega: omega,
            amplitude: ampl,
            sea: this.sea
        } as IOscillator1D;

        this._sea.oscillators.push(osc);
    }

    public removeOscillatorNear(x: number): void {
        let i = this._sea.oscillators.findIndex(o => Math.hypot(o.x - x) < 5);
        if (i !== -1) this._sea.oscillators.splice(i, 1);
    }

    public step(): void {
        this._sea.chronos++;

        // oscillators
        for (let o of this._sea.oscillators) {
            if (this._sea.water[o.x].free) {
                // o.next();
                this._sea.water[o.x].x =
                    Math.sin(2 * Math.PI * o.omega * this.sea.chronos) * o.amplitude;
            }
        }

        // расчет сил
        let n = this._sea.n;
        for (let r = 1; r < n - 1; r++) {
            this._sea.water[r].f = (this._sea.water[r - 1].x + this._sea.water[r + 1].x - this._sea.water[r].x * 2) / 2;

        }

        // расчет отклонений

        // точки на периметре
        if (false) {
            // полное отражение от границ
            this._sea.water[0].x = this._sea.water[n - 1].x = 0;
        } else {
            // поглощение границами (неполное)
            this._sea.water[0].x = this._sea.water[1].x - this._sea.water[1].v;
            this._sea.water[n - 1].x = this._sea.water[n - 2].x - this._sea.water[n - 2].v;
        }

        // внутренние точки
        for (let r = 1; r < n - 1; r++) {
            // change v
            this._sea.water[r].v += this._sea.water[r].f;
            this._sea.water[r].v *= 1.0;                ///////
            // change x
            this._sea.water[r].x += this._sea.water[r].v;
        }
    }

    public initSea(options: IOptions): void {
        this.clearSea();
        for (let c = 0; c < options.N; c++) {
            this._sea.water.push({ x: 0, f: 0, v: 0, free: true });
        }

        this._sea.point = { row: 0, column: 0 };
        this._sea.n = options.N;
    }

    public clearSea(): void {
        this._sea.chronos = -1;
        this.sea.water = [];
        this.sea.oscillators = [];
        this.sea.isles = [];
    }
}
