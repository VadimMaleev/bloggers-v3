import {body} from "express-validator";

export const blogIdValid = body('blogId').isString().notEmpty()
export const contentCommentBodyValid = body('content').trim().isString().isLength({min: 20, max: 300})
export const LikeValid = body('likeStatus').notEmpty().isString().isLength({min: 4, max: 9})
