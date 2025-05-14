import { Document } from 'mongoose';

export type Role = 'user' | 'admin';

export interface UserDto {
    id: string;
    username: string;
    email: string;
    createdAt: Date;
    level: number;
    exp: number;
    isBlocked: boolean;
    isVerified: boolean;
    role: 'user' | 'admin';
    lastSeen: Date;
}

export interface UserDoc extends Document {
    username: string;
    password: string;
    email: string;
    createdAt: Date;
    isBlocked: boolean;
    isVerified: boolean;
    emailToken?: string;
    level: number;
    exp: number;
    role: Role;
    lastSeen: Date;
}
