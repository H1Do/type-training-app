import { Document } from 'mongoose';

export interface UserDto {
    id: string;
    username: string;
    email: string;
    createdAt: Date;
    level: number;
    exp: number;
}

export interface UserDoc extends Document {
    username: string;
    password: string;
    email: string;
    createdAt: Date;
    level: number;
    exp: number;
}
