import {body, param} from "express-validator";

export const youtubeBodyValid = body('youtubeUrl').trim().isString().isURL({protocols: ['https']}).isLength({min: 1, max: 100})
export const nameBodyValid = body('name').isString().trim().isLength({min: 1, max: 15})
export const shortDescriptionBodyValid = body('shortDescription').isString().trim().isLength({max: 100}).notEmpty()
export const titleBodyValid = body('title').isString().trim().isLength({max: 30}).notEmpty()
export const contentBodyValid = body('content').isString().trim().isLength({max: 1000}).notEmpty()
param('postId').custom(async () => {
    //await
    //if (false) throw error()
    //return
})

