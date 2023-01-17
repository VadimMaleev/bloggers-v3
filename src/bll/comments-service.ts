import {inject, injectable} from "inversify";
import {CommentClass, CommentForResponse, LikeType} from "../types/types";
import {ObjectId} from "mongodb";
import {CommentsRepository} from "../repositories/comments-repository";
import {UsersQueryRepository} from "../repositories/users-query-repository";

@injectable()

export class CommentsService {
    constructor(
        @inject('cr') protected commentsRepository: CommentsRepository,
        @inject('uqr') protected usersQueryRepository: UsersQueryRepository
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

        return await this.commentsRepository.createComment(newComment)
        }


    async updateComment (id: ObjectId, content: string): Promise<boolean> {
        return await this.commentsRepository.updateComment(id, content)
    }

    async deleteComment(id: ObjectId): Promise<boolean> {
        return await this.commentsRepository.deleteComment(id)
    }

    async makeLikeOrUnlike(commentId: ObjectId, userId: ObjectId, likeStatus: LikeType) {
        const user = await this.usersQueryRepository.findUserById(userId!)
        return await this.commentsRepository.makeLikeOrUnlike(commentId, userId, user!.login, likeStatus)
    }
}