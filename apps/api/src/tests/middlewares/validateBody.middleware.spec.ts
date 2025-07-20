import { validateBody } from '@api/middlewares/validateBody.middleware';
import { Context, Next } from 'hono';
import UpdateTenantDTO from '@api/tenants/dto/update_tenant.dto';


describe('validateBody middleware', () => {
    let next: Next;
    let context: Context;

    beforeEach(() => {
        next = jest.fn();
        context = {
            req: {
                json: jest.fn(),
            },
            set: jest.fn(),
        } as unknown as Context;
    });

    it('should call next() and set DTO when body is valid', async () => {
        const validBody = { name: 'validName' };
        (context.req.json as jest.Mock).mockResolvedValue(validBody);

        const middleware = validateBody(UpdateTenantDTO);
        await middleware(context, next);

        expect(context.req.json).toHaveBeenCalled();
        expect(context.set).toHaveBeenCalledWith('dto', expect.any(UpdateTenantDTO));
        expect(next).toHaveBeenCalled();
    });

    it('should throw 400 error if JSON is invalid', async () => {
        (context.req.json as jest.Mock).mockImplementation(() => {
            throw new SyntaxError('Unexpected token');
        });

        const middleware = validateBody(UpdateTenantDTO);

        await expect(middleware(context, next)).rejects.toThrow('Invalid JSON');
        expect(next).not.toHaveBeenCalled();
    });

    it('should throw 400 error if validation fails', async () => {
        const invalidBody = { name: 1234 };
        const expectedError = [
            {
                property: 'name',
                constraints:
                {
                    isString: "name must be a string"
                }
            }
        ];
        (context.req.json as jest.Mock).mockResolvedValue(invalidBody);

        const middleware = validateBody(UpdateTenantDTO);

        await expect(middleware(context, next)).rejects.toThrow(JSON.stringify(expectedError));
        expect(next).not.toHaveBeenCalled();
    });
});