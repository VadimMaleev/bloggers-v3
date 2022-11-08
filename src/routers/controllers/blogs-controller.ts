import {inject, injectable} from "inversify";
import {Request, Response} from "express";
import {BlogsService} from "../../bll/blogs-service";
import {BlogsQueryRepository} from "../../repositories/blogs-query-repository";
import {ObjectId} from "mongodb";


@injectable()

export class BlogsController {
    constructor(
        @inject('bs') protected blogsService: BlogsService,
        @inject('bqr') protected blogsQueryRepository: BlogsQueryRepository
    ) {
    }

    async getBlogs(req: Request, res: Response) {
        const blogs = await this.blogsQueryRepository.getBlogs()
        return res.status(200).send(blogs)
    }

    async getOneBlogById(req: Request, res: Response) {
        const blog = await this.blogsQueryRepository.getOneBlogById(new ObjectId(req.params.id))
        if(!blog) return res.sendStatus(404)
        return res.status(200).send(blog)
    }

    async createBlog(req: Request, res: Response) {
        const newBlog = await this.blogsService.createBlog(req.body.name, req.body.youtubeUrl)
        res.status(201).send(newBlog)
    }

    async updateBlog(req: Request, res: Response) {
        console.log('blogs controller')
        const isUpdated = await this.blogsService.updateBlog(new ObjectId(req.params.id), req.body.name, req.body.youtubeUrl)
        if (!isUpdated) return res.sendStatus(404)
        return res.sendStatus(204)
    }

    async deleteBlog(req: Request, res: Response) {
        const isDeleted = await this.blogsService.deleteBlog(new ObjectId(req.params.id))
        if(isDeleted) {
            res.sendStatus(204)
        } else {
            res.sendStatus(404)
        }
    }
}