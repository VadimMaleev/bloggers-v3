import {inject, injectable} from "inversify";
import {Request, Response} from "express";
import {CommentsQueryRepository} from "../../repositories/comments-query-repository";
import {ObjectId} from "mongodb";
import {CommentsService} from "../../bll/comments-service";
import {extractUserIdFromHeaders} from "../../helpers/helper";

@injectable()

export class CommentsController {
    constructor(
        @inject('cqr') protected commentsQueryRepository: CommentsQueryRepository,
        @inject('cs') protected commentsService: CommentsService
    ) {
    }

    async getCommentById (req: Request, res: Response) {
        try {
            let userId: ObjectId | null = null
            if (req.headers.authorization) {
                userId = await extractUserIdFromHeaders(req)
            }
            const comment = await this.commentsQueryRepository.getCommentById(new ObjectId(req.params.id), userId)
            if(!comment) return res.sendStatus(404)
            res.status(200).send(comment)
        } catch (e) {
            res.sendStatus(404)
        }
    }

    async updateComment (req: Request, res: Response) {
        try {
            const comment = await this.commentsQueryRepository.getCommentById(new ObjectId(req.params.id))
            if(!comment) return res.sendStatus(404)
            if(comment.userId.toHexString() !== req.user!.id.toHexString()) return res.sendStatus(403)

            const isUpdated = await this.commentsService.updateComment(new ObjectId(req.params.id), req.body.content)
            if(!isUpdated) return res.sendStatus(404)
            return res.sendStatus(204)
        } catch (e) {
            res.sendStatus(404)
        }
    }

    async deleteComment (req: Request, res: Response) {
        try {
            const comment = await this.commentsQueryRepository.getCommentById(new ObjectId(req.params.id))
            if (!comment) return res.sendStatus(404)
            if(comment.userId.toHexString() !== req.user!.id.toHexString()) return res.sendStatus(403)

            const isDeleted = await this.commentsService.deleteComment(new ObjectId(req.params.id))
            if (!isDeleted) return res.sendStatus(404)
            return res.sendStatus(204)
        } catch (e) {
            res.sendStatus(404)
        }
    }

    async makeLikeOrUnlike(req: Request, res: Response) {

            const comment = await this.commentsQueryRepository.getCommentById(new ObjectId(req.params.id))
            if (!comment) return res.sendStatus(404)
            const userId: ObjectId | null = await extractUserIdFromHeaders(req)
            await this.commentsService.makeLikeOrUnlike(new ObjectId(req.params.commentId), userId!, req.body.likeStatus)
            return res.sendStatus(204)


    }
}