import { Client, Pool, type PoolConfig } from 'pg';
import dotenv from 'dotenv';

dotenv.config();

let pool: Pool | null = null;

// Supabase requires SSL. Set DB_SSL=false only for a local Postgres without SSL.
function connectionConfig(): PoolConfig {
  return {
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT),
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    ssl: process.env.DB_SSL === 'false' ? false : { rejectUnauthorized: false },
  };
}

export function getClient() {
  return new Client(connectionConfig());
}

export function getPool() {
  if (!pool) {
    pool = new Pool(connectionConfig());
  }
  return pool;
}
