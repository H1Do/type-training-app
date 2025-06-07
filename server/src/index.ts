import 'module-alias/register';
import app from './app';
import { connectDB } from './db';
import dotenv from 'dotenv';
import { scheduleCleanupUnfinishedSessions } from './tasks/cleanUnfinishedSessions';
dotenv.config();

const PORT = process.env.PORT || 3000;

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
scheduleCleanupUnfinishedSessions();
