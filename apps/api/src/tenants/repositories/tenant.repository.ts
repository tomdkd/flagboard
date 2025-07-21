import { eq } from "drizzle-orm";
import { database } from "../../database/database";
import { tenantTable } from "../../database/schemas/tenant.table";
import Tenant from "../interfaces/tenant.interface";

export default class TenantRepository {
    private readonly databaseinstance = database;

    async create(tenant: typeof tenantTable.$inferInsert) {
        return await this.databaseinstance
            .insert(tenantTable)
            .values(tenant);
    }

    async getAll(): Promise<Tenant[]> {
        return await this.databaseinstance
            .select()
            .from(tenantTable) as Tenant[];
    }

    async update(id: number, tenant: Partial<typeof tenantTable.$inferInsert>) {
        return await this.databaseinstance
            .update(tenantTable)
            .set(tenant)
            .where(eq(tenantTable.id, id));
    }

    async findById(id: number): Promise<Tenant | null> {
        return await this.databaseinstance
            .select()
            .from(tenantTable)
            .where(eq(tenantTable.id, id))
            .then((result) => {
                const row = result[0];
                if (!row) return null;
                return row as Tenant;
            });
    }

    async delete(id: number) {
        return await this.databaseinstance
            .delete(tenantTable)
            .where(eq(tenantTable.id, id));
    }
}