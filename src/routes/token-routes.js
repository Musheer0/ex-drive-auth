import express from 'express'
import { DeleteTokenController, RefreshTokenController, VerifiyTokenController } from '../controllers/token-controller.js';
export const TokenRouter = express.Router();

TokenRouter.post('/verify',VerifiyTokenController);
TokenRouter.post('/refresh',RefreshTokenController);
TokenRouter.delete('/delete',DeleteTokenController)