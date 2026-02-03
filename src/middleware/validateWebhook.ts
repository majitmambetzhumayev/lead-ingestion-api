import { Request, Response, NextFunction } from "express";
import crypto from 'crypto';

export const validateMaltWebhook = (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const signature = req.headers['x-malt-signature'] as string;
    const secret = process.env.MALT_WEBHOOK_SECRET;

    if (!secret) {
        console.warn('MALT_WEBHOOK_SECRET not set');
        return next(); // Continue in dev
    }

    if (!signature) {
        return res.status(401).json({ error: 'Missing signature' });
    }

    const hash = crypto
        .createHmac('sha256', secret)
        .update(JSON.stringify(req.body))
        .digest('hex');

    if (hash !== signature) {
        return res.status(401).json({ error: 'Invalid signature' });
    }

    next();
    };

    export const validateCodeurWebhook = (
    req: Request,
    res: Response,
    next: NextFunction
    ) => {
    // Codeur.com uses api key in headers
    const apiKey = req.headers['x-api-key'] as string;
    const secret = process.env.CODEUR_WEBHOOK_SECRET;

    if (!secret) {
        console.warn('⚠️  CODEUR_WEBHOOK_SECRET not set');
        return next();
    }

    if (apiKey !== secret) {
        return res.status(401).json({ error: 'Invalid API key' });
    }

    next();
};
