import {injectable} from "inversify";
import {BlogClass, BlogsPagType} from "../types";
import {BlogsModel} from "../schemas/mongoose-schemas";
import {ObjectId} from "mongodb";


@injectable()

export class BlogsQueryRepository {
    constructor() {
    }

    async getBlogs(name: string, page: number, pageSize: number, sortBy: string, sortDirection: "asc" | "desc"): Promise<BlogsPagType> {
        const items = await BlogsModel.find({'name': {$regex: name}}, {_id: 0})
            .sort({[sortBy]: sortDirection})
            .skip((page - 1) * pageSize).limit(pageSize).lean()
        return {
            pagesCount: Math.ceil(await BlogsModel.count(({'name': {$regex: name}})) / pageSize),
            page: page,
            pageSize: pageSize,
            totalCount: await BlogsModel.count(({'name': {$regex: name}})),
            items

        }
    }

    async getOneBlogById (id: ObjectId): Promise<BlogClass | null> {
        return BlogsModel.findOne({id: id}, {_id: 0}).lean();
    }
}