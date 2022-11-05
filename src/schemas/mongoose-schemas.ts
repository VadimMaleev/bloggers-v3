import * as mongoose from "mongoose";
import {BlogClass, PostClass} from "../types";
import {ObjectId} from "mongodb";

const blogsSchema = new mongoose.Schema<BlogClass>({
    id: ObjectId,
    name: String,
    youtubeUrl: String
}, {versionKey: false})

const postsSchema = new mongoose.Schema<PostClass>({
    id: ObjectId,
    title: String,
    shortDescription: String,
    content: String,
    blogId: String,
    blogName: String
}, {versionKey: false})

export const BlogsModel = mongoose.model('blogs', blogsSchema)
export const PostsModel = mongoose.model('posts', postsSchema)