import {body} from "express-validator";

export const titlePostValidation =
    body('title').isString().trim().isLength({min:3, max:30})
export const shortDescriptionPostValidation =
    body('shortDescription').isString().trim().isLength({min: 3, max: 100})
export const contentPostsValidation =
    body('content').isString().trim().isLength(({min:3, max: 1000}))
export const blogIdValidation =
    body('blogId').isMongoId()
