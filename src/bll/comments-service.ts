import {inject, injectable} from "inversify";
import {CommentClass, CommentForResponse} from "../types/types";
import {ObjectId} from "mongodb";
import {CommentsRepository} from "../repositories/comments-repository";

@injectable()

export class CommentsService {
    constructor(
        @inject('cr') protected commentsRepository: CommentsRepository
    ) {
    }

    async createComment (postId: ObjectId, content: string, userId: ObjectId, login: string): Promise<CommentForResponse> {
        const newComment = new CommentClass(
            new ObjectId(),
            content,
            userId,
            login,
            new Date(),
            postId
        )
        await this.commentsRepository.createComment(newComment)

        return {
            id: newComment.id,
            content: newComment.content,
            userId: newComment.userId,
            userLogin: newComment.userLogin,
            createdAt: newComment.createdAt
        }
    }

    async updateComment (id: ObjectId, content: string): Promise<boolean> {
        return await this.commentsRepository.updateComment(id, content)
    }

    async deleteComment(id: ObjectId): Promise<boolean> {
        return await this.commentsRepository.deleteComment(id)
    }
}