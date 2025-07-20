import { Context } from "hono";
import TenantService from "../services/tenant.service";
import CreateTenantDTO from "../dto/create-tenant.dto";
import UpdateTenantDTO from "../dto/update_tenant.dto";
import { logger } from "@api/config/logger";

export default class TenantController {
    constructor(private tenantService: TenantService) { }

    async create(context: Context) {
        const dto = this.tenantService.getDTO<CreateTenantDTO>(context);
        const { code, message } = await this.tenantService.createTenant(dto);

        logger.info(`Tenant created: ${message}`);

        return context.json({ message }, code);
    }

    async update(context: Context) {
        const id = this.tenantService.getId(context);
        const dto = this.tenantService.getDTO<UpdateTenantDTO>(context);

        if (!id) return context.json({ message: 'Tenant ID is required' }, 400);

        const { code, message } = await this.tenantService.updateTenant(id, dto);

        return context.json({ message }, code);
    }

    async getAll(context: Context) {
        const { code, message, tenants } = await this.tenantService.getAllTenants();
        return context.json(message ?? tenants, code);
    }

    async getById(context: Context) {
        const id = this.tenantService.getId(context);
        if (!id) return context.json({ message: 'Tenant ID is required' }, 400);

        const { code, message, tenant } = await this.tenantService.getTenantById(id);

        return context.json(message ?? tenant, code);
    }

    async delete(context: Context) {
        const id = this.tenantService.getId(context);

        if (!id) return context.json({ message: 'Tenant ID is required' }, 400);

        const { message, code } = await this.tenantService.deleteTenant(id);

        logger.info(`Tenant with ID ${id} deleted: ${message}`);

        return context.json({ message }, code);
    }
}