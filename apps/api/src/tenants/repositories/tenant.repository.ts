import { eq } from "drizzle-orm";
import { database } from "../../database/database";
import { tenantsTable } from "../../database/schemas/tenants.table";
import Tenant from "../interfaces/tenant.interface";

export default class TenantRepository {
    private readonly databaseinstance = database;

    async create(tenant: typeof tenantsTable.$inferInsert) {
        return await this.databaseinstance
            .insert(tenantsTable)
            .values(tenant);
    }

    async getAll(): Promise<Tenant[]> {
        return await this.databaseinstance
            .select()
            .from(tenantsTable) as Tenant[];
    }

    async update(id: number, tenant: Partial<typeof tenantsTable.$inferInsert>) {
        return await this.databaseinstance
            .update(tenantsTable)
            .set(tenant)
            .where(eq(tenantsTable.id, id));
    }

    async findById(id: number): Promise<Tenant | null> {
        return await this.databaseinstance
            .select()
            .from(tenantsTable)
            .where(eq(tenantsTable.id, id))
            .then((result) => {
                const row = result[0];
                if (!row) return null;
                return row as Tenant;
            });
    }

    async delete(id: number) {
        return await this.databaseinstance
            .delete(tenantsTable)
            .where(eq(tenantsTable.id, id));
    }
}