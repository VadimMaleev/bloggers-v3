import {NextFunction, Request, Response} from "express";
import {ObjectId} from "mongodb";
import {BloggerType} from "../repositories/types";
import {BlogsService} from "../domain/blogs-service";
import {myContainer} from "../composition-root";
import {errorMessage} from "../helpers/helper";

export const checkBlogInDB =  async (req: Request, res: Response, next: NextFunction) => {
    const blogsService = myContainer.resolve(BlogsService)
    const id = new ObjectId(req.params.id)
    const blog: BloggerType | null = await blogsService.getBlogById(id)

    if (!blog) {
        return res.status(404).send(errorMessage("bloggerId"))
    }
    next();
}