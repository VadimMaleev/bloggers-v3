import * as mongoose from "mongoose";
import {BlogClass, PostClass} from "../types";
import {ObjectId} from "mongodb";

const blogsSchema = new mongoose.Schema<BlogClass>({
    id: ObjectId,
    name: String,
    description: String,
    websiteUrl: String,
    createdAt: Date
}, {versionKey: false})

const postsSchema = new mongoose.Schema<PostClass>({
    id: ObjectId,
    title: String,
    shortDescription: String,
    content: String,
    blogId: ObjectId,
    blogName: String,
    createdAt: Date
}, {versionKey: false})

export const BlogsModel = mongoose.model('blogs', blogsSchema)
export const PostsModel = mongoose.model('posts', postsSchema)