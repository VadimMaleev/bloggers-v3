import {inject, injectable} from "inversify";
import {Request, Response} from "express";
import {BlogsService} from "../../bll/blogs-service";
import {BlogsQueryRepository} from "../../repositories/blogs-query-repository";
import {ObjectId} from "mongodb";
import {PostsService} from "../../bll/posts-service";
import {PostsPagType} from "../../types";
import {PostsQueryRepository} from "../../repositories/posts-query-repository";


@injectable()

export class BlogsController {
    constructor(
        @inject('bs') protected blogsService: BlogsService,
        @inject('bqr') protected blogsQueryRepository: BlogsQueryRepository,
        @inject('ps') protected postsService: PostsService,
        @inject('pqr') protected postsQueryRepository: PostsQueryRepository
    ) {
    }

    async getBlogs(req: Request, res: Response) {
        const page = isNaN(Number(req.query.pageNumber)) ? 1 : +req.query.pageNumber!
        const pageSize = isNaN(Number(req.query.pageSize)) ? 10 : +req.query.pageSize!
        const name = req.query.searchNameTerm?.toString().toLowerCase() || ''
        const sortBy = req.query.sortBy?.toString() || "createdAt"
        let sortDirection: "desc" | "asc" = "desc"
        if (req.query.sortDirection && req.query.sortDirection === "asc") {
            sortDirection = "asc"
        }

        const blogs = await this.blogsQueryRepository.getBlogs(name, page, pageSize, sortBy, sortDirection)
        return res.status(200).send(blogs)
    }

    async getOneBlogById(req: Request, res: Response) {
        try {
            const blog = await this.blogsQueryRepository.getOneBlogById(new ObjectId(req.params.id))
            if(!blog) return res.sendStatus(404)
            return res.status(200).send(blog)
        } catch (e) {
            return res.sendStatus(404)
        }
    }

    async createBlog(req: Request, res: Response) {
        const newBlog = await this.blogsService.createBlog(req.body.name, req.body.youtubeUrl)
        res.status(201).send(newBlog)
    }

    async updateBlog(req: Request, res: Response) {
        try {
            const isUpdated = await this.blogsService.updateBlog(new ObjectId(req.params.id), req.body.name, req.body.youtubeUrl)
            if (!isUpdated) return res.sendStatus(404)
            return res.sendStatus(204)
            // isUpdated ? res.sendStatus(204) : res.sendStatus(404)
        } catch (e) {
            return res.sendStatus(404)
        }

    }

    async deleteBlog(req: Request, res: Response) {
        try {
            const isDeleted = await this.blogsService.deleteBlog(new ObjectId(req.params.id))
            if (isDeleted) {
                res.sendStatus(204)
            } else {
                res.sendStatus(404)
            }
        } catch (e) {
            return res.sendStatus(404)
        }
    }

    async createPostForBlog (req: Request, res: Response) {
        try {
            const newPost = await this.postsService.createPost(
                req.body.title,
                req.body.shortDescription,
                req.body.content,
                new ObjectId(req.params.id)
            )

            if (newPost === null) return res.sendStatus(404)
            res.status(201).send(newPost)

        } catch (e) {
            return res.sendStatus(404)
        }
    }

    async getPostsForBlog (req: Request, res: Response) {
        try {
            const pageNumber = isNaN(Number(req.query.pageNumber)) ? 1 : +req.query.pageNumber!
            const pageSize = isNaN(Number(req.query.pageSize)) ? 10 : +req.query.pageSize!
            const sortBy = req.query.sortBy?.toString() || "createdAt"
            let sortDirection: "desc" | "asc" = "desc"
            if (req.query.sortDirection && req.query.sortDirection === "asc") {
                sortDirection = "asc"
            }

            const postByBlogger: PostsPagType | null = await this.postsQueryRepository.getPostsForBlog(pageNumber, pageSize, new ObjectId(req.params.id), sortBy, sortDirection)
            if (!postByBlogger) return res.sendStatus(404)
             res.status(200).send(postByBlogger)
        } catch (e) {
            return res.sendStatus(404)
        }
    }
}