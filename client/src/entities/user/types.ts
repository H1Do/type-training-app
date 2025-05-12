export interface User {
    username: string;
    email: string;
    createdAt: string;
    level: number;
    exp: number;
    isVerified: boolean;
}

export interface UserState {
    isAuthenticated: boolean;
    username: string;
    email: string;
    createdAt: string;
    level: number;
    exp: number;
    error: string;
    isVerified: boolean;
}
