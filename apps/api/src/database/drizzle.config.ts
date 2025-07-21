import * as dotenv from 'dotenv';
import { defineConfig } from "drizzle-kit";
import path from "path";

const dotEnvPath = path.resolve(__dirname, "../../../../.env");

dotenv.config({ path: dotEnvPath});

const connectionString = `postgres://${process.env.POSTGRES_USER}:${process.env.POSTGRES_PASSWORD}@${process.env.POSTGRES_HOST}:${process.env.POSTGRES_PORT ?? 5432}/${process.env.POSTGRES_DB}`;

export default defineConfig({
    dialect: "postgresql",
    schema: './src/database/schemas',
    out: './src/database/migrations',
    dbCredentials: {
        url: connectionString,
    }
});
