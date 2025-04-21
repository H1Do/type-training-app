import express, { json } from 'express';
import { connectDB } from './db';
import dotenv from 'dotenv';
import { router } from './routes';
import { errorMiddleware } from './middleware/errorMiddleware';
import cookieParser from 'cookie-parser';
import cors from 'cors';
dotenv.config();

const PORT = process.env.PORT || 3000;
const CLIENT_URL = process.env.CLIENT_URL || 'http://localhost:5173';

const app = express();
app.use(json());
app.use(cookieParser());
app.use(
    cors({
        credentials: true,
        origin: CLIENT_URL,
        methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
        allowedHeaders: ['Content-Type', 'Authorization'],
    }),
);
app.use('/api', router);
app.use(errorMiddleware);

const startServer = async () => {
    try {
        await connectDB();
        app.listen(PORT, () => console.log(`listening on port ${PORT}`));
    } catch (error) {
        console.error('Error starting server:', error);
        process.exit(1);
    }
};

startServer();
