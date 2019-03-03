import { IOptions } from '../models/options';
import { IOptions3D } from '../models/options3D';
import { ISettings3D } from '../models/settings3D';

export const DEFAULT_SEA_2D_OPTIONS: IOptions = {
    D: 2,                           // triangle size for 3d visualize
    N: 500,                         // 3 * 167 = 501
    OMEGA: Number((0.2 / (2 * Math.PI)).toFixed(4)),  // 0.2 < OMEGA < 0.8
    W: 1,
    R: 0,
    _3d: false,
    _1d: false,
    W_ROCK: 1,
    kvisRange: 9
}

export const DEFAULT_SEA_3D_OPTIONS: IOptions3D = {
    cameraY: 0,
    cameraZ: 0,
    lightX: 0,
    lineIsleWidth: 1,
    meterRadius: 20,
}

export const DEFAULT_3D_SETTINGS: ISettings3D = {
    cameraRange: 0,
    lightRange: 0,
}

export const DEFAULT_SEA_1D_OPTIONS: IOptions = {
    N: 200,
    W: 1,
}

export const DEFAULT_SEA = {
    chronos: -1,
    oscillators: [],
    isles: [],
    water: [],
}
