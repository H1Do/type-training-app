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

        const insertedLessons = await Lesson.insertMany([
            ...qwertyLessons,
            ...ycukenLessons,
        ]);

        const layoutGroups = insertedLessons.reduce<
            Record<string, typeof insertedLessons>
        >((acc, lesson) => {
            if (!acc[lesson.layout]) acc[lesson.layout] = [];
            acc[lesson.layout].push(lesson);
            return acc;
        }, {});

        for (const group of Object.values(layoutGroups)) {
            const sorted = group.sort((a, b) => a.order - b.order);
            for (let i = 0; i < sorted.length; i++) {
                const current = sorted[i];
                const prev = sorted[i - 1]?._id ?? null;
                const next = sorted[i + 1]?._id ?? null;

                await Lesson.findByIdAndUpdate(current._id, {
                    prevLessonId: prev,
                    nextLessonId: next,
                });
            }
        }

        console.log('Lessons seeded and linked successfully');
        process.exit(0);
    } catch (error) {
        console.error('Seeding error:', error);
        process.exit(1);
    }
}

seedLessons();
