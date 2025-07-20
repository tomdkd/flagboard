import { env } from '../config/env';
import { drizzle } from 'drizzle-orm/node-postgres';
import { tenantsTable } from "./schemas/tenants.table";

const connectionString = `postgres://${env.DB_USER}:${env.DB_PASS}@${env.DB_HOST}:${env.DB_PORT ?? 5432}/${env.DB_NAME}`;

const databaseInstance = drizzle(connectionString);

export {
    databaseInstance as database,
    tenantsTable
};