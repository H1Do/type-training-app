import { UserDoc } from '@/types/userTypes';

export const expTable: number[] = [
    0, 100, 250, 450, 700, 1000, 1350, 1750, 2200, 2700,
];

export const MAX_LEVEL = 10;

export function getExpForLevel(level: number): number {
    if (level < 1 || level >= MAX_LEVEL) return Infinity;
    return expTable[level];
}

export function calculateExp({
    cpm,
    accuracy,
    charCount,
}: {
    cpm: number;
    accuracy: number;
    charCount: number;
}): number {
    const base = charCount / 20;
    const accuracyFactor = Math.max(0, accuracy / 100);
    const speedFactor = Math.min(1, cpm / 300);

    const result = base * accuracyFactor * speedFactor * 5;

    return Math.max(1, Math.round(result));
}

export function addExpToUser(user: UserDoc, expGained: number) {
    user.exp += expGained;

    while (user.level < MAX_LEVEL && user.exp >= getExpForLevel(user.level)) {
        user.exp -= getExpForLevel(user.level);
        user.level += 1;
    }

    if (user.level >= MAX_LEVEL) {
        user.level = MAX_LEVEL;
        user.exp = 0;
    }

    return {
        newLevel: user.level,
        currentExp: user.exp,
        requiredExp: getExpForLevel(user.level),
    };
}
