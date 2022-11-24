import {Router} from "express";
import {container} from "../composition-root";
import {AuthController} from "./controllers/auth-controller";
import {loginOrEmailAuthValidation, passwordAuthValidation} from "../middlewares/login-validation-middleware";
import {errorsMiddleware} from "../middlewares/errors-validation-middleware";

export const authRouter = Router({})

const authController = container.resolve(AuthController)

const login = authController.login.bind(authController)

authRouter.post('/login',
    loginOrEmailAuthValidation,
    passwordAuthValidation,
    errorsMiddleware,
    login)