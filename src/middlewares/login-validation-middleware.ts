import {body} from "express-validator";

export const loginOrEmailAuthValidation =
    body('loginOrEmail').isString().trim().isLength({min:3})

export const passwordAuthValidation =
    body('password').isString().trim()
