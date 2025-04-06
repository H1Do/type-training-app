import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

let isConnected = false;

export const connectDB = async () => {
    if (isConnected) {
        console.log('MongoDB is already connected');
        return;
    }

    try {
        const mongoUrl = process.env.MONGODB_URL;
        if (!mongoUrl) {
            throw new Error(
                'MONGODB_URL is not defined in the environment variables',
            );
        }
        await mongoose.connect(mongoUrl);
        isConnected = true;
        console.log('MongoDB connected');
    } catch (error) {
        console.error('MongoDB connection error:', error);
        process.exit(1);
    }
};

export const disconnectDB = async () => {
    if (!isConnected) return;

    try {
        await mongoose.disconnect();
        isConnected = false;
        console.log('MongoDB disconnected');
    } catch (error) {
        console.error('MongoDB disconnection error:', error);
    }
};

process.on('SIGINT', async () => {
    await disconnectDB();
    process.exit(0);
});

process.on('SIGTERM', async () => {
    await disconnectDB();
    process.exit(0);
});
