import {injectable} from "inversify";
import {CommentTypeLikeInfoType} from "../types";
import {CommentModel, Likes} from "../db";
import {ObjectId} from "mongodb";

@injectable()
export class CommentsQueryRepository {
    async getNewComment(commentId: ObjectId): Promise<CommentTypeLikeInfoType> {
        const comment = await CommentModel.findById(commentId)
        return {
            id: comment!._id.toString(),
            content: comment!.content,
            userId: comment!.userId,
            userLogin: comment!.userLogin,
            createdAt: comment!.createdAt,
            likesInfo: {
                likesCount: comment!.likesCount,
                dislikesCount: comment!.dislikesCount,
                myStatus: "None"
            }
        }

    }
}