import "reflect-metadata"
import {inject, injectable} from "inversify";
import {PostClass} from "../types/types";
import {BlogsQueryRepository} from "../repositories/blogs-query-repository";
import {ObjectId} from "mongodb";
import {PostsRepository} from "../repositories/posts-repository";

@injectable()
export class PostsService {
    constructor(
        @inject('pr') protected postsRepository: PostsRepository,
        @inject('bqr') protected blogsQueryRepository: BlogsQueryRepository
    ) {
    }

    async createPost(title: string, shortDescription: string, content: string, blogId: ObjectId): Promise<PostClass | null> {
        const blog =  await this.blogsQueryRepository.getOneBlogById(blogId)
        if (!blog) return null
        const newPost = new PostClass(
            new ObjectId(),
            title,
            shortDescription,
            content,
            new ObjectId(blogId),
            blog.name,
            new Date()
        )
        return await this.postsRepository.createPost(newPost)
    }

    async updatePost (postId: ObjectId, title: string, shortDescription: string, content: string, blogId: ObjectId): Promise<boolean> {
        return this.postsRepository.updatePost(postId, title, shortDescription, content, blogId)
    }

    async deletePost(id: ObjectId): Promise<boolean> {
        return this.postsRepository.deletePost(id)
    }
}