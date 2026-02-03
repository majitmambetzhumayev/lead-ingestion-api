# Lead Ingestion API

Multi-source lead ingestion and normalization API with automatic Notion sync. Built to receive leads from Make.com automation workflows.

## Features

- Webhook endpoint for Make.com integrations
- Intelligent data normalization across multiple sources (Google Forms, Typeform, Facebook Leads, etc.)
- PostgreSQL storage with automatic Notion synchronization
- Rate limiting and webhook validation
- Comprehensive test coverage

## Tech Stack

- Node.js + Express + TypeScript
- PostgreSQL
- Notion API
- Jest

## Installation
```bash
pnpm install
cp .env.example .env
# Configure .env with your credentials
```

## Database Setup
```sql
CREATE DATABASE lead_ingestion;

CREATE TABLE leads (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  phone VARCHAR(50),
  company VARCHAR(255),
  message TEXT NOT NULL,
  budget DECIMAL(10, 2),
  source VARCHAR(50) NOT NULL,
  status VARCHAR(50) DEFAULT 'new',
  synced_to_notion BOOLEAN DEFAULT false,
  received_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  metadata JSONB
);

CREATE INDEX idx_email ON leads(email);
CREATE INDEX idx_source ON leads(source);
CREATE INDEX idx_status ON leads(status);
```

## Usage

Development:
```bash
pnpm dev
```

Production:
```bash
pnpm build
pnpm start
```

Testing:
```bash
pnpm test
pnpm test:coverage
```

## API Endpoints

- `POST /api/webhooks/make` - Receive leads from Make.com workflows
- `GET /api/health` - Health check
- `GET /` - API information

## Make.com Integration

Configure the HTTP module in Make.com:

**URL:** `https://your-api-url.com/api/webhooks/make`  
**Method:** POST  
**Headers:** `Content-Type: application/json`  
**Body:**
```json
{
  "name": "{{trigger.name}}",
  "email": "{{trigger.email}}",
  "phone": "{{trigger.phone}}",
  "message": "{{trigger.message}}",
  "company": "{{trigger.company}}",
  "budget": "{{trigger.budget}}",
  "source": "google-forms"
}
```

## Environment Variables

Required variables (see `.env.example`):

- `DATABASE_URL` - PostgreSQL connection string
- `NOTION_API_KEY` - Notion integration key
- `NOTION_DATABASE_ID` - Target Notion database ID
- `MAKE_WEBHOOK_SECRET` - Webhook validation secret (optional)
- `PORT` - Server port (default: 3000)
- `NODE_ENV` - Environment (development/production)

## Deployment

Railway deployment:
1. Connect GitHub repository
2. Add PostgreSQL database
3. Run database schema SQL
4. Configure environment variables
5. Deploy

The API will be available at `https://your-app.up.railway.app`

## Project Structure
```
src/
├── config/         # Database and service configurations
├── controllers/    # Request handlers
├── middleware/     # Rate limiting, validation, error handling
├── routes/         # API route definitions
├── services/       # Business logic (normalization, Notion sync, database)
├── types/          # TypeScript type definitions
└── index.ts        # Application entry point
```

## License

MIT
