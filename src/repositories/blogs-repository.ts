import {injectable} from "inversify";
import {BlogClass} from "../types/types";
import {BlogsModel} from "../schemas/mongoose-schemas";
import {ObjectId} from "mongodb";

@injectable()

export class BlogsRepository {
    constructor(
    ) {
    }

    async createBlog (newBlog: BlogClass): Promise<BlogClass> {
        const blogInstance = new BlogsModel(newBlog)
        await blogInstance.save()
        return newBlog
    }

    async updateBlog (id: ObjectId, name: string, description: string, websiteUrl: string): Promise<boolean> {
        try {
            const result = await BlogsModel.findOneAndUpdate({id: id}, {$set: {name, description, websiteUrl}})
            return !!result
        } catch (e) {
            return false
        }
    }

    async deleteBlog (id: ObjectId): Promise<boolean> {
        const blogInstance = await BlogsModel.findOne({id: id})
        if (!blogInstance) return false
        await blogInstance.deleteOne()
        return true
    }
}