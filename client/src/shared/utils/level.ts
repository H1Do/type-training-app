export const expTable: number[] = [
    0, 100, 250, 450, 700, 1000, 1350, 1750, 2200, 2700,
];

export const MAX_LEVEL = 10;

export function getExpForLevel(level: number): number {
    if (level < 1 || level >= MAX_LEVEL) return Infinity;
    return expTable[level];
}
