import {injectable} from "inversify";
import {ObjectId} from "mongodb";
import {CommentsModel} from "../schemas/mongoose-schemas";
import {CommentForResponse, CommentsPagType} from "../types/types";

@injectable()

export class CommentsQueryRepository {
    constructor(

    ) {
    }

    async getCommentsForPost (postId: ObjectId, page: number, pageSize: number, sortBy: string, sortDirection: "asc" | "desc"): Promise<CommentsPagType> {
        const items = await CommentsModel.find({postId: postId}, {_id: 0, postId: 0})
            .sort({[sortBy]: sortDirection}).select({})
            .skip((page - 1) * pageSize).limit(pageSize).lean()
        //найти лайки
        //фильтр для

        return {
            pagesCount: Math.ceil(await CommentsModel.count({'postId': postId}) / pageSize),
            page: page,
            pageSize: pageSize,
            totalCount: await CommentsModel.count({'postId': postId}),
            items
        }
    }

    async getCommentById (id: ObjectId): Promise<CommentForResponse | null> {
        return CommentsModel.findOne({id: id}, {_id: 0, postId: 0})
    }
}