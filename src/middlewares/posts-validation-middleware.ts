import {body} from "express-validator";
import {BlogsQueryRepository} from "../repositories/blogs-query-repository";
import {ObjectId} from "mongodb";

const bqr = new BlogsQueryRepository()

export const titlePostValidation =
    body('title').isString().trim().isLength({min:3, max:30})
export const shortDescriptionPostValidation =
    body('shortDescription').isString().trim().isLength({min: 3, max: 100})
export const contentPostsValidation =
    body('content').isString().trim().isLength(({min:3, max: 1000}))
export const blogIdValidation =
    body('blogId').isMongoId().custom(async blogId => {
        const blog = await bqr.getOneBlogById(new ObjectId(blogId))
        if (!blog) throw new Error()
        return true
    })
