import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { ApiError } from '../errors/ApiError';
import { User } from '../models/User';
import { NextFunction, Response } from 'express';
import { AuthRequest } from '@/types/requestTypes';
import { UserDto } from '@/types/userTypes';

const JWT_EXPIRES_IN = '7d';
const COOKIE_MAX_AGE = 7 * 24 * 60 * 60 * 1000;

const generateToken = (id: string) => {
    if (!process.env.JWT_SECRET) {
        throw new Error('JWT_SECRET is not defined');
    }
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: JWT_EXPIRES_IN,
    });
};

class UserController {
    async registration(req: AuthRequest, res: Response, next: NextFunction) {
        const { username, password, email } = req.body;
        if (!username || !password || !email) {
            return next(
                ApiError.badRequest(
                    req.t?.('errors.all_fields_required') ??
                        'All fields are required',
                ),
            );
        }

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return next(
                ApiError.badRequest(
                    req.t?.('errors.email_used') ?? 'Email already used',
                ),
            );
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const user = new User({ username, password: hashedPassword, email });
        await user.save();

        const token = generateToken(String(user._id));
        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: COOKIE_MAX_AGE,
            path: '/',
        });

        return res.status(201).json({
            message:
                req.t?.('messages.registration_success') ??
                'User registered successfully',
        });
    }

    async login(req: AuthRequest, res: Response, next: NextFunction) {
        const { email, password } = req.body;

        if (!email || !password) {
            return next(
                ApiError.badRequest(
                    req.t?.('errors.all_fields_required') ??
                        'All fields are required',
                ),
            );
        }

        const user = await User.findOne({ email });
        if (!user) {
            return next(
                ApiError.badRequest(
                    req.t?.('errors.invalid_credentials') ??
                        'Invalid email or password',
                ),
            );
        }

        let comparePassword = await bcrypt.compare(password, user.password);
        if (!comparePassword) {
            return next(
                ApiError.badRequest(
                    req.t?.('errors.invalid_credentials') ??
                        'Invalid email or password',
                ),
            );
        }

        const token = generateToken(String(user._id));
        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: COOKIE_MAX_AGE,
            path: '/',
        });

        return res.status(200).json({
            message:
                req.t?.('messages.login_success') ??
                'User logged in successfully',
        });
    }

    async logout(req: AuthRequest, res: Response, next: NextFunction) {
        res.clearCookie('token');
        return res.status(200).json({
            message:
                req.t?.('messages.logout_success') ??
                'User logged out successfully',
        });
    }

    async changePassword(req: AuthRequest, res: Response, next: NextFunction) {
        const { oldPassword, newPassword } = req.body;

        if (!oldPassword || !newPassword) {
            return next(
                ApiError.badRequest(
                    req.t?.('errors.all_fields_required') ??
                        'All fields are required',
                ),
            );
        }

        const userId = req.user?.id;
        if (!userId) {
            return next(
                ApiError.unauthorized(
                    req.t?.('errors.unauthorized') ?? 'Not authorized',
                ),
            );
        }

        const user = await User.findById(userId);
        if (!user) {
            return next(
                ApiError.notFound(
                    req.t?.('errors.user_not_found') ?? 'User not found',
                ),
            );
        }

        let comparePassword = await bcrypt.compare(oldPassword, user.password);
        if (!comparePassword) {
            return next(
                ApiError.badRequest(
                    req.t?.('errors.invalid_old_password') ??
                        'Invalid old password',
                ),
            );
        }

        const hashedPassword = await bcrypt.hash(newPassword, 10);
        user.password = hashedPassword;
        await user.save();

        return res.status(200).json({
            message:
                req.t?.('messages.password_change_success') ??
                'Password changed successfully',
        });
    }

    async getUser(req: AuthRequest, res: Response, next: NextFunction) {
        const userId = req.user?.id;
        if (!userId) {
            return next(
                ApiError.unauthorized(
                    req.t?.('errors.unauthorized') ?? 'Not authorized',
                ),
            );
        }

        const user = await User.findById(userId);

        if (!user) {
            return next(
                ApiError.notFound(
                    req.t?.('errors.user_not_found') ?? 'User not found',
                ),
            );
        }

        const userDto: UserDto = {
            id: user.id.toString(),
            username: user.username,
            email: user.email,
            createdAt: user.createdAt,
            level: user.level,
            exp: user.exp,
        };

        return res.status(200).json(userDto);
    }
}

export const userController = new UserController();
