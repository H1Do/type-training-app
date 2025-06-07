import { describe, it, expect, vi, beforeEach, Mock } from 'vitest';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { Response, NextFunction } from 'express';
import { userController } from './userController';
import { transporter } from '@/utils/mailer';
import { isPasswordStrong } from '@/utils/user';
import { ApiError } from '../errors/ApiError';
import { User } from '../models/User';

vi.mock('bcryptjs');
vi.mock('jsonwebtoken');
vi.mock('../models/User', () => ({
    User: {
        findOne: vi.fn(),
        findById: vi.fn(),
        prototype: { save: vi.fn() },
    },
}));
vi.mock('@/utils/mailer', () => ({
    transporter: { sendMail: vi.fn() },
}));
vi.mock('@/utils/email', () => ({
    getResetPasswordHtml: vi.fn().mockReturnValue('<reset>'),
    getVerifyEmailHtml: vi.fn().mockReturnValue('<verify>'),
}));
vi.mock('@/utils/user', () => ({
    isPasswordStrong: vi.fn(),
}));
vi.mock('../models/User', () => {
    class MockUser {
        _id: any;
        username: any;
        password: any;
        email: any;
        isBlocked: any;
        isVerified: any;
        role: any;
        level: any;
        exp: any;
        createdAt: any;
        lastSeen: any;
        emailToken: any;
        save = vi.fn();
        constructor(data: any) {
            Object.assign(this, data);
        }
    }
    (MockUser as any).findOne = vi.fn();
    (MockUser as any).findById = vi.fn();
    return {
        default: MockUser,
        User: MockUser,
    };
});

describe('UserController.registration', () => {
    let res: Partial<Response>;
    let next: NextFunction;

    beforeEach(() => {
        vi.clearAllMocks();
        res = {
            status: vi.fn().mockReturnThis(),
            json: vi.fn(),
            cookie: vi.fn(),
        };
        next = vi.fn();
        process.env.JWT_SECRET = 'jwt';
        process.env.EMAIL_JWT_SECRET = 'emailjwt';
        process.env.CLIENT_URL = 'http://client';
    });

    it('errors when missing fields', async () => {
        const req: any = { body: { username: 'u' }, t: (k: string) => k };
        await userController.registration(req, res as Response, next);
        expect(next).toHaveBeenCalled();
        const err = (next as Mock).mock.calls[0][0] as ApiError;
        expect(err.status).toBe(400);
    });

    it('errors on invalid field types', async () => {
        (isPasswordStrong as Mock).mockReturnValue(false);
        const req: any = {
            body: { username: 'us', password: 'weak', email: 'no-at' },
            t: (k: string) => k,
        };
        await userController.registration(req, res as Response, next);
        expect(next).toHaveBeenCalled();
    });

    it('errors when email already exists', async () => {
        (isPasswordStrong as Mock).mockReturnValue(true);
        (User.findOne as Mock).mockResolvedValue({ _id: 'x' });
        const req: any = {
            body: {
                username: 'user',
                password: 'StrongP@ss1',
                email: 'e@e.com',
            },
            t: (k: string) => k,
        };
        await userController.registration(req, res as Response, next);
        expect(next).toHaveBeenCalled();
        const err = (next as Mock).mock.calls[0][0] as ApiError;
        expect(err.status).toBe(400);
    });

    it('registers successfully', async () => {
        (isPasswordStrong as Mock).mockReturnValue(true);
        (User.findOne as Mock).mockResolvedValue(null);
        (bcrypt.hash as Mock).mockResolvedValue('hashed');
        (User as any).prototype.save = vi.fn().mockResolvedValue(undefined);
        (jwt.sign as Mock).mockReturnValue('emailToken');
        const req: any = {
            body: {
                username: 'user',
                password: 'StrongP@ss1',
                email: 'e@e.com',
            },
            t: (k: string) => k,
        };
        await userController.registration(req, res as Response, next);
        expect(User.findOne).toHaveBeenCalledWith({ email: 'e@e.com' });
        expect(bcrypt.hash).toHaveBeenCalledWith('StrongP@ss1', 10);
        expect(transporter.sendMail).toHaveBeenCalled();
        expect(res.cookie).toHaveBeenCalledWith(
            'token',
            expect.any(String),
            expect.objectContaining({ httpOnly: true }),
        );
        expect(res.status).toHaveBeenCalledWith(201);
        expect(res.json).toHaveBeenCalledWith({
            message: 'messages.registration_success',
        });
    });
});

describe('UserController.login', () => {
    let res: Partial<Response>;
    let next: NextFunction;

    beforeEach(() => {
        vi.clearAllMocks();
        res = {
            status: vi.fn().mockReturnThis(),
            json: vi.fn(),
            cookie: vi.fn(),
        };
        next = vi.fn();
        process.env.JWT_SECRET = 'jwt';
    });

    it('errors when missing fields', async () => {
        const req: any = { body: { email: 'e@e.com' }, t: (k: string) => k };
        await userController.login(req, res as Response, next);
        expect(next).toHaveBeenCalled();
    });

    it('errors when user not found', async () => {
        (User.findOne as Mock).mockResolvedValue(null);
        const req: any = {
            body: { email: 'e@e.com', password: 'pass1234' },
            t: (k: string) => k,
        };
        await userController.login(req, res as Response, next);
        expect(next).toHaveBeenCalled();
    });

    it('errors when user blocked', async () => {
        (User.findOne as Mock).mockResolvedValue({
            password: 'h',
            isBlocked: true,
        });
        const req: any = {
            body: { email: 'e@e.com', password: 'pass1234' },
            t: (k: string) => k,
        };
        await userController.login(req, res as Response, next);
        expect(next).toHaveBeenCalled();
        const err = (next as Mock).mock.calls[0][0] as ApiError;
        expect(err.status).toBe(403);
    });

    it('errors on invalid field types', async () => {
        (User.findOne as Mock).mockResolvedValue({
            password: 'h',
            isBlocked: false,
        });
        const req: any = {
            body: { email: 'invalid', password: 'short' },
            t: (k: string) => k,
        };
        await userController.login(req, res as Response, next);
        expect(next).toHaveBeenCalled();
    });

    it('errors on wrong password', async () => {
        (User.findOne as Mock).mockResolvedValue({
            password: 'hashed',
            isBlocked: false,
        });
        (bcrypt.compare as Mock).mockResolvedValue(false);
        const req: any = {
            body: { email: 'e@e.com', password: 'wrongPass' },
            t: (k: string) => k,
        };
        await userController.login(req, res as Response, next);
        expect(next).toHaveBeenCalled();
    });

    it('logs in successfully', async () => {
        (User.findOne as Mock).mockResolvedValue({
            password: 'hashed',
            isBlocked: false,
            _id: 'uid',
        });
        (bcrypt.compare as Mock).mockResolvedValue(true);
        (jwt.sign as Mock).mockReturnValue('token');
        const req: any = {
            body: { email: 'e@e.com', password: 'pass1234' },
            t: (k: string) => k,
        };
        await userController.login(req, res as Response, next);
        expect(res.cookie).toHaveBeenCalled();
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({
            message: 'messages.login_success',
        });
    });
});

describe('UserController.logout', () => {
    it('clears cookie', async () => {
        const res: any = {
            clearCookie: vi.fn(),
            status: vi.fn().mockReturnThis(),
            json: vi.fn(),
        };
        const next = vi.fn();
        await userController.logout({} as any, res as Response, next);
        expect(res.clearCookie).toHaveBeenCalledWith('token');
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({
            message: 'User logged out successfully',
        });
    });
});

describe('UserController.changePassword', () => {
    let res: Partial<Response>;
    let next: NextFunction;

    beforeEach(() => {
        vi.clearAllMocks();
        res = { status: vi.fn().mockReturnThis(), json: vi.fn() };
        next = vi.fn();
        (isPasswordStrong as Mock).mockReturnValue(true);
    });

    it('errors when missing fields', async () => {
        const req: any = { body: { oldPassword: 'old' }, t: (k: string) => k };
        await userController.changePassword(req, res as Response, next);
        expect(next).toHaveBeenCalled();
    });

    it('errors on weak new password', async () => {
        (isPasswordStrong as Mock).mockReturnValue(false);
        const req: any = {
            body: { oldPassword: 'oldstrong', newPassword: 'weak' },
            user: { id: 'u1' },
            t: (k: string) => k,
        };
        await userController.changePassword(req, res as Response, next);
        expect(next).toHaveBeenCalled();
    });

    it('errors when unauthorized', async () => {
        const req: any = {
            body: { oldPassword: 'oldstrong', newPassword: 'Strong1!' },
            user: null,
            t: (k: string) => k,
        };
        await userController.changePassword(req, res as Response, next);
        expect(next).toHaveBeenCalled();
    });

    it('errors when user not found', async () => {
        (User.findById as Mock).mockResolvedValue(null);
        const req: any = {
            body: { oldPassword: 'oldstrong', newPassword: 'Strong1!' },
            user: { id: 'u1' },
            t: (k: string) => k,
        };
        await userController.changePassword(req, res as Response, next);
        expect(next).toHaveBeenCalled();
    });

    it('errors on wrong old password', async () => {
        (User.findById as Mock).mockResolvedValue({
            password: 'hashed',
            save: vi.fn(),
        });
        (bcrypt.compare as Mock).mockResolvedValue(false);
        const req: any = {
            body: { oldPassword: 'wrong', newPassword: 'Strong1!' },
            user: { id: 'u1' },
            t: (k: string) => k,
        };
        await userController.changePassword(req, res as Response, next);
        expect(next).toHaveBeenCalled();
    });

    it('changes password successfully', async () => {
        const mockUser: any = { password: 'hashed', save: vi.fn() };
        (User.findById as Mock).mockResolvedValue(mockUser);
        (bcrypt.compare as Mock).mockResolvedValue(true);
        (bcrypt.hash as Mock).mockResolvedValue('newhashed');
        const req: any = {
            body: { oldPassword: 'StrongOld1', newPassword: 'StrongNew1!' },
            user: { id: 'u1' },
            t: (k: string) => k,
        };
        await userController.changePassword(req, res as Response, next);
        expect(mockUser.save).toHaveBeenCalled();
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({
            message: 'messages.password_change_success',
        });
    });
});

describe('UserController.getUser', () => {
    let res: Partial<Response>;
    let next: NextFunction;

    beforeEach(() => {
        vi.clearAllMocks();
        res = { status: vi.fn().mockReturnThis(), json: vi.fn() };
        next = vi.fn();
    });

    it('errors when unauthorized', async () => {
        const req: any = { user: null, t: (k: string) => k };
        await userController.getUser(req, res as Response, next);
        expect(next).toHaveBeenCalled();
    });

    it('errors when user not found', async () => {
        (User.findById as Mock).mockResolvedValue(null);
        const req: any = { user: { id: 'u1' }, t: (k: string) => k };
        await userController.getUser(req, res as Response, next);
        expect(next).toHaveBeenCalled();
    });

    it('errors when blocked', async () => {
        (User.findById as Mock).mockResolvedValue({ isBlocked: true });
        const req: any = { user: { id: 'u1' }, t: (k: string) => k };
        await userController.getUser(req, res as Response, next);
        expect(next).toHaveBeenCalled();
    });

    it('returns user DTO on success', async () => {
        const userObj = {
            _id: 'u1',
            username: 'usr',
            email: 'e@e.com',
            createdAt: new Date(),
            level: 1,
            exp: 10,
            isBlocked: false,
            isVerified: true,
            role: 'user',
            lastSeen: new Date(),
        };
        (User.findById as Mock).mockResolvedValue(userObj);
        const req: any = { user: { id: 'u1' }, t: (k: string) => k };
        await userController.getUser(req, res as Response, next);
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({
            id: 'u1',
            username: 'usr',
            email: 'e@e.com',
            createdAt: userObj.createdAt,
            level: 1,
            exp: 10,
            isBlocked: false,
            isVerified: true,
            role: 'user',
            lastSeen: userObj.lastSeen,
        });
    });
});

describe('UserController.verifyEmail', () => {
    let res: Partial<Response>;
    let next: NextFunction;

    beforeEach(() => {
        vi.clearAllMocks();
        res = { status: vi.fn().mockReturnThis(), json: vi.fn() };
        next = vi.fn();
        process.env.EMAIL_JWT_SECRET = 'emailjwt';
    });

    it('errors on invalid token', async () => {
        (jwt.verify as Mock).mockImplementation(() => {
            throw new Error();
        });
        const req: any = { query: { token: 'bad' }, t: (k: string) => k };
        await userController.verifyEmail(req, res as Response, next);
        expect(res.status).toHaveBeenCalledWith(400);
    });

    it('errors when user not found or already verified', async () => {
        (jwt.verify as Mock).mockReturnValue({ id: 'u1' });
        (User.findById as Mock).mockResolvedValue(null);
        const req: any = { query: { token: 'good' }, t: (k: string) => k };
        await userController.verifyEmail(req, res as Response, next);
        expect(res.status).toHaveBeenCalledWith(400);
    });

    it('verifies successfully', async () => {
        const mockUser: any = { isVerified: false, save: vi.fn() };
        (jwt.verify as Mock).mockReturnValue({ id: 'u1' });
        (User.findById as Mock).mockResolvedValue(mockUser);
        const req: any = { query: { token: 'good' }, t: (k: string) => k };
        await userController.verifyEmail(req, res as Response, next);
        expect(mockUser.save).toHaveBeenCalled();
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({
            message: 'messages.email_verified',
        });
    });
});

describe('UserController.requestPasswordReset', () => {
    let res: Partial<Response>;
    let next: NextFunction;

    beforeEach(() => {
        vi.clearAllMocks();
        res = { status: vi.fn().mockReturnThis(), json: vi.fn() };
        next = vi.fn();
        process.env.RESET_JWT_SECRET = 'resjwt';
        process.env.CLIENT_URL = 'http://client';
    });

    it('errors on invalid email', async () => {
        const req: any = { body: { email: 'invalid' }, t: (k: string) => k };
        await userController.requestPasswordReset(req, res as Response, next);
        expect(next).toHaveBeenCalled();
    });

    it('returns generic message when user not found or unverified', async () => {
        (User.findOne as Mock).mockResolvedValue(null);
        const req: any = { body: { email: 'e@e.com' }, t: (k: string) => k };
        await userController.requestPasswordReset(req, res as Response, next);
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({
            message: 'messages.reset_email_sent',
        });
    });

    it('sends reset email successfully', async () => {
        (User.findOne as Mock).mockResolvedValue({
            _id: 'u1',
            email: 'e@e.com',
            isVerified: true,
        });
        (jwt.sign as Mock).mockReturnValue('resetToken');
        const req: any = { body: { email: 'e@e.com' }, t: (k: string) => k };
        await userController.requestPasswordReset(req, res as Response, next);
        expect(transporter.sendMail).toHaveBeenCalledWith(
            expect.objectContaining({
                to: 'e@e.com',
                html: '<reset>',
            }),
        );
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({
            message: 'messages.reset_email_sent',
        });
    });
});

describe('UserController.resetPassword', () => {
    let res: Partial<Response>;
    let next: NextFunction;

    beforeEach(() => {
        vi.clearAllMocks();
        res = { status: vi.fn().mockReturnThis(), json: vi.fn() };
        next = vi.fn();
        process.env.RESET_JWT_SECRET = 'resjwt';
        (isPasswordStrong as Mock).mockReturnValue(true);
    });

    it('errors on invalid fields', async () => {
        const req: any = {
            body: { token: '', newPassword: 'weak' },
            t: (k: string) => k,
        };
        await userController.resetPassword(req, res as Response, next);
        expect(next).toHaveBeenCalled();
    });

    it('errors on invalid token', async () => {
        (jwt.verify as Mock).mockImplementation(() => {
            throw new Error();
        });
        const req: any = {
            body: { token: 'bad', newPassword: 'Strong1!' },
            t: (k: string) => k,
        };
        await userController.resetPassword(req, res as Response, next);
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({
            message: 'errors.invalid_or_expired_token',
        });
    });

    it('errors when user not found', async () => {
        (jwt.verify as Mock).mockReturnValue({ id: 'u1' });
        (User.findById as Mock).mockResolvedValue(null);
        const req: any = {
            body: { token: 'good', newPassword: 'Strong1!' },
            t: (k: string) => k,
        };
        await userController.resetPassword(req, res as Response, next);
        expect(next).toHaveBeenCalled();
    });

    it('resets password successfully', async () => {
        const mockUser: any = { save: vi.fn() };
        (jwt.verify as Mock).mockReturnValue({ id: 'u1' });
        (User.findById as Mock).mockResolvedValue(mockUser);
        (bcrypt.hash as Mock).mockResolvedValue('newhashed');
        const req: any = {
            body: { token: 'good', newPassword: 'Strong1!' },
            t: (k: string) => k,
        };
        await userController.resetPassword(req, res as Response, next);
        expect(bcrypt.hash).toHaveBeenCalledWith('Strong1!', 10);
        expect(mockUser.save).toHaveBeenCalled();
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({
            message: 'messages.password_reset_success',
        });
    });
});

describe('UserController.resendVerificationEmail', () => {
    let res: Partial<Response>;
    let next: NextFunction;

    beforeEach(() => {
        vi.clearAllMocks();
        res = { status: vi.fn().mockReturnThis(), json: vi.fn() };
        next = vi.fn();
        process.env.EMAIL_JWT_SECRET = 'emailjwt';
        process.env.CLIENT_URL = 'http://client';
    });

    it('errors when user not found', async () => {
        (User.findById as Mock).mockResolvedValue(null);
        const req: any = { user: { id: 'u1' }, t: (k: string) => k };
        await userController.resendVerificationEmail(
            req,
            res as Response,
            next,
        );
        expect(next).toHaveBeenCalled();
    });

    it('returns message if already verified', async () => {
        (User.findById as Mock).mockResolvedValue({
            isVerified: true,
            email: 'e@e.com',
        });
        const req: any = { user: { id: 'u1' }, t: (k: string) => k };
        await userController.resendVerificationEmail(
            req,
            res as Response,
            next,
        );
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({
            message: 'messages.email_already_verified',
        });
    });

    it('resends email successfully', async () => {
        const mockUser: any = {
            isVerified: false,
            save: vi.fn(),
            email: 'e@e.com',
            _id: 'u1',
        };
        (User.findById as Mock).mockResolvedValue(mockUser);
        (jwt.sign as Mock).mockReturnValue('emailToken');
        const req: any = { user: { id: 'u1' }, t: (k: string) => k };
        await userController.resendVerificationEmail(
            req,
            res as Response,
            next,
        );
        expect(mockUser.save).toHaveBeenCalled();
        expect(transporter.sendMail).toHaveBeenCalledWith(
            expect.objectContaining({
                to: 'e@e.com',
                html: '<verify>',
            }),
        );
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({
            message: 'messages.email_sent',
        });
    });
});
