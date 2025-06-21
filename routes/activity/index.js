import express from 'express';
import { messagePath, trainingDataPath } from '../../service_endpoints/services.js';
import { fetchUserTrainingSummary } from './fetch-training-summary.js';
import { fetchMessageStats } from './fetch-message-status.js';
const userActivityRouter = express.Router();

userActivityRouter.get(trainingDataPath, fetchUserTrainingSummary);
userActivityRouter.get(messagePath, fetchMessageStats);

export default userActivityRouter;