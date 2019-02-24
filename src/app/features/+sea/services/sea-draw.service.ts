import { Injectable } from '@angular/core';
import { ISea2D } from '../models/sea';
import { IOptions } from '../models/options';

@Injectable()
export class SeaDrawService {

    constructor() { }

    public draw(sea: ISea2D, options: IOptions, canvasData: ImageData): void {
        const ROCK_COLOR = 160; // 0xa0

        for (let r = 0; r < options.N; r++) {
            for (let c = 0; c < options.N; c++) {
                let idx = (c + r * options.N) * 4;
                if (!sea.water[r][c].free) {
                    // draw free
                    canvasData.data[idx] = 1;  // red
                    canvasData.data[idx + 1] = ROCK_COLOR;  // green
                    // canvasData.data[idx + 2] = 0;  // blue
                    canvasData.data[idx + 3] = 255;  // alpha
                } else {
                    // define alpha
                    let color = sea.water[r][c].x * 2 ** options.kvisRange  | 0;
                    const maxColor = 127;
                    if (color > maxColor) color = maxColor;
                    if (color < -maxColor) color = -maxColor;
                    color += 127;
                    // draw water
                    canvasData.data[idx] = 0;  // red
                    // canvasData.data[idx + 1] = 0;  // green
                    canvasData.data[idx + 2] = 100;  // blue
                    canvasData.data[idx + 3] = color;  // alpha
                }
            }
        }
        // draw oscillators
        for (let o of sea.oscillators) {
            let idx = (o.column + o.row * options.N) * 4;
            // alpha
            canvasData.data[idx + 3] = 0;
            canvasData.data[idx + 3 + 4] = 0;
            canvasData.data[idx + 3 - 4] = 0;
            canvasData.data[idx + 3 + (4 * options.N)] = 0;
            canvasData.data[idx + 3 - (4 * options.N)] = 0;
        }
    }

    public draw1(sea: ISea2D, options: IOptions, context1d: CanvasRenderingContext2D): void {
        let r = sea.point.row;
        let c = sea.point.column;

        let ctx = context1d;
        ctx.clearRect(0, 0, options.N, options.N);
        ctx.strokeStyle = 'gray';
        ctx.lineWidth = 0.1;
        ctx.strokeRect(0, r, options.N - 1, 0);
        ctx.strokeRect(c, 0, 0, options.N - 1);

        ctx.lineWidth = 1;
        ctx.strokeStyle = 'red';
        ctx.beginPath();
        for (let c = 0; c < options.N; c++) {
            let h = sea.water[r][c].x * (2 ** options.kvisRange);
            ctx.moveTo(c, r);
            ctx.lineTo(c, r + 30 * h);
        }
        ctx.stroke();
    }
}
