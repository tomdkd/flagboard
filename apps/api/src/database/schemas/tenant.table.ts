import { relations } from "drizzle-orm";
import * as pg from "drizzle-orm/pg-core";
import { userTable } from "./user.table";

export const tenantTable = pg.pgTable("tenants", {
  id: pg.serial("id").primaryKey(),
  uuid: pg.uuid("uuid").defaultRandom().notNull().unique(),
  name: pg.text("name").notNull(),
  legal_name: pg.text("legal_name"),
  siret: pg.varchar("siret"),
  address: pg.text("address"),
  city: pg.text("city"),
  postal_code: pg.text("postal_code"),
  country: pg.text("country"),
  phone: pg.text("phone"),
  website: pg.text("website"),
  is_active: pg.boolean("is_active").default(true),
  updated_at: pg.timestamp("updated_at"),
  created_at: pg.timestamp("created_at").defaultNow(),
});

export const tenantRelations = relations(tenantTable, ({ many }) => ({
	users: many(userTable),
}));