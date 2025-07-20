import TenantController from '@api/tenants/controllers/tenant.controller';
import Tenant from '@api/tenants/interfaces/tenant.interface';
import TenantService from '@api/tenants/services/tenant.service';
import { Context } from 'hono';
import { ContentfulStatusCode } from 'hono/utils/http-status';

describe('TenantController', () => {
    let tenantService: jest.Mocked<TenantService>;
    let controller: TenantController;
    let context: Partial<Context>;

    beforeEach(() => {
        tenantService = {
            getDTO: jest.fn(),
            createTenant: jest.fn(),
            getId: jest.fn(),
            updateTenant: jest.fn(),
            getAllTenants: jest.fn(),
            getTenantById: jest.fn(),
            deleteTenant: jest.fn()
        } as unknown as jest.Mocked<TenantService>;

        controller = new TenantController(tenantService);

        context = {
            json: jest.fn(),
        };
    });

    describe('create', () => {
        it('should call createTenant with DTO and return success response', async () => {
            const dto = { name: 'New Tenant' };
            const serviceResponse = { code: 201 as ContentfulStatusCode, message: 'Tenant created successfully' };

            tenantService.getDTO.mockReturnValue(dto);
            tenantService.createTenant.mockResolvedValue(serviceResponse);

            await controller.create(context as Context);

            expect(tenantService.getDTO).toHaveBeenCalledWith(context);
            expect(tenantService.createTenant).toHaveBeenCalledWith(dto);
            expect(context.json).toHaveBeenCalledWith({ message: serviceResponse.message }, serviceResponse.code);
        });
    });

    describe('update', () => {
        it('should return 400 with message if ID is missing', async () => {
            const dto = { name: 'Update' };

            tenantService.getId.mockReturnValue(null);
            tenantService.getDTO.mockReturnValue(dto);

            await controller.update(context as Context);

            expect(context.json).toHaveBeenCalledWith({ message: 'Tenant ID is required' }, 400);
            expect(tenantService.updateTenant).not.toHaveBeenCalled();
        });

        it('should call service\'s updateTenant and return success response', async () => {
            const id = 1;
            const dto = { name: 'Update' };
            const serviceResponse = { code: 200 as ContentfulStatusCode, message: 'Tenant updated successfully' };

            tenantService.getId.mockReturnValue(id);
            tenantService.getDTO.mockReturnValue(dto);
            tenantService.updateTenant.mockResolvedValue(serviceResponse);

            await controller.update(context as Context);

            expect(tenantService.getId).toHaveBeenCalledWith(context);
            expect(tenantService.getDTO).toHaveBeenCalledWith(context);
            expect(tenantService.updateTenant).toHaveBeenCalledWith(id, dto);
            expect(context.json).toHaveBeenCalledWith({ message: serviceResponse.message }, serviceResponse.code);
        });

        it('should forward the code and message from the service to the response', async () => {
            const id = 42;
            const dto = { name: 'Updated Tenant' };
            const serviceResponse = { code: 418 as ContentfulStatusCode, message: 'I\'m a teapot' };

            tenantService.getId.mockReturnValue(id);
            tenantService.getDTO.mockReturnValue(dto);
            tenantService.updateTenant.mockResolvedValue(serviceResponse);

            await controller.update(context as Context);

            expect(context.json).toHaveBeenCalledWith({ message: serviceResponse.message }, serviceResponse.code);
        });
    });

    describe('getAll', () => {
        it('should return tenants list when service returns tenants', async () => {
            const tenants = [{ id: 1, name: 'Tenant1' }] as Tenant[];
            const serviceResponse = { code: 200 as ContentfulStatusCode, tenants };

            tenantService.getAllTenants.mockResolvedValue(serviceResponse);

            await controller.getAll(context as Context);

            expect(tenantService.getAllTenants).toHaveBeenCalled();
            expect(context.json).toHaveBeenCalledWith(tenants, serviceResponse.code);
        });

        it('should return message when service returns a message', async () => {
            const serviceResponse = { code: 404 as ContentfulStatusCode, message: 'No tenants found' };

            tenantService.getAllTenants.mockResolvedValue(serviceResponse);

            await controller.getAll(context as Context);

            expect(tenantService.getAllTenants).toHaveBeenCalled();
            expect(context.json).toHaveBeenCalledWith(serviceResponse.message, serviceResponse.code);
        });
    });

    describe('getById', () => {
        it('should return 400 if ID is missing', async () => {
            tenantService.getId.mockReturnValue(null);

            await controller.getById(context as Context);

            expect(context.json).toHaveBeenCalledWith({ message: 'Tenant ID is required' }, 400);
            expect(tenantService.getTenantById).not.toHaveBeenCalled();
        });

        it('should call getTenantById and return tenant data', async () => {
            const id = 1;
            const tenant = { id, name: 'Tenant1' } as Tenant;
            const serviceResponse = { code: 200 as ContentfulStatusCode, tenant };

            tenantService.getId.mockReturnValue(id);
            tenantService.getTenantById.mockResolvedValue(serviceResponse);

            await controller.getById(context as Context);

            expect(tenantService.getId).toHaveBeenCalledWith(context);
            expect(tenantService.getTenantById).toHaveBeenCalledWith(id);
            expect(context.json).toHaveBeenCalledWith(tenant, serviceResponse.code);
        });

        it('should call getTenantById and return message if present', async () => {
            const id = 1;
            const serviceResponse = { code: 404 as ContentfulStatusCode, message: 'Tenant not found' };

            tenantService.getId.mockReturnValue(id);
            tenantService.getTenantById.mockResolvedValue(serviceResponse);

            await controller.getById(context as Context);

            expect(tenantService.getId).toHaveBeenCalledWith(context);
            expect(tenantService.getTenantById).toHaveBeenCalledWith(id);
            expect(context.json).toHaveBeenCalledWith(serviceResponse.message, serviceResponse.code);
        });
    });

    describe('delete', () => {
        it('should return 400 if ID is missing', async () => {
            tenantService.getId.mockReturnValue(null);

            await controller.delete(context as Context);

            expect(context.json).toHaveBeenCalledWith({ message: 'Tenant ID is required' }, 400);
            expect(tenantService.deleteTenant).not.toHaveBeenCalled();
        });

        it('should call deleteTenant and return success response', async () => {
            const id = 1;
            const serviceResponse = { code: 200 as ContentfulStatusCode, message: 'Tenant deleted successfully' };

            tenantService.getId.mockReturnValue(id);
            tenantService.deleteTenant.mockResolvedValue(serviceResponse);

            await controller.delete(context as Context);

            expect(tenantService.getId).toHaveBeenCalledWith(context);
            expect(tenantService.deleteTenant).toHaveBeenCalledWith(id);
            expect(context.json).toHaveBeenCalledWith({ message: serviceResponse.message }, serviceResponse.code);
        });
    });
});