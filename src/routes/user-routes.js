import express from 'express'
import { OAuthCallBackController } from '../controllers/user-controllers.js';
export const UserRouter = express.Router();

UserRouter.get('/oauth/google',OAuthCallBackController)