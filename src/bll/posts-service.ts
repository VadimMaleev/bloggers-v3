import "reflect-metadata"
import {inject, injectable} from "inversify";
import {LikeType, PostClass, PostForResponse} from "../types/types";
import {BlogsQueryRepository} from "../repositories/blogs-query-repository";
import {ObjectId} from "mongodb";
import {PostsRepository} from "../repositories/posts-repository";
import {mapPostExtendedLikesInfo} from "../helpers/helper";
import {UsersQueryRepository} from "../repositories/users-query-repository";

@injectable()
export class PostsService {
    constructor(
        @inject('pr') protected postsRepository: PostsRepository,
        @inject('bqr') protected blogsQueryRepository: BlogsQueryRepository,
        @inject('uqr') protected usersQueryRepository: UsersQueryRepository
    ) {
    }

    async createPost(title: string, shortDescription: string, content: string, blogId: ObjectId): Promise<PostForResponse | null> {
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
        await this.postsRepository.createPost(newPost)
        return mapPostExtendedLikesInfo(newPost)
    }

    async updatePost (postId: ObjectId, title: string, shortDescription: string, content: string, blogId: ObjectId): Promise<boolean> {
        return await this.postsRepository.updatePost(postId, title, shortDescription, content, blogId)
    }

    async deletePost(id: ObjectId): Promise<boolean> {
        return this.postsRepository.deletePost(id)
    }

    async makeLikeOrUnlike(postId: ObjectId, userId: ObjectId, likeStatus: LikeType): Promise<boolean> {
        const user = await this.usersQueryRepository.findUserById(userId!)
        return await this.postsRepository.makeLikeOrUnlike(postId, userId, user!.login, likeStatus)
    }
}