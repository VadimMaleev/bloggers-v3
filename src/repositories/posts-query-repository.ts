import {injectable} from "inversify";
import {PostsModel} from "../schemas/mongoose-schemas";
import {PostClass} from "../types";
import {ObjectId} from "mongodb";

@injectable()

export class PostsQueryRepository {
    constructor() {
    }

    async getPosts(): Promise<PostClass[]> {
        return PostsModel.find({}, {_id: 0}).lean()
    }

    async getOnePostById(id: ObjectId): Promise<PostClass | null> {
        return PostsModel.findOne({id: id}, {_id: 0})
    }
}