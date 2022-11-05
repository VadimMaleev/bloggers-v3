import 'reflect-metadata'
import {inject, injectable} from "inversify";
import {Request, Response} from "express";
import {PostsQueryRepository} from "../../repositories/posts-query-repository";
import {PostsService} from "../../bll/posts-service";
import {ObjectId} from "mongodb";

@injectable()
export class PostsController {
    constructor(
        @inject('ps') protected postsService: PostsService,
        @inject('pqr') protected postsQueryRepository: PostsQueryRepository
    ) {
    }

    async getPosts (req: Request, res: Response) {
        const posts = await this.postsQueryRepository.getPosts()
        return res.status(200).send(posts)
    }

    async getOnePost (req: Request, res: Response) {
        const post = await this.postsQueryRepository.getOnePost(new ObjectId(req.params.id))
        if (!post) return res.sendStatus(404)
        return res.status(200).send(post)
    }

    async createPost (req: Request, res: Response) {
        const newPost = await this.postsService.createPost(req.body.title, req.body.shortDescription,
                                                            req.body.content, req.body.blogId)
        return res.status(201).send(newPost)
    }

}