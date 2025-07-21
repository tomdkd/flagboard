import User from "../interfaces/user.interface";
import CreateUserDTO from "../dto/create-user.dto";
import UpdateUserDTO from "../dto/update-user.dto";
import { Context } from "hono";
import { ContentfulStatusCode } from "hono/utils/http-status";
import UserRepository from "../repositories/user.repository";

export default class UserService {
    constructor(private readonly userRepository: UserRepository) { }

    async createUser(dto: CreateUserDTO): Promise<{ code: ContentfulStatusCode; message: string }> {
        try {
            await this.userRepository.create(dto);
            return { code: 201, message: "User created successfully" };
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : "An error occurred while creating the user";
            return { code: 500, message: errorMessage };
        }
    }

    async getAllUsers(): Promise<{ code: ContentfulStatusCode; users?: User[]; message?: string }> {
        try {
            const users = await this.userRepository.getAll();
            if (!users.length) return { code: 404, users: [] };
            return { code: 200, users };
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : "An error occurred while fetching users";
            return { code: 500, message: errorMessage };
        }
    }

    async getUserById(id: number): Promise<{ code: ContentfulStatusCode; user?: User | null; message?: string }> {
        try {
            const user = await this.userRepository.findById(id);
            if (!user) return { code: 404, user: null };
            return { code: 200, user };
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : "An error occurred while fetching the user";
            return { code: 500, message: errorMessage };
        }
    }

    async updateUser(id: number, dto: UpdateUserDTO): Promise<{ code: ContentfulStatusCode; message: string }> {
        try {
            await this.userRepository.update(id, dto);
            return { code: 200, message: "User updated successfully" };
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : "An error occurred while updating the user";
            return { code: 500, message: errorMessage };
        }
    }

    async deleteUser(id: number): Promise<{ code: ContentfulStatusCode; message: string }> {
        try {
            const user = await this.userRepository.findById(id);
            if (!user) return { code: 404, message: "User not found" };

            await this.userRepository.delete(id);
            return { code: 200, message: "User deleted successfully" };
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : "An error occurred while deleting the user";
            return { code: 500, message: errorMessage };
        }
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