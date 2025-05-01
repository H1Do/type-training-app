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

function loadSettings(): SettingsState {
    try {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (raw) {
            const parsed = JSON.parse(raw);
            return {
                localization: parsed.localization ?? Localization.EN,
                layout: parsed.layout ?? Layout.QWERTY,
                theme: parsed.theme ?? Theme.LIGHT,
                difficulty: parsed.difficulty ?? Difficulty.ZONE_HINTS,
            };
        }
    } catch (e) {
        console.warn('Failed to load settings from localStorage', e);
    }
    return {
        localization: Localization.EN,
        layout: Layout.QWERTY,
        theme: Theme.LIGHT,
        difficulty: Difficulty.ZONE_HINTS,
    };
}

function saveSettings(state: SettingsState) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

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
