import { IsleType } from './isle-type.enum';

export interface IIsle {
    id?: number,
    type?: IsleType,
    column?: number,
    row?: number,
    columnTo?: number,
    rowTo?: number,
    width?: number,
    height?: number,
    seaId?: number,
}