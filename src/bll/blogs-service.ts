import {inject, injectable} from "inversify";
import {BlogClass} from "../types";
import {BlogsRepository} from "../repositories/blogs-repository";
import {ObjectId} from "mongodb";

@injectable()
export class BlogsService {
    constructor(
        @inject('br') protected blogsRepository: BlogsRepository
    ) {
    }
    async createBlog (name: string, youtubeUrl: string): Promise<BlogClass> {
        const newBlog = new BlogClass(
            new ObjectId(),
            name,
            youtubeUrl
        )
        return await this.blogsRepository.createBlog(newBlog)
    }

    async updateBlog (id: ObjectId, name: string, youtubeUrl: string): Promise<boolean> {
        return this.blogsRepository.updateBlog(id, name, youtubeUrl)
    }

    async deleteBlog (id: ObjectId): Promise<boolean> {
        return this.blogsRepository.deleteBlog(id)
    }
}