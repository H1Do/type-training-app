import type { KeyCode } from '@/shared/types';
import { defineStore } from 'pinia';

export interface KeyboardStoreState {
    hintedKeyCode: KeyCode | '';
    pressedKeyCode: KeyCode | '';
    isShiftPressed: boolean;
    lastCorrectKeyCode: KeyCode | '';
    wasErrorRecently: boolean;
}

export const useKeyboardStore = defineStore('keyboard', {
    state: (): KeyboardStoreState => ({
        hintedKeyCode: '',
        pressedKeyCode: '',
        isShiftPressed: false,
        lastCorrectKeyCode: '',
        wasErrorRecently: false,
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

        onKeyDown(code: KeyCode) {
            if (code === 'ShiftLeft' || code === 'ShiftRight') {
                this.isShiftPressed = true;
                return;
            }

            this.pressedKeyCode = code;

            if (code === 'Backspace') {
                return;
            }

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
    },
});
