import 'reflect-metadata'
import {inject, injectable} from "inversify";
import {Request, Response} from "express";
import {PostsQueryRepository} from "../../repositories/posts-query-repository";
import {PostsService} from "../../bll/posts-service";
import {ObjectId} from "mongodb";
import {BlogsQueryRepository} from "../../repositories/blogs-query-repository";

@injectable()
export class PostsController {
    constructor(
        @inject('ps') protected postsService: PostsService,
        @inject('pqr') protected postsQueryRepository: PostsQueryRepository,
        @inject('bqr') protected blogsQueryRepository: BlogsQueryRepository
    ) {
    }

    async getPosts(req: Request, res: Response) {
        const page = isNaN(Number(req.query.pageNumber)) ? 1 : +req.query.pageNumber!
        const pageSize = isNaN(Number(req.query.pageSize)) ? 10 : +req.query.pageSize!
        const sortBy = req.query.sortBy?.toString() || "createdAt"
        let sortDirection: "desc" | "asc" = "desc"
        if (req.query.sortDirection && req.query.sortDirection === "asc") {
            sortDirection = "asc"
        }

        const posts = await this.postsQueryRepository.getPosts(page, pageSize, sortBy, sortDirection)
        return res.status(200).send(posts)
    }

    async getOnePostById(req: Request, res: Response) {
        try {
            const post = await this.postsQueryRepository.getOnePostById(new ObjectId(req.params.id))
            if (!post) return res.sendStatus(404)
            return res.status(200).send(post)
        } catch (e) {
            return res.sendStatus(404)
        }
    }

    async createPost(req: Request, res: Response) {
        const newPost = await this.postsService.createPost(req.body.title, req.body.shortDescription,
            req.body.content, new ObjectId(req.body.blogId))
        return res.status(201).send(newPost)
    }

    async updatePost(req: Request, res: Response) {
        try {
            const isUpdated = await this.postsService.updatePost(new ObjectId(req.params.id), req.body.title,
                req.body.shortDescription, req.body.content, new ObjectId(req.body.blogId))
            if (!isUpdated) return res.sendStatus(404)
            return res.sendStatus(204)
        } catch (e) {
            return res.sendStatus(404)
        }
    }

    async deletePost(req: Request, res: Response) {
        try {
            const isDeleted = await this.postsService.deletePost(new ObjectId(req.params.id))
            if(!isDeleted) return res.sendStatus(404)
            return res.sendStatus(204)
        } catch (e) {
            res.sendStatus(404)
        }
    }
}