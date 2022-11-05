import {injectable} from "inversify";
import {BlogClass} from "../types";
import {BlogsModel} from "../schemas/mongoose-schemas";
import {ObjectId} from "mongodb";


@injectable()

export class BlogsQueryRepository {
    constructor() {
    }

    async getBlogs(): Promise<BlogClass[]> {
        return BlogsModel.find({}, {_id: 0}).lean()
    }

    async getOneBlogById (id: ObjectId): Promise<BlogClass | null> {
        return BlogsModel.findOne({id: id}, {_id: 0}).lean();
    }
}