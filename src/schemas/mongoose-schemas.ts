import * as mongoose from "mongoose";
import {BlogClass, CommentClass, DeviceClass, PostClass, TokenType, UserClass} from "../types/types";
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
    createdAt: Date,
    confirmationCode: String,
    codeExpirationDate: Date,
    isConfirmed: Boolean
}, {versionKey: false})

const commentsSchema = new mongoose.Schema<CommentClass>({
    id: ObjectId,
    content: String,
    userId: ObjectId,
    userLogin: String,
    createdAt: Date,
    postId: ObjectId
}, {versionKey: false})

const tokenSchema = new mongoose.Schema<TokenType>({
    _id: ObjectId,
    refreshToken: String
}, {versionKey: false})

const deviceSchema = new mongoose.Schema<DeviceClass>({
    ip: String,
    title: String,
    lastActiveDate: String,
    deviceId: String,
    userId: ObjectId
}, {versionKey: false})

export const BlogsModel = mongoose.model('blogs', blogsSchema)
export const PostsModel = mongoose.model('posts', postsSchema)
export const UsersModel = mongoose.model('users', usersSchema)
export const CommentsModel = mongoose.model('comments', commentsSchema)
export const TokensModel = mongoose.model('tokens', tokenSchema)
export const DevicesModel = mongoose.model('devices', deviceSchema)