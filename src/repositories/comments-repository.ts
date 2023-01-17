import {injectable} from "inversify";
import {CommentClass, LikeForRepoClass, LikeType} from "../types/types";
import {CommentsModel, LikesModel} from "../schemas/mongoose-schemas";
import {ObjectId} from "mongodb";
import {mapComment} from "../helpers/helper";

@injectable()

export class CommentsRepository {
    constructor(

    ) {
    }

    async createComment (newComment: CommentClass) {
        await CommentsModel.insertMany(newComment)
        return mapComment(newComment)
    }

    async updateComment (id: ObjectId, content: string): Promise<boolean> {
        const commentInstance = await CommentsModel.findOne({id: id})
        if (!commentInstance) return false

        commentInstance.content = content
        await commentInstance.save()
        return true
    }

    async deleteComment (id: ObjectId): Promise<boolean> {
        const commentInstance = await CommentsModel.findOne({id: id})
        if (!commentInstance) return false

        await commentInstance.deleteOne()
        return true
    }

    async makeLikeOrUnlike(commentId: ObjectId, userId: ObjectId, login: string, likeStatus: LikeType) {
        const like: LikeForRepoClass | undefined =  await LikesModel.findOne({idOfEntity: commentId, userId: userId})
        if (!like) {
            const likeOrUnlike = new LikeForRepoClass(
                new ObjectId(),
                'comment',
                commentId,
                userId,
                login,
                new Date(),
                likeStatus
            )
            await LikesModel.insertMany(likeOrUnlike)
        }

        if (like && like.status !== likeStatus) {
            const like = await LikesModel.findOne({idOfEntity: commentId, userId: userId})
            like!.status = likeStatus as LikeType
            like!.addedAt = new Date()
            await like!.save()
        }
        return true
    }
}