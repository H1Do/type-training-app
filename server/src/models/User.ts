import { UserDoc } from '@/types/userTypes';
import mongoose, { Schema } from 'mongoose';

const userSchema = new Schema<UserDoc>({
    username: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    isBlocked: { type: Boolean, default: false },
    isVerified: { type: Boolean, default: false },
    emailToken: { type: String },
    level: {
        type: Number,
        required: true,
        default: 1,
    },
    exp: {
        type: Number,
        required: true,
        default: 0,
    },
    role: {
        type: String,
        required: true,
        default: 'user',
    },
    lastSeen: {
        type: Date,
        default: Date.now,
    },
});

export const User = mongoose.model('User', userSchema);
