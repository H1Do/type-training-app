export interface User {
    username: string;
    email: string;
    createdAt: string;
    level: number;
    exp: number;
}

export interface UserState {
    isAuthenticated: boolean;
    username: string;
    email: string;
    createdAt: string;
    level: number;
    exp: number;
    error: string;
}
