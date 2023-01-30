import "reflect-metadata";
import {
    CommentsRepType,
    CommentTypeLikeInfoType,
    LikeType,
    LikeTypeObj
} from "../repositories/types";
import {CommentsRepository} from "../repositories/comments-repository";
import {jwtUtility} from "../application/jwt-utility";
import {CommentModel, UserModel} from "../repositories/db";
import {ObjectId} from "mongodb";
import {injectable} from "inversify";
import {UsersService} from "./users-service";
import {Types} from "mongoose";

@injectable()
export class CommentsService {
    constructor(protected commentsRepository: CommentsRepository,
                protected usersService: UsersService) {
    }

    async getCommentsForPost(postId: string, pageNumber: number, pageSize: number, userId: ObjectId | null): Promise<CommentsRepType> {
        return await this.commentsRepository.getCommentsForPost(postId, pageNumber, pageSize, userId)
    }

    async createComment(postId: string, content: string, token: string): Promise<ObjectId> {
        const userId = await jwtUtility.extractUserIdFromToken(token.split(" ")[1])
        const userLogin = await UserModel.findOne({_id: String(userId)})
        const newComment = new CommentModel()
        newComment._id = new Types.ObjectId()
        newComment.content = content
        newComment.userId = String(userId)
        newComment.userLogin = userLogin!.accountData.userName
        newComment.createdAt = new Date()
        newComment.postId = postId
        newComment.likesCount = 0
        newComment.dislikesCount = 0
        newComment.likesOrDislikes = []
        await CommentModel.create(newComment)
        return newComment._id
    }

    async getCommentsById(id: string, userId?: ObjectId | null): Promise<CommentTypeLikeInfoType | null> {
        const comment = await this.commentsRepository.getCommentsById(id)
        if (!comment) return null
        let myLikeOrDislikeObj: LikeTypeObj | undefined = undefined
        let myLikeOrDislikeStatus = "None"
        if (userId) {
            myLikeOrDislikeObj = comment.likesOrDislikes.find((u) => u.userId == userId)
        }
        if (myLikeOrDislikeObj) {
            myLikeOrDislikeStatus = myLikeOrDislikeObj.status
        }
        return {
            id: comment._id.toString(),
            content: comment.content,
            userId: comment.userId,
            userLogin: comment.userLogin,
            createdAt: comment.createdAt,
            likesInfo: {
                likesCount: comment.likesCount,
                dislikesCount: comment.dislikesCount,
                myStatus: myLikeOrDislikeStatus
            }
        }
    }

    async deleteCommentById(id: string): Promise<boolean> {
        return await this.commentsRepository.deleteCommentById(id)
    }

    async deleteCommentByPostId(postId: string): Promise<boolean> {
        return await this.commentsRepository.deleteCommentByPostId(postId)
    }

    async updateCommentById(id: string, content: string): Promise<boolean> {
        return await this.commentsRepository.updateCommentById(id, content)
    }

    async makeLike(commentId: string, userId: ObjectId): Promise<boolean> {
        const comment = await this.commentsRepository.getMongooseCommentsById(commentId)
        const myStatus = await this.commentsRepository.getMyStatusToComment(commentId, userId)
        if (comment && myStatus === "Dislike") {
            comment.likesCount += 1
            comment.dislikesCount -= 1
            comment.likesOrDislikes[0].addedAt = new Date()
            comment.likesOrDislikes[0].status = "Like"
            await comment.save()
            return true
        }
        if (comment && myStatus === null) {
            comment.likesCount += 1

            const like = {
                _id: new ObjectId(),
                userId: userId,
                addedAt: new Date(),
                status: "Like"
            }

            comment.likesOrDislikes.push(like)
            await comment.save()
        }
        if (comment && myStatus === "None") {
            comment.likesCount += 1
            comment.likesOrDislikes[0].addedAt = new Date()
            comment.likesOrDislikes[0].status = "Like"
            await comment.save()
        }
        return true
    }

    async makeDislike(commentId: string, userId: ObjectId): Promise<boolean> {
        const comment = await this.commentsRepository.getMongooseCommentsById(commentId)
        const myStatus = await this.commentsRepository.getMyStatusToComment(commentId, userId)
        if (comment && myStatus === "Like") {
            comment.likesCount -= 1
            comment.dislikesCount += 1
            comment.likesOrDislikes[0].addedAt = new Date()
            comment.likesOrDislikes[0].status = "Dislike"
            await comment.save()
            return true
        }
        if (comment && myStatus === null) {
            comment.dislikesCount += 1

            const dislike = {
                _id: new ObjectId(),
                userId,
                addedAt: new Date(),
                status: "Dislike"
            }

            comment.likesOrDislikes.push(dislike)
            await comment.save()
        }
        if (comment && myStatus === "None") {
            comment.dislikesCount += 1
            comment.likesOrDislikes[0].addedAt = new Date()
            comment.likesOrDislikes[0].status = "Dislike"
            await comment.save()
        }
        return true
    }

    async resetLike(commentId: string, userId: ObjectId): Promise<boolean> {
        const comment = await this.commentsRepository.getMongooseCommentsById(commentId)
        const myStatus = await this.commentsRepository.getMyStatusToComment(commentId, userId)
        if (comment && myStatus === "Like") {
            comment.likesCount -= 1
            comment.likesOrDislikes[0].addedAt = new Date()
            comment.likesOrDislikes[0].status = "None"
            await comment.save()
            return true
        }
        if (comment && myStatus === "Dislike") {
            comment.dislikesCount -= 1
            comment.likesOrDislikes[0].addedAt = new Date()
            comment.likesOrDislikes[0].status = "None"
            await comment.save()
            return true
        }
        if (comment && myStatus === null) {
            const resetLike = {
                _id: new ObjectId(),
                userId,
                addedAt: new Date(),
                status: "None"
            }
            comment.likesOrDislikes.push(resetLike)
            await comment.save()
        }
        return true
    }

    async makeLikeOrUnlike(commentId: string, userId: ObjectId, likeStatus: LikeType): Promise<boolean> {
        const comment = await this.commentsRepository.getCommentsById(commentId)
        if (!comment) return false
        if (likeStatus === "Like") {
            return await this.makeLike(commentId, userId)
        }
        if (likeStatus === "Dislike") {
            return await this.makeDislike(commentId, userId)
        }
        if (likeStatus === "None") {
            return await this.resetLike(commentId, userId)
        }
        return true
    }
}