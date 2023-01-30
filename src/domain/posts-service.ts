import "reflect-metadata";
import {PostsRepository} from "../repositories/posts-repository";
import {BlogsRepository} from "../repositories/blogs-repository";
import {
    BloggerType,
    LikeType,
    PostDBType,
    PostsRepType,
    PostType,
} from "../repositories/types";
import {ObjectId} from "mongodb";
import {inject, injectable} from "inversify";
import {UsersService} from "./users-service";
import {Types} from "mongoose";
import {mapPostExtendedLikesInfo} from "../helpers/helper";
import {Posts} from "../repositories/db";

@injectable()
export class PostsService {
    constructor(@inject(PostsRepository) protected postsRepository: PostsRepository,
                @inject(BlogsRepository) protected bloggersRepository: BlogsRepository,
                @inject(UsersService) protected usersService: UsersService) {
    }

    async getPosts(pageNumber: number, pageSize: number, userId: ObjectId | null): Promise<PostsRepType> {
        return await this.postsRepository.getPosts(pageNumber, pageSize, userId)
    }

    async getPostById(id: string, userId?: ObjectId | null): Promise<PostType | null> {
        return await this.postsRepository.getPostById(id, userId)
    }

    async deletePostById(id: string): Promise<boolean> {
        return await this.postsRepository.deletePostById(id)
    }

    async deleteAllPost(): Promise<boolean> {
        return await this.postsRepository.deleteAllPost()
    }

    async updatePostById(id: string, title: string, shortDescription: string, content: string, blogId: string): Promise<boolean> {
        return await this.postsRepository.updatePostById(id, title, shortDescription, content, blogId)
    }

    async createPost(title: string, shortDescription: string, content: string, blogId: string, userId?: ObjectId | null): Promise<PostType> {
        const rightBlog: BloggerType | null = await this.bloggersRepository.getBlogById(new ObjectId(blogId))
        const newPost: PostDBType = {
            _id: new Types.ObjectId(),
            title: title,
            shortDescription: shortDescription,
            content: content,
            blogId: blogId,
            blogName: rightBlog!.name,
            createdAt: new Date()
        }
        await Posts.create(newPost)
        return mapPostExtendedLikesInfo(newPost)
    }

    async makeLikeOrUnlike(postId: string, userId: ObjectId, likeStatus: LikeType): Promise<boolean> {
        const user = await this.usersService.returnInfoAboutMe(userId!)
        return await this.postsRepository.makeLikeOrUnlike(postId, userId, user.login, likeStatus)
    }
}

