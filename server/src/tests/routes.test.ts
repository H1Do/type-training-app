import { describe, it, expect, beforeAll, afterAll, vi } from 'vitest';
import request from 'supertest';
import { Request, Response, NextFunction } from 'express';

vi.mock('@/controllers/userController', () => ({
    userController: {
        registration: vi.fn(async (_req: Request, res: Response) =>
            res.status(201).json({ success: true }),
        ),
        login: vi.fn(async (_req: Request, res: Response) =>
            res.status(200).json({ token: 'mock-token' }),
        ),
        logout: vi.fn(async (_req: Request, res: Response) =>
            res.sendStatus(204),
        ),
        changePassword: vi.fn(async (_req: Request, res: Response) =>
            res.sendStatus(204),
        ),
        getUser: vi.fn(async (_req: Request, res: Response) =>
            res.status(200).json({ id: 1, email: 'test@example.com' }),
        ),
        verifyEmail: vi.fn(async (_req: Request, res: Response) =>
            res.sendStatus(200),
        ),
        requestPasswordReset: vi.fn(async (_req: Request, res: Response) =>
            res.sendStatus(200),
        ),
        resetPassword: vi.fn(async (_req: Request, res: Response) =>
            res.sendStatus(200),
        ),
        resendVerificationEmail: vi.fn(async (_req: Request, res: Response) =>
            res.sendStatus(200),
        ),
    },
}));

vi.mock('@/controllers/lessonsController', () => ({
    lessonsController: {
        getAll: vi.fn(async (_req: Request, res: Response) =>
            res.status(200).json([{ id: '1', title: 'Lesson 1' }]),
        ),
        getById: vi.fn(async (_req: Request, res: Response) =>
            res.status(200).json({ id: '1', title: 'Lesson 1' }),
        ),
        complete: vi.fn(async (_req: Request, res: Response) =>
            res.sendStatus(204),
        ),
    },
}));

vi.mock('@/controllers/statsController', () => ({
    StatsController: {
        getUserStats: vi.fn(async (_req: Request, res: Response) =>
            res.status(200).json({ total: 42 }),
        ),
        getTopUsersByLevel: vi.fn(async (_req: Request, res: Response) =>
            res.status(200).json([{ id: 'u1', level: 5 }]),
        ),
    },
}));

vi.mock('@/controllers/trainingController', () => ({
    trainingController: {
        startSession: vi.fn(async (_req: Request, res: Response) =>
            res.status(201).json({ sessionId: 's1' }),
        ),
        finishSession: vi.fn(async (_req: Request, res: Response) =>
            res.status(200).json({ result: 'finished' }),
        ),
    },
}));

vi.mock('@/controllers/adminController', () => ({
    adminController: {
        getAllUsers: vi.fn(async (_req: Request, res: Response) =>
            res.status(200).json([{ id: 'u1', email: 'a@b.com' }]),
        ),
        blockUser: vi.fn(async (_req: Request, res: Response) =>
            res.sendStatus(204),
        ),
        unblockUser: vi.fn(async (_req: Request, res: Response) =>
            res.sendStatus(204),
        ),
        getUserStats: vi.fn(async (_req: Request, res: Response) =>
            res.status(200).json({ sessions: 10 }),
        ),
        getAllLessons: vi.fn(async (_req: Request, res: Response) =>
            res.status(200).json([{ id: 'l1', title: 'Lesson A' }]),
        ),
        createLesson: vi.fn(async (_req: Request, res: Response) =>
            res.status(201).json({ id: 'l2' }),
        ),
        updateLesson: vi.fn(async (_req: Request, res: Response) =>
            res.sendStatus(200),
        ),
        deleteLesson: vi.fn(async (_req: Request, res: Response) =>
            res.sendStatus(204),
        ),
        getAdminStats: vi.fn(async (_req: Request, res: Response) =>
            res.status(200).json({ users: 5 }),
        ),
    },
}));

vi.mock('@/middleware/authMiddleware', () => ({
    createAuthMiddleware:
        (_strict = false) =>
        (_req: Request, _res: Response, next: NextFunction) =>
            next(),
}));

vi.mock('@/middleware/rateLimiter', () => ({
    strictRateLimiter: (_req: Request, _res: Response, next: NextFunction) =>
        next(),
    moderateRateLimiter: (_req: Request, _res: Response, next: NextFunction) =>
        next(),
    looseRateLimiter: (_req: Request, _res: Response, next: NextFunction) =>
        next(),
}));

vi.mock('@/middleware/isAdminMiddleware', () => ({
    isAdminMiddleware: (_req: Request, _res: Response, next: NextFunction) =>
        next(),
}));

import app from '@/app';

let server: ReturnType<typeof app.listen>;

beforeAll(() => {
    server = app.listen();
});

afterAll(() => new Promise<void>((resolve) => server.close(() => resolve())));

// User Routes
describe('User Routes', () => {
    it('POST /api/user/registration — 201 и success:true', async () => {
        const res = await request(server)
            .post('/api/user/registration')
            .send({ email: 'new@example.com', password: 'pass123' })
            .expect(201);
        expect(res.body).toEqual({ success: true });
    });

    it('POST /api/user/login — 200 и возвращает токен', async () => {
        const res = await request(server)
            .post('/api/user/login')
            .send({ email: 'test@example.com', password: 'pass123' })
            .expect(200);
        expect(res.body).toHaveProperty('token', 'mock-token');
    });

    it('POST /api/user/logout — 204 No Content', async () => {
        await request(server).post('/api/user/logout').expect(204);
    });

    it('POST /api/user/change-password — 204 No Content', async () => {
        await request(server)
            .post('/api/user/change-password')
            .send({ oldPassword: 'old', newPassword: 'new' })
            .expect(204);
    });

    it('GET /api/user — 200 и возвращает объект пользователя', async () => {
        const res = await request(server).get('/api/user').expect(200);
        expect(res.body).toMatchObject({ id: 1, email: 'test@example.com' });
    });

    it('GET /api/user/verify-email — 200 OK', async () => {
        await request(server)
            .get('/api/user/verify-email?token=abc')
            .expect(200);
    });

    it('POST /api/user/forgot-password — 200 OK', async () => {
        await request(server)
            .post('/api/user/forgot-password')
            .send({ email: 'test@example.com' })
            .expect(200);
    });

    it('POST /api/user/reset-password — 200 OK', async () => {
        await request(server)
            .post('/api/user/reset-password')
            .send({ token: 'abc', newPassword: 'newpass' })
            .expect(200);
    });

    it('POST /api/user/resend-verification — 200 OK', async () => {
        await request(server).post('/api/user/resend-verification').expect(200);
    });
});

// Lessons Routes
describe('Lessons Routes', () => {
    it('GET /api/lessons — 200 и массив уроков', async () => {
        const res = await request(server).get('/api/lessons').expect(200);
        expect(Array.isArray(res.body)).toBe(true);
        expect(res.body[0]).toHaveProperty('id', '1');
    });

    it('GET /api/lessons/:id — 200 и объект урока', async () => {
        const res = await request(server).get('/api/lessons/1').expect(200);
        expect(res.body).toMatchObject({ id: '1', title: 'Lesson 1' });
    });

    it('POST /api/lessons/:id/complete — 204 No Content', async () => {
        await request(server).post('/api/lessons/1/complete').expect(204);
    });
});

// Stats Routes
describe('Stats Routes', () => {
    it('GET /api/stats/me — 200 и объект статистики пользователя', async () => {
        const res = await request(server).get('/api/stats/me').expect(200);
        expect(res.body).toMatchObject({ total: 42 });
    });

    it('GET /api/stats/top-users — 200 и массив топ-пользователей', async () => {
        const res = await request(server)
            .get('/api/stats/top-users')
            .expect(200);
        expect(Array.isArray(res.body)).toBe(true);
        expect(res.body[0]).toMatchObject({ id: 'u1', level: 5 });
    });
});

// Training Routes
describe('Training Routes', () => {
    it('POST /api/training/session — 201 и объект с sessionId', async () => {
        const res = await request(server)
            .post('/api/training/session')
            .expect(201);
        expect(res.body).toHaveProperty('sessionId', 's1');
    });

    it('POST /api/training/session/:id/finish — 200 и результат', async () => {
        const res = await request(server)
            .post('/api/training/session/s1/finish')
            .expect(200);
        expect(res.body).toMatchObject({ result: 'finished' });
    });
});

// Admin Routes
describe('Admin Routes', () => {
    it('GET /api/admin/users — 200 и массив пользователей', async () => {
        const res = await request(server).get('/api/admin/users').expect(200);
        expect(Array.isArray(res.body)).toBe(true);
        expect(res.body[0]).toMatchObject({ id: 'u1', email: 'a@b.com' });
    });

    it('PATCH /api/admin/users/:id/block — 204 No Content', async () => {
        await request(server).patch('/api/admin/users/u1/block').expect(204);
    });

    it('PATCH /api/admin/users/:id/unblock — 204 No Content', async () => {
        await request(server).patch('/api/admin/users/u1/unblock').expect(204);
    });

    it('GET /api/admin/users/:id/stats — 200 и объект stats', async () => {
        const res = await request(server)
            .get('/api/admin/users/u1/stats')
            .expect(200);
        expect(res.body).toMatchObject({ sessions: 10 });
    });

    it('GET /api/admin/lessons — 200 и массив уроков', async () => {
        const res = await request(server).get('/api/admin/lessons').expect(200);
        expect(Array.isArray(res.body)).toBe(true);
        expect(res.body[0]).toMatchObject({ id: 'l1', title: 'Lesson A' });
    });

    it('POST /api/admin/lessons — 201 и объект с id', async () => {
        const res = await request(server)
            .post('/api/admin/lessons')
            .send({ title: 'New' })
            .expect(201);
        expect(res.body).toMatchObject({ id: 'l2' });
    });

    it('PUT /api/admin/lessons/:id — 200 OK', async () => {
        await request(server)
            .put('/api/admin/lessons/l1')
            .send({ title: 'Updated' })
            .expect(200);
    });

    it('DELETE /api/admin/lessons/:id — 204 No Content', async () => {
        await request(server).delete('/api/admin/lessons/l1').expect(204);
    });

    it('GET /api/admin/stats — 200 и объект stats', async () => {
        const res = await request(server).get('/api/admin/stats').expect(200);
        expect(res.body).toMatchObject({ users: 5 });
    });
});
