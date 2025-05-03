import cron from 'node-cron';
import { TrainingSession } from '@/models/TrainingSession';

export function scheduleCleanupUnfinishedSessions() {
    cron.schedule('0 * * * *', async () => {
        const cutoff = Date.now() - 1000 * 60 * 60;

        const result = await TrainingSession.deleteMany({
            finishedAt: null,
            startedAt: { $lt: cutoff },
        });

        console.log(
            `Removed ${result.deletedCount} unfinished training sessions`,
        );
    });
}
