import express from 'express';
import type { Router as IRouter } from 'express';
import { handleZapierWebhook } from '../controllers/zapierController';
import { webhookLimiter } from '../middleware/rateLimiter';

const router: IRouter = express.Router();

// webhook route for zapier
router.post('/zapier', webhookLimiter, handleZapierWebhook);

export default router;