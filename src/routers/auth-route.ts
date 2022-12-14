import "reflect-metadata"
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
import {ipBlockMiddleware} from "../middlewares/ip-block-middleware";
import {passwordRecoveryValidation} from "../middlewares/password-recovery-validation";

export const authRouter = Router({})

const authController = container.resolve(AuthController)

const login = authController.login.bind(authController)
const aboutMe = authController.aboutMe.bind(authController)
const registration = authController.registration.bind(authController)
const confirmation = authController.confirmation.bind(authController)
const emailResending = authController.emailResending.bind(authController)
const createTokens = authController.refreshToken.bind(authController)
const logout = authController.logout.bind(authController)
const passwordRecovery = authController.passwordRecovery.bind(authController)
const newPassword = authController.newPassword.bind(authController)

authRouter.post('/login',
    ipBlockMiddleware('login'),
    loginOrEmailAuthValidation,
    passwordAuthValidation,
    errorsMiddleware,
    login)

authRouter.post('/registration',
    ipBlockMiddleware('registration'),
    loginUsersValidation,
    emailUsersValidation,
    passwordUsersValidation,
    errorsMiddleware,
    registration)

authRouter.post('/password-recovery',
    ipBlockMiddleware('password-recovery'),
    emailUsersValidation,
    errorsMiddleware,
    passwordRecovery)

authRouter.post('/new-password',
    ipBlockMiddleware('new-password'),
    passwordRecoveryValidation,
    errorsMiddleware,
    newPassword)

authRouter.post('/registration-confirmation',
    ipBlockMiddleware('registration-confirmation'),
    confirmation)

authRouter.post('/registration-email-resending',
    ipBlockMiddleware('registration-email-resending'),
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