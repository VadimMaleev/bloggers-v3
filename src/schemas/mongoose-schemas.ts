import * as mongoose from "mongoose";
import {BlogClass, CommentClass, PostClass, UserClass} from "../types/types";
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

const usersSchema = new mongoose.Schema<UserClass>({
    id: ObjectId,
    login: String,
    email: String,
    passwordHash: String,
    createdAt: Date
}, {versionKey: false})

const commentsSchema = new mongoose.Schema<CommentClass>({
    id: ObjectId,
    content: String,
    userId: ObjectId,
    userLogin: String,
    createdAt: Date,
    postId: ObjectId
}, {versionKey: false})

export const BlogsModel = mongoose.model('blogs', blogsSchema)
export const PostsModel = mongoose.model('posts', postsSchema)
export const UsersModel = mongoose.model('users', usersSchema)
export const CommentsModel = mongoose.model('comments', commentsSchema)