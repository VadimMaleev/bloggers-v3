import {inject, injectable} from "inversify";
import {PostsService} from "../../domain/posts-service";
import {CommentsService} from "../../domain/comments-service";
import {Request, Response} from "express";
import {PostType} from "../../repositories/types";
import {ObjectId} from "mongodb";
import {extractUserIdFromHeaders} from "../../helpers/helper";
import {CommentsQueryRepository} from "../../repositories/query-repository/comments-query-repository";


@injectable()
export class PostsController {
    constructor(@inject(PostsService) protected postsService: PostsService,
                @inject(CommentsService) protected commentsService: CommentsService,
                @inject(CommentsQueryRepository) protected commentsQueryRepository: CommentsQueryRepository) {
    }

    async getPosts(req: Request, res: Response) {
        const userId: ObjectId | null = await extractUserIdFromHeaders(req)
        const pageNumber = Number(req.query.PageNumber) || 1
        const pageSize = Number(req.query.PageSize) || 10
        return res.status(200).send(await this.postsService.getPosts(pageNumber, pageSize, userId))
    }

    async getPostById(req: Request, res: Response) {
        const userId: ObjectId | null = await extractUserIdFromHeaders(req)
        const rightPost = await this.postsService.getPostById(req.params.id, userId)
        if (rightPost) {
            return res.status(200).send(rightPost)
        }
        return res.sendStatus(404)
    }

    async getCommentByPost(req: Request, res: Response) {
        const userId = await extractUserIdFromHeaders(req)
        const pageNumber = Number(req.query.PageNumber) || 1
        const pageSize = Number(req.query.PageSize) || 10
        const searchPost = await this.postsService.getPostById(req.params.postId)
        if (!searchPost) {
            return res.sendStatus(404)
        }
        const commentForPost = await this.commentsService.getCommentsForPost(req.params.postId, pageNumber, pageSize, userId)
        return res.status(200).send(commentForPost)
    }

    async createPost(req: Request, res: Response) {
        const userId: ObjectId | null = await extractUserIdFromHeaders(req)
        const rightPost = await this.postsService.createPost(req.body.title, req.body.shortDescription,
            req.body.content, req.body.blogId, userId)
        return res.status(201).send(rightPost)
    }

    async createCommentByPost(req: Request, res: Response) {
        const needPost: PostType | null = await this.postsService.getPostById(req.params.postId)
        if (!needPost) return res.sendStatus(404)
        const idNewComment = await this.commentsService.createComment(req.params.postId, req.body.content, req.headers.authorization!)
        const newComment = await this.commentsQueryRepository.getNewComment(idNewComment)
        return res.status(201).send(newComment)
    }

    async updatePost(req: Request, res: Response) {
        await this.postsService.updatePostById(req.params.id, req.body.title,
            req.body.shortDescription, req.body.content, req.body.blogId)
        return res.sendStatus(204)
    }

    async deletePostById(req: Request, res: Response) {
        const id: string = req.params.id;
        if (!(await this.postsService.getPostById(id))) {
            return res.sendStatus(404)
        }
        await this.postsService.deletePostById(id);
        await this.commentsService.deleteCommentByPostId(id)
        return res.sendStatus(204)
    }

    async deleteAllPost(req: Request, res: Response) {
        await this.postsService.deleteAllPost()
        return res.sendStatus(204)
    }

    async makeLikeOrUnlike(req: Request, res: Response) {
        const userId: ObjectId | null = await extractUserIdFromHeaders(req)
        await this.postsService.makeLikeOrUnlike(req.params.id, userId!, req.body.likeStatus)
        return res.sendStatus(204)
    }
}

