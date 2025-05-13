import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { ApiError } from '../errors/ApiError';
import { User } from '../models/User';
import { NextFunction, Response } from 'express';
import { AuthRequest, ResetPasswordRequest } from '@/types/requestTypes';
import { UserDto } from '@/types/userTypes';
import { transporter } from '@/utils/mailer';
import { getResetPasswordHtml, getVerifyEmailHtml } from '@/utils/email';

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

        const emailToken = jwt.sign(
            { id: user._id },
            process.env.EMAIL_JWT_SECRET!,
            { expiresIn: '1d' },
        );

        user.emailToken = emailToken;
        await user.save();

        await transporter.sendMail({
            from: '"KeySpark" <no-reply@yourapp.com>',
            to: user.email,
            subject: req.t('mail.verify_your_email') ?? 'Verify your email',
            html: getVerifyEmailHtml(
                `${process.env.CLIENT_URL}/verify-email?token=${emailToken}`,
                req.t,
            ),
        });

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
            isVerified: user.isVerified,
        };

        return res.status(200).json(userDto);
    }

    async verifyEmail(req: AuthRequest, res: Response, next: NextFunction) {
        const { token } = req.query;

        try {
            const payload = jwt.verify(
                token as string,
                process.env.EMAIL_JWT_SECRET!,
            ) as { id: string };
            const user = await User.findById(payload.id);

            if (!user || user.isVerified) {
                return res.status(400).json({
                    message:
                        req.t?.('errors.invalid_or_expired_token') ??
                        'Invalid token',
                });
            }

            user.isVerified = true;
            user.emailToken = undefined;
            await user.save();

            return res.status(200).json({
                message: req.t?.('messages.email_verified') ?? 'Email verified',
            });
        } catch {
            return res.status(400).json({
                message:
                    req.t?.('errors.invalid_or_expired_token') ??
                    'Invalid token',
            });
        }
    }

    async requestPasswordReset(
        req: AuthRequest,
        res: Response,
        next: NextFunction,
    ) {
        const { email } = req.body;

        const user = await User.findOne({ email });
        if (!user || !user.isVerified) {
            return res.status(200).json({
                message:
                    req.t?.('messages.reset_email_sent') ??
                    'If the email is found, a reset link has been sent',
            });
        }

        const resetToken = jwt.sign(
            { id: user._id },
            process.env.RESET_JWT_SECRET!,
            {
                expiresIn: '15m',
            },
        );

        await transporter.sendMail({
            from: '"KeySpark" <no-reply@yourapp.com>',
            to: user.email,
            subject: req.t('mail.password_reset') ?? 'Password reset',
            html: getResetPasswordHtml(
                `${process.env.CLIENT_URL}/reset-password?token=${resetToken}`,
                req.t,
            ),
        });

        return res.status(200).json({
            message:
                req.t?.('messages.reset_email_sent') ??
                'If the email is found, a reset link has been sent',
        });
    }

    async resetPassword(
        req: ResetPasswordRequest,
        res: Response,
        next: NextFunction,
    ) {
        const { token, newPassword } = req.body;

        try {
            const payload = jwt.verify(
                token,
                process.env.RESET_JWT_SECRET!,
            ) as {
                id: string;
            };
            const user = await User.findById(payload.id);
            if (!user) {
                return next(ApiError.notFound(req.t('errors.user_not_found')));
            }

            user.password = await bcrypt.hash(newPassword, 10);
            await user.save();

            return res.status(200).json({
                message:
                    req.t?.('messages.password_reset_success') ??
                    'Password has been reset',
            });
        } catch {
            return res.status(400).json({
                message:
                    req.t?.('errors.invalid_or_expired_token') ??
                    'Invalid or expired token',
            });
        }
    }

    async resendVerificationEmail(
        req: AuthRequest,
        res: Response,
        next: NextFunction,
    ) {
        const userId = req.user?.id;
        const user = await User.findById(userId);

        if (!user)
            return next(ApiError.notFound(req.t('errors.user_not_found')));
        if (user.isVerified)
            return res.status(200).json({
                message:
                    req.t?.('messages.email_already_verified') ??
                    'Email is already verified',
            });

        if (!process.env.EMAIL_JWT_SECRET) {
            return new Error('EMAIL_JWT_SECRET is not defined');
        }

        const emailToken = jwt.sign(
            { id: user._id },
            process.env.EMAIL_JWT_SECRET,
            { expiresIn: '1d' },
        );

        user.emailToken = emailToken;
        await user.save();

        await transporter.sendMail({
            from: '"KeySpark" <no-reply@yourapp.com>',
            to: user.email,
            subject: req.t('mail.verify_your_email') ?? 'Verify your email',
            html: getVerifyEmailHtml(
                `${process.env.CLIENT_URL}/verify-email?token=${emailToken}`,
                req.t,
            ),
        });

        return res.status(200).json({
            message:
                req.t?.('messages.email_sent') ?? 'Verification email sent',
        });
    }
}

export const userController = new UserController();
