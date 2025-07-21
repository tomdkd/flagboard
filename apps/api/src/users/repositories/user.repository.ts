import { eq } from "drizzle-orm";
import { database } from "../../database/database";
import { userTable } from "../../database/schemas/user.table";
import User from "../interfaces/user.interface";

export default class UserRepository {
    private readonly databaseinstance = database;

    async create(user: typeof userTable.$inferInsert) {
        return await this.databaseinstance.insert(userTable).values(user);
    }

    async getAll(): Promise<User[]> {
        return await this.databaseinstance.select().from(userTable) as User[];
    }

    async findById(id: number): Promise<User | null> {
        return await this.databaseinstance
            .select()
            .from(userTable)
            .where(eq(userTable.id, id))
            .then((rows) => rows[0] as User ?? null);
    }

    async update(id: number, user: Partial<typeof userTable.$inferInsert>) {
        return await this.databaseinstance
            .update(userTable)
            .set(user)
            .where(eq(userTable.id, id));
    }

    async delete(id: number) {
        return await this.databaseinstance.delete(userTable).where(eq(userTable.id, id));
    }
}