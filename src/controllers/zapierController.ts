import { Request, Response, NextFunction } from 'express';
import { normalizeZapier } from '../services/leadNormalizer';
import { saveLead } from '../services/database';
import { syncToNotion } from '../services/notionSync';

export const handleZapierWebhook = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const payload = req.body;
    
    console.log('Webhook received:', {
      source: payload.source || 'unknown',
      email: payload.email,
    });

    const normalizedLead = normalizeZapier(payload);
    const savedLead = await saveLead(normalizedLead);

    console.log('Lead saved:', savedLead.id);

    // async notion connection
    syncToNotion(savedLead).catch(err =>
      console.error('Notion sync failed:', err)
    );

    res.status(200).json({
      success: true,
      leadId: savedLead.id,
      source: normalizedLead.source,
      message: 'Lead received and processed',
    });
  } catch (error) {
    next(error);
  }
};