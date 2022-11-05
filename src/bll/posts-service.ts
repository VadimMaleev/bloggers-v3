import "reflect-metadata"
import {inject, injectable} from "inversify";
import {PostClass} from "../types";
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

    async createPost(title: string, shortDescription: string, content: string, blogId: string){ //Promise<PostForResponse | null> {
        const blogger =  await this.blogsQueryRepository.getOneBlogById(new ObjectId(blogId))
        if (!blogger) return null
        const newPost = new PostClass(
            new ObjectId(),
            title,
            shortDescription,
            content,
            new ObjectId(blogId),
            blogger.name
        )
        return await this.postsRepository.createPost(newPost)
    }
}