export interface Lead {
  id?: number;
  name: string;
  email: string;
  phone: string | null;
  company: string | null;
  message: string;
  budget: number | null;
  source: 'typeform' | 'google-forms' | 'facebook' | 'linkedin' | 'website' | 'zapier' | 'make';
  status: 'new' | 'contacted' | 'qualified' | 'lost';
  synced_to_notion?: boolean;
  received_at?: Date;
  created_at?: Date;
  metadata?: Record<string, any>; // Additionnal raw data
}

// Typeform webhook payload
export interface TypeformWebhook {
  event_id: string;
  event_type: string;
  form_response: {
    form_id: string;
    answers: Array<{
      field: { id: string; type: string; ref: string };
      type: string;
      text?: string;
      email?: string;
      phone_number?: string;
      number?: number;
    }>;
  };
}

// Google Forms (via Zapier)
export interface GoogleFormsWebhook {
  name: string;
  email: string;
  phone?: string;
  message: string;
  [key: string]: any;
}

// Facebook Lead Ads (via Zapier)
export interface FacebookLeadWebhook {
  full_name: string;
  email: string;
  phone_number?: string;
  company_name?: string;
  custom_question_answer?: string;
}

// Generic Zapier Format
export interface ZapierWebhook {
  name?: string;
  email?: string;
  phone?: string;
  company?: string;
  message?: string;
  budget?: string | number;
  source?: string;
  [key: string]: any;
}