import {body} from "express-validator";

export const nameBlogsValidation =
    body('name').isString().trim().isLength({min:3, max:15})
export const descriptionBlogsValidation =
    body('description').isString().trim().isLength({min:3, max: 500})
export const websiteUrlBlogsValidation =
    body('websiteUrl').isString().trim().isURL({protocols: ['https']}).isLength({min: 3, max: 100})
