import { Router } from 'express';
import { userRouter } from './userRouter';
import { trainingRouter } from './trainingRouter';

export const router = Router();

router.use('/user', userRouter);
router.use('/training', trainingRouter);
