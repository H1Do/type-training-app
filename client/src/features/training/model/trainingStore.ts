import { defineStore } from 'pinia';
import type { TrainingApi } from '@/shared/api/trainingApi';
import {
    TrainingMode,
    type TrainingSession,
    type TrainingStats,
} from '@/shared/types/training';
import TrainingSummaryModal from '../ui/TrainingSummaryModal.vue';
import { useSettingsStore } from '@/features/settings';

interface TrainingSessionState extends TrainingSession {
    startedAt: number;
    finishedAt: number | null;
}

interface InputEventRecord {
    type: 'input' | 'backspace';
    actual?: string;
    expected?: string;
    time: number;
    timestamp: number;
}

export const useTrainingStore = defineStore('training', {
    state: () => ({
        sequence: [] as string[],
        session: null as TrainingSessionState | null,
        input: [] as string[],
        events: [] as InputEventRecord[],
        lastInputTimestamp: 0,
        stats: null as TrainingStats | null,
        mode:
            (localStorage.getItem('training-mode') as TrainingMode) ??
            TrainingMode.Letters,
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
    },

    actions: {
        setMode(mode: TrainingMode) {
            this.mode = mode;
            localStorage.setItem('training-mode', mode);
        },

        async prepare() {
            const settingsStore = useSettingsStore();

            this.sequence = await this.trainingApi.prepareSequence(
                this.mode,
                settingsStore.layout,
            );
            this.input = [];
            this.events = [];
            this.lastInputTimestamp = 0;
            this.session = null;
        },

        async start() {
            if (this.sequence.length === 0) return;

            const session = await this.trainingApi.startSession(
                this.mode,
                this.sequence,
            );

            this.session = {
                id: session.id,
                sequence: session.sequence,
                startedAt: Date.now(),
                finishedAt: null,
            };
        },

        async finish() {
            if (!this.session) return;

            const result = {
                sessionId: this.session.id,
                startedAt: this.session.startedAt,
                finishedAt: Date.now(),
                input: this.input,
                events: this.events,
            };

            this.session.finishedAt = result.finishedAt;

            const response = await this.trainingApi.finishSession(result);
            this.stats = response.stats;

            await this.modalService.open(TrainingSummaryModal, {
                stats: response.stats,
            });
        },

        async processKey(inputChar: string) {
            if (this.isFinished) return;

            const now = performance.now();

            if (!this.session) {
                this.start();
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
            });

            this.lastInputTimestamp = now;
        },

        reset() {
            this.sequence = [];
            this.session = null;
            this.input = [];
            this.events = [];
            this.lastInputTimestamp = 0;
            this.setMode(TrainingMode.Letters);
        },

        setApi(api: TrainingApi) {
            this.trainingApi = api;
        },
    },
});
