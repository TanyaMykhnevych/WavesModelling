export interface IOptions {
    D?: number,
    N?: number,
    OMEGA?: number,
    W?: number,
    R?: number,
    _3d?: boolean,
    _1d?: boolean,
    W_ROCK?: number,
}




// let opts = {
//     D: 2,                           // triangle size for 3d visualize
//     N: 500,                         // 3 * 167 = 501
//     OMEGA: (0.2 / (2 * Math.PI)).toFixed(4),  // 0.2 < OMEGA < 0.8
//     W: 1,
//     R: 0,
//     _3d: 0,
//     _1d: 0,
//     W_ROCK: 1,

//     stringify() {
//         return `"D": ${this.D},
// "N": ${this.N},
// "W": ${this.W},
// "R": ${this.R},
// "OMEGA": ${this.OMEGA},
// "_3d": ${this._3d},
// "_1d": ${this._1d},
// "W_ROCK": ${this.W_ROCK}`;
//     },

//     parse() {
//         let obj = JSON.parse("{" + optsArea.value + "}");
//         obj.N = Math.round(obj.N / obj.D) * obj.D;
//         obj.OMEGA = obj.OMEGA.toFixed(4);

//         let resetNeeded =
//             this._3d !== obj._3d ||
//             this.N !== obj.N ||
//             this.D !== obj.D;
//         Object.assign(this, obj);
//         return resetNeeded;
//     }
// };


// let optz = {
//     Kvis: 2 ** 9,                     // 2d visualise coefficient
//     Kvis3d: 2 * 9,                    // 3d visualise coefficient
//     cameraY: 0,
//     cameraZ: opts.N * Math.cos(cameraRange.value),
//     lightX: lightRange.value * opts.N / 2,
//     lineIsleWidth: 1,               // width of the line isle
//     meterRadius: 20,
// };

