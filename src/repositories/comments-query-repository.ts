import {injectable} from "inversify";
import {ObjectId} from "mongodb";
import {CommentsModel, LikesModel} from "../schemas/mongoose-schemas";
import {CommentForResponse, CommentsPagType, LikeForRepoClass} from "../types/types";
import {mapComment} from "../helpers/helper";

@injectable()

export class CommentsQueryRepository {
    constructor(

    ) {
    }

    async getCommentsForPost (postId: ObjectId, page: number, pageSize: number, sortBy: string, sortDirection: "asc" | "desc", userId: ObjectId | null): Promise<CommentsPagType> {
        const item = await CommentsModel.find({postId: postId}, {_id: 0, postId: 0})
            .sort({[sortBy]: sortDirection}).select({})
            .skip((page - 1) * pageSize).limit(pageSize).lean()

        const items = await Promise.all(item.map(async i => {
            const result: CommentForResponse = await mapComment(i)
            let myLikeForComment: LikeForRepoClass | null = null
            if (!userId) {
                return result
            }
            myLikeForComment = await LikesModel.findOne({
                userId: userId,
                idOfEntity: i.id
            }).lean()

            if (myLikeForComment) {
                result.likesInfo.myStatus = myLikeForComment.status
            }
            return result
        }))

        return {
            pagesCount: Math.ceil(await CommentsModel.count({'postId': postId}) / pageSize),
            page: page,
            pageSize: pageSize,
            totalCount: await CommentsModel.count({'postId': postId}),
            items
        }
    }

    async getCommentById (id: ObjectId, userId?: ObjectId | null): Promise<CommentForResponse | null> {
        const comment = await CommentsModel.findOne({id: id}).lean()
        if (!comment) return null
        const result: CommentForResponse = await mapComment(comment)
        let myLikeForComment: LikeForRepoClass | null = null
        if (!userId) {
            return result
        }
        myLikeForComment = await LikesModel.findOne({
            userId: userId,
            idOfEntity: comment.id
        }).lean()

        if (myLikeForComment) {
            result.likesInfo.myStatus = myLikeForComment.status
        }
        return result
    }
}