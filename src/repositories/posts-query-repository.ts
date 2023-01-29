import {injectable} from "inversify";
import {BlogsModel, LikesModel, PostsModel} from "../schemas/mongoose-schemas";
import {LikeForRepoClass, PostForResponse, PostsPagType} from "../types/types";
import {ObjectId} from "mongodb";
import {mapPostExtendedLikesInfo} from "../helpers/helper";

@injectable()

export class PostsQueryRepository {
    constructor() {
    }

    async getPosts(pageNumber: number, pageSize: number, sortBy: string, sortDirection: "asc" | "desc", userId: ObjectId | null): Promise<PostsPagType> {
        const item = await PostsModel.find({})
            .sort({[sortBy]: sortDirection}).select({})
            .skip((pageNumber - 1) * pageSize).limit(pageSize).lean()
        const items = await Promise.all(item.map(async i => {
            const result: PostForResponse = await mapPostExtendedLikesInfo(i)
            let myLikeForPost: LikeForRepoClass | null = null
            if (!userId) {
                return result
            }
            if (userId) {
                myLikeForPost = await LikesModel.findOne({
                    userId: userId,
                    idOfEntity: i.id
                }).lean()
            }
            if (myLikeForPost) {
                result.extendedLikesInfo.myStatus = myLikeForPost.status
            }
            return result
        }))
        return {
            pagesCount: Math.ceil(await PostsModel.count({}) / pageSize),
            page: pageNumber,
            pageSize: pageSize,
            totalCount: await PostsModel.count({}),
            items
        }
    }

    async getOnePostById(id: ObjectId, userId?: ObjectId | null): Promise<PostForResponse | null> {
        const needPost = await PostsModel.findOne({id: new ObjectId(id)}).lean()
        if (!needPost) return null
        let result: PostForResponse = await mapPostExtendedLikesInfo(needPost)
        let myLikeForPost: LikeForRepoClass | null = null
        if (!userId) {
            return result
        }
        if (userId) {
            myLikeForPost = await LikesModel.findOne({
                userId: userId,
                idOfEntity: needPost.id
            }).lean()
        }
        if (myLikeForPost) {
            result.extendedLikesInfo.myStatus = myLikeForPost.status
        }
        return result
    }

    async getPostsForBlog (pageNumber: number, pageSize: number, blogId: ObjectId,
                           sortBy: string, sortDirection: "asc" | "desc", userId: ObjectId | null): Promise<PostsPagType | null> {
        const findBlog = await BlogsModel.findOne({'id': blogId})
        if (!findBlog) return null
        const item = await PostsModel.find({})
            .sort({[sortBy]: sortDirection}).select({})
            .skip((pageNumber - 1) * pageSize).limit(pageSize).lean()
        const items = await Promise.all(item.map(async i => {
            const result: PostForResponse = await mapPostExtendedLikesInfo(i)
            let myLikeForPost: LikeForRepoClass | null = null
            if (!userId) {
                return result
            }
            if (userId) {
                myLikeForPost = await LikesModel.findOne({
                    userId: userId,
                    idOfEntity: i.id
                }).lean()
            }
            if (myLikeForPost) {
                result.extendedLikesInfo.myStatus = myLikeForPost.status
            }
            return result
        }))
        return {
            pagesCount: Math.ceil(await PostsModel.count({}) / pageSize),
            page: pageNumber,
            pageSize: pageSize,
            totalCount: await PostsModel.count({}),
            items
        }
    }
}