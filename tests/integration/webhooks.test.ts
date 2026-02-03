import request from 'supertest';
import app from '../../src/index';

describe('Webhook Endpoints', () => {
  describe('POST /api/webhooks/zapier', () => {
    it('should accept valid Google Forms payload', async () => {
      const payload = {
        name: 'Alice Test',
        email: 'alice@example.com',
        phone: '0612345678',
        message: 'Test message',
        source: 'google-forms',
      };

      const response = await request(app)
        .post('/api/webhooks/zapier')
        .send(payload)
        .expect('Content-Type', /json/)
        .expect(200);

      expect(response.body).toHaveProperty('success', true);
      expect(response.body).toHaveProperty('leadId');
      expect(response.body).toHaveProperty('source', 'google-forms');
    });

    it('should accept valid Facebook Lead Ads payload', async () => {
      const payload = {
        full_name: 'Bob Test',
        email: 'bob@example.com',
        phone_number: '+33612345678',
        company_name: 'Test Corp',
        custom_question_answer: 'Need help',
        source: 'facebook',
      };

      const response = await request(app)
        .post('/api/webhooks/zapier')
        .send(payload)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.source).toBe('facebook');
    });

    it('should handle minimal payload', async () => {
      const payload = {
        email: 'minimal@test.com',
      };

      const response = await request(app)
        .post('/api/webhooks/zapier')
        .send(payload)
        .expect(200);

      expect(response.body.success).toBe(true);
    });

    it('should be rate limited after too many requests', async () => {
      // sends 101 requests (limit = 100 every 15 min)
      const requests = Array(101).fill(null).map(() =>
        request(app)
          .post('/api/webhooks/zapier')
          .send({ email: 'test@test.com' })
      );

      const responses = await Promise.all(requests);
      const rateLimited = responses.some(r => r.status === 429);

      expect(rateLimited).toBe(true);
    });
  });

  describe('GET /api/health', () => {
    it('should return health status', async () => {
      const response = await request(app)
        .get('/api/health')
        .expect(200);

      expect(response.body).toHaveProperty('status', 'ok');
      expect(response.body).toHaveProperty('timestamp');
    });
  });

  describe('404 Handler', () => {
    it('should return 404 for unknown routes', async () => {
      const response = await request(app)
        .get('/api/unknown-route')
        .expect(404);

      expect(response.body).toHaveProperty('success', false);
      expect(response.body.message).toContain('not found');
    });
  });
});