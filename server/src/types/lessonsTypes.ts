import { Document, Types } from 'mongoose';
import { Layout } from '@/types/keyboardTypes';

export interface LessonDoc extends Document {
    title: string;
    allowedChars: string;
    length: number;
    layout: Layout;
    cpmFor1: number;
    cpmFor2: number;
    cpmFor3: number;
    minAccuracy: number;
    order: number;
    createdAt: Date;
    updatedAt: Date;
}

export interface UserLessonProgressDoc extends Document {
    userId: Types.ObjectId;
    lessonId: Types.ObjectId;
    stars: 1 | 2 | 3;
    createdAt: Date;
    updatedAt: Date;
}
