import { LessonDoc, UserLessonProgressDoc } from '@/types/lessonsTypes';
import { Schema, model } from 'mongoose';

const LessonSchema = new Schema<LessonDoc>(
    {
        title: {
            type: String,
            required: true,
        },
        allowedChars: {
            type: String,
            required: true,
        },
        length: {
            type: Number,
            required: true,
            default: 60,
        },
        layout: {
            type: String,
            required: true,
        },
        cpmFor1: {
            type: Number,
            required: true,
        },
        cpmFor2: {
            type: Number,
            required: true,
        },
        cpmFor3: {
            type: Number,
            required: true,
        },
        minAccuracy: {
            type: Number,
            required: true,
            default: 90,
        },
        order: {
            type: Number,
            required: true,
        },
        prevLessonId: {
            type: Schema.Types.ObjectId,
            ref: 'Lesson',
            default: null,
        },
        nextLessonId: {
            type: Schema.Types.ObjectId,
            ref: 'Lesson',
            default: null,
        },
    },
    {
        timestamps: true,
    },
);

const UserLessonProgressSchema = new Schema<UserLessonProgressDoc>(
    {
        userId: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        lessonId: {
            type: Schema.Types.ObjectId,
            ref: 'Lesson',
            required: true,
        },
        stars: {
            type: Number,
            required: true,
            enum: [1, 2, 3],
        },
    },
    {
        timestamps: true,
    },
);

UserLessonProgressSchema.index({ userId: 1, lessonId: 1 }, { unique: true });

export const UserLessonProgress = model(
    'UserLessonProgress',
    UserLessonProgressSchema,
);
export const Lesson = model('Lesson', LessonSchema);
