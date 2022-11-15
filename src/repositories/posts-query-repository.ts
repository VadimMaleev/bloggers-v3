import {injectable} from "inversify";
import {BlogsModel, PostsModel} from "../schemas/mongoose-schemas";
import {PostClass, PostsPagType} from "../types";
import {ObjectId} from "mongodb";

@injectable()

export class PostsQueryRepository {
    constructor() {
    }

    async getPosts(pageNumber: number, pageSize: number, sortBy: string, sortDirection: "asc" | "desc"): Promise<PostsPagType> {
        const items = await PostsModel.find({}, {_id: 0})
            .sort({[sortBy]: sortDirection}).select({})
            .skip((pageNumber - 1) * pageSize).limit(pageSize).lean()

        return {
            pagesCount: Math.ceil(await PostsModel.count({}) / pageSize),
            page: pageNumber,
            pageSize: pageSize,
            totalCount: await PostsModel.count({}),
            items
        }
    }

    async getOnePostById(id: ObjectId): Promise<PostClass | null> {
        return PostsModel.findOne({id: id}, {_id: 0})
    }

    async getPostsForBlog (pageNumber: number, pageSize: number, blogId: ObjectId,
                           sortBy: string, sortDirection: "asc" | "desc"): Promise<PostsPagType | null> {
        const findBlog = await BlogsModel.findOne({'id': blogId})
        if (!findBlog) return null
        const items = await PostsModel.find({'blogId': blogId}, {_id: 0})
            .sort({[sortBy]: sortDirection})
            .skip((pageNumber - 1) * pageSize).limit(pageSize).lean()

        return {
            pagesCount: Math.ceil(await PostsModel.count({'blogId': blogId}) / pageSize),
            page: pageNumber,
            pageSize: pageSize,
            totalCount: await PostsModel.count({'blogId': blogId}),
            items
        }
    }
}