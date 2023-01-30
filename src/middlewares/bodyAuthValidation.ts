import {body} from "express-validator";

export const loginValid =  body('login').isString().trim().isLength({min: 3, max: 10}).notEmpty()
export const emailValid = body('email').isEmail().notEmpty()
export const passwordValid =  body('password').isString().trim().isLength({min: 6, max: 20}).notEmpty()
export const codeValid =  body('code').isString().notEmpty()
export const recoveryCodeValid =  body('recoveryCode').isString().notEmpty()
export const accessTokenValid =  body('accessToken').isString().notEmpty()
export const newPasswordValid =  body('newPassword').isString().trim().isLength({min: 6, max: 20}).notEmpty()
