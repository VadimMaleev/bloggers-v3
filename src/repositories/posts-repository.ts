import "reflect-metadata"
import {LikeForRepoClass, LikeType, PostClass} from "../types/types";
import {ObjectId} from "mongodb";
import {LikesModel, PostsModel} from "../schemas/mongoose-schemas";
import {injectable} from "inversify";

@injectable()
export class PostsRepository {
    constructor() {
    }

    async createPost(newPost: PostClass) {
        await PostsModel.create(newPost)
    }

    async updatePost (postId: ObjectId, title: string, shortDescription: string, content: string, blogId: ObjectId): Promise<boolean> {
        const postInstance =  await PostsModel.findOne({id: postId})
        if (!postInstance) return false
        postInstance.title = title
        postInstance.shortDescription = shortDescription
        postInstance.content= content
        postInstance.blogId = blogId

        await postInstance.save()
        return true
    }

    async deletePost(id: ObjectId): Promise<boolean> {
        const postInstance = await PostsModel.findOne({id:id})
        if (!postInstance) return false
        await postInstance.deleteOne()
        return true
    }

    async makeLikeOrUnlike(postId: ObjectId, userId: ObjectId, login: string, likeStatus: LikeType) {
        const like: LikeForRepoClass | undefined =  await LikesModel.findOne({idOfEntity: postId, userId: userId})
        if (!like) {
            const likeOrUnlike = new LikeForRepoClass(
                new ObjectId(),
                'post',
                postId,
                userId,
                login,
                new Date(),
                likeStatus
            )
            await LikesModel.insertMany(likeOrUnlike)
        }

        if (like && like.status !== likeStatus) {
            const like = await LikesModel.findOne({idOfEntity: postId, userId: userId})
            like!.status = likeStatus as LikeType
            like!.addedAt = new Date()
            await like!.save()
        }
        return true
    }
}