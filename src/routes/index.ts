import { router as userRouter } from '@routes/user.route';
import { Router } from 'express';
export const router = Router();

router.use('/auth', userRouter);
