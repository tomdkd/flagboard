import CreateTenantDTO from "@api/tenants/dto/create-tenant.dto";
import Tenant from "@api/tenants/interfaces/tenant.interface";
import TenantService from "@api/tenants/services/tenant.service";
import { validate } from "class-validator";
import * as fs from "fs";
import path from "path";

describe('TenantService', () => {
    const pathToFakeBdd = path.join(__dirname, 'mockTenants.bdd.json');
    const mockTenants = JSON.parse(fs.readFileSync(path.join(__dirname, 'tenants.mock.json'), 'utf-8'));
    const context = {
        get: jest.fn()
    } as any;
    const mockTenantRepository = {
        create: jest.fn().mockResolvedValue(undefined),
        getAll: jest.fn(() => JSON.parse(fs.readFileSync(pathToFakeBdd, 'utf-8'))),
        update: jest.fn().mockImplementation((id, dto) => {
            const tenant = JSON.parse(fs.readFileSync(pathToFakeBdd, 'utf-8'))[0];
            Object.keys(dto).forEach(key => {
                tenant[key] = dto[key];
            });
            fs.writeFileSync(pathToFakeBdd, JSON.stringify([tenant]));
        }),
        findById: jest.fn((id) => {
            const tenants = JSON.parse(fs.readFileSync(pathToFakeBdd, 'utf-8'));
            return tenants.find((tenant: Tenant) => {
                return tenant.id === id;
            }) || null;
        }),
        delete: jest.fn((id) => {
            const tenants = JSON.parse(fs.readFileSync(pathToFakeBdd, 'utf-8'));
            const updatedTenants = tenants.filter((tenant: Tenant) => tenant.id !== id);
            fs.writeFileSync(pathToFakeBdd, JSON.stringify(updatedTenants));
        })
    };

    let tenantService = new TenantService(mockTenantRepository as any);

    beforeEach(() => {
        fs.writeFileSync(pathToFakeBdd, JSON.stringify(mockTenants));
        jest.clearAllMocks();
        tenantService = new TenantService(mockTenantRepository as any);
    });

    afterAll(() => {
        fs.unlinkSync(path.join(__dirname, 'mockTenants.bdd.json'));
    });

    describe('createTenant', () => {
        it('should return 201 and success message on successful creation', async () => {
            const dto: CreateTenantDTO = { name: 'Test Tenant' };
            const result = await tenantService.createTenant(dto);

            expect(mockTenantRepository.create).toHaveBeenCalledWith(dto);
            expect(result.code).toBe(201);
            expect(result.message).toBe('Tenant created successfully');
        });

        it('should return 500 and error message on repository failure', async () => {
            mockTenantRepository.create.mockImplementationOnce(() => { throw new Error('DB error'); });

            const dto: CreateTenantDTO = { name: 'Test Tenant' };
            const resultFirst = await tenantService.createTenant(dto);

            expect(mockTenantRepository.create).toHaveBeenCalledWith(dto);
            expect(resultFirst.code).toBe(500);
            expect(resultFirst.message).toBe('DB error');

            mockTenantRepository.create.mockImplementationOnce(() => { throw 'DB error'; });
            const resultSecond = await tenantService.createTenant(dto);

            expect(resultSecond.code).toBe(500);
            expect(resultSecond.message).toBe('An error occurred while creating the tenant');
        });

        it('should validate a valid DTO', async () => {
            const dto = new CreateTenantDTO();
            dto.name = 'My Tenant';
            dto.siret = '12345678901234';
            dto.phone = '0123456789';

            const errors = await validate(dto);
            expect(errors.length).toBe(0);
        });

        it('should fail if name is missing', async () => {
            const dto = new CreateTenantDTO();
            const errors = await validate(dto);
            expect(errors.some(e => e.property === 'name')).toBe(true);
        });

        it('should fail if siret is not 14 digits', async () => {
            const dto = new CreateTenantDTO();
            dto.name = 'Tenant';
            dto.siret = '12345';

            const errors = await validate(dto);
            expect(errors.some(e => e.property === 'siret')).toBe(true);
        });

        it('should fail if siret contains non-digit chars', async () => {
            const dto = new CreateTenantDTO();
            dto.name = 'Tenant';
            dto.siret = '1234abcd567890';

            const errors = await validate(dto);
            expect(errors.some(e => e.property === 'siret')).toBe(true);
        });

        it('should fail if phone length is not 10', async () => {
            const dto = new CreateTenantDTO();
            dto.name = 'Tenant';
            dto.phone = '1234';

            const errors = await validate(dto);
            expect(errors.some(e => e.property === 'phone')).toBe(true);
        });

        it('should allow optional fields to be omitted', async () => {
            const dto = new CreateTenantDTO();
            dto.name = 'Tenant';

            const errors = await validate(dto);
            expect(errors.length).toBe(0);
        });
    })

    describe('getAllTenants', () => {
        it('should return 200 and list of tenants when tenants exist', async () => {
            const expectedTenants = [
                {
                    "id": 1,
                    "uuid": "f1418788-e9e0-41d7-bc32-428e15195cef",
                    "name": "toto",
                    "legal_name": "toto",
                    "siret": null,
                    "address": null,
                    "city": null,
                    "postal_code": null,
                    "country": null,
                    "phone": null,
                    "website": null,
                    "is_active": true,
                    "updated_at": null,
                    "created_at": "2025-07-18T22:49:11.817Z"
                }
            ]
            const service = new TenantService(mockTenantRepository as any);
            const result = await service.getAllTenants();

            expect(mockTenantRepository.getAll).toHaveBeenCalled();
            expect(result.code).toBe(200);
            expect(result.tenants).toEqual(expectedTenants);
        });

        it('should return 404 when no tenants exist', async () => {
            mockTenantRepository.getAll.mockResolvedValueOnce([]);

            const service = new TenantService(mockTenantRepository as any);
            const result = await service.getAllTenants();

            expect(mockTenantRepository.getAll).toHaveBeenCalled();
            expect(result.code).toBe(404);
            expect(result.tenants).toEqual([]);
        });

        it('should return 500 and error message on repository failure', async () => {
            mockTenantRepository.getAll.mockRejectedValueOnce(new Error('DB error'));

            const service = new TenantService(mockTenantRepository as any);
            const resultFirst = await service.getAllTenants();

            expect(mockTenantRepository.getAll).toHaveBeenCalled();
            expect(resultFirst.code).toBe(500);
            expect(resultFirst.message).toBe('DB error');

            mockTenantRepository.getAll.mockImplementationOnce(() => { throw 'DB Error' });

            const resultSecond = await service.getAllTenants();

            expect(resultSecond.code).toBe(500);
            expect(resultSecond.message).toBe('An error occurred while fetching tenants');
        });
    })

    describe('updateTenant', () => {
        it('should return 200 and success message on successful update', async () => {
            const id = 1;
            const dto = { name: 'Updated Tenant' };

            const result = await tenantService.updateTenant(id, dto);
            const updatedTenant = JSON.parse(fs.readFileSync(pathToFakeBdd, 'utf-8'))[0];

            expect(mockTenantRepository.update).toHaveBeenCalledWith(id, dto);
            expect(result.code).toBe(200);
            expect(result.message).toBe('Tenant updated successfully');
            expect(updatedTenant.name).toBe(dto.name);
        });

        it('should return 500 and error message on repository failure', async () => {
            const id = 1;
            const dto = { name: 'Updated Tenant' };
            mockTenantRepository.update.mockRejectedValueOnce(new Error('DB error'));

            const resultFirst = await tenantService.updateTenant(id, dto);

            expect(mockTenantRepository.update).toHaveBeenCalledWith(id, dto);
            expect(resultFirst.code).toBe(500);
            expect(resultFirst.message).toBe('DB error');

            mockTenantRepository.update.mockImplementationOnce(() => { throw 'DB Error' });

            const resultSecond = await tenantService.updateTenant(id, dto);

            expect(resultSecond.code).toBe(500);
            expect(resultSecond.message).toBe('An error occurred while updating the tenant');
        });
    });

    describe('getTenantById', () => {
        it('should return 200 and the tenant when found', async () => {
            const id = 1;
            const result = await tenantService.getTenantById(id);
            const expectedTenant = {
                "id": 1,
                "uuid": "f1418788-e9e0-41d7-bc32-428e15195cef",
                "name": "toto",
                "legal_name": "toto",
                "siret": null,
                "address": null,
                "city": null,
                "postal_code": null,
                "country": null,
                "phone": null,
                "website": null,
                "is_active": true,
                "updated_at": null,
                "created_at": "2025-07-18T22:49:11.817Z"
            }

            expect(mockTenantRepository.findById).toHaveBeenCalledWith(id);
            expect(result.code).toBe(200);
            expect(result.tenant).toEqual(expectedTenant);
        });

        it('should return 404 and no tenant when not found', async () => {
            const id = 20;
            const result = await tenantService.getTenantById(id);

            expect(mockTenantRepository.findById).toHaveBeenCalledWith(id);
            expect(result.code).toBe(404);
            expect(result.tenant).toBeNull();
        });

        it('should return 500 and error message on repository failure', async () => {
            const id = 1;
            mockTenantRepository.findById.mockRejectedValueOnce(new Error('DB error'));

            const result = await tenantService.getTenantById(id);

            expect(mockTenantRepository.findById).toHaveBeenCalledWith(id);
            expect(result.code).toBe(500);
            expect(result.message).toBe('DB error');

            mockTenantRepository.findById.mockImplementationOnce(() => { throw 'DB Error' });

            const resultSecond = await tenantService.getTenantById(id);
            expect(resultSecond.code).toBe(500);
            expect(resultSecond.message).toBe('An error occurred while fetching the tenant');
        });
    });

    describe('deleteTenant', () => {
        it('should return 200 and success message when tenant exists and is deleted', async () => {
            const id = 1;
            const result = await tenantService.deleteTenant(id);

            expect(mockTenantRepository.findById).toHaveBeenCalledWith(id);
            expect(mockTenantRepository.delete).toHaveBeenCalledWith(id);
            expect(result.code).toBe(200);
            expect(result.message).toBe('Tenant deleted successfully');
            const tenants = JSON.parse(fs.readFileSync(pathToFakeBdd, 'utf-8'));
            expect(tenants.length).toBe(0);
        });

        it('should return 404 and not found message when tenant does not exist', async () => {
            const id = 999;
            const result = await tenantService.deleteTenant(id);

            expect(mockTenantRepository.findById).toHaveBeenCalledWith(id);
            expect(result.code).toBe(404);
            expect(result.message).toBe('Tenant not found');
        });

        it('should return 500 and error message when delete throws an error', async () => {
            const id = 1;
            mockTenantRepository.delete.mockImplementationOnce(() => { throw new Error('Delete failed'); });

            const result = await tenantService.deleteTenant(id);

            expect(mockTenantRepository.findById).toHaveBeenCalledWith(id);
            expect(mockTenantRepository.delete).toHaveBeenCalledWith(id);
            expect(result.code).toBe(500);
            expect(result.message).toBe('Delete failed');

            mockTenantRepository.delete.mockImplementationOnce(() => { throw 'Delete failed'; });

            const resultSecond = await tenantService.deleteTenant(id);

            expect(resultSecond.code).toBe(500);
            expect(resultSecond.message).toBe('An error occurred while deleting the tenant');
        });
    })

    describe('getId', () => {
        it('should return parsed number when id param is present', () => {
            const context = {
                req: {
                    param: (key: string) => '42'
                }
            } as any;

            const result = tenantService.getId(context);
            expect(result).toBe(42);
        });

        it('should return null when id param is missing', () => {
            const context = {
                req: {
                    param: (key: string) => undefined
                }
            } as any;

            const result = tenantService.getId(context);
            expect(result).toBeNull();
        });

        it('should return NaN if id param is not a number', () => {
            const context = {
                req: {
                    param: (key: string) => 'abc'
                }
            } as any;

            const result = tenantService.getId(context);
            expect(result).toBeNaN();
        });
    });

    describe('getDTO', () => {
        it('should return the DTO from context when present', () => {
            const mockDto = { name: 'Test DTO' };
            context.get.mockReturnValue(mockDto);

            const result = tenantService.getDTO<typeof mockDto>(context);
            expect(context.get).toHaveBeenCalledWith('dto');
            expect(result).toEqual(mockDto);
        });

        it('should throw an error when DTO is not in context', () => {
            context.get.mockReturnValue(undefined);
            expect(() => tenantService.getDTO(context)).toThrow('DTO not found in context');
        });
    })
});