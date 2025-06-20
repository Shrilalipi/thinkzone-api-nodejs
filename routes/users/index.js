import express from 'express';
import { loginPath, profilePath, userRegistrationPath } from '../../service_endpoints/services.js';
import { fetchProfile, login, registerUser } from './users.service.js';
const userRouter = express.Router();

userRouter.post(userRegistrationPath, registerUser);
userRouter.post(loginPath, login);
userRouter.get(profilePath, fetchProfile)

export default userRouter;