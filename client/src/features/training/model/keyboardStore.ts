import { defineStore } from 'pinia';

export const useKeyboardStore = defineStore('keyboard', {
    state: () => ({
        hintedKeyCode: '' as string,
        pressedKeyCode: '' as string,
        isShiftPressed: false,
    }),

    getters: {
        isCorrect(state): boolean {
            return state.pressedKeyCode === state.hintedKeyCode;
        },

        isError(state): boolean {
            return (
                state.pressedKeyCode !== '' &&
                state.pressedKeyCode !== state.hintedKeyCode
            );
        },
    },

    actions: {
        setHintedKey(code: string) {
            this.hintedKeyCode = code;
            this.pressedKeyCode = '';
        },

        pressKey(code: string) {
            this.pressedKeyCode = code;
        },

        handleKeyDown(code: string) {
            if (code === 'ShiftLeft' || code === 'ShiftRight') {
                this.isShiftPressed = true;
            }
            this.pressKey(code);
        },

        handleKeyUp(code: string) {
            if (code === 'ShiftLeft' || code === 'ShiftRight') {
                this.isShiftPressed = false;
            }

            if (code === this.pressedKeyCode) {
                this.pressedKeyCode = '';
            }
        },

        reset() {
            this.hintedKeyCode = '';
            this.pressedKeyCode = '';
            this.isShiftPressed = false;
        },
    },
});
