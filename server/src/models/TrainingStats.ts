import { FingerStat, PerCharStat, TrainingStatsDoc } from '@/types/statsTypes';
import mongoose, { Schema } from 'mongoose';

const PerCharStatSchema = new Schema<PerCharStat>({
    char: { type: String, required: true },
    count: { type: Number, required: true },
    errorsCount: { type: Number, required: true },
    totalTime: { type: Number, required: true },
    averageReaction: { type: Number, required: true },
    accuracy: { type: Number, required: true },
});

const FingerSchema = new Schema<FingerStat>({
    finger: { type: String, required: true },
    chars: { type: [String], required: true },
    count: { type: Number, required: true },
    errorsCount: { type: Number, required: true },
    totalTime: { type: Number, required: true },
    averageReaction: { type: Number, required: true },
    accuracy: { type: Number, required: true },
});

const TrainingStatsSchema = new Schema<TrainingStatsDoc>({
    sessionId: {
        type: Schema.Types.ObjectId,
        ref: 'TrainingSession',
        required: true,
    },
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    mode: { type: String, required: true },
    layout: { type: String, required: true },
    accuracy: { type: Number, required: true },
    count: { type: Number, required: true },
    errorsCount: { type: Number, required: true },
    textErrorsCount: { type: Number, required: true },
    corrections: { type: Number, required: true },
    averageReaction: { type: Number, required: true },
    cpm: { type: Number, required: true },
    totalTime: { type: Number, required: true },
    perCharStats: { type: [PerCharStatSchema], default: [] },
    fingerStats: { type: [FingerSchema], default: [] },
    isRated: { type: Boolean, required: true },
    isLeaderboardEligible: { type: Boolean, required: true },
    createdAt: { type: Date, default: Date.now },
});

export const TrainingStats =
    mongoose.models.TrainingStats ||
    mongoose.model<TrainingStatsDoc>('TrainingStats', TrainingStatsSchema);
