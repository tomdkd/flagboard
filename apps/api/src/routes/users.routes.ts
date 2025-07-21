import { validateBody } from "@api/middlewares/validateBody.middleware";
import CreateTenantDTO from "@api/tenants/dto/create-tenant.dto";
import UpdateTenantDTO from "@api/tenants/dto/update_tenant.dto";
import UserController from "@api/users/controllers/user.controller";
import UserRepository from "@api/users/repositories/user.repository";
import UserService from "@api/users/services/user.service";
import { Hono } from "hono";

// Repository
const userRepository = new UserRepository();

// Service
const userService = new UserService(userRepository);

// Controller
const userController = new UserController(userService);

// Routes
const usersRoutes = new Hono();

usersRoutes.get("/", async (context) => await userController.getAll(context));
usersRoutes.post("/", validateBody(CreateTenantDTO), context => userController.create(context));
usersRoutes.get("/:id", context => userController.getById(context));
usersRoutes.patch("/:id", validateBody(UpdateTenantDTO), context => userController.update(context));
usersRoutes.delete("/:id", context => userController.delete(context));

export default usersRoutes;