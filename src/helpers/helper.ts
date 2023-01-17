import "reflect-metadata"
import {JWTService} from "../bll/jwt-service";
import {Request} from "express";
import {ObjectId} from "mongodb";
import {container} from "../composition-root";
import {CommentClass, PostClass} from "../types/types";
import {LikesModel} from "../schemas/mongoose-schemas";

export const extractUserIdFromHeaders = async (req: Request): Promise<ObjectId | null> => {
    const jwtService = container.resolve(JWTService)
    const splited = req.headers.authorization?.split(' ');
    if (req.headers.authorization && splited?.length === 2) {
        return  await jwtService.extractUserIdFromToken(splited[1])
    }
    return null
}

// export const mapPostExtendedLikesInfo = async (post: PostClass): Promise<PostType> => ({
//     id: post._id.toString(),
//     title: post.title,
//     shortDescription: post.shortDescription,
//     content: post.content,
//     bloggerId: post.bloggerId,
//     bloggerName: post.bloggerName,
//     addedAt: post.addedAt,
//     extendedLikesInfo: {
//         likesCount: await LikeModelClass.count({"idObject": post._id, "status": "Like"}).lean(),
//         dislikesCount: await LikeModelClass.count({"idObject": post._id, "status": "Dislike"}).lean(),
//         myStatus: "None",
//         newestLikes: await LikeModelClass.find({"idObject": post._id, "status": "Like"}).sort({addedAt: -1})
//             .select("-_id -idObject -status -postOrComment").limit(3).lean()
//     }
// })

export const mapComment = async (comment: CommentClass) => ({
    id: comment.id,
    content: comment.content,
    userId: comment.userId,
    userLogin: comment.userLogin,
    createdAt: comment.createdAt,
    likesInfo: {
        likesCount: await LikesModel.count({"idOfEntity": comment.id, "status": "Like"}).lean(),
        dislikesCount: await LikesModel.count({"idOfEntity": comment.id, "status": "Dislike"}).lean(),
        myStatus: "None"
    }
})