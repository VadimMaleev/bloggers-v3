import "reflect-metadata"
import {PostClass} from "../types/types";
import {ObjectId} from "mongodb";
import {PostsModel} from "../schemas/mongoose-schemas";
import {injectable} from "inversify";

@injectable()
export class PostsRepository {
    constructor() {
    }

    async createPost(newPost: PostClass): Promise<PostClass> {
        const postForDB = {
            _id: new ObjectId(),
            ...newPost
        }
        await PostsModel.insertMany(postForDB)
        return newPost
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
}