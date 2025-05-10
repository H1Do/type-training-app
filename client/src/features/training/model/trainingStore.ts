import { defineStore } from 'pinia';
import type { TrainingApi } from '@/shared/api/trainingApi';
import { TrainingMode, type TrainingSession } from '@/shared/types/training';
import TrainingSummaryModal from '../ui/TrainingSummaryModal.vue';
import { useSettingsStore } from '@/features/settings';
import type { Finger } from '@/shared/types';
import { AxiosError } from 'axios';

interface TrainingSessionState extends TrainingSession {
    startedAt: number;
    finishedAt: number | null;
}

export interface InputEventRecord {
    type: 'input' | 'backspace';
    actual?: string;
    expected?: string;
    time: number;
    timestamp: number;
    finger: Finger | null;
}

export const useTrainingStore = defineStore('training', {
    state: () => ({
        sequence: [] as string[],
        session: null as TrainingSessionState | null,
        input: [] as string[],
        events: [] as InputEventRecord[],
        lastInputTimestamp: 0,
        mode:
            (localStorage.getItem('training-mode') as TrainingMode) ??
            TrainingMode.Letters,
        customText: undefined as string | undefined,
        customLength: undefined as number | undefined,
        customIsWords: undefined as boolean | undefined,
    }),

    getters: {
        currentIndex: (state) => state.input.length,

        currentSymbol: (state) => state.sequence[state.input.length] || '',

        isFinished: (state) =>
            state.sequence.length > 0 &&
            state.input.length >= state.sequence.length,

        undoCount: (state) =>
            state.events.filter((e) => e.type === 'backspace').length,

        duration: (state) => {
            if (!state.session || !state.session.startedAt) return 0;
            return (
                (state.session.finishedAt ?? Date.now()) -
                state.session.startedAt
            );
        },

        isCustomMode: (state) => state.mode === TrainingMode.Custom,

        isCustomSettingsSet: (state) => {
            return !!state.customText?.length && !!state.customLength;
        },
    },

    actions: {
        setMode(mode: TrainingMode) {
            this.mode = mode;
            localStorage.setItem('training-mode', mode);
            this.customText = undefined;
            this.customLength = undefined;
            this.customIsWords = undefined;
        },

        setCustomText(text: string) {
            this.customText = text;
        },

        setCustomLength(length: number) {
            this.customLength = length;
        },

        setCustomIsWords(isWords: boolean) {
            this.customIsWords = isWords;
        },

        async start() {
            const settingsStore = useSettingsStore();

            if (this.isCustomMode && !this.isCustomSettingsSet) {
                this.reset();
                return;
            }

            try {
                const session = await this.trainingApi.startSession(
                    this.mode,
                    settingsStore.layout,
                    this.customText,
                    this.customLength,
                    this.customIsWords || undefined,
                );

                this.sequence = session.sequence;
                this.input = [];
                this.events = [];
                this.lastInputTimestamp = 0;

                this.session = {
                    id: session.id,
                    sequence: session.sequence,
                    startedAt: 0,
                    finishedAt: null,
                };
            } catch (error) {
                if (error instanceof AxiosError) {
                    const message = error?.response?.data?.message;
                    this.messageService.error(message);
                }
            }
        },

        async finish() {
            if (!this.session) return;

            const settingsStore = useSettingsStore();

            const result = {
                sessionId: this.session.id,
                startedAt: this.session.startedAt,
                finishedAt: Date.now(),
                input: this.input,
                events: this.events,
                layout: settingsStore.layout,
                mode: this.mode,
            };

            this.session.finishedAt = result.finishedAt;

            try {
                const response = await this.trainingApi.finishSession(result);

                await this.modalService.open(TrainingSummaryModal, {
                    stats: response.stats,
                });
            } catch (error) {
                if (error instanceof AxiosError) {
                    const message = error?.response?.data?.message;
                    this.messageService.error(message);
                }
            }
        },

        async processKey(inputChar: string, finger: Finger | null) {
            if (this.isFinished) return;

            const now = performance.now();

            if (!this.session) {
                this.start();
                return;
            }

            if (this.session.startedAt === 0) {
                this.session.startedAt = Date.now();
            }

            const expected = this.sequence[this.input.length] || '';
            const time = this.lastInputTimestamp
                ? now - this.lastInputTimestamp
                : 0;

            this.input.push(inputChar);
            this.events.push({
                type: 'input',
                actual: inputChar,
                expected,
                time,
                timestamp: now,
                finger,
            });

            this.lastInputTimestamp = now;

            if (
                this.input.length >= this.sequence.length &&
                this.session &&
                !this.session.finishedAt
            ) {
                await this.finish();
            }
        },

        backspace() {
            if (this.input.length === 0) return;

            this.input.pop();

            const now = performance.now();
            const time = this.lastInputTimestamp
                ? now - this.lastInputTimestamp
                : 0;

            this.events.push({
                type: 'backspace',
                time,
                timestamp: now,
                finger: null,
            });

            this.lastInputTimestamp = now;
        },

        reset() {
            this.sequence = [];
            this.session = null;
            this.input = [];
            this.events = [];
            this.lastInputTimestamp = 0;
        },

        setApi(api: TrainingApi) {
            this.trainingApi = api;
        },
    },
});
