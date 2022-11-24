import {Router} from "express";
import {container} from "../composition-root";
import {UsersController} from "./controllers/users-controller";
import {basicAuthMiddleware} from "../middlewares/basic-auth-middleware";
import {
    emailUsersValidation,
    loginUsersValidation,
    passwordUsersValidation
} from "../middlewares/users-validation-middleware";
import {errorsMiddleware} from "../middlewares/errors-validation-middleware";

export const usersRouter = Router({})

const usersController = container.resolve(UsersController)

const getUsers = usersController.getUsers.bind(usersController)
const createUser = usersController.createUser.bind(usersController)
const deleteUser = usersController.deleteUser.bind(usersController)

usersRouter.get('/',
    basicAuthMiddleware,
    getUsers)

usersRouter.post('/',
    basicAuthMiddleware,
    loginUsersValidation,
    emailUsersValidation,
    passwordUsersValidation,
    errorsMiddleware,
    createUser)

usersRouter.delete('/:id',
    basicAuthMiddleware,
    deleteUser)