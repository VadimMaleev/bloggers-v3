import "reflect-metadata";
import {Router} from "express";
import {authMiddleware} from "../middlewares/auth-middleware";
import {checkErrorsValidation} from "../middlewares/bodyValidationBloggers";
import {emailValid, loginValid, passwordValid} from "../middlewares/bodyAuthValidation";
import {loginDuplicateValid} from "../middlewares/loginDuplicateValid";
import {emailDuplicateValid} from "../middlewares/emailDuplicateValid";
import {UsersController} from "./controllers/users-controller";
import {myContainer} from "../composition-root";


export const usersRouter = Router()

const usersController = myContainer.resolve(UsersController)

usersRouter.get('/', usersController.getUsers.bind(usersController))

usersRouter.post('/', authMiddleware,
    loginValid,
    emailValid,
    passwordValid,
    emailDuplicateValid,
    loginDuplicateValid,
    checkErrorsValidation,
    usersController.createUser.bind(usersController))

usersRouter.delete('/:id', authMiddleware, usersController.deleteUserById.bind(usersController))