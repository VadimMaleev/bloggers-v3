import {injectable} from "inversify";
import {CommentsService} from "../../domain/comments-service";
import {Request, Response} from "express";
import {jwtUtility} from "../../application/jwt-utility";
import {errorMessage} from "../../helpers/helper";
import {ObjectId} from "mongodb";

@injectable()
export class CommentsController {
    constructor(protected commentsService: CommentsService) {
    }

    async getCommentById(req: Request, res: Response) {
        let userId: ObjectId | null = null
        if(req.headers.authorization){
            userId = await jwtUtility.extractUserIdFromToken(req.headers.authorization.split(" ")[1])
        }
        const rightComment = await this.commentsService.getCommentsById(req.params.id, userId)
        if (rightComment) {
            res.status(200).send(rightComment)
        } else res.send(404)
    }

    async deleteCommentById(req: Request, res: Response) {
        const needComment: boolean = await this.commentsService.deleteCommentById(req.params.commentId);
        if (needComment) {
            return res.send(204)
        }
    }

    async updateCommentById(req: Request, res: Response) {
        const desiredComment: boolean = await this.commentsService.updateCommentById(req.params.commentId, req.body.content);

        if (desiredComment) {
            res.sendStatus(204)
        } else res.sendStatus(404)
    }

    async makeLikeOrUnlike(req: Request, res: Response) {
        const likeStatus = req.body.likeStatus
        if(likeStatus === "Like" || likeStatus === "Dislike" || likeStatus === "None") {
            const userId = await jwtUtility.extractUserIdFromToken(req.headers.authorization!.split(" ")[1])
            await this.commentsService.makeLikeOrUnlike(req.params.id, userId!, req.body.likeStatus)
            return res.sendStatus(204)
        } else return res.status(400).json(errorMessage("likeStatus"))
    }
}

