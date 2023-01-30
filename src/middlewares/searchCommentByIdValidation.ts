import {NextFunction, Request, Response} from "express";
import {myContainer} from "../composition-root";
import {CommentsService} from "../domain/comments-service";

export const searchCommentByIdValidation =  async (req: Request, res: Response, next: NextFunction) => {
    const commentService = myContainer.resolve(CommentsService)
    const commentId = req.params.id
    if (commentId.length !== 24 || !(await commentService.getCommentsById(req.params.id))) {
       return  res.sendStatus(404)
    }
    next()
}