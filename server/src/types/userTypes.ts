import { Document } from 'mongoose';

export interface UserDto {
    id: string;
    username: string;
    email: string;
    createdAt: Date;
    level: number;
    exp: number;
    isVerified: boolean;
}

export interface UserDoc extends Document {
    username: string;
    password: string;
    email: string;
    createdAt: Date;
    isVerified: boolean;
    emailToken?: string;
    level: number;
    exp: number;
}
