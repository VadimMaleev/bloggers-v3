import {NextFunction, Request, Response} from "express";
import {jwtUtility} from "../application/jwt-utility";
import {CommentsService} from "../domain/comments-service";
import {myContainer} from "../composition-root";

export const checkUserForOwner =  async (req: Request, res: Response, next: NextFunction) => {
    const commentsService = myContainer.resolve(CommentsService)
    const token: string = req.headers.authorization!.split(' ')[1]
    const userId = await jwtUtility.extractUserIdFromToken(token)
    const comment = await commentsService.getCommentsById(req.params.commentId)
    if (!comment) {
        return res.sendStatus(404)
    }
    if (String(userId) !== comment.userId) {
        return res.sendStatus(403)
    }
    next()
}