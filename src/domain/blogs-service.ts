import "reflect-metadata";
import {BloggerDBType, BloggerRepType, BloggerType} from "../repositories/types";
import {BlogsRepository} from "../repositories/blogs-repository";
import {injectable} from "inversify";
import {ObjectId} from "mongodb";

@injectable()
export class BlogsService {
    constructor(protected blogsRepository: BlogsRepository) {
    }

    async getBlogs(name: string, pageNumber: number, pageSize: number): Promise<BloggerRepType> {
        return await this.blogsRepository.getBlogs(name, pageNumber, pageSize)
    }
    async getPostByBlogId(pageNumber: number, pageSize: number, id: string, userId: ObjectId | null) {
        return await this.blogsRepository.getPostByBlogId(pageNumber, pageSize, id, userId)
    }
    async getBlogById(id: ObjectId): Promise<BloggerType | null> {
        return await this.blogsRepository.getBlogById(id)
    }
    async createBlog(name: string, youtubeUrl: string): Promise<BloggerType> {
        const newBlogger: BloggerDBType = {
            _id: new ObjectId(),
            name: name,
            youtubeUrl: youtubeUrl,
            createdAt: new Date()
        }
        return  await this.blogsRepository.createBlog(newBlogger)

    }
    async updateBlogById(id: string, name: string, youtubeUrl: string): Promise<boolean> {
        return  await this.blogsRepository.updateBlogById(id,name, youtubeUrl)
    }
    async deleteAllBlogs(): Promise<boolean> {
        return await this.blogsRepository.deleteAllBlogs()
    }
    async deleteBlogById(id: string): Promise<boolean> {
        return await this.blogsRepository.deleteBlogById(id)
    }
}
