export type Role = 'user' | 'admin';

export interface User {
    username: string;
    email: string;
    createdAt: string;
    level: number;
    exp: number;
    role: Role;
    isVerified: boolean;
    isBlocked: boolean;
    lastSeen: string;
}

export interface UserState {
    isAuthenticated: boolean;
    username: string;
    email: string;
    createdAt: string;
    level: number;
    exp: number;
    error: string;
    role: Role;
    isVerified: boolean;
}
