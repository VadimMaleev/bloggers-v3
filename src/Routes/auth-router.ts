import "reflect-metadata";
import {Router} from 'express'
import {checkErrorsValidation} from "../middlewares/bodyValidationBloggers";
import {loginAndPasswordValidation} from "../middlewares/loginAndPasswordValidation";
import {
    codeValid,
    emailValid,
    loginValid,
    newPasswordValid,
    passwordValid,
    recoveryCodeValid
} from "../middlewares/bodyAuthValidation";
import {counterInputOneIpInTenSec} from "../middlewares/counterInputOneIpInTenSec";
import {loginDuplicateValid} from "../middlewares/loginDuplicateValid";
import {emailDuplicateValid} from "../middlewares/emailDuplicateValid";
import {checkRefreshToken} from "../middlewares/checkRefreshToken";
import {authTokenMiddleware} from "../middlewares/Auth-token-middleware";
import {myContainer} from "../composition-root";
import {AuthController} from "./controllers/auth-controller";

export const authRouter = Router({})

const authController = myContainer.resolve(AuthController)

authRouter.post('/login',
    counterInputOneIpInTenSec("login"),
    loginAndPasswordValidation,
    loginValid,
    passwordValid,
    checkErrorsValidation,
    authController.login.bind(authController))

authRouter.post('/registration',
    counterInputOneIpInTenSec("registration"),
    loginValid,
    emailValid,
    passwordValid,
    loginDuplicateValid,
    emailDuplicateValid,
    checkErrorsValidation,
    authController.registration.bind(authController))

authRouter.post('/registration-email-resending',
    counterInputOneIpInTenSec("registration-email-resending"),
    emailValid,
    checkErrorsValidation,
    authController.registrationEmailResending.bind(authController))

authRouter.post('/registration-confirmation',
    counterInputOneIpInTenSec("registration-confirmation"),
    codeValid,
    checkErrorsValidation,
    authController.registrationConfirmation.bind(authController))

authRouter.post('/refresh-token',
    checkRefreshToken,
    authController.updateRefreshToken.bind(authController))

authRouter.get('/me',
    authTokenMiddleware,
    authController.infoAboutMe.bind(authController))

authRouter.post('/logout',
    checkRefreshToken,
    authController.logout.bind(authController))

authRouter.post('/password-recovery',
    counterInputOneIpInTenSec("password-recovery"),
    emailValid,
    checkErrorsValidation,
    authController.passwordRecovery.bind(authController))

authRouter.post('/new-password',
    counterInputOneIpInTenSec("new-password"),
    newPasswordValid,
    recoveryCodeValid,
    checkErrorsValidation,
    authController.newPassword.bind(authController))