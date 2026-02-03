import { waitForDebugger } from 'node:inspector';
import pool from '../config/database';
import { Lead } from '../types/Lead';
import { Result } from 'pg';

export const saveLead = async (lead: Lead): Promise<Lead> => {
    //using back ticks here allows for the query to span multiple line for betetr readability
    const query = `
    INSERT INTO leads (name, email, phone, company, message, buget, source, status)
    VALUES($1, $2, $3, $4, $5, $6, $7, $8)
    RETURNING *
    `;

    const values = [
        lead.email,
        lead.phone,
        lead.company,
        lead.message,
        lead.budget,
        lead.source,
        lead.status,
    ];

    const result = await pool.query(query, values);
    return result.rows[0]
};

export const getLeads = async (): Promise<Lead[]> => { //gives an array of Leads => []
    //single line query, no need for back ticks 
    const query = 'SELECT * FROM leads ORDER BY created_at';
    const result = await pool.query(query);
    return result.rows;
}

export const getLeadById = async (id: number): Promise<Lead> => {
    const query = 'SELECT * FROM leads WHERE id = $1';
    const result = await pool.query(query, [id]);
    return result.rows[0] || null
}

export const markAsSynced = async (id: number): Promise<void> => { // we're not returning a Lead object, juste updating the table
    const query = 'UPDATE leads SET synced_to_notion = true WHERE id = $1';
    await pool.query(query, [id]);
}