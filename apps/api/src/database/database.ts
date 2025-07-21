import { env } from '../config/env';
import { drizzle } from 'drizzle-orm/node-postgres';
import { tenantTable } from "./schemas/tenant.table";
import { userTable } from './schemas/user.table';

const connectionString = `postgres://${env.DB_USER}:${env.DB_PASS}@${env.DB_HOST}:${env.DB_PORT ?? 5432}/${env.DB_NAME}`;

const databaseInstance = drizzle(connectionString);

export {
    databaseInstance as database,
    tenantTable,
    userTable,
};