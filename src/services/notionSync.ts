import { Client } from "@notionhq/client";
import { Lead } from "../types/Lead";
import { markAsSynced } from "./database";

const notion = new Client({ auth: process.env.NOTION_API_KEY! });
const databaseId = process.env.NOTION_DATABASE_ID!;

export const syncToNotion = async (lead: Lead ): Promise<void> => {
    try {
        //checks if credentials are there
        if (!process.env.NOTION_API_KEY || !process.env.NOTION_DATABASE_ID) {
        console.warn('Notion credentials not configured, skipping sync');
        return;
        }
        await notion.pages.create({
            parent: { database_id: databaseId },
            properties: {
                Name: {
                title: [{ text: { content: lead.name } }],
                },
                Email: {
                email: lead.email,
                },
                Phone: {
                phone_number: lead.phone || '',
                },
                Company: {
                rich_text: [{ text: { content: lead.company || '' } }],
                },
                Message: {
                rich_text: [{ text: { content: lead.message } }],
                },
                Budget: {
                number: lead.budget || null,
                },
                Source: {
                select: { name: lead.source },
                },
                Status: {
                status: { name: lead.status },
                },
            },
        });

        if (lead.id) {
            await markAsSynced(lead.id);
        }

        console.log(`Lead ${lead.id} synced to Notion`);
    } catch (error) {
        console.error('Notion sync error', error);
        throw error;
    }
};