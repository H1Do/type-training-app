import { defineStore } from 'pinia';

export const useTrainingStore = defineStore('training', {
    state: () => ({
        sequence: [] as string[],
        currentIndex: 0,
        inputHistory: [] as { code: string; correct: boolean }[],
    }),

    getters: {
        currentSymbol(state): string {
            return state.sequence[state.currentIndex] || '';
        },

        isFinished(state): boolean {
            return state.currentIndex >= state.sequence.length;
        },
    },

    actions: {
        generateSequence(chars: string[], length = 20) {
            this.sequence = Array.from(
                { length },
                () => chars[Math.floor(Math.random() * chars.length)],
            );
            this.currentIndex = 0;
            this.inputHistory = [];
        },

        processKey(input: string) {
            if (this.isFinished) return;

            const expected = this.currentSymbol;
            const correct = input === expected;

            this.inputHistory.push({ code: input, correct });
            this.currentIndex++;
        },

        backspace() {
            if (this.inputHistory.length > 0) {
                this.inputHistory.pop();
                this.currentIndex--;
            }
        },

        reset() {
            this.sequence = [];
            this.currentIndex = 0;
            this.inputHistory = [];
        },
    },
});
