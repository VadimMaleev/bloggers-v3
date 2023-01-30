import "reflect-metadata";
import {BloggerDBType, BloggerRepType, BloggerType, LikeDBType, PostsRepType, PostType} from "./types";
import {Blogs, Likes, Posts} from "./db";
import {mapBlogger, mapPostExtendedLikesInfo} from "../helpers/helper";
import {injectable} from "inversify";
import {ObjectId} from "mongodb";

@injectable()
export class BlogsRepository {
    async getBlogs(name: string, pageNumber: number, pageSize: number): Promise<BloggerRepType> {
        const item = await Blogs.find({'name': {$regex: name}})
            .skip((pageNumber - 1) * pageSize).limit(pageSize).lean()
        const items: BloggerType[] = item.map(i => mapBlogger(i))
        return {
            pagesCount: Math.ceil(await Blogs.count(({'name': {$regex: name}})) / pageSize),
            page: pageNumber,
            pageSize: pageSize,
            totalCount: await Blogs.count(({'name': {$regex: name}})),
            items

        }
    }

    async getPostByBlogId(pageNumber: number, pageSize: number, bloggerId: string, userId: ObjectId | null): Promise<PostsRepType | null> {
        const findBlogger: number = await Blogs.count({'blogId': bloggerId})
        if (!findBlogger) return null
        const itemsDBType = await Posts.find({'blogId': bloggerId}).select({})
            .skip((pageNumber - 1) * pageSize).limit(pageSize).sort({createdAt: -1}).lean()
        const items: PostType[] = await Promise.all(itemsDBType
            .map(async (i) => {
                const result = await mapPostExtendedLikesInfo(i)
                let myLikeForPost: LikeDBType | null = null
                if (!userId) {
                    return result
                }
                myLikeForPost = await Likes.findOne({
                    userId: userId,
                    idObject: i._id
                }).lean()

                if (myLikeForPost) {
                    result.extendedLikesInfo.myStatus = myLikeForPost.status
                }
                return result
            }))
        return {
            pagesCount: Math.ceil(await Posts.count({'blogId': bloggerId}) / pageSize),
            page: pageNumber,
            pageSize: pageSize,
            totalCount: await Posts.count({'blogId': bloggerId}),
            items
        }
    }

    async getBlogById(id: ObjectId): Promise<BloggerType | null> {
        const needBlogger: BloggerDBType = await Blogs.findOne({_id: id}).lean();
        if (!needBlogger) return null
        return mapBlogger(needBlogger)
    }

    async deleteBlogById(id: string): Promise<boolean> {
        const result = await Blogs.deleteOne({_id: id})
        return result.deletedCount === 1
    }

    async deleteAllBlogs(): Promise<boolean> {
        await Blogs.deleteMany({});
        return true
    }

    async updateBlogById(id: string, name: string, youtubeUrl: string): Promise<boolean> {
        const result = await Blogs.updateOne({_id: id}, {$set: {name: name, youtubeUrl: youtubeUrl}})
        return result.matchedCount === 1
    }

    async createBlog(newBlogger: BloggerDBType): Promise<BloggerType> {
        await Blogs.insertMany(newBlogger)
        return mapBlogger(newBlogger)
    }
}

