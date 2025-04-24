export interface User {
    username: string;
    email: string;
    createdAt: string;
}

export interface UserState {
    isAuthenticated: boolean;
    username: string;
    email: string;
    error: string;
    createdAt: string;
}
