import { Hono } from "hono";
import TenantController from "../tenants/controllers/tenant.controller";
import TenantRepository from "../tenants/repositories/tenant.repository";
import TenantService from "../tenants/services/tenant.service";
import { validateBody } from "@api/middlewares/validateBody.middleware";
import CreateTenantDTO from "@api/tenants/dto/create-tenant.dto";
import UpdateTenantDTO from "@api/tenants/dto/update_tenant.dto";

// Repository
const tenantRepository = new TenantRepository();

// Service
const tenantService = new TenantService(tenantRepository);

// Controller
const tenantController = new TenantController(tenantService);

// Routes
const tenantsRoutes = new Hono();

tenantsRoutes.get("/", async (context) => await tenantController.getAll(context));
tenantsRoutes.post("/", validateBody(CreateTenantDTO), context => tenantController.create(context));
tenantsRoutes.get("/:id", context => tenantController.getById(context));
tenantsRoutes.patch("/:id", validateBody(UpdateTenantDTO), context => tenantController.update(context));
tenantsRoutes.delete("/:id", context => tenantController.delete(context));

export default tenantsRoutes;