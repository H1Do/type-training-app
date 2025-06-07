import express, { json } from 'express';
import dotenv from 'dotenv';
import { router } from './routes';
import { errorMiddleware } from './middleware/errorMiddleware';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import { i18nMiddleware } from './middleware/i18nMiddleware';
dotenv.config();

const CLIENT_URL = process.env.CLIENT_URL || 'http://localhost:5173';

const app = express();
app.use(i18nMiddleware);
app.use(json());
app.use(cookieParser());
app.use(
    cors({
        credentials: true,
        origin: CLIENT_URL,
        methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
        allowedHeaders: ['Content-Type', 'Authorization'],
    }),
);
app.use('/api', router);
app.use(errorMiddleware);

export default app;
