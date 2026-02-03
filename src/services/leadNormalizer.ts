import { Lead } from '../types/Lead';

export const normalizeZapier = (payload: any): Lead => {
  // fetches data by matching depending on format, normalizes format
  
  const extractName = (): string => {
    return (
      payload.name ||
      payload.full_name ||
      payload.fullName ||
      (payload.firstName && payload.lastName
        ? `${payload.firstName} ${payload.lastName}`
        : null) ||
      payload.client_name ||
      'Unknown'
    );
  };

  const extractEmail = (): string => {
    return (
      payload.email ||
      payload.email_address ||
      payload.emailAddress ||
      payload.client_email ||
      ''
    );
  };

  const extractPhone = (): string | null => {
    return (
      payload.phone ||
      payload.phone_number ||
      payload.phoneNumber ||
      payload.telephone ||
      payload.client_phone ||
      null
    );
  };

  const extractCompany = (): string | null => {
    return (
      payload.company ||
      payload.company_name ||
      payload.companyName ||
      payload.organization ||
      null
    );
  };

  const extractMessage = (): string => {
    return (
      payload.message ||
      payload.description ||
      payload.comment ||
      payload.comments ||
      payload.project_description ||
      payload.custom_question_answer ||
      payload.question ||
      ''
    );
  };

  const extractBudget = (): number | null => {
    const budgetField =
      payload.budget ||
      payload.budget_max ||
      payload.budget_range ||
      payload.estimated_budget;

    if (!budgetField) return null;

    const budgetStr = String(budgetField).replace(/[^\d.]/g, '');
    const budgetNum = parseFloat(budgetStr);

    return isNaN(budgetNum) ? null : budgetNum;
  };

  const extractSource = (): Lead['source'] => {
    const source = payload.source?.toLowerCase() || 'zapier';

    // Maps to supported sources
    const sourceMap: Record<string, Lead['source']> = {
      'google-forms': 'google-forms',
      'google forms': 'google-forms',
      googleforms: 'google-forms',
      facebook: 'facebook',
      'facebook-ads': 'facebook',
      linkedin: 'linkedin',
      typeform: 'typeform',
      website: 'website',
      zapier: 'zapier',
      make: 'make',
    };

    return sourceMap[source] || 'zapier';
  };

  return {
    name: extractName(),
    email: extractEmail(),
    phone: extractPhone(),
    company: extractCompany(),
    message: extractMessage(),
    budget: extractBudget(),
    source: extractSource(),
    status: 'new',
    metadata: payload, // Keeps everything just in case
  };
};