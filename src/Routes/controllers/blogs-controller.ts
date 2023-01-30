import {injectable} from "inversify";
import {BlogsService} from "../../domain/blogs-service";
import {PostsService} from "../../domain/posts-service";
import {Request, Response} from "express";
import {BloggerRepType, BloggerType, PostsRepType, PostType} from "../../repositories/types";
import {ObjectId} from "mongodb";
import {extractUserIdFromHeaders} from "../../helpers/helper";

@injectable()
export class BlogsController {
    constructor(protected blogsService: BlogsService,
                protected postsService: PostsService) {
    }

    async getBlogs(req: Request, res: Response) {
        const searchNameTerm: string = req.query.SearchNameTerm as string || ''
        const pageNumber: number = Number(req.query.PageNumber) || 1
        const pageSize: number = Number(req.query.PageSize) || 10
        const bloggers: BloggerRepType | undefined = await this.blogsService.getBlogs(searchNameTerm, pageNumber, pageSize)
        res.status(200).send(bloggers)
    }

    async getPostByBlogId(req: Request, res: Response) {
        const userId = await extractUserIdFromHeaders(req)
        const pageNumber: number = Number(req.query.PageNumber) || 1
        const pageSize: number = Number(req.query.PageSize) || 10
        const postByBlogger: PostsRepType | null = await this.blogsService.getPostByBlogId(pageNumber, pageSize, (req.params.id).trim().toString(), userId)
        if (!postByBlogger) {
            return res.sendStatus(404)
        } else res.status(200).send(postByBlogger)
    }

    async getBlogById(req: Request, res: Response) {
        const id = new ObjectId(req.params.id)
        const rightBloggers: BloggerType | null = await this.blogsService.getBlogById(id)
        if (rightBloggers) {
            res.status(200).send(rightBloggers)
        } else res.sendStatus(404)
    }

    async createBlog(req: Request, res: Response) {
        const newBlogger: BloggerType = await this.blogsService.createBlog(req.body.name, req.body.youtubeUrl)
        res.status(201).send(newBlogger)
    }

    async createPostByBlogId(req: Request, res: Response) {
        const rightPost = await this.postsService.createPost(req.body.title, req.body.shortDescription,
            req.body.content, req.params.id)
        res.status(201).send(rightPost)

    }

    async updateBlogById(req: Request, res: Response) {
        const desiredBlogger: boolean = await this.blogsService.updateBlogById(req.params.id, req.body.name, req.body.youtubeUrl);
        if (desiredBlogger) {
            res.sendStatus(204)
        } else res.sendStatus(404)
    }

    async deleteBlog(req: Request, res: Response) {
        const bloggerFiltered: boolean = await this.blogsService.deleteBlogById(req.params.id)
        if (bloggerFiltered) {
            res.sendStatus(204)
        } else res.sendStatus(404)
    }

    async deleteAllBlog(req: Request, res: Response) {
        await this.blogsService.deleteAllBlogs()
        res.sendStatus(204)
    }
}