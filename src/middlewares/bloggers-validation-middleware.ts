import {body, param} from "express-validator";

export const nameBloggersValidation =
    body('name').isString().trim().isLength({min:3, max:15})
export const youtubeUrlBloggersValidation =
    body('youtubeUrl').isString().trim().isURL({protocols: ['https']}).isLength({min: 3, max: 100})

export const idParamValidation =
    param('id').isMongoId()