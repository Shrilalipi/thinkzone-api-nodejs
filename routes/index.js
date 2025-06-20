import express from 'express';
import userRouter from './users/index.js';
import userActivityRouter from './activity/index.js';
const router = express.Router();

router.use(userRouter);
router.use(userActivityRouter);

export default router;