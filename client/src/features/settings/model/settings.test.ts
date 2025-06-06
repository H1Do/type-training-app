import { setActivePinia, createPinia } from 'pinia';
import { useSettingsStore } from './settings';
import { Localization, Layout, Theme, Difficulty } from '@/shared/types';
import { describe, it, beforeEach, expect } from 'vitest';

const STORAGE_KEY = 'app_settings';

describe('useSettingsStore', () => {
    beforeEach(() => {
        localStorage.clear();
        setActivePinia(createPinia());
    });

    it('initializes with defaults if localStorage is empty', () => {
        const store = useSettingsStore();

        expect(store.localization).toBeDefined();
        expect(store.layout).toBe(Layout.QWERTY);
        expect(store.difficulty).toBe(Difficulty.Easy);
        expect([Theme.LIGHT, Theme.DARK]).toContain(store.theme);
    });

    it('loads saved settings from localStorage', () => {
        const saved = {
            localization: Localization.RU,
            layout: Layout.YCUKEN,
            theme: Theme.DARK,
            difficulty: Difficulty.Hard,
        };

        localStorage.setItem(STORAGE_KEY, JSON.stringify(saved));

        const store = useSettingsStore();

        expect(store.localization).toBe(Localization.RU);
        expect(store.layout).toBe(Layout.YCUKEN);
        expect(store.theme).toBe(Theme.DARK);
        expect(store.difficulty).toBe(Difficulty.Hard);
    });

    it('toggles theme', () => {
        const store = useSettingsStore();
        store.setTheme(Theme.LIGHT);
        store.toggleTheme();
        expect(store.theme).toBe(Theme.DARK);
        store.toggleTheme();
        expect(store.theme).toBe(Theme.LIGHT);
    });

    it('toggles localization', () => {
        const store = useSettingsStore();
        store.setLocalization(Localization.EN);
        store.toggleLocalization();
        expect(store.localization).toBe(Localization.RU);
        store.toggleLocalization();
        expect(store.localization).toBe(Localization.EN);
    });

    it('updates layout and saves to localStorage', () => {
        const store = useSettingsStore();
        store.setLayout(Layout.YCUKEN);
        expect(store.layout).toBe(Layout.YCUKEN);

        const saved = JSON.parse(localStorage.getItem(STORAGE_KEY)!);
        expect(saved.layout).toBe(Layout.YCUKEN);
    });

    it('updates difficulty and saves to localStorage', () => {
        const store = useSettingsStore();
        store.setDifficulty(Difficulty.Hard);
        expect(store.difficulty).toBe(Difficulty.Hard);

        const saved = JSON.parse(localStorage.getItem(STORAGE_KEY)!);
        expect(saved.difficulty).toBe(Difficulty.Hard);
    });
});
