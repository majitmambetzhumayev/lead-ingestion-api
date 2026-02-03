import { Request, Response, NextFunction } from 'express';
import { normalizeMake } from '../services/leadNormalizer';
import { saveLead } from '../services/database';
import { syncToNotion } from '../services/notionSync';

export const handleMakeWebhook = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const payload = req.body;
    
    console.log('Webhook received from Make:', {
      source: payload.source || 'unknown',
      email: payload.email,
    });

    console.log('Normalizing lead...');
    const normalizedLead = normalizeMake(payload);

    console.log('Saving to database...');
    const savedLead = await saveLead(normalizedLead);
    console.log('Lead saved:', savedLead.id);

    console.log('Starting Notion sync...');
    syncToNotion(savedLead)
      .then(() => console.log('Notion sync complete'))
      .catch(err => console.error('Notion sync failed:', err));

    res.status(200).json({
      success: true,
      leadId: savedLead.id,
      source: normalizedLead.source,
      message: 'Lead received and processed',
    });
  } catch (error) {
    console.error('Controller error:', error);
    next(error);
  }
};