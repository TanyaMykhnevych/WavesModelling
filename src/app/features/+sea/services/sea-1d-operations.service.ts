import { Injectable } from '@angular/core';
import { ISea1D } from '../models/sea';
import { IOscillator1D } from '../models/oscillator-1d';
import { IOptions1D } from '../models/options1D';

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
                    Math.sin(o.omega * this._sea.chronos) * o.amplitude;
            }
        }

        // расчет ускорений
        let n = this._sea.n;
        // крайние точки
        this._sea.water[0].a = (this._sea.water[1].x - this._sea.water[0].x) * this._sea.water[0].km;
        this._sea.water[n - 1].a = (this._sea.water[n - 2].x - this._sea.water[n - 1].x) * this._sea.water[n - 1].km;
        // внутренние точки
        for (let r = 1; r < n - 1; r++) {
            this._sea.water[r].a = (this._sea.water[r - 1].x + this._sea.water[r + 1].x - this._sea.water[r].x * 2) * this._sea.water[r].km;
        }
        // расчет отклонений

        let reflection = 0;

        // крайние точки
        if (reflection) {
            // полное отражение от границ
            this._sea.water[0].x = this._sea.water[n - 1].x = 0;
        } else {
            // поглощение границами (неполное)
            this._sea.water[0].x = this._sea.water[1].x - this._sea.water[1].v;
            this._sea.water[n - 1].x = this._sea.water[n - 2].x - this._sea.water[n - 2].v;
            this._sea.water[0].v = 0;
            this._sea.water[n - 1].v = 0;
        }

        // все точки
        for (let r = 1; r < n - 1; r++) {
            if (!this._sea.water[r].free)
                continue;
            // change v
            this._sea.water[r].v += this._sea.water[r].a;
            // energy dissipation
            this._sea.water[r].v *= this._sea.water[r].w;
            // change x
            this._sea.water[r].x += this._sea.water[r].v;
        }
    }

    public initSea(options: IOptions1D): void {
        this.clearSea();
        for (let c = 0; c < options.n; c++) {
            this._sea.water.push({ free: true, w: options.w, km: options.km, x: 0, a: 0, v: 0, });
        }

        let w = options.w;
        for (let i = 0; i < options.merge; i++) {
            let r = options.n - options.merge + i;
            w -= 0.001;
            this._sea.water[r].w = w;
        }

        this._sea.point = { row: 0, column: 0 };
        this._sea.n = options.n;
    }

    public clearSea(): void {
        this._sea.chronos = -1;
        this.sea.water = [];
        this.sea.oscillators = [];
        this.sea.isles = [];
    }
}
