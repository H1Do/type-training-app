import { Router } from 'express';
import { userRouter } from './userRouter';
import { trainingRouter } from './trainingRouter';
import { statsRouter } from './statsRouter';

export const router = Router();

router.use('/user', userRouter);
router.use('/training', trainingRouter);
router.use('/stats', statsRouter);
