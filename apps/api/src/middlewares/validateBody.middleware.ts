import { plainToInstance } from 'class-transformer'
import { validate } from 'class-validator'
import { Context, Next } from 'hono'
import { HTTPException } from 'hono/http-exception'

export function validateBody<T extends object>(DTOClass: new () => T) {
    return async (c: Context, next: Next) => {
        let dto: T
        try {
            const body = await c.req.json()
            dto = plainToInstance(DTOClass, body)
        } catch {
            throw new HTTPException(400, { message: 'Invalid JSON' })
        }
        const errors = await validate(dto)
        if (errors.length > 0) {
            throw new HTTPException(400, {
                message: JSON.stringify(errors.map(e => ({
                    property: e.property,
                    constraints: e.constraints,
                }))),
            })
        }
        c.set('dto', dto) !
        await next()
    }
}