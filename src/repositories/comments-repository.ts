import {injectable} from "inversify";
import {CommentClass} from "../types/types";
import {CommentsModel} from "../schemas/mongoose-schemas";
import {ObjectId} from "mongodb";

@injectable()

export class CommentsRepository {
    constructor(

    ) {
    }

    async createComment (newComment: CommentClass) {
        const commentInstance = new CommentsModel(newComment)
        await commentInstance.save()
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
}