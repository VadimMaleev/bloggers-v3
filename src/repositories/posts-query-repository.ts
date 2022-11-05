import {injectable} from "inversify";
import {PostsModel} from "../schemas/mongoose-schemas";
import {PostForResponse} from "../types";
import {ObjectId} from "mongodb";

@injectable()

export class PostsQueryRepository {
    constructor() {
    }

    async getPosts(): Promise<PostForResponse[]> {
        return PostsModel.find({}, {_id: 0, blogId: 0, blogName: 0}).lean()
    }

    async getOnePost(id: ObjectId): Promise<PostForResponse | null> {
        return PostsModel.findOne({id: id}, {_id: 0, blogId: 0, blogName: 0})
    }
}