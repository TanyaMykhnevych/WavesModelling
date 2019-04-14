export interface IOptions1D {
    n: number,
    w: number,
    km: number,
    merge: number,
    oscilOmega?: number
}

// W - потери (1 - потерь нет)
// Km = модуль упругости / масса узла
// скорость распространения волны ~ Km ** 0.5 и не зависит от частоты осциллятора
// Km - скорость пропорциональна корню из Km
// oscilOmega - частота осциллятора
