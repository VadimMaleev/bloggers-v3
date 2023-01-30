import {
    BloggerDBType,
    CommentDBType,
    LikesAndDislikeCounterType,
    LikeTypeToObject,
    PostDBType,
    PostType
} from "../repositories/types";
import {Likes} from "../repositories/db";
import {ObjectId} from "mongodb";
import {jwtUtility} from "../application/jwt-utility";
import {Request} from "express";

export const errorMessage = (err: string) => ({errorsMessages: [{
    message: `${err} invalid`,
        field: `${err}`
}]})
export const mapPost = (post: PostDBType) => ({
    id: post._id.toString(),
    title: post.title,
    shortDescription: post.shortDescription,
    content: post.content,
    bloggerId: post.blogId,
    blogName: post.blogName,
    createdAt: post.createdAt
})
export const mapBlogger = (blogger: BloggerDBType) => ({
    id: blogger._id.toString(),
    name: blogger.name,
    youtubeUrl: blogger.youtubeUrl,
})
export const mapComment = async (comment: CommentDBType & LikesAndDislikeCounterType & LikeTypeToObject) => ({
    id: comment._id.toString(),
    content: comment.content,
    userId: comment.userId,
    userLogin: comment.userLogin,
    createdAt: comment.createdAt,
    likesInfo: {
        likesCount: comment.likesCount,
        dislikesCount: comment.dislikesCount,
        myStatus: "None"
    }
})



export const mapPostExtendedLikesInfo = async (post: PostDBType): Promise<PostType> => ({
    id: post._id.toString(),
    title: post.title,
    shortDescription: post.shortDescription,
    content: post.content,
    blogId: post.blogId,
    blogName: post.blogName,
    createdAt: post.createdAt,
    extendedLikesInfo: {
        likesCount: await Likes.count({"idObject": post._id, "status": "Like"}).lean(),
        dislikesCount: await Likes.count({"idObject": post._id, "status": "Dislike"}).lean(),
        myStatus: "None",
        newestLikes: await Likes.find({"idObject": post._id, "status": "Like"}).sort({addedAt: -1})
            .select("-_id -idObject -status -postOrComment").limit(3).lean()
    }
})

export const extractUserIdFromHeaders = async (req: Request): Promise<ObjectId | null> => {
    const splitHeadersAuth = req.headers.authorization?.split(' ');
    if (req.headers.authorization && splitHeadersAuth?.length === 2) {
        return  await jwtUtility.extractUserIdFromToken(splitHeadersAuth[1])
    }
    return null
}
