import { defineStore } from 'pinia';

export enum Theme {
    LIGHT = 'light-theme',
    DARK = 'dark-theme',
}

export const useThemeStore = defineStore('theme', {
    state: () => ({
        theme: Theme.LIGHT,
    }),
    actions: {
        toggleTheme() {
            this.theme = this.theme === Theme.LIGHT ? Theme.DARK : Theme.LIGHT;
        },
    },
});
