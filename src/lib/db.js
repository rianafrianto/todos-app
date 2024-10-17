import { Pool } from 'pg';

const pool = new Pool({
  user: process.env.DB_USER || 'postgres',
  host: process.env.DB_HOST || 'localhost',
  database: process.env.DB_NAME || 'todo',
  password: process.env.DB_PASSWORD || 'todo123',
  port: process.env.DB_PORT || 5432,
});

export default pool;
