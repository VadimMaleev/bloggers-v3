import {NextFunction, Request, Response} from "express";
import {BlogsService} from "../domain/blogs-service";
import {myContainer} from "../composition-root";

export const searchNeedBlogByPostValidation =  async (req: Request, res: Response, next: NextFunction) => {
    const blogsService = myContainer.resolve(BlogsService)
    if (!(await blogsService.getBlogById(req.body.blogId))) {
        res.status(400).send({
            errorsMessages: [{message: "Blog doesn't exist", field: "blogId"}]
        })
    }
    next()
}