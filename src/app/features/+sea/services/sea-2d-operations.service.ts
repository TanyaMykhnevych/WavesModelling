import { Injectable } from '@angular/core';
import { ISea2D } from '../models/sea';
import { IOptions } from '../models/options';
import { IOscillator2D } from '../models/oscillator-2d';

@Injectable()
export class Sea2DOperationsService {

    constructor() { }

    private _sea: ISea2D;

    public get sea() {
        return this._sea;
    }

    public set sea(sea: ISea2D) {
        this._sea = sea;
    }

    public addOscillator(r: number, c: number, omega: number, ampl: number): void {
        const osc = {
            row: r,
            column: c,
            omega: omega,
            amplitude: ampl,
            sea: this.sea
        } as IOscillator2D;

        this._sea.oscillators.push(osc);
    }

    public removeOscillatorNear(r: number, c: number): void {
        let i = this._sea.oscillators.findIndex(o => Math.hypot(o.row - r, o.column - c) < 5);
        if (i !== -1) this._sea.oscillators.splice(i, 1);
    }

    public getRocksFromCanvasData(canvasData: ImageData): void {
        let n = this._sea.n;
        for (let r = 0; r < n; r++) {
            for (let c = 0; c < n; c++) {
                let idx = (c + r * n) * 4;
                if (canvasData.data[idx] > 0)  // red
                    this._sea.water[r][c].free = false;
            }
        }
    }

    public step(opts: IOptions): void {
        this._sea.chronos++;

        // oscillators
        for (let o of this._sea.oscillators) {
            if (this._sea.water[o.row][o.column].free) {
                // o.next();
                this._sea.water[o.row][o.column].x =
                    Math.sin(2 * Math.PI * opts.omega * this.sea.chronos) * o.amplitude;
            }
        }

        // force calculation
        let n = this._sea.n;
        for (let r = 1; r < n - 1; r++) {
            for (let c = 1; c < n - 1; c++) {
                this._sea.water[r][c].f = (this._sea.water[r - 1][c].x + this._sea.water[r + 1][c].x +
                    this._sea.water[r][c - 1].x + this._sea.water[r][c + 1].x - this._sea.water[r][c].x * 4) / 4;
            }
        }

        // deviation calculation

        // points on the perimeter
        for (let p = 1; p < n - 1; p++) {
            if (opts.r) {
                // full reflection from borders
                this._sea.water[p][0].x = this._sea.water[p][n - 1].x = this._sea.water[0][p].x = this._sea.water[n - 1][p].x = 0;
            } else {
                // absorption by boundaries (incomplete)
                this._sea.water[p][0].x = this._sea.water[p][1].x - this._sea.water[p][1].v;

                this._sea.water[p][n - 1].x = this._sea.water[p][n - 2].x - this._sea.water[p][n - 2].v;
                this._sea.water[0][p].x = this._sea.water[1][p].x - this._sea.water[1][p].v;
                this._sea.water[n - 1][p].x = this._sea.water[n - 2][p].x - this._sea.water[n - 2][p].v;
            }
        }

        // interior points
        for (let r = 1; r < n - 1; r++) {
            for (let c = 1; c < n - 1; c++) {
                // change v
                this._sea.water[r][c].v += this._sea.water[r][c].f;
                this._sea.water[r][c].v *= opts.w;
                // change x
                this._sea.water[r][c].x += this._sea.water[r][c].v;

                // rock
                if (!this._sea.water[r][c].free) {
                    // this.w[r][c].x = 0;

                    // eat energy
                    // this._sea.water[r][c].v = 0;
                    // this._sea.water[r][c].x = (this._sea.water[r-1][c].x + this._sea.water[r+1][c].x + this._sea.water[r][c+1].x + this._sea.water[r][c-1].x) / 4;

                    this._sea.water[r][c].v *= opts.w * opts.W_ROCK;
                    this._sea.water[r][c].x += this._sea.water[r][c].v;
                }
            }
        }
    }

    public initSea(options: IOptions): void {
        this._sea.chronos = -1;
        this._sea.water = [];
        for (let r = 0; r < options.n; r++) {
            let row = [];
            for (let c = 0; c < options.n; c++) {
                row.push({ x: 0, f: 0, v: 0, free: 1 });
            }
            this._sea.water.push(row);
        }
        this._sea.point = { row: 0, column: 0 };
        this._sea.n = options.n;
    }

    public clearSea(): void {
        if (this._sea) {
            this._sea.chronos = -1;
            this._sea.water = [];
            this.sea.oscillators = [];
            this.sea.isles = [];
        }
    }

    // замер плотности энергии в области {column, row, w, h}
    public energyDensity(o): any {
        let e = 0, n = 0;
        for (let r = o.row; r < o.row + o.width; r++) {
            for (let c = o.column; c < o.column + o.height; c++) {
                let dxr = this._sea.water[r][c].x - this._sea.water[r - 1][c].x;
                let dxc = this._sea.water[r][c].x - this._sea.water[r][c - 1].x;
                let v = this._sea.water[r][c].v;
                e += (dxr ** 2 + dxc ** 2) / 4 + v ** 2;
                n++;
            }
        }
        return e / n;
    }

    // замер энергии в целом
    public energyTotal(): any {
        let eP = 0, eC = 0;
        for (let r = 1; r < this._sea.n - 1; r++) {
            for (let c = 1; c < this._sea.n - 1; c++) {
                let dxr = this._sea.water[r][c].x - this._sea.water[r - 1][c].x;
                let dxc = this._sea.water[r][c].x - this._sea.water[r][c - 1].x;
                let v = this._sea.water[r][c].v;
                eP += (dxr ** 2 + dxc ** 2) / 4;
                eC += v ** 2;
            }
        }
        return { eP, eC };
    }
}
