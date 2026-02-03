import { normalizeZapier } from '../../src/services/leadNormalizer';

describe('Lead Normalizer', () => {
  describe('normalizeZapier', () => {
    it('should normalize Google Forms payload', () => {
      const payload = {
        name: 'george saint-pierre',
        email: 'george.saint-pierre@test.com',
        phone: '0612345678',
        message: 'Besoin site web',
        source: 'google-forms',
      };

      const result = normalizeZapier(payload);

      expect(result.name).toBe('george saint-pierre');
      expect(result.email).toBe('george.saint-pierre@test.com');
      expect(result.phone).toBe('0612345678');
      expect(result.message).toBe('Besoin site web');
      expect(result.source).toBe('google-forms');
      expect(result.status).toBe('new');
    });

    it('should normalize Facebook Lead Ads payload', () => {
      const payload = {
        full_name: 'demetrious johnson',
        email: 'demetrious.johnson@test.com',
        phone_number: '+33612345678',
        company_name: 'Startup XYZ',
        custom_question_answer: 'Cherche développeur',
        source: 'facebook',
      };

      const result = normalizeZapier(payload);

      expect(result.name).toBe('demetrious johnson');
      expect(result.email).toBe('demetrious.johnson@test.com');
      expect(result.phone).toBe('+33612345678');
      expect(result.company).toBe('Startup XYZ');
      expect(result.message).toBe('Cherche développeur');
      expect(result.source).toBe('facebook');
    });

    it('should extract budget correctly', () => {
      const payload = {
        name: 'Test',
        email: 'test@test.com',
        budget: '5000€',
      };

      const result = normalizeZapier(payload);

      expect(result.budget).toBe(5000);
    });

    it('should handle missing optional fields', () => {
      const payload = {
        name: 'Minimal',
        email: 'minimal@test.com',
      };

      const result = normalizeZapier(payload);

      expect(result.name).toBe('Minimal');
      expect(result.email).toBe('minimal@test.com');
      expect(result.phone).toBeNull();
      expect(result.company).toBeNull();
      expect(result.message).toBe('');
      expect(result.budget).toBeNull();
    });

    it('should default to "Unknown" if name is missing', () => {
      const payload = {
        email: 'noname@test.com',
      };

      const result = normalizeZapier(payload);

      expect(result.name).toBe('Unknown');
    });
  });
});