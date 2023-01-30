import "reflect-metadata";
import {
    CommentDBType,
    CommentsRepType,
    CommentType,
    CommentTypeLikeInfoType,
    LikeDBType,
    LikesAndDislikeCounterType,
    LikeType, LikeTypeObj,
    LikeTypeToObject
} from "./types";
import {CommentModel, Likes} from "./db";
import {mapComment} from "../helpers/helper";
import {injectable} from "inversify";
import {ObjectId} from "mongodb";
import {Document} from "mongoose";

@injectable()
export class CommentsRepository {
    async getCommentsForPost(postId: string, pageNumber: number, pageSize: number, userId: ObjectId | null): Promise<CommentsRepType> {
        const itemsDBType = await CommentModel.find(({'postId': postId}))
            .skip((pageNumber - 1) * pageSize).limit(pageSize).sort({createdAt: -1}).lean()
        const items: CommentType[] = await Promise.all(itemsDBType.map(async i => {
            const result: CommentTypeLikeInfoType = await mapComment(i)
            let myLikeForComment: LikeTypeObj | undefined = undefined
            if (!userId) {
                return result
            }
            myLikeForComment = i.likesOrDislikes.find((u) => u.userId == userId)
            if (myLikeForComment) {
                result.likesInfo.myStatus = myLikeForComment.status
            }
            return result
        }))
        return {
            pagesCount: Math.ceil(await CommentModel.count(({'postId': postId})) / pageSize),
            page: pageNumber,
            pageSize: pageSize,
            totalCount: await CommentModel.count(({'postId': postId})),
            items
        }
    }

    async getCommentsById(id: string): Promise<CommentDBType & LikesAndDislikeCounterType & LikeTypeToObject  | null> {
        const needComment = await CommentModel.findOne({'_id': id}).lean()
        if (!needComment) return null
        return needComment
    }

    async deleteCommentById(id: string): Promise<boolean> {
        const result = await CommentModel.deleteOne({_id: id})
        return result.deletedCount === 1
    }

    async updateCommentById(id: string, content: string): Promise<boolean> {
        const result = await CommentModel.updateOne({_id: id}, {$set: {content: content}})
        return result.matchedCount === 1
    }

    async deleteCommentByPostId(postId: string): Promise<boolean> {
        const result = await CommentModel.deleteMany({postId: postId})
        return result.deletedCount > 0
    }

    async makeLikeOrUnlike(commentId: string, userId: ObjectId, userLogin: string, likeStatus: string): Promise<boolean> {
        const likeInDb: LikeDBType | undefined = await Likes.findOne({idObject: commentId, userId: userId}).lean()
        if (!likeInDb) {
            const likeOrUnlike =
                {
                    _id: new ObjectId(),
                    idObject: new ObjectId(commentId),
                    addedAt: new Date(),
                    userId: userId,
                    login: userLogin,
                    status: likeStatus,
                    postOrComment: "comment"
                }
            await Likes.insertMany(likeOrUnlike)
        }

        if (likeInDb && likeInDb.status !== likeStatus) {
            const like = await Likes.findOne({idObject: commentId, userId: userId})
            like!.status = likeStatus as LikeType
            like!.addedAt = new Date()
            await like!.save()
        }
        return true
    }

    async getMongooseCommentsById(id: string): Promise<Document & LikesAndDislikeCounterType & CommentDBType & LikeTypeToObject | null> {
        const needComment = await CommentModel.findOne({'_id': id})
        if (!needComment) return null
        return needComment
    }

    async getMyStatusToComment(commentId: string, userId: ObjectId): Promise<string | null> {
        const needComment = await CommentModel.findOne({'_id': commentId, 'likesOrDislikes.userId': userId})
        if (!needComment) return null
        return needComment.likesOrDislikes[0].status
    }
}