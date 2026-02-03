import pool from '../config/database';
import { Lead } from '../types/Lead';

export const saveLead = async (lead: Lead): Promise<Lead> => {
  const query = `
    INSERT INTO leads (name, email, phone, company, message, budget, source, status, metadata)
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
    RETURNING *
  `;

  const values = [
    lead.name,
    lead.email,
    lead.phone,
    lead.company,
    lead.message,
    lead.budget,
    lead.source,
    lead.status,
    lead.metadata ? JSON.stringify(lead.metadata) : null,
  ];

  const result = await pool.query(query, values);
  return result.rows[0];
};

export const getLeads = async (): Promise<Lead[]> => {
  const query = 'SELECT * FROM leads ORDER BY created_at DESC';
  const result = await pool.query(query);
  return result.rows;
};

export const getLeadById = async (id: number): Promise<Lead | null> => {
  const query = 'SELECT * FROM leads WHERE id = $1';
  const result = await pool.query(query, [id]);
  return result.rows[0] || null;
};

export const markAsSynced = async (id: number): Promise<void> => {
  const query = 'UPDATE leads SET synced_to_notion = true WHERE id = $1';
  await pool.query(query, [id]);
};