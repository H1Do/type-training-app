import { Layout, Localization, Theme, Difficulty } from '@/shared/types';
import { defineStore } from 'pinia';

export const localizationNameMap = {
    [Localization.EN]: 'En',
    [Localization.RU]: 'Ру',
};

export const layoutNameMap = {
    [Layout.QWERTY]: 'QWERTY',
    [Layout.YCUKEN]: 'ЙЦУКЕН',
};

interface SettingsState {
    localization: Localization;
    layout: Layout;
    theme: Theme;
    difficulty: Difficulty;
}

const STORAGE_KEY = 'app_settings';

const detectDefaultLocalization = (): Localization => {
    const lang = navigator.language.toLowerCase();

    if (lang.startsWith('ru')) return Localization.RU;
    return Localization.EN;
};

const detectDefaultTheme = (): Theme => {
    return window.matchMedia('(prefers-color-scheme: dark)').matches
        ? Theme.DARK
        : Theme.LIGHT;
};

const loadSettings = (): SettingsState => {
    try {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (raw) {
            const parsed = JSON.parse(raw);

            return {
                localization:
                    parsed.localization ?? detectDefaultLocalization(),
                layout: parsed.layout ?? Layout.QWERTY,
                theme: parsed.theme ?? detectDefaultTheme(),
                difficulty: parsed.difficulty ?? Difficulty.Easy,
            };
        }
    } catch (e) {
        console.warn('Failed to load settings from localStorage', e);
    }
    return {
        localization: detectDefaultLocalization(),
        layout: Layout.QWERTY,
        theme: detectDefaultTheme(),
        difficulty: Difficulty.Easy,
    };
};

const saveSettings = (state: SettingsState) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
};

export const useSettingsStore = defineStore('settings', {
    state: (): SettingsState => loadSettings(),

    actions: {
        toggleLocalization() {
            this.localization =
                this.localization === Localization.EN
                    ? Localization.RU
                    : Localization.EN;
            saveSettings(this.$state);
        },
        setLocalization(localization: Localization) {
            this.localization = localization;
            saveSettings(this.$state);
        },
        setLayout(layout: Layout) {
            this.layout = layout;
            saveSettings(this.$state);
        },
        setTheme(theme: Theme) {
            this.theme = theme;
            saveSettings(this.$state);
        },
        toggleTheme() {
            this.theme = this.theme === Theme.LIGHT ? Theme.DARK : Theme.LIGHT;
            saveSettings(this.$state);
        },
        setDifficulty(difficulty: Difficulty) {
            this.difficulty = difficulty;
            saveSettings(this.$state);
        },
    },
});
