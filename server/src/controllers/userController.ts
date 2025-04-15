import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { ApiError } from '../errors/ApiError';
import { User } from '../models/User';
import { NextFunction, Response } from 'express';
import { AuthRequest } from '@/types/requestTypes';
import { UserDto } from '@/types/userTypes';

const generateToken = (id: string) => {
    if (!process.env.JWT_SECRET) {
        throw new Error(
            'JWT_SECRET is not defined in the environment variables',
        );
    }

    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: '1h',
    });
};

class UserController {
    async registration(req: AuthRequest, res: Response, next: NextFunction) {
        const { username, password, email } = req.body;
        if (!username || !password || !email) {
            return next(ApiError.badRequest('All fields are required'));
        }

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return next(ApiError.badRequest('User already exists'));
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const user = new User({ username, password: hashedPassword, email });
        await user.save();
        const token = generateToken(String(user._id));

        res.cookie('token', token, { httpOnly: true });
        return res
            .status(201)
            .json({ message: 'User registered successfully' });
    }

    async login(req: AuthRequest, res: Response, next: NextFunction) {
        const { email, password } = req.body;

        if (!email || !password) {
            return next(ApiError.badRequest('All fields are required'));
        }

        const user = await User.findOne({ email });
        if (!user) {
            return next(ApiError.badRequest('Invalid email or password'));
        }

        let comparePassword = await bcrypt.compare(password, user.password);
        if (!comparePassword) {
            return next(ApiError.badRequest('Invalid email or password'));
        }

        const token = generateToken(String(user._id));
        res.cookie('token', token, { httpOnly: true });
        return res.status(200).json({ message: 'User logged in successfully' });
    }

    async logout(req: AuthRequest, res: Response, next: NextFunction) {
        res.clearCookie('token');
        return res
            .status(200)
            .json({ message: 'User logged out successfully' });
    }

    async getUser(req: AuthRequest, res: Response, next: NextFunction) {
        const userId = req.user?.id;
        if (!userId) {
            return next(ApiError.unauthorized('Not authorized'));
        }

        const user = await User.findById(userId);

        if (!user) {
            return next(ApiError.notFound('User not found'));
        }

        const userDto: UserDto = {
            id: user._id.toString(),
            username: user.username,
            email: user.email,
            createdAt: user.createdAt,
        };

        return res.status(200).json(userDto);
    }
}

export const userController = new UserController();
