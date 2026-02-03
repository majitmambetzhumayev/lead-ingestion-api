import { log } from 'node:console';
import { Pool } from 'pg';

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: process.env.NODE_ENV === 'production'
    ? { rejectUnauthorized: false }
    : false,
});

pool.on('connect', () => {
    console.log('Connected to PG')
});

pool.on('error' , (err) => {
    console.log('PG Error', err)
    process.exit(-1);
});

export default pool;