import { Request } from 'express';

export interface AuthRequest extends Request {
    body: {
        username?: string;
        password?: string;
        email?: string;
    };
    user?: {
        id: string;
    };
}
