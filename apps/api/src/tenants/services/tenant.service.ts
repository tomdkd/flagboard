import CreateTenantDTO from "../dto/create-tenant.dto";
import Tenant from "../interfaces/tenant.interface";
import TenantRepository from "../repositories/tenant.repository";
import UpdateTenantDTO from "../dto/update_tenant.dto";
import { ContentfulStatusCode } from "hono/utils/http-status";
import { logger } from "@api/config/logger";
import { Context } from "hono";

export default class TenantService {

    constructor(private tenantRepository: TenantRepository) { }

    async createTenant(dto: CreateTenantDTO): Promise<{ code: ContentfulStatusCode; message: string; }> {
        try {
            await this.tenantRepository.create(dto)
            return { code: 201, message: "Tenant created successfully" };
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : "An error occurred while creating the tenant";
            logger.error(`Error creating tenant: ${errorMessage}`);
            return { code: 500, message: errorMessage };
        }
    }

    async getAllTenants(): Promise<{ code: ContentfulStatusCode; tenants?: Tenant[]; message?: string; }> {
        try {
            const tenants = await this.tenantRepository.getAll()
            return { code: tenants.length > 0 ? 200 : 404, tenants };
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : "An error occurred while fetching tenants";
            logger.error(`Error fetching tenants: ${errorMessage}`);
            return { code: 500, message: errorMessage };
        }
    }

    async updateTenant(id: number, dto: UpdateTenantDTO): Promise<{ code: ContentfulStatusCode; message: string; }> {
        try {
            await this.tenantRepository.update(id, dto);
            logger.info(`Tenant with ID ${id} updated successfully`);
            return { code: 200, message: "Tenant updated successfully" };
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : "An error occurred while updating the tenant";
            logger.error(`Error updating tenant with ID ${id}: ${errorMessage}`);
            return { code: 500, message: errorMessage };
        }
    }

    async getTenantById(id: number): Promise<{ code: ContentfulStatusCode; message?: string, tenant?: Tenant | null; }> {
        try {
            const result = await this.tenantRepository.findById(id);
            return { code: result?.id ? 200 : 404, tenant: result };
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : "An error occurred while fetching the tenant";
            logger.error(`Error fetching tenant with ID ${id}: ${errorMessage}`);
            return { code: 500, message: errorMessage };
        }
    }

    async deleteTenant(id: number): Promise<{ code: ContentfulStatusCode; message: string; }> {
        const tenant = await this.tenantRepository.findById(id);

        if (tenant) {
            try {
                await this.tenantRepository.delete(id);
                return { code: 200, message: "Tenant deleted successfully" };
            } catch (error) {
                const errorMessage = error instanceof Error ? error.message : "An error occurred while deleting the tenant";
                logger.error(`Error deleting tenant with ID ${id}: ${errorMessage}`);
                return { code: 500, message: errorMessage };
            }
        }

        return { code: 404, message: "Tenant not found" };
    }

    getId(context: Context): number | null {
        const id = context.req.param('id');
        return id ? parseInt(id) : null;
    }

    getDTO<T>(context: Context): T {
        const dto = context.get('dto') as T;
        if (!dto) throw new Error('DTO not found in context');
        return dto;
    }

}