import express from 'express';
import type { Router as IRouter } from 'express';
import { handleMakeWebhook } from '../controllers/makeController';
import { webhookLimiter } from '../middleware/rateLimiter';

const router: IRouter = express.Router();

// unique route for Make.com
router.post('/make', webhookLimiter, handleMakeWebhook);

export default router;
