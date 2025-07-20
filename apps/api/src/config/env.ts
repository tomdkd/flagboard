import * as path from 'path';
import * as dotenv from 'dotenv';

const __filename = path.resolve('');
const __dirname = path.dirname(__filename);
const dotEnvPath = path.resolve(__dirname, ".././.env");

dotenv.config({ path: dotEnvPath});

function getEnv(name: string): string {
  const value = process.env[name];
  if (!value) throw new Error(`Missing env var: ${name}`);
  return value;
}

export const env = {
  DB_USER: getEnv('POSTGRES_USER'),
  DB_PASS: getEnv('POSTGRES_PASSWORD'),
  DB_HOST: getEnv('POSTGRES_HOST'),
  DB_PORT: getEnv('POSTGRES_PORT'),
  DB_NAME: getEnv('POSTGRES_DB'),
};