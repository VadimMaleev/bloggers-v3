import {NextFunction, Request, Response} from "express";
import {PostsService} from "../domain/posts-service";
import {myContainer} from "../composition-root";

export const searchPostByIdValidation =  async (req: Request, res: Response, next: NextFunction) => {
    const postsService = myContainer.resolve(PostsService)
    const postId = req.params.id
    if (postId.length !== 24 || !(await postsService.getPostById(postId))) {
        return  res.sendStatus(404)
    }
    next()
}