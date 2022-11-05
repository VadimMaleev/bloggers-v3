import "reflect-metadata"
import {PostClass, PostForResponse} from "../types";
import {ObjectId} from "mongodb";
import {PostsModel} from "../schemas/mongoose-schemas";
import {injectable} from "inversify";

@injectable()
export class PostsRepository {
    constructor() {
    }

    async createPost(newPost: PostClass): Promise<PostForResponse> {
        const postForResponse = {
            _id: new ObjectId(),
            ...newPost
        }
        await PostsModel.insertMany(newPost)
        return postForResponse
    }
}