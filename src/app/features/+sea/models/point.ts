export interface IPoint {
    row?: number,
    column?: number,
    x?: number,
    f?: number,
    v?: number,
    free?: boolean,
    w?: number;
    km?: number;
    a?: number;
}

// W - потери (1 - потерь нет)
// Km = модуль упругости / масса узла
// скорость распространения волны ~ Km ** 0.5 и не зависит от частоты осциллятора
// Km - скорость пропорциональна корню из Km