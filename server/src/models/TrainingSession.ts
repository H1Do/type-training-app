import { TrainingSessionDoc } from '@/types/trainingTypes';
import mongoose, { Schema } from 'mongoose';

const trainingSessionSchema = new mongoose.Schema<TrainingSessionDoc>({
    userId: { type: String, required: true },
    mode: { type: String, required: true },
    layout: { type: String, required: true },
    sequence: { type: [String], required: true },
    input: { type: [String], default: [] },
    events: {
        type: [
            {
                type: {
                    type: String,
                    enum: ['input', 'backspace'],
                    required: true,
                },
                actual: String,
                expected: String,
                time: Number,
                timestamp: Number,
            },
        ],
        default: [],
    },
    startedAt: { type: Number },
    finishedAt: { type: Number },
    statsId: { type: Schema.Types.ObjectId, ref: 'TrainingStats' },
});

export const TrainingSession = mongoose.model(
    'TrainingSession',
    trainingSessionSchema,
);
