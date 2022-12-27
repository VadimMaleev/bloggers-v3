import {body} from "express-validator";

export const passwordRecoveryValidation =
    body('newPassword').isString().trim().isLength({min:6, max:20})