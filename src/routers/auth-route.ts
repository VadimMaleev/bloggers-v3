import {Router} from "express";
import {container} from "../composition-root";
import {AuthController} from "./controllers/auth-controller";
import {loginOrEmailAuthValidation, passwordAuthValidation} from "../middlewares/login-validation-middleware";
import {errorsMiddleware} from "../middlewares/errors-validation-middleware";
import {jwtAuthMiddleware, jwtRefreshAuthMiddleware} from "../middlewares/jwt-auth-middleware";
import {
    emailUsersValidation,
    loginUsersValidation,
    passwordUsersValidation
} from "../middlewares/users-validation-middleware";

export const authRouter = Router({})

const authController = container.resolve(AuthController)

const login = authController.login.bind(authController)
const aboutMe = authController.aboutMe.bind(authController)
const registration = authController.registration.bind(authController)
const confirmation = authController.confirmation.bind(authController)
const emailResending = authController.emailResending.bind(authController)
const createTokens = authController.createTokens.bind(authController)
const logout = authController.logout.bind(authController)

authRouter.post('/login',
    loginOrEmailAuthValidation,
    passwordAuthValidation,
    errorsMiddleware,
    login)

authRouter.post('/registration',
    loginUsersValidation,
    emailUsersValidation,
    passwordUsersValidation,
    errorsMiddleware,
    registration)

authRouter.post('/registration-confirmation',
    confirmation)

authRouter.post('/registration-email-resending',
    emailUsersValidation,
    errorsMiddleware,
    emailResending
)

authRouter.post('/refresh-token',
    jwtRefreshAuthMiddleware,
    createTokens)

authRouter.post('/logout',
    jwtRefreshAuthMiddleware,
    logout)

authRouter.get('/me',
    jwtAuthMiddleware,
    aboutMe)