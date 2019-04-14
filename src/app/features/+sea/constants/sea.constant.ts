import { IOptions } from '../models/options';
import { IOptions3D } from '../models/options3D';
import { ISettings3D } from '../models/settings3D';
import { IOptions1D } from '../models/options1D';

export const DEFAULT_SEA_2D_OPTIONS: IOptions = {
    d: 2,                           // triangle size for 3d visualize
    n: 500,                         // 3 * 167 = 501
    omega: Number((0.2 / (2 * Math.PI)).toFixed(4)),  // 0.2 < OMEGA < 0.8
    w: 1,
    r: 0,
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

export const DEFAULT_SEA_1D_OPTIONS: IOptions1D = {
    n: 300,
    w: 1,
    km: 1,
    merge: 100,
    oscilOmega: 0.1,
}

export const DEFAULT_SEA = {
    chronos: -1,
    oscillators: [],
    isles: [],
    water: [],
}
