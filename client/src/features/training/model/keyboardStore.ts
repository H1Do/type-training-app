import type { KeyCode, KeyboardKey } from '@/shared/types';
import { defineStore } from 'pinia';

export const useKeyboardStore = defineStore('keyboard', {
    state: () => ({
        hintedKeyCode: '' as KeyCode | '',
        isShiftRequired: false,
        pressedKeyCode: '' as KeyCode | '',
        isShiftPressed: false,
        lastCorrectKeyCode: '' as KeyCode | '',
        wasErrorRecently: false,

        codeToKeyMap: new Map<string, KeyboardKey>(),
        symbolToKeyMap: new Map<string, KeyboardKey>(),
    }),

    getters: {
        isCorrect(state): boolean {
            return state.pressedKeyCode === state.hintedKeyCode;
        },
        isError(state): boolean {
            return state.wasErrorRecently;
        },
    },

    actions: {
        setHintedKey(code: KeyCode) {
            this.hintedKeyCode = code;
        },

        setIsShiftRequired(isShiftRequired: boolean) {
            this.isShiftRequired = isShiftRequired;
        },

        onKeyDown(code: KeyCode) {
            if (code === 'ShiftLeft' || code === 'ShiftRight') {
                this.isShiftPressed = true;
                return;
            }

            this.pressedKeyCode = code;

            if (code === 'Backspace') return;

            if (code === this.hintedKeyCode) {
                this.lastCorrectKeyCode = code;
                this.wasErrorRecently = false;
            } else {
                this.wasErrorRecently = true;
                setTimeout(() => {
                    this.wasErrorRecently = false;
                }, 200);
            }
        },

        onKeyUp(code: KeyCode) {
            if (code === 'ShiftLeft' || code === 'ShiftRight') {
                this.isShiftPressed = false;
                return;
            }

            if (this.pressedKeyCode === code) {
                this.pressedKeyCode = '';
            }

            if (this.lastCorrectKeyCode === code) {
                this.lastCorrectKeyCode = '';
            }
        },

        reset() {
            this.hintedKeyCode = '';
            this.pressedKeyCode = '';
            this.isShiftPressed = false;
            this.lastCorrectKeyCode = '';
            this.wasErrorRecently = false;
        },

        buildKeyMaps(layout: KeyboardKey[][]) {
            this.codeToKeyMap.clear();
            this.symbolToKeyMap.clear();

            for (const row of layout) {
                for (const key of row) {
                    this.codeToKeyMap.set(key.code, key);
                    this.symbolToKeyMap.set(key.lower, key);
                    this.symbolToKeyMap.set(key.upper, key);
                }
            }
        },

        getSymbolByCode(code: string): string | null {
            const key = this.codeToKeyMap.get(code);
            if (!key) return null;
            return this.isShiftPressed ? key.upper : key.lower;
        },

        getKeyBySymbol(symbol: string): KeyboardKey | null {
            return this.symbolToKeyMap.get(symbol) ?? null;
        },
    },
});
