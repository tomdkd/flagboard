import { pgTable } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';
import { tenantTable } from './tenant.table';
import * as pg from "drizzle-orm/pg-core";

export const userTable = pgTable('users', {
  id: pg.serial("id").primaryKey(),
  uuid: pg.uuid("uuid").defaultRandom().notNull().unique(),
  tenant_id: pg.integer('tenant_id').notNull().references(() => tenantTable.id, { onDelete: 'cascade', onUpdate: 'cascade' }),
  email: pg.varchar('email', { length: 255 }).notNull().unique(),
  name: pg.varchar('name', { length: 255 }).notNull(),
  password: pg.varchar('password', { length: 255 }).notNull(),
  is_active: pg.boolean("is_active").default(true).notNull(),
  updated_at: pg.timestamp("updated_at"),
  created_at: pg.timestamp("created_at").defaultNow(),
});

export const userRelations = relations(userTable, ({ one }) => ({
  tenant: one(tenantTable, {
    fields: [userTable.tenant_id],
    references: [tenantTable.id],
  }),
}));