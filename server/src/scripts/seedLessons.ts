import { Lesson } from '@/models/Lesson';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { qwertyLessons, ycukenLessons } from '@/constants/lessons';
dotenv.config();

async function seedLessons() {
    try {
        const mongoUrl = process.env.MONGODB_URL;
        if (!mongoUrl) {
            throw new Error(
                'MONGODB_URL is not defined in the environment variables',
            );
        }
        await mongoose.connect(mongoUrl);
        await Lesson.deleteMany({});
        await Lesson.insertMany([...qwertyLessons, ...ycukenLessons]);
        console.log('Lessons seeded successfully');
        process.exit(0);
    } catch (error) {
        console.error('Seeding error:', error);
        process.exit(1);
    }
}

seedLessons();
