import {body} from "express-validator";

export const loginUsersValidation =
    body('login').isString().trim().isLength({min:3, max:10})
export const passwordUsersValidation =
    body('password').isString().trim().isLength({min:6, max:20})
export const emailUsersValidation =
    body("email").trim().isEmail()