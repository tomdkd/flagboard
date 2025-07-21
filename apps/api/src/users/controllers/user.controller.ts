import { Context } from 'hono';
import CreateUserDTO from '../dto/create-user.dto';
import UpdateUserDTO from '../dto/update-user.dto';
import UserService from '../services/user.service';

export default class UserController {
    constructor(private userService: UserService) {}

    async create(context: Context) {
        const dto = this.userService.getDTO<CreateUserDTO>(context);
        const { code, message } = await this.userService.createUser(dto);
        return context.json({ message }, code);
    }

    async getAll(context: Context) {
        const { code, users, message } = await this.userService.getAllUsers();
        return context.json(message ?? users, code);
    }

    async getById(context: Context) {
        const id = this.userService.getId(context);
        if (!id) return context.json({ message: 'User ID is required' }, 400);

        const { code, user, message } = await this.userService.getUserById(id);
        return context.json(message ?? user, code);
    }

    async update(context: Context) {
        const id = this.userService.getId(context);
        const dto = this.userService.getDTO<UpdateUserDTO>(context);
        if (!id) return context.json({ message: 'User ID is required' }, 400);

        const { code, message } = await this.userService.updateUser(id, dto);
        return context.json({ message }, code);
    }

    async delete(context: Context) {
        const id = this.userService.getId(context);
        if (!id) return context.json({ message: 'User ID is required' }, 400);

        const { code, message } = await this.userService.deleteUser(id);
        return context.json({ message }, code);
    }
}