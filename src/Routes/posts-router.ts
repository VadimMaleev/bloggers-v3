import "reflect-metadata";
import {Router} from "express";
import {authMiddleware} from "../middlewares/auth-middleware";
import {checkErrorsValidation} from "../middlewares/bodyValidationBloggers";
import {searchPostByIdValidation} from "../middlewares/searchPostByIdValidation";
import {searchNeedBlogByPostValidation} from "../middlewares/searchNeedBlogByPostValidation";
import {authTokenMiddleware} from "../middlewares/Auth-token-middleware";
import {contentBodyValid, shortDescriptionBodyValid, titleBodyValid} from "../middlewares/bodyBlogValidation";
import {blogIdValid, contentCommentBodyValid, LikeValid} from "../middlewares/bodyPostValidation";
import {myContainer} from "../composition-root";
import {PostsController} from "./controllers/posts-controller";
import {likeStatusValidation} from "../middlewares/likeStatusValidation";

export const postsRouter = Router()

const postsController = myContainer.resolve(PostsController)

postsRouter.get('/', postsController.getPosts.bind(postsController))

postsRouter.get('/:id', postsController.getPostById.bind(postsController))

postsRouter.get('/:postId/comments', postsController.getCommentByPost.bind(postsController))

postsRouter.post('/', authMiddleware,
    shortDescriptionBodyValid,
    titleBodyValid,
    contentBodyValid,
    blogIdValid,
    checkErrorsValidation, searchNeedBlogByPostValidation,
    postsController.createPost.bind(postsController))

postsRouter.post('/:postId/comments',
    authTokenMiddleware,
    contentCommentBodyValid,
    checkErrorsValidation,
    postsController.createCommentByPost.bind(postsController))

postsRouter.put('/:id', authMiddleware,
    shortDescriptionBodyValid,
    titleBodyValid,
    contentBodyValid,
    blogIdValid,
    checkErrorsValidation, searchPostByIdValidation, searchNeedBlogByPostValidation,
    postsController.updatePost.bind(postsController))

postsRouter.delete('/:id', authMiddleware, postsController.deletePostById.bind(postsController))

postsRouter.delete('/', authMiddleware, postsController.deleteAllPost.bind(postsController))

postsRouter.put('/:id/like-status', authTokenMiddleware, searchPostByIdValidation,
    LikeValid, checkErrorsValidation, likeStatusValidation,
    postsController.makeLikeOrUnlike.bind(postsController))