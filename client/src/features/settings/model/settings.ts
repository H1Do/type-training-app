import { defineStore } from 'pinia';

export const enum Localization {
    RU = 'RU',
    EN = 'EN',
}

export const localizationNameMap = {
    [Localization.EN]: 'En',
    [Localization.RU]: 'Ру',
};

export const enum Layout {
    QWERTY = 'QWERTY',
    YCUKEN = 'YCUKEN',
}

export const layoutNameMap = {
    [Layout.QWERTY]: 'QWERTY',
    [Layout.YCUKEN]: 'ЙЦУКЕН',
};

interface SettingsState {
    localization: Localization;
    layout: Layout;
}

export const useSettingsStore = defineStore('settings', {
    state: (): SettingsState => ({
        localization: Localization.EN,
        layout: Layout.QWERTY,
    }),

    actions: {
        toggleLocalization() {
            this.localization =
                this.localization === Localization.EN
                    ? Localization.RU
                    : Localization.EN;
        },
        setLocalization(localization: Localization) {
            this.localization = localization;
        },
        setLayout(layout: Layout) {
            this.layout = layout;
        },
    },
});
