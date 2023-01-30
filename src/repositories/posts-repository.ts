import "reflect-metadata";
import {LikeDBType, LikeType, PostDBType, PostsRepType, PostType} from "./types";
import {Likes, Posts} from "./db";
import {mapPostExtendedLikesInfo} from "../helpers/helper";
import {ObjectId} from "mongodb";
import {injectable} from "inversify";

@injectable()
export class PostsRepository {
    async getPosts(pageNumber: number, pageSize: number, userId: ObjectId | null): Promise<PostsRepType> {
        const item: PostDBType[] = await Posts.find({}).select({})
            .skip((pageNumber - 1) * pageSize).limit(pageSize).sort({createdAt: -1}).lean()
        const items: PostType[] = await Promise.all(item.map(async i => {
            const result: PostType = await mapPostExtendedLikesInfo(i)
            let myLikeForPost: LikeDBType | null = null
            if (!userId) {
                return result
            }
            if (userId) {
                myLikeForPost = await Likes.findOne({
                    userId: userId,
                    idObject: i._id
                }).lean()
            }
            if (myLikeForPost) {
                result.extendedLikesInfo.myStatus = myLikeForPost.status
            }
            return result
        }))
        return {
            pagesCount: Math.ceil(await Posts.count({}) / pageSize),
            page: pageNumber,
            pageSize: pageSize,
            totalCount: await Posts.count({}),
            items
        }
    }

    async getPostById(id: string, userId?: ObjectId | null): Promise<PostType | null> {
        const needPost: PostDBType | null = await Posts.findOne({_id: id}).lean()
        if (!needPost) return null
        let result: PostType = await mapPostExtendedLikesInfo(needPost)
        let myLikeForPost: LikeDBType | null = null
        if (!userId) {
            return result
        }
        if (userId) {
            myLikeForPost = await Likes.findOne({
                userId: userId,
                idObject: needPost._id
            }).lean()
        }
        if (myLikeForPost) {
            result.extendedLikesInfo.myStatus = myLikeForPost.status
        }
        return result
    }

    async deletePostById(id: string): Promise<boolean> {
        const result = await Posts.deleteOne({_id: id})
        return result.deletedCount === 1
    }

    async deleteAllPost(): Promise<boolean> {
        await Posts.deleteMany({})
        return true
    }

    async updatePostById(id: string, title: string, shortDescription: string, content: string, bloggerId: string): Promise<boolean> {
        const result = await Posts.updateOne({_id: id},
            {
                $set: {
                    title: title,
                    shortDescription: shortDescription,
                    content: content,
                    bloggerId: bloggerId
                }
            })
        return result.matchedCount === 1
    }

    async makeLikeOrUnlike(postId: string, userId: ObjectId, userLogin: string, likeStatus: string): Promise<boolean> {
        const likeInDb: LikeDBType | undefined = await Likes.findOne({idObject: postId, userId: userId}).lean()
        if (!likeInDb) {
            const likeOrUnlike =
                {
                    _id: new ObjectId(),
                    idObject: new ObjectId(postId),
                    addedAt: new Date(),
                    userId: userId,
                    login: userLogin,
                    status: likeStatus,
                    postOrComment: "post"
                }
            await Likes.insertMany(likeOrUnlike)
        }

        if (likeInDb && likeInDb.status !== likeStatus) {
            const like = await Likes.findOne({idObject: postId, userId: userId})
            like!.status = likeStatus as LikeType
            like!.addedAt = new Date()
            await like!.save()
        }
        return true
    }
}
