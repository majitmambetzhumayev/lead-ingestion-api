import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import webhookRoutes from './routes/webhooks';
import { errorHandler, notFound } from './middleware/errorHandler';
import { generalLimiter } from './middleware/rateLimiter';

dotenv.config();

const app: Application = express();
const PORT = process.env.PORT || 3000;

// Middleware global
app.use(cors());
app.use(express.json());
app.use(generalLimiter);

// Routes
app.get('/', (req: Request, res: Response) => {
  res.json({ 
    message: 'Lead Ingestion API 🚀',
    version: '1.0.0',
    endpoints: {
      health: '/api/health',
      webhooks: {
        malt: '/api/webhooks/malt',
        codeur: '/api/webhooks/codeur',
      },
    },
  });
});

app.get('/api/health', (req: Request, res: Response) => {
  res.json({ 
    status: 'ok', 
    timestamp: new Date().toISOString(),
    database: 'connected',
  });
});

app.use('/api/webhooks', webhookRoutes);

// 404 handler (AVANT errorHandler)
app.use(notFound);

// Error handler (EN DERNIER)
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});

export default app;