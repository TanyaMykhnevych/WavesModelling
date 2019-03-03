import { Injectable } from '@angular/core';
import { ISea2D } from '../models/sea';
import { IOptions } from '../models/options';
import { IDisplay3DParameters } from '../models/display-3d-parameters';
import { IOptions3D } from '../models/options3D';

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
                    let color = sea.water[r][c].x * 2 ** options.kvisRange | 0;
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

    public draw3D(sea: ISea2D, options: IOptions, optionsZ: IOptions3D, displayParams: IDisplay3DParameters): void {
        let amp = 2 * options.kvisRange;

        const optz = optionsZ;

        let half = options.N / 2 | 0;
        displayParams.camera.position.set(half, half + optz.cameraY, optz.cameraZ);
        displayParams.camera.lookAt(half, half, 0);

        displayParams.light.position.set(optz.lightX, half, options.N);

        let v = displayParams.geometry.getAttribute('position').array;
        let d = options.D;
        let i = 0;
        for (let r_ = 0; r_ < options.N - d; r_ += d) {
            let r = options.N - d - r_;
            for (let c = 0; c < options.N - d; c += d) {
                // 1
                v[i] = c;
                v[i + 1] = r_;
                v[i + 2] = sea.water[r][c].x * amp;
                // 2
                v[i + 3] = c + d;
                v[i + 4] = r_;
                v[i + 5] = sea.water[r - d][c].x * amp;
                // 3
                v[i + 6] = c;
                v[i + 7] = r_ + d;
                v[i + 8] = sea.water[r][c + d].x * amp;
                // 3
                v[i + 9] = c;
                v[i + 10] = r_ + d;
                v[i + 11] = sea.water[r][c + d].x * amp;
                // 2
                v[i + 12] = c + d;
                v[i + 13] = r_;
                v[i + 14] = sea.water[r - d][c].x * amp;
                // 4
                v[i + 15] = c + d;
                v[i + 16] = r_ + d;
                v[i + 17] = sea.water[r - d][c + d].x * amp;
                i += 18;
            }
        }
        displayParams.geometry.getAttribute('position').needsUpdate = true;
        displayParams.geometry.computeVertexNormals();
        displayParams.renderer.render(displayParams.scene, displayParams.camera);
    }
}
