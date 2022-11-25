import {inject, injectable} from "inversify";
import {BlogClass} from "../types/types";
import {BlogsRepository} from "../repositories/blogs-repository";
import {ObjectId} from "mongodb";

@injectable()
export class BlogsService {
    constructor(
        @inject('br') protected blogsRepository: BlogsRepository
    ) {
    }
    async createBlog (name: string, description: string, websiteUrl: string): Promise<BlogClass> {
        const newBlog = new BlogClass(
            new ObjectId(),
            name,
            description,
            websiteUrl,
            new Date()
        )
        return await this.blogsRepository.createBlog(newBlog)
    }

    async updateBlog (id: ObjectId, name: string, description: string, websiteUrl: string): Promise<boolean> {
        return this.blogsRepository.updateBlog(id, name, description, websiteUrl)
    }

    async deleteBlog (id: ObjectId): Promise<boolean> {
        return this.blogsRepository.deleteBlog(id)
    }
}