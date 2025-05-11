import { Router } from 'express';
import { userRouter } from './userRouter';
import { trainingRouter } from './trainingRouter';
import { statsRouter } from './statsRouter';
import { lessonsRouter } from './lessonsRouter';

export const router = Router();

router.use('/user', userRouter);
router.use('/training', trainingRouter);
router.use('/stats', statsRouter);
router.use('/lessons', lessonsRouter);
